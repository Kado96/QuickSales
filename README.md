# ⛪ Makamba Diocese Connect

Application complète pour la gestion et la communication du **Diocèse de Makamba (Burundi)**, comprenant un backend Django performant et un frontend React moderne et multilingue.

## 🚀 Structure du Projet

- **Backend** : Django REST Framework, PostgreSQL (**Supabase**) en production, SQLite en développement local.
- **Frontend** : React, Vite, Tailwind CSS, TypeScript, Framer Motion (animations).
- **Langues supportées** : Français (FR), Anglais (EN) (Simplification Mars 2026).

---

## 🛠️ Workflow de Développement : Local vers Production
Le projet est configuré pour séparer strictement le développement (local) de la production (Supabase).

### Étape 1 : Développement Local (SQLite)
Travaillez en toute sécurité sur votre machine sans impacter le site en ligne.

1. Vérifiez que votre fichier `backend/.env` contient :
   ```env
   DATABASE_URL=votre_url_supabase_ou_sqlite
   DEBUG=True
   ```
   *Note : Si vous voulez forcer SQLite en local, assurez-vous que `DATABASE_URL` n'est pas défini ou pointe vers un fichier .sqlite3.*

2. **Migrations de structure** : Si vous modifiez `models.py` (ex: ajout d'un champ), générez les migrations :
   ```powershell
   cd backend
   .\venv\Scripts\activate
   python manage.py makemigrations
   python manage.py migrate
   ```

### Étape 2 : Déploiement et Synchronisation

Quand vos modifications sont prêtes à être publiées :

**A. Envoyer le Code (Déploiement Render)** :
Envoyez votre code sur GitHub. Le site web se mettra à jour automatiquement sur Render.
```powershell
git add .
git commit -m "Description de vos changements"
git push
```

**B. Synchroniser les Données (Supabase)** :
Pour envoyer vos nouveaux articles, paroisses ou sermons de votre PC vers le site en ligne, utilisez le script de synchronisation depuis le dossier `backend/` :
```powershell
.\venv\Scripts\activate
python sync_local_to_prod.py
```
*Le script compare votre base locale et Supabase pour mettre à jour les données sans créer de doublons.*

---

## 💻 Installation Rapide

### Backend (Python)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React/Vite)
```powershell
cd frontend
npm install
npm run dev
```
*Le frontend sera accessible sur `http://localhost:8080`.*

---

## ⚙️ Administration et Maintenance

- **Accès Admin** : `/admin/login` sur le frontend ou `/admin` sur le backend.
- **Initialisation** : Pour réinitialiser les données de base (noms de sections, langues), lancez :
  ```powershell
  python populate_defaults.py
  ```
- **Images** : Le projet utilise un proxy d'image pour supporter les liens Google Drive sans erreurs de sécurité (CORS).

## 📝 Notes de Sécurité
- Le fichier `db.sqlite3` et les fichiers `.env` sont exclus de Git pour protéger vos données et accès.
- Les accès API sont protégés par des tokens **JWT**.
- En production (Render/Supabase), les fichiers statiques sont servis via **WhiteNoise**.

---

## 🏗️ Architecture Technique : Synchronisation (Modèle Réutilisable)

Ce projet utilise une architecture de synchronisation "One-Way" (Local -> Prod) très efficace pour les petits et moyens projets. Voici comment la reproduire ailleurs.

### 1. L'Interrupteur de Base de Données (`.env`)
Dans le fichier `settings.py`, nous utilisons une condition basée sur une variable d'environnement :
- **`USE_LOCAL_SQLITE=True`** : Django utilise `db.sqlite3`. C'est **obligatoire** en développement pour éviter l'erreur `MaxClientsInSessionMode` de Supabase (limite de connexions atteintes).
- **`DATABASE_URL=...`** (et `USE_LOCAL_SQLITE=False`) : Utilisé uniquement par le serveur en production ou par le script de synchronisation.

**Pourquoi cette approche ?**
Les offres gratuites/standard de Supabase limitent le nombre de clients connectés simultanément. En travaillant sur **SQLite** localement, vous ne consommez aucune de ces connexions précieuses, vous travaillez plus vite (pas de latence réseau), et vous ne risquez pas de casser les données en ligne par erreur.

### 2. Le Script `sync_local_to_prod.py`
Ce script est le "cerveau" de l'opération. Il gère la synchronisation de la manière suivante :
- **Identification par "Sens" (Clé Naturelle)** : Au lieu de se fier uniquement aux numéros d'IDs (qui peuvent être différents entre votre PC et Supabase), le script cherche les objets par leur nom (Paroisse), titre (Sermon) ou nom d'utilisateur.
- **Mappage Dynamique des IDs (Mémoire)** : Si l'ID d'un utilisateur est différent sur Supabase (ex: 12 au lieu de 75), le script mémorise ce changement (`75 -> 12`) et traduit automatiquement toutes les relations (clés étrangères) même s'il s'agit de colonnes techniques (ex: `user_id`).
- **Fiabilité Maximale** : Chaque élément est traité dans sa propre transaction. Une erreur sur un utilisateur ou un sermon spécifique n'arrêtera jamais la synchronisation des 50 autres éléments.
- **Mise à jour Intelligente** : S'il trouve un objet identique, il le met à jour (`update`). Sinon, il le crée (`create`).
1.  **Double Connexion** : Il ouvre deux connexions simultanées :
    *   `default` : La base SQLite locale (Source).
    *   `prod` : La base Supabase distante (Destination).
2.  **Composants Synchronisés** :
    *   👤 **Sécurité** : Utilisateurs et Profils (Comptes).
    *   ⚙️ **Configuration** : Paramètres du site (Textes, Logos, Couleurs).
    *   ⛪ **Église** : Paroisses, Ministères et leurs activités.
    *   📖 **Enseignement** : Sermons et leurs catégories.
    *   📰 **Communication** : Annonces, Articles et Témoignages.
    *   📄 **Contenu Web** : Timeline, Valeurs, Vision, Équipe et Présentation du Diocèse (**Désormais 100% dynamique : Hero, Nav, Badges inclus**).
3.  **Vérification d'Existence** : Pour chaque élément :
    *   Il regarde si l'**ID** existe déjà en production.
    *   **Si OUI** ➔ Il met à jour l'élément (`UPDATE`).
    *   **Si NON** ➔ Il crée l'élément avec le même ID (`CREATE`).
4.  **Ordre des Dépendances** : Le script traite d'abord les tables "parents" (ex: Catégories) avant les tables "enfants" (ex: Sermons) pour éviter les erreurs de clés étrangères.

### 3. Gestion de la Pagination (DRF) dans le Frontend
En local (SQLite), l'API renvoie souvent une liste directe `[...]`. En production (Supabase/PostgreSQL), si la pagination est activée, l'API renvoie un objet `{ "results": [...] }`.

- **Erreur Classique** : `data.map is not a function` ou `data.filter is not a function`.
  *⚠️ Cas critique en production (Vite/Rollup) : Si cette erreur survient dans un build compilé, elle prendra souvent la forme `TypeError: _.map is not a function` ou `e.map is not a function`. Le minificateur réduit le nom de votre variable (ex: `categories`) en `_` ou `e`. Si l'API retourne un objet paginé au lieu d'un tableau et que votre code n'est pas sécurisé, le rendu `.map()` fait irrémédiablement crasher l'UI de la page.*
- **L'astuce Architecturale (Le Filtre d'entrée)** : Pour éviter de devoir écrire le code de sécurité sur chaque nouvelle page, la "Rule of Thumb" de ce projet a été d'appliquer la *Safe Array Extraction* directement au sein du connecteur (dans le fichier central `src/lib/api.ts`) pour que chaque appel devienne **100% robuste de base** :

