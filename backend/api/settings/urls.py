from django.urls import path, include
from rest_framework import routers
from .viewsets import SiteSettingsViewSet, SiteSettingsCurrentView
from .media_manager import MediaManagerView

router = routers.DefaultRouter()
router.register(r'', SiteSettingsViewSet, basename='settings')

urlpatterns = [
    path('current/', SiteSettingsCurrentView.as_view(), name='settings-current'),
    path('media-manager/', MediaManagerView.as_view(), name='media-manager'),
    path('', include(router.urls)),
]

