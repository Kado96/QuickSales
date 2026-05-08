# 🚀 Guide de Déploiement — Makamba Diocese Connect

> **Mémo complet** pour déployer et maintenir le projet en local et en production.

---

## 📐 Architecture

```
LOCAL (Développement)              PRODUCTION (Serveur)
┌──────────────────┐               ┌──────────────────────┐
│  PC / Windows    │               │  Render.com          │
│  ├── Django      │   git push    │  ├── Django + Gunicorn│
│  ├── SQLite      │ ───────────►  │  ├── PostgreSQL      │
│  └── Vite (React)│               │  │   (Supabase)      │
│                  │               │  └── WhiteNoise      │
└──────────────────┘               └──────────────────────┘
```

Django choisit **automatiquement** la base de données selon l'environnement :
- **Pas de `DATABASE_URL`** → SQLite (local)
- **`DATABASE_URL` existe** → PostgreSQL (production)

---

## 1️⃣ Installation locale (première fois uniquement)

```bash
# Cloner le projet
git clone https://github.com/Kado96/makamba-diocese-connect.git
cd makamba-diocese-connect

# Backend
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

---

## 2️⃣ Fichier `.env` (backend)

Créer le fichier `backend/.env` :

```env
DEBUG=True
SECRET_KEY=dev-secret-key-12345
ALLOWED_HOSTS=localhost,127.0.0.1
```

> ⚠️ **Ne jamais pousser `.env` sur GitHub !** Il est déjà dans `.gitignore`.

---

## 3️⃣ Travailler en local

```bash
# Terminal 1 : Backend
cd backend
venv\Scripts\activate
python manage.py migrate
python manage.py runserver

# Terminal 2 : Frontend
cd frontend
npm run dev
```

Le site est accessible sur :
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:8000/api/

---

## 4️⃣ Pousser les modifications (déployer)

### Procédure standard

```bash
# 1. Depuis la racine du projet
cd makamba-diocese-connect

# 2. Ajouter les fichiers modifiés
git add .

# 3. Commiter avec un message descriptif
git commit -m "description de ce qui a changé"

# 4. Pousser sur GitHub → Render redéploie automatiquement
git push
```

### ⚠️ Règles Git importantes

| À faire | À ne JAMAIS faire |
|---|---|
| Commiter uniquement le code source | Pousser `venv/`, `db.sqlite3`, `.env` |
| Messages de commit descriptifs | `git push --force` (sauf cas extrême) |
| Vérifier `git status` avant de pousser | Pousser des fichiers `.zip` ou binaires |

### Si `git push` échoue (timeout/connection reset)

```bash
# Vérifier la taille du push
git diff --stat HEAD origin/main

# Augmenter le buffer si nécessaire
git config --global http.postBuffer 524288000

# Réessayer
git push
```

---

## 5️⃣ Configuration Production (Render)

### Variables d'environnement sur Render

| Clé | Valeur | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.XXX:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres` | URL Supabase (Session Pooler) |
| `DEBUG` | `False` | Toujours False en production |
| `SECRET_KEY` | `(clé longue et unique)` | Clé secrète Django |
| `DJANGO_SETTINGS_MODULE` | `makamba.settings` | Module de configuration |
| `ALLOWED_HOSTS` | `.onrender.com,anglicanemakamba.wuaze.com,...` | Domaines autorisés |
| `PYTHON_VERSION` | `3.11.9` | Version Python |

### Paramètres Render

| Paramètre | Valeur |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `bash build.sh` |
| **Start Command** | `bash start.sh` |

---

## 6️⃣ Récupérer l'URL Supabase (DATABASE_URL)