```typescript
// Au sein de toutes les fonctions fetch (fetchSermons, fetchActualites, etc.)
export async function fetchData(lang?: string): Promise<Item[] | null> {
    const data = await apiFetch<PaginatedResponse<Item>>(`/api/items/?language=${lang}`);
    
    // 🔥 L'arme secrète Globale: Si c'est un tableau normal, renvoie-le.
    // Si c'est un format paginé, renvoie .results. 
    // Sinon annule (null).
    return (Array.isArray(data) ? (data as any) : data?.results) ?? null;
}
```
Avec ce simple patch dans l'API, tu assures l'immunité absolue de tout ton frontend web contre les bugs silencieux d'arrays.

### 4. Le Piège Fatal de l'Erreur "405 Method Not Allowed"
Ce projet nécessite deux hébergements distincts :
- Le Backend (Python/Django) sur **Render / Heroku**.
- Le Frontend (App React construite) sur un hébergement mutualisé standard comme **InfinityFree / Wuaze**.

**Symptôme :** Tu saisis de nouvelles informations dans une page *"Admin"*, tu cliques sur Sauvegarder, et rien ne se passe. Dans la console tu vois l'erreur rouge ou jaune : `Failed to load resource: the server responded with a status of 405 (Method Not Allowed)`.

**Le problème (`.env.production`) :**
Tu as accidentellement défini l'URL de base de ton API sur l'URL de ton site web (React) au lieu du vrai backend (Python). Par exemple :
```env
# FAUX (Provoquera l'erreur 405)
VITE_API_URL=https://monsiteReact.wuaze.com
```
L'hébergeur "wuaze" tourne sous Apache pour servir tes fichiers statiques. Quand le Front React lui envoie un `PATCH` ou `POST` pour enregistrer en SQL, Apache panique, car un serveur Web de fichiers ne sait gérer que des requêtes de type `GET`. Il répond IMMÉDIATEMENT = `405 Method Not Allowed`.

