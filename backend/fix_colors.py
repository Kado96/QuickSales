import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.settings.models import SiteSettings

settings = SiteSettings.objects.get(pk=1)
settings.primary_color = "#1D8B5D"
settings.secondary_color = "#19324D"
settings.accent_color = "#F59E0B"
settings.save()

print("Original colors restored successfully.")