1. Aller sur **[app.supabase.com](https://app.supabase.com)**
2. Sélectionner le projet
3. **Project Settings** → **Database**
4. **Connect to your project** → **Connection String**
5. Type : **URI** | Method : **Session Pooler** ✅ (IPv4 compatible)
6. Copier l'URL et remplacer `[YOUR-PASSWORD]` par le vrai mot de passe
7. Coller dans `DATABASE_URL` sur Render

> 💡 Si mot de passe oublié : **Database Settings** → **Reset Database Password**

> ⚠️ Si le projet Supabase est en **pause** (gratuit = pause après 7j) :
> Aller sur le dashboard Supabase → cliquer **"Resume Project"**

---

## 7️⃣ Migrer les données SQLite → PostgreSQL

### Exporter depuis le local (SQLite)

```bash
cd backend
venv\Scripts\activate
python manage.py dumpdata --indent 2 -o data.json
```

### Importer sur le serveur (PostgreSQL)

Option A — Via le shell Render :
```bash
python manage.py migrate
python manage.py loaddata data.json
```

Option B — En local avec DATABASE_URL temporaire :
```bash
# Ajouter temporairement dans .env :
# DATABASE_URL=postgresql://postgres.XXX:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

python manage.py migrate
python manage.py loaddata data.json

# Puis remettre .env en mode local (supprimer DATABASE_URL)
```

---

## 8️⃣ Commandes utiles

### Backend (Django)

```bash
# Créer les migrations après modification d'un modèle
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un super-utilisateur
python manage.py createsuperuser

# Exporter toutes les données
python manage.py dumpdata --indent 2 > data.json

# Importer des données
python manage.py loaddata data.json

# Collecter les fichiers statiques (production)
python manage.py collectstatic --noinput
```

### Frontend (React/Vite)

```bash
# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

### Git

```bash
# Voir l'état des fichiers
git status

# Voir les modifications
git diff

# Annuler les modifications d'un fichier
git checkout -- nom-du-fichier

# Voir l'historique
git log --oneline -10
```

---

## 9️⃣ Structure du projet

```
makamba-diocese-connect/
├── .gitignore              # Fichiers à ne pas pousser
├── README.md               # Documentation du projet
├── DEPLOY_GUIDE.md         # ← CE FICHIER
│
├── backend/
│   ├── .env                # Variables locales (JAMAIS sur Git)
│   ├── manage.py           # Point d'entrée Django
│   ├── requirements.txt    # Dépendances Python
│   ├── build.sh            # Script de build (Render)
│   ├── start.sh            # Script de démarrage (Render)
│   ├── Procfile            # Configuration Render
│   ├── db.sqlite3          # Base locale (JAMAIS sur Git)
│   ├── venv/               # Environnement virtuel (JAMAIS sur Git)
│   ├── media/              # Fichiers uploadés (JAMAIS sur Git)
│   ├── makamba/
│   │   ├── settings.py     # Configuration Django
│   │   ├── urls.py         # Routes principales
│   │   └── wsgi.py         # Point d'entrée WSGI
│   └── api/
│       ├── accounts/       # Gestion des utilisateurs
│       ├── settings/       # Paramètres du site
│       ├── sermons/        # Sermons/Prédications
│       ├── announcements/  # Annonces
│       ├── parishes/       # Paroisses
│       ├── ministries/     # Ministères
│       ├── testimonials/   # Témoignages
│       └── pages/          # Pages statiques
│
└── frontend/
    ├── package.json        # Dépendances Node.js
    ├── vite.config.ts      # Configuration Vite
    └── src/
        ├── pages/          # Pages (public + admin)
        ├── components/     # Composants réutilisables
        ├── hooks/          # Hooks React (useApi, etc.)
        ├── lib/            # API, types, utilitaires
        └── locales/        # Traductions (fr, rn, en, sw)
```

---

## 🔒 Fichiers à ne JAMAIS pousser sur GitHub

Ces fichiers sont dans `.gitignore` :

```
backend/venv/           # Environnement virtuel Python
backend/db.sqlite3      # Base de données locale
backend/.env            # Variables secrètes
backend/media/          # Fichiers uploadés
backend/staticfiles/    # Fichiers statiques compilés
backend/logs/           # Logs
__pycache__/            # Cache Python
*.pyc                   # Bytecode Python
*.zip                   # Archives
node_modules/           # Dépendances Node.js
```

---

## ❌ Erreurs fréquentes

| Erreur | Cause | Solution |
|---|---|---|
| `password authentication failed` | Mauvais mot de passe Supabase | Vérifier/reset le mot de passe dans Supabase Dashboard |
| `Connection was reset` (git push) | Fichiers trop lourds dans l'historique Git | Vérifier `.gitignore`, utiliser `git gc` |
| `500 Internal Server Error` (API) | Champ manquant dans le serializer | Vérifier que tous les champs sont dans `Meta.fields` |
| `ModuleNotFoundError` | Dépendance manquante | `pip install -r requirements.txt` |
| `CORS error` | Domaine non autorisé | Ajouter le domaine dans `CORS_ALLOWED_ORIGINS` (settings.py) |
| Supabase en pause | Projet gratuit inactif 7+ jours | Aller sur Supabase → "Resume Project" |

---

## 🔄 Workflow quotidien résumé

```
1. Modifier le code en local
2. Tester : python manage.py runserver + npm run dev
3. git add .
4. git commit -m "description"
5. git push
6. Render redéploie automatiquement ✅
```

---

*Dernière mise à jour : 8 mars 2026*
