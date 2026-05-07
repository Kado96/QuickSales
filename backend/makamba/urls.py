
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import FileResponse, HttpResponse
from django.conf import settings as django_settings
import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from api.accounts.viewsets import CustomTokenObtainPairView, RegisterViewSet
from api.test_cors import test_cors  # Test CORS

# Import des handlers personnalisés pour les erreurs HTTP
from .handlers import handler400, handler403, handler404, handler500
from .views import MakambaDioceseView, RootView, ImageProxyView

admin.site.site_header = 'ANGLICANE MAKAMBA ADMINISTRATION'
admin.site.index_title = 'Anglicane Makamba Admin'
admin.site.site_title = 'Administration'


# Vues importées depuis views.py


def serve_media_with_cors(request, path):
    """
    Vue personnalisée pour servir les fichiers média avec les headers CORS
    Résout les problèmes CORB (Cross-Origin Read Blocking)
    """
    # Obtenir l'origine de la requête
    origin = request.META.get('HTTP_ORIGIN', '')
    
    # Vérifier si l'origine est autorisée
    allowed_origins = getattr(django_settings, 'CORS_ALLOWED_ORIGINS', [])
    allow_all = getattr(django_settings, 'CORS_ALLOW_ALL_ORIGINS', False) or django_settings.DEBUG
    
    is_allowed = allow_all or origin in allowed_origins
    
    # Gérer les requêtes OPTIONS (preflight CORS)
    if request.method == 'OPTIONS':
        response = HttpResponse()
        if is_allowed:
            response['Access-Control-Allow-Origin'] = origin if origin else '*'
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with'
            response['Access-Control-Max-Age'] = '86400'
        return response
    
    # Construire le chemin complet du fichier
    file_path = os.path.join(django_settings.MEDIA_ROOT, path)
    
    # Vérifier que le fichier existe et est dans MEDIA_ROOT (sécurité)
    if not os.path.exists(file_path) or not file_path.startswith(str(django_settings.MEDIA_ROOT)):
        response = HttpResponse('File not found', status=404)
        if is_allowed:
            response['Access-Control-Allow-Origin'] = origin if origin else '*'
        return response
    
    # Servez le fichier avec les headers CORS
    try:
        file_handle = open(file_path, 'rb')
        response = FileResponse(file_handle)
        
        # Ajouter les headers CORS si l'origine est autorisée
        if is_allowed:
            response['Access-Control-Allow-Origin'] = origin if origin else '*'
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with'
            response['Access-Control-Expose-Headers'] = 'Content-Length, Content-Type'
        
        # Déterminer le Content-Type
        import mimetypes
        content_type, _ = mimetypes.guess_type(file_path)
        if content_type:
            response['Content-Type'] = content_type
        
        return response
    except Exception as e:
        response = HttpResponse(f'Error serving file: {str(e)}', status=500)
        if is_allowed:
            response['Access-Control-Allow-Origin'] = origin if origin else '*'
        return response



router = routers.DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', MakambaDioceseView.as_view()),
    path('api/test-cors/', test_cors, name="test-cors"),  # Test CORS simple
    path('api/accounts/', include("api.accounts.urls")),
    path('api/sermons/', include("api.sermons.urls")),
    path('api/announcements/', include('api.announcements.urls')),
    path('api/settings/', include("api.settings.urls")),
    path('api/parishes/', include('api.parishes.urls')),
    path('api/ministries/', include('api.ministries.urls')),
    path('api/pages/', include('api.pages.urls')),
    path('api/testimonials/', include("api.testimonials.urls")),
    path('api-auth/', include('rest_framework.urls')),
    path('api/login/', CustomTokenObtainPairView.as_view(), name="api-login"),
    path('api/register/', RegisterViewSet.as_view(), name="api-register"),
    path('api/refresh/', TokenRefreshView.as_view(), name="api-refresh"),
    # Proxy pour les images Google Drive (résout CORB)
    path('api/image-proxy/', ImageProxyView.as_view(), name='image_proxy'),
    # Route pour le favicon (retourner 404 sans authentification)
    re_path(r'^favicon\.ico$', lambda request: HttpResponse(status=404)),
    # Route personnalisée pour servir les fichiers média avec CORS
    re_path(
        r'^api/media/(?P<path>.*)$',
        serve_media_with_cors,
        name='media'
    ),
    # Route catch-all pour les routes non-API : retourner une réponse JSON au lieu d'un template
    re_path(
        "^(?!admin)(?!api)(?!ussd)(?!static)(?!silk)(?!favicon).*$",
        RootView.as_view()
    ),
]

# Configuration des handlers d'erreur personnalisés
handler400 = 'makamba.handlers.handler400'
handler403 = 'makamba.handlers.handler403'
handler404 = 'makamba.handlers.handler404'
handler500 = 'makamba.handlers.handler500'

