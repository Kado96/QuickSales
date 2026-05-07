import os
import django
import sys

# Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.ministries.models import MinistryPage

def debug():
    mp = MinistryPage.objects.first()
    if mp:
        print(f"ID: {mp.id}")
        print(f"FR Badge: {mp.hero_badge_fr}")
        print(f"EN Badge: {mp.hero_badge_en}")
        print(f"FR Title: {mp.hero_title_fr}")
        print(f"EN Title: {mp.hero_title_en}")
        print(f"EN Desc: {mp.hero_description_en}")
    else:
        print("Aucune page de ministère trouvée.")

if __name__ == "__main__":
    debug()
