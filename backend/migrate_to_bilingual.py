import os
import django
import sys

# 1. Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.announcements.models import Announcement
from api.pages.models import TimelineEvent, MissionAxe, VisionValue, TeamMember, DiocesePresentation

def migrate_data():
    print("🚀 Démarrage de la migration des données vers le format bilingue...")
    
    # --- 1. ANNOUNCEMENTS (Actualités) ---
    print("\n📦 Migration: Announcements...")
    for obj in Announcement.objects.all():
        updated = False
        if obj.title and not obj.title_fr:
            obj.title_fr = obj.title
            updated = True
        if obj.content and not obj.content_fr:
            obj.content_fr = obj.content
            updated = True
        if updated:
            obj.save()
            print(f"  ✅ Actualité migrée: {obj.title_fr[:30]}...")

    # --- 2. TIMELINE EVENTS (Historique) ---
    print("\n📦 Migration: TimelineEvents...")
    for obj in TimelineEvent.objects.all():
        updated = False
        if obj.title and not obj.title_fr:
            obj.title_fr = obj.title
            updated = True
        if obj.description and not obj.description_fr:
            obj.description_fr = obj.description
            updated = True
        if updated:
            obj.save()
            print(f"  ✅ Événement migré: {obj.year}")

    # --- 3. MISSION AXES (Axes Stratégiques) ---
    print("\n📦 Migration: MissionAxes...")
    for obj in MissionAxe.objects.all():
        if obj.text and not obj.text_fr:
            obj.text_fr = obj.text
            obj.save()
            print(f"  ✅ Axe migré: {obj.text_fr[:30]}...")

    # --- 4. VISION VALUES (Valeurs) ---
    print("\n📦 Migration: VisionValues...")
    for obj in VisionValue.objects.all():
        updated = False
        if obj.title and not obj.title_fr:
            obj.title_fr = obj.title
            updated = True
        if obj.description and not obj.description_fr:
            obj.description_fr = obj.description
            updated = True
        if updated:
            obj.save()
            print(f"  ✅ Valeur migrée: {obj.title_fr[:30]}...")

    # --- 5. TEAM MEMBERS (Équipe) ---
    print("\n📦 Migration: TeamMembers...")
    for obj in TeamMember.objects.all():
        updated = False
        if obj.role and not obj.role_fr:
            obj.role_fr = obj.role
            updated = True
        if obj.description and not obj.description_fr:
            obj.description_fr = obj.description
            updated = True
        if updated:
            obj.save()
            print(f"  ✅ Membre migré: {obj.name}")

    print("\n✨ MIGRATION TERMINÉE AVEC SUCCÈS !")
    print("💡 Note : Les anciens champs 'obsolètes' ont été conservés par sécurité.")

if __name__ == "__main__":
    migrate_data()
