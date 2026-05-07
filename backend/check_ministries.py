import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.ministries.models import Ministry

print("--- LISTE DES MINISTÈRES EN BASE ---")
ministries = Ministry.objects.all().order_by('order')
if not ministries.exists():
    print("Aucun ministère trouvé.")
else:
    for m in ministries:
        print(f"ID: {m.id} | Titre FR: {m.title_fr} | Titre EN: {m.title_en} | Ordre: {m.order}")
print("------------------------------------")
