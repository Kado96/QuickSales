import os
import django
import sys

# Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.ministries.models import Ministry

def check_ministries():
    ministries = Ministry.objects.all()
    print(f"Total Ministères: {ministries.count()}")
    for m in ministries:
        print(f"ID: {m.id}")
        print(f"  FR: {m.title_fr}")
        print(f"  EN: {m.title_en or '--- MANQUANT ---'}")
        print(f"  Mission EN: {m.mission_en[:50] if m.mission_en else '--- MANQUANT ---'}...")

if __name__ == "__main__":
    check_ministries()