```env
# VRAI (La bonne manière)
VITE_API_URL=https://monserveur-django-base.onrender.com 
```
**Conclusion :** Assure-toi que toutes les requêtes en modifications aillent pointer concrètement vers le cerveau Python.

### 5. Accessibilité et Autofill (Formulaires)
Pour que les navigateurs (Chrome, Safari, etc.) puissent remplir automatiquement les mots de passe et les emails, et pour garantir une bonne accessibilité (Lighthouse) :
- **ID Unique** : Chaque `Input` doit avoir un `id` correspondant au `htmlFor` de son `Label`.
- **Attribut Name** : Indispensable pour que le navigateur comprenne ce que contient le champ (ex: `name="email"`).
- **Auto-complete** : Toujours spécifier le type (ex: `autoComplete="current-password"` ou `"username"`).

**Exemple de structure parfaite :**
```tsx
<Label htmlFor="user-email">Email</Label>
<Input 
  id="user-email" 
  name="email" 
  type="email" 
  autoComplete="email" 
/>
```

### 7. Pourquoi c'est mieux que `dumpdata` ?
- **Pas d'écrasement total** : Contrairement à `loaddata`, le script local `sync_local_to_prod` ne supprime rien en production. Il fusionne les données de manière bidirectionnelle avec des clés naturelles.
- **Sécurité** : Si une erreur survient au milieu, la transaction `transaction.atomic` annule tout pour éviter une base de données corrompue.
- **Liberté** : Vous pouvez modifier un texte en local et l'envoyer en production en 2 secondes sans toucher au code ni ouvrir PgAdmin.

## ⚠️ Mise en garde cruciale pour la Production (Render)

### 1. Le Piège du Disque Éphémère
Si vous hébergez votre site sur **Render** (version gratuite ou standard sans disque persistant) :
- **Tout ce que vous uploadez via l'admin** (Logo, Photos, etc.) sera **EFFACÉ** à chaque redémarrage du serveur (toutes les 24h environ).
- **Solution de secours :** Utilisez des liens directs vers des images hébergées ailleurs (Google Drive, ImgBB, etc.).
- **Solution Pro :** Configurez **Supabase Storage** (voir section ci-dessous).

### 2. Le Cas des Vidéos 🎥
**NE JAMAIS héberger vos vidéos directement sur Render ou Supabase Storage.**
- Les fichiers vidéos sont trop lourds et ralentiront votre site.
- **Meilleure Pratique :** Hébergez vos vidéos sur **YouTube** (ou Vimeo) en mode "Non répertorié" et mettez le lien dans l'administration. C'est gratuit et ultra rapide.

---

## ☁️ Configuration du Stockage d'Images (Supabase Storage)

Si vous voulez que vos photos (Logo, Hero, Photos d'Évêque) apparaissent sur le site en ligne et ne soient plus liées à votre ordinateur, suivez ce guide.

### 1. Préparer Supabase
1. Allez sur votre tableau de bord [Supabase](https://supabase.com).
2. Dans le menu de gauche, allez dans **Storage**.
3. Créez un nouveau bucket (dossier) nommé **`media`** et mettez-le en **Public**.
4. Allez dans **Project Settings** > **Storage**.
5. Notez vos identifiants dans la section **S3 Connection Settings** :
   - `S3 Endpoint`
   - `Access Key ID`
   - `Secret Access Key`

### 2. Installer les outils (Backend)
Dans votre terminal `backend` :
```powershell
.\venv\Scripts\activate
pip install django-storages boto3
pip freeze > requirements.txt
```

### 3. Configurer le projet (`backend/.env`)
Ajoutez ces lignes à votre fichier `.env` :
```env
USE_S3_STORAGE=True
AWS_ACCESS_KEY_ID=votre_access_key_id
AWS_SECRET_ACCESS_KEY=votre_secret_access_key
AWS_STORAGE_BUCKET_NAME=media
AWS_S3_ENDPOINT_URL=votre_s3_endpoint_url
AWS_S3_REGION_NAME=votre_region (ex: eu-central-1)
```

### 4. Pourquoi faire ça ?
- **Stabilité** : Vos photos ne disparaissent plus.
- **Vitesse** : Les images sont servies par le réseau mondial de Supabase.
- **Synchronisation** : Tout ce que vous uploadez en local apparaît immédiatement sur le site réel.

---
---

## 📰 Système d'Actualités (Bilingue Native & Galeries)

Le système de communication est désormais nativement bilingue (champs FR/EN sur un seul article) et supporte l'upload multiple d'images pour des galeries photo riches. Tout est géré dans une interface d'administration unifiée et ultra-rapide.

---
© 2024-2026 Diocèse de Makamba - Église Anglicane du Burundi.
