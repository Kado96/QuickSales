"""
QuickSales - Script de Synchronisation
SQLite (Local) ➔ Supabase PostgreSQL + S3 Storage (Production)

Utilisation:
  python sync_local_to_prod.py               # Sync DB + Media
  python sync_local_to_prod.py --media-only  # Sync Media seulement
  python sync_local_to_prod.py --db-only     # Sync DB seulement
  python sync_local_to_prod.py --dry-run     # Simulation sans écriture
"""

import os
import sys
import django
import argparse
import logging
import mimetypes
from pathlib import Path

# ──────────────────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────
# 1. Chargement du .env
# ──────────────────────────────────────────────────────────
def load_env_file():
    dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(dotenv_path):
        with open(dotenv_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip('"').strip("'")
                    os.environ.setdefault(key.strip(), value.strip())

load_env_file()

# ──────────────────────────────────────────────────────────
# 2. Bootstrap Django (SQLite local)
# ──────────────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['DJANGO_SETTINGS_MODULE'] = 'quicksales.settings'
os.environ['USE_LOCAL_SQLITE'] = 'True'   # Force SQLite pour la lecture
os.environ['USE_S3_STORAGE'] = 'False'    # On gère S3 manuellement ici

django.setup()

# ──────────────────────────────────────────────────────────
# 3. Vérifications de base
# ──────────────────────────────────────────────────────────
from django.conf import settings as django_settings
import dj_database_url
from urllib.parse import unquote
from django.db import transaction, connections

prod_db_url = os.environ.get('DATABASE_URL')
if not prod_db_url:
    logger.error("❌ DATABASE_URL manquant dans .env")
    sys.exit(1)

# Supabase S3 credentials
S3_ENDPOINT   = os.environ.get('AWS_S3_ENDPOINT_URL', '')
S3_KEY_ID     = os.environ.get('AWS_ACCESS_KEY_ID', '')
S3_SECRET     = os.environ.get('AWS_SECRET_ACCESS_KEY', '')
S3_BUCKET     = os.environ.get('AWS_STORAGE_BUCKET_NAME', 'media')
S3_REGION     = os.environ.get('AWS_S3_REGION_NAME', 'eu-west-1')

if not all([S3_ENDPOINT, S3_KEY_ID, S3_SECRET]):
    logger.warning("⚠️  Variables S3 incomplètes — l'upload media sera ignoré.")
    HAS_S3 = False
else:
    HAS_S3 = True

# ──────────────────────────────────────────────────────────
# 4. Imports modèles
# ──────────────────────────────────────────────────────────
from django.contrib.auth.models import User
from api.accounts.models import Account
from api.settings.models import SiteSettings
from api.announcements.models import Announcement
from api.testimonials.models import Testimonial
from api.parishes.models import Parish
from api.ministries.models import Ministry, MinistryActivity
from api.sermons.models import SermonCategory, Sermon
from api.pages.models import (
    TimelineEvent, VisionValue, MissionAxe,
    TeamMember, DiocesePresentation
)

MEDIA_ROOT = Path(django_settings.BASE_DIR) / 'media'


# ══════════════════════════════════════════════════════════
# PARTIE A : UPLOAD MEDIA VERS SUPABASE S3
# ══════════════════════════════════════════════════════════

def get_s3_client():
    """Retourne un client boto3 connecté à Supabase S3."""
    import boto3
    from botocore.config import Config
    return boto3.client(
        's3',
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=S3_KEY_ID,
        aws_secret_access_key=S3_SECRET,
        region_name=S3_REGION,
        config=Config(signature_version='s3v4', s3={'addressing_style': 'path'}),
    )


def list_s3_keys(s3, bucket):
    """Liste tous les fichiers déjà présents dans le bucket S3."""
    existing = set()
    paginator = s3.get_paginator('list_objects_v2')
    for page in paginator.paginate(Bucket=bucket):
        for obj in page.get('Contents', []):
            existing.add(obj['Key'])
    return existing


def sync_media(dry_run=False):
    """Upload tous les fichiers locaux du dossier media/ vers Supabase S3."""
    if not HAS_S3:
        logger.error("❌ Impossible d'uploader : variables S3 manquantes.")
        return

    try:
        import boto3
    except ImportError:
        logger.error("❌ boto3 non installé : pip install boto3")
        return

    logger.info("=" * 60)
    logger.info("📂 SYNCHRONISATION MEDIA LOCAL → SUPABASE S3")
    logger.info(f"   Bucket  : {S3_BUCKET}")
    logger.info(f"   Source  : {MEDIA_ROOT}")
    logger.info("=" * 60)

    if not MEDIA_ROOT.exists():
        logger.error(f"❌ Dossier media introuvable : {MEDIA_ROOT}")
        return

    s3 = get_s3_client()

    # Lister les fichiers déjà en prod pour ne pas re-uploader
    logger.info("🔍 Listage des fichiers existants dans S3...")
    try:
        existing_keys = list_s3_keys(s3, S3_BUCKET)
        logger.info(f"   {len(existing_keys)} fichiers déjà présents dans S3.")
    except Exception as e:
        logger.warning(f"⚠️  Impossible de lister S3 (bucket vide ?) : {e}")
        existing_keys = set()

    # Parcourir tous les fichiers locaux
    all_files = list(MEDIA_ROOT.rglob('*'))
    media_files = [f for f in all_files if f.is_file()]

    logger.info(f"📁 {len(media_files)} fichiers locaux à traiter.\n")

    stats = {'uploaded': 0, 'skipped': 0, 'errors': 0}

    for local_path in media_files:
        # Clé S3 = chemin relatif depuis MEDIA_ROOT
        s3_key = local_path.relative_to(MEDIA_ROOT).as_posix()

        if s3_key in existing_keys:
            logger.debug(f"  ⏭  SKIP  {s3_key} (déjà présent)")
            stats['skipped'] += 1
            continue

        content_type, _ = mimetypes.guess_type(str(local_path))
        content_type = content_type or 'application/octet-stream'

        logger.info(f"  ⬆  UPLOAD {s3_key} ({local_path.stat().st_size / 1024:.1f} KB)")

        if not dry_run:
            try:
                with open(local_path, 'rb') as f:
                    s3.put_object(
                        Bucket=S3_BUCKET,
                        Key=s3_key,
                        Body=f,
                        ContentType=content_type,
                    )
                stats['uploaded'] += 1
            except Exception as e:
                logger.error(f"  ❌ ERREUR upload {s3_key}: {e}")
                stats['errors'] += 1
        else:
            stats['uploaded'] += 1  # compté comme "serait uploadé"

    logger.info("\n" + "=" * 60)
    logger.info(f"✅ Media sync terminé :")
    logger.info(f"   ⬆  Uploadés  : {stats['uploaded']}")
    logger.info(f"   ⏭  Ignorés   : {stats['skipped']} (déjà en S3)")
    logger.info(f"   ❌ Erreurs   : {stats['errors']}")
    logger.info("=" * 60)


# ══════════════════════════════════════════════════════════
# PARTIE B : SYNCHRONISATION BASE DE DONNÉES
# ══════════════════════════════════════════════════════════

class QuickSalesSync:

    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.stats = {'created': 0, 'updated': 0, 'errors': 0}
        self.id_map = {}
        self._setup_prod_db()

    def _setup_prod_db(self):
        """Configure la connexion secondaire PostgreSQL (Supabase)."""
        db_config = dj_database_url.parse(prod_db_url, ssl_require=True)
        db_config['PASSWORD'] = unquote(db_config['PASSWORD'])

        new_config = django_settings.DATABASES['default'].copy()
        new_config.update(db_config)
        django_settings.DATABASES['prod'] = new_config

        try:
            with connections['prod'].cursor() as cursor:
                cursor.execute("SELECT 1")
            logger.info("✅ Connexion Supabase PostgreSQL réussie.")
        except Exception as e:
            logger.error(f"❌ Connexion Supabase échouée : {e}")
            sys.exit(1)

    def _prepare_data(self, instance):
        """Extrait les données d'un objet Django en gérant les champs spéciaux."""
        data = {}
        for field in instance._meta.fields:
            if field.name == 'id':
                continue
            try:
                val = getattr(instance, field.name)
                if field.is_relation and val:
                    data[f"{field.name}_id"] = val.id
                elif hasattr(val, 'name') and hasattr(val, 'url'):
                    # FileField / ImageField → on stocke juste le nom du fichier
                    data[field.name] = val.name if (val and val.name) else None
                else:
                    data[field.name] = val
            except Exception as e:
                logger.debug(f"    Champ ignoré {field.name}: {e}")
                data[field.name] = None
        return data

    def _natural_key(self, model_class, item):
        """Retourne les critères de recherche naturels pour un objet."""
        if model_class == User:            return {'username': item.username}
        if model_class == Account:
            uid = self.id_map.get('User', {}).get(item.user_id, item.user_id)
            return {'user_id': uid}
        if model_class == SiteSettings:   return {'id': 1}
        if model_class == Parish:         return {'name': item.name, 'language': item.language}
        if model_class == Ministry:       return {'title_fr': item.title_fr}
        if model_class == MinistryActivity:
            mid = self.id_map.get('Ministry', {}).get(item.ministry_id, item.ministry_id)
            return {'ministry_id': mid, 'title_fr': item.title_fr}
        if model_class == SermonCategory: return {'name_fr': item.name_fr}
        if model_class == Sermon:         return {'title_fr': item.title_fr, 'preacher_name': item.preacher_name}
        if model_class == Announcement:   return {'title_fr': item.title_fr}
        if model_class == Testimonial:    return {'author_name': item.author_name, 'language': item.language}
        if model_class == TeamMember:     return {'name': item.name}
        if model_class == TimelineEvent:  return {'year': item.year, 'title_fr': item.title_fr}
        if model_class == MissionAxe:     return {'text_fr': item.text_fr}
        if model_class == VisionValue:    return {'title_fr': item.title_fr}
        if model_class == DiocesePresentation: return {'id': 1}
        return None

    def sync_model(self, model_class, label):
        """Synchronise une table locale vers Supabase."""
        logger.info(f"\n--- {label} ---")
        model_name = model_class.__name__
        self.id_map[model_name] = {}

        local_items = model_class.objects.using('default').all()

        for item in local_items:
            data = self._prepare_data(item)

            # Traduction des clés étrangères (ID local → ID prod)
            for field in model_class._meta.fields:
                if field.is_relation:
                    for key in [field.name, f"{field.name}_id"]:
                        if key in data and data[key]:
                            rel_name = field.related_model.__name__
                            local_id = data[key]
                            if rel_name in self.id_map and local_id in self.id_map[rel_name]:
                                data[key] = self.id_map[rel_name][local_id]

            try:
                with transaction.atomic(using='prod'):
                    # Cherche par ID, puis slug, puis clé naturelle
                    q = model_class.objects.using('prod').filter(id=item.id)

                    if not q.exists() and hasattr(item, 'slug') and item.slug:
                        q = model_class.objects.using('prod').filter(slug=item.slug)

                    if not q.exists():
                        nk = self._natural_key(model_class, item)
                        if nk:
                            q = model_class.objects.using('prod').filter(**nk)

                    if q.exists():
                        prod_id = q.first().id
                        if not self.dry_run:
                            data.pop('id', None)
                            q.update(**data)
                            self.stats['updated'] += 1
                        logger.info(f"  [UPD] {item} (prod_id={prod_id})")
                        self.id_map[model_name][item.id] = prod_id
                    else:
                        if not self.dry_run:
                            if model_class.objects.using('prod').filter(id=item.id).exists():
                                data.pop('id', None)
                            new_obj = model_class.objects.using('prod').create(**data)
                            self.stats['created'] += 1
                            logger.info(f"  [NEW] {item} (prod_id={new_obj.id})")
                            self.id_map[model_name][item.id] = new_obj.id
                        else:
                            logger.info(f"  [SIM] {item} serait créé")
                            self.id_map[model_name][item.id] = item.id

            except Exception as e:
                logger.error(f"  ❌ Erreur {label} '{item}': {e}")
                self.stats['errors'] += 1

    def run(self):
        logger.info("=" * 60)
        logger.info(f"🗄  SYNCHRONISATION BASE DE DONNÉES → SUPABASE")
        logger.info(f"   Mode : {'⚠️  SIMULATION' if self.dry_run else '🚀 RÉEL'}")
        logger.info("=" * 60)

        # Ordre de dépendance strict
        self.sync_model(User,               "Utilisateurs")
        self.sync_model(Account,            "Profils")
        self.sync_model(SiteSettings,       "Paramètres Site")
        self.sync_model(SermonCategory,     "Catégories Sermons")
        self.sync_model(Testimonial,        "Témoignages")
        self.sync_model(Announcement,       "Annonces/Articles")
        self.sync_model(Parish,             "Paroisses")
        self.sync_model(Ministry,           "Ministères")
        self.sync_model(Sermon,             "Sermons")
        self.sync_model(MinistryActivity,   "Activités Ministères")
        self.sync_model(TimelineEvent,      "Évènements Timeline")
        self.sync_model(VisionValue,        "Valeurs Vision")
        self.sync_model(MissionAxe,         "Axes Mission")
        self.sync_model(TeamMember,         "Membres Équipe")
        self.sync_model(DiocesePresentation,"Présentation Diocèse")

        logger.info("\n" + "=" * 60)
        logger.info(f"✅ DB sync terminé :")
        logger.info(f"   ✚ Créés     : {self.stats['created']}")
        logger.info(f"   ↻ Mis à jour: {self.stats['updated']}")
        logger.info(f"   ❌ Erreurs  : {self.stats['errors']}")
        logger.info("=" * 60)


# ══════════════════════════════════════════════════════════
# POINT D'ENTRÉE
# ══════════════════════════════════════════════════════════

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QuickSales — Sync local → Supabase")
    parser.add_argument('--dry-run',    action='store_true', help='Simulation sans écriture')
    parser.add_argument('--media-only', action='store_true', help='Upload media seulement (DB ignorée)')
    parser.add_argument('--db-only',    action='store_true', help='Sync DB seulement (media ignoré)')
    args = parser.parse_args()

    if args.media_only:
        sync_media(dry_run=args.dry_run)
    elif args.db_only:
        syncer = QuickSalesSync(dry_run=args.dry_run)
        syncer.run()
    else:
        # Par défaut : media D'ABORD, puis DB
        sync_media(dry_run=args.dry_run)
        syncer = QuickSalesSync(dry_run=args.dry_run)
        syncer.run()
