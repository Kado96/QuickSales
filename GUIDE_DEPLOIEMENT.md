# 🚀 Guide de Synchronisation et de Déploiement

Ce document de référence explique comment fonctionne la synchronisation intelligente de votre base de données et résume les bonnes pratiques Git pour vos futurs déploiements.

---

## 1. La Synchronisation des Données (Local ➔ Production)

Le script `sync_local_to_prod.py` est l'outil le plus puissant et sécurisé de votre projet pour transférer vos données de test vers votre base de données de production (Supabase).

### Pourquoi éviter `loaddata` et `dumpdata` ?
La méthode classique avec les fichiers `.json` écrase tout ou provoque souvent des erreurs de doublons (les fameuses `IntegrityError` liées aux clés uniques).

### Comment fonctionne `sync_local_to_prod.py` ?
Il s'agit d'une **Synchronisation Intelligente** :
1. **Double Connexion :** Le script se connecte en même temps à votre fichier SQLite (Local) et à votre base PostgreSQL (Production).
2. **Comparaison par "Clé Naturelle" :** Au lieu de se fier uniquement à l'ID (qui peut différer entre le local et la prod), le script cherche des correspondances logiques (par exemple, il vérifie si un Utilisateur porte déjà le même `username`, ou si un Article a déjà le même `titre`).
3. **Mise à jour ou Création (Upsert) :** 
   - Si la donnée existe en production ➔ Il la **met à jour**.
   - Si la donnée n'existe pas ➔ Il la **crée**.
4. **Synchronisation S3 automatique :** Le script détecte vos images locales (dans `/media`) et les téléverse de lui-même vers votre bucket de stockage S3 Supabase.
5. **Traduction des relations :** Si un "Profil" est lié à "l'Utilisateur ID 2" en local, mais que cet utilisateur a "l'ID 5" en production, le script fait la traduction automatiquement.

**Commande pour lancer la synchronisation :**
```bash
# Placez-vous dans le backend
cd backend

# Exécutez le script
python sync_local_to_prod.py
```

---

## 2. Workflow de Déploiement avec Git

Pour que votre code local (vos modifications de fichiers React ou Django) aille sur votre hébergeur (Render, cPanel, etc.), la meilleure méthode est d'utiliser **Git**.

### A. Les Règles d'Or (Sécurité)
**Ne jamais versionner vos secrets !** 
Assurez-vous toujours que le fichier `.gitignore` bloque vos mots de passe.
```gitignore
# Exemple de fichier .gitignore
.env
db.sqlite3
media/
venv/
node_modules/
```

### B. Commandes Git du Quotidien
À chaque fois que vous terminez une fonctionnalité ou corrigez un bug, exécutez cette routine dans votre terminal (à la racine de votre projet) :

**1. Voir ce qui a été modifié :**
```bash
git status
```

**2. Ajouter toutes les modifications :**
```bash
git add .
```

**3. Valider (Commit) vos modifications avec un message clair :**
```bash
git commit -m "Ajout de la page Historique et correction des émojis"
```

**4. Envoyer vers GitHub (Push) :**
```bash
git push origin main
```

### C. Le lien avec la Production (Render)
Si votre hébergeur (comme Render) est connecté à votre dépôt GitHub :
Dès que vous faites un `git push origin main`, Render détecte la mise à jour, télécharge le nouveau code, lance votre script de démarrage (`start.sh` : migrations et collectstatic), et redémarre le site **automatiquement**. Vous n'avez rien d'autre à faire !
