from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.conf import settings as django_settings
import logging
from api.accounts.viewsets.dependencies import IsAdminOrSuperUser
from .models import SiteSettings
from .serializers import SiteSettingsSerializer

logger = logging.getLogger(__name__)


class SiteSettingsCurrentView(APIView):
    """
    Vue API simple pour récupérer les paramètres du site
    GET /api/settings/current/ - Retourne l'objet unique directement
    """
    permission_classes = [AllowAny]
    # Forcer le renderer JSON et désactiver la pagination
    renderer_classes = [JSONRenderer]
    pagination_class = None
    # Parser JSON pour les requêtes (même si GET n'a pas de body, DRF en a besoin)
    parser_classes = [parsers.JSONParser]
    
    def get(self, request):
        """Récupérer les paramètres du site"""
        try:
            logger.info(f"Requête reçue sur /api/settings/current/ depuis {request.META.get('REMOTE_ADDR', 'unknown')}")
            
            # Essayer de récupérer l'instance
            try:
                settings = SiteSettings.objects.get(pk=1)
                logger.info(f"Instance SiteSettings trouvée (ID: {settings.id})")
            except SiteSettings.DoesNotExist:
                logger.warning("Instance SiteSettings non trouvée, création...")
                # Créer l'instance si elle n'existe pas
                try:
                    settings = SiteSettings.objects.create(
                        pk=1,
                        site_name='Diocese Makamba',
                        description='Site officiel du Diocese Makamba Connect',
                        contact_email='info@makamba-diocese.org',
                        contact_phone='+257 22 23 45 67',
                        contact_address='Makamba, Burundi',
                        hero_title_fr='Diocèse de Makamba',
                        hero_subtitle_fr='Servir Dieu et notre prochain au cœur de Makamba.',
                        about_content_fr='Bienvenue sur le site du Diocese Makamba, une communauté dédiée à la croissance spirituelle.',
                        contact_content_fr='Contactez-nous pour toute question ou demande.',
                    )
                    logger.info(f"Instance SiteSettings créée (ID: {settings.id})")
                except Exception as create_error:
                    logger.error(f"Erreur lors de la création de SiteSettings: {create_error}", exc_info=True)
                    # Retourner une réponse minimale même si la création échoue
                    return Response(
                        {
                            'id': 1,
                            'site_name': 'Shalom Ministry',
                            'description': 'Plateforme de formation chrétienne en ligne',
                            'error': 'creation_error',
                            'message': f'Erreur lors de la création: {str(create_error)}'
                        },
                        status=status.HTTP_200_OK
                    )
            
            # Sérialiser avec le contexte de la requête
            try:
                serializer = SiteSettingsSerializer(settings, context={'request': request})
                data = serializer.data
                logger.info(f"Sérialisation réussie, {len(data)} champs")
                
                # Utiliser Response de DRF pour garantir le format JSON correct
                return Response(data, status=status.HTTP_200_OK)
            except Exception as ser_error:
                logger.error(f"Erreur de sérialisation: {ser_error}", exc_info=True)
                # Retourner un JSON minimal en cas d'erreur de sérialisation
                try:
                    minimal_data = {
                        'id': getattr(settings, 'id', 1),
                        'site_name': getattr(settings, 'site_name', 'Shalom Ministry'),
                        'description': getattr(settings, 'description', '') or '',
                        'contact_email': getattr(settings, 'contact_email', '') or '',
                        'contact_phone': getattr(settings, 'contact_phone', '') or '',
                        'contact_address': getattr(settings, 'contact_address', '') or '',
                        'hero_title_fr': getattr(settings, 'hero_title_fr', '') or '',
                        'hero_subtitle_fr': getattr(settings, 'hero_subtitle_fr', '') or '',
                        'error': 'serialization_partial',
                        'message': f'Sérialisation partielle due à: {str(ser_error)}'
                    }
                    return Response(minimal_data, status=status.HTTP_200_OK)
                except Exception as minimal_error:
                    logger.error(f"Erreur même lors de la création de la réponse minimale: {minimal_error}", exc_info=True)
                    return Response(
                        {
                            'error': 'critical_error',
                            'message': f'Erreur critique: {str(minimal_error)}'
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            logger.error(f"Erreur dans SiteSettingsCurrentView: {str(e)}", exc_info=True)
            logger.error(f"Traceback: {error_traceback}")
            
            # Retourner une erreur JSON claire avec Response de DRF
            error_data = {
                'detail': f'Erreur lors de la récupération des paramètres: {str(e)}',
                'error': 'retrieval_error',
                'error_type': type(e).__name__,
            }
            if django_settings.DEBUG:
                error_data['traceback'] = error_traceback
            return Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les paramètres du site
    - GET /api/settings/ : Récupérer les paramètres (public)
    - PUT/PATCH /api/settings/1/ : Modifier les paramètres (admin seulement)
    - PATCH /api/settings/1/ avec FormData : Upload de logo
    """
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    lookup_field = 'pk'
    pagination_class = None  # Désactiver complètement la pagination pour éviter les erreurs 400
    parser_classes = (MultiPartParser, FormParser, JSONParser)  # Support pour les uploads de fichiers
    
    def get_permissions(self):
        """Permettre la lecture publique, l'écriture admin seulement"""
        if self.action in ['list', 'retrieve', 'current']:
            return [AllowAny()]
        return [IsAdminOrSuperUser()]  # Accepter is_staff OU is_superuser
    
    @property
    def paginator(self):
        """Désactiver complètement la pagination - retourner toujours None"""
        return None
    
    def paginate_queryset(self, queryset):
        """Désactiver complètement la pagination pour éviter les erreurs 400"""
        return None
    
    def filter_queryset(self, queryset):
        """Ne pas filtrer pour éviter les erreurs"""
        return queryset
    
    def list(self, request, *args, **kwargs):
        """Retourne toujours la première (et seule) instance - Version simplifiée"""
        try:
            # S'assurer que self.request est correctement défini
            self.request = request
            
            # Récupérer ou créer l'instance
            try:
                settings = SiteSettings.objects.get(pk=1)
            except SiteSettings.DoesNotExist:
                settings = SiteSettings.objects.create(
                    pk=1,
                    site_name='Diocese Makamba',
                    description='Site officiel du Diocese Makamba Connect',
                    contact_email='info@makamba-diocese.org',
                    contact_phone='+257 22 23 45 67',
                    contact_address='Makamba, Burundi',
                    hero_title_fr='Diocèse de Makamba',
                    hero_subtitle_fr='Servir Dieu et notre prochain au cœur de Makamba.',
                    about_content_fr='Bienvenue sur le site du Diocese Makamba, une communauté dédiée à la croissance spirituelle.',
                    contact_content_fr='Contactez-nous pour toute question ou demande.',
                )
            
            # Sérialiser et retourner - IMPORTANT: retourner une liste même pour un singleton
            try:
                serializer = self.get_serializer(settings, context={'request': request})
                # Retourner une liste avec un seul élément pour respecter l'API REST
                return Response([serializer.data], status=status.HTTP_200_OK)
            except Exception as ser_error:
                # Si le serializer échoue, retourner une liste vide plutôt qu'une erreur
                logger.error(f"Erreur de sérialisation dans list(): {ser_error}", exc_info=True)
                return Response([], status=status.HTTP_200_OK)
        except Exception as e:
            # En cas d'erreur, retourner une liste vide plutôt qu'une erreur 500
            logger.error(f"Erreur dans list(): {e}", exc_info=True)
            return Response([], status=status.HTTP_200_OK)
    
    def retrieve(self, request, *args, **kwargs):
        """Retourne toujours la première (et seule) instance"""
        try:
            # Essayer de récupérer les settings
            try:
                settings = SiteSettings.get_settings()
            except Exception:
                # Si get_settings échoue, créer l'instance directement
                settings, created = SiteSettings.objects.get_or_create(pk=1)
            
            # S'assurer que l'instance existe
            if not settings:
                settings, created = SiteSettings.objects.get_or_create(pk=1)
            
            # Sérialiser avec gestion d'erreur
            try:
                serializer = self.get_serializer(settings, context={'request': request})
                return Response(serializer.data)
            except Exception as e:
                # Si le serializer échoue, retourner une réponse JSON d'erreur
                return Response(
                    {
                        'detail': f'Erreur lors de la sérialisation: {str(e)}',
                        'error': 'serialization_error'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            # En cas d'erreur, créer l'instance avec les valeurs par défaut
            try:
                settings, created = SiteSettings.objects.get_or_create(
                    pk=1,
                    defaults={
                        'site_name': 'Diocese Makamba',
                        'description': 'Site officiel du Diocese Makamba Connect',
                        'contact_email': 'info@makamba-diocese.org',
                        'contact_phone': '+257 22 23 45 67',
                        'contact_address': 'Makamba, Burundi',
                        'hero_title_fr': 'Diocèse de Makamba',
                        'hero_subtitle_fr': 'Servir Dieu et notre prochain au cœur de Makamba.',
                        'about_content_fr': 'Bienvenue sur le site du Diocese Makamba, une communauté dédiée à la croissance spirituelle.',
                        'contact_content_fr': 'Contactez-nous pour toute question ou demande.',
                    }
                )
                serializer = self.get_serializer(settings, context={'request': request})
                return Response(serializer.data)
            except Exception as e2:
                # Si même la création échoue, retourner une erreur JSON
                return Response(
                    {
                        'detail': f'Erreur lors de la création des paramètres: {str(e2)}',
                        'error': 'creation_error'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    
    def create(self, request, *args, **kwargs):
        """Créer ou récupérer l'instance unique"""
        settings, created = SiteSettings.objects.get_or_create(pk=1, defaults=request.data)
        serializer = self.get_serializer(settings, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        """Mettre à jour l'instance unique"""
        settings = SiteSettings.get_settings()
        
        # Champs en lecture seule (SerializerMethodField) que le frontend peut renvoyer mais
        # que le serializer ne sait pas écrire → les supprimer avant la validation
        READ_ONLY_FIELDS = {
            # Affichage d'images (URLs calculées)
            'logo_url_display', 'hero_image_display', 'about_image_display',
            'team_image_display', 'quote_author_image_display', 'vision_bg_image_display',
            'engage_bg_image_display', 'stories_bg_image_display', 'parishes_bg_image_display',
            'history_image_display', 'bishop_photo_display', 'vision_image_display',
            'mission_image_display', 'values_image_display',
            # Champs localisés calculés (aliases sans suffixe _fr/_en)
            'hero_title', 'hero_subtitle', 'hero_badge', 'hero_btn1_text', 'hero_btn1_link',
            'hero_btn2_text', 'hero_btn2_link', 'about_title', 'about_title_accent',
            'about_badge', 'about_content', 'bible_verse', 'bible_verse_ref',
            'quote_text', 'quote_author_name', 'quote_author_subtitle',
            'diocese_subtitle', 'history_subtitle', 'vision_subtitle',
            'footer_description', 'footer_copyright',
            'stat_years_label', 'stat_years_desc', 'stat_emissions', 'stat_emissions_desc',
            'stat_audience', 'stat_audience_desc', 'stat_languages', 'stat_languages_desc',
            'stats_cta_title', 'stats_cta_link_text',
            'history_intro_title', 'history_intro_text', 'vision_text', 'mission_intro',
            'bishop_bio_p1', 'bishop_bio_p2',
            'vision_title', 'vision_description', 'vision_pillar1_title', 'vision_pillar1_desc',
            'vision_pillar2_title', 'vision_pillar2_desc', 'vision_pillar3_title', 'vision_pillar3_desc',
            'engage_title', 'engage_description', 'engage_item1_title', 'engage_item1_desc',
            'engage_item1_cta', 'engage_item2_title', 'engage_item2_desc', 'engage_item2_cta',
            'engage_item3_title', 'engage_item3_desc', 'engage_item3_cta',
            'stories_badge', 'stories_title', 'info_message_text', 'info_badge_text',
            'organization_title', 'organization_subtitle', 'organization_text',
            'history_title', 'history_text', 'bishop_title', 'bishop_message',
            'vision_badge', 'mission_badge', 'mission_title', 'mission_description',
            'values_badge', 'values_title', 'values_description', 'team_badge',
            'nav_history', 'nav_bishop', 'nav_vision', 'nav_team',
            # Bouton submit envoyé par le formulaire HTML
            'save_settings',
        }
        
        # Construire un dict mutable SANS deepcopy (qui plante avec les fichiers uploadés)
        mutable_data = {}
        for key in request.data:
            if key in READ_ONLY_FIELDS:
                continue  # Ignorer les champs en lecture seule
            # Pour les fichiers, prendre directement l'objet fichier
            if key in request.FILES:
                mutable_data[key] = request.FILES[key]
            else:
                mutable_data[key] = request.data[key]
        
        # Gérer la suppression explicite du logo
        if mutable_data.get('clear_logo') == 'true' or mutable_data.get('clear_logo') is True:
            settings.logo = None
            settings.save()
            # Retrait du champ pour éviter que le serializer n'essaie de le traiter
            mutable_data.pop('logo', None)
        
        # Nettoyer le champ clear_logo (non géré par le sérialiseur)
        mutable_data.pop('clear_logo', None)
                
        serializer = self.get_serializer(settings, data=mutable_data, partial=kwargs.get('partial', False), context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Mettre à jour partiellement l'instance unique"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='current')
    def current(self, request):
        """Action personnalisée pour récupérer l'objet unique directement (sans liste)"""
        try:
            # Récupérer l'instance unique
            
            # Utiliser get_settings() qui gère automatiquement la création si nécessaire
            settings = SiteSettings.get_settings()
            
            # S'assurer que l'instance existe
            if not settings:
                # Si get_settings() retourne None, créer l'instance
                settings = SiteSettings.objects.create(
                    pk=1,
                    site_name='Diocese Makamba',
                    description='Site officiel du Diocese Makamba Connect',
                    contact_email='info@makamba-diocese.org',
                    contact_phone='+257 22 23 45 67',
                    contact_address='Makamba, Burundi',
                    hero_title_fr='Diocèse de Makamba',
                    hero_subtitle_fr='Servir Dieu et notre prochain au cœur de Makamba.',
                    about_content_fr='Bienvenue sur le site du Diocese Makamba, une communauté dédiée à la croissance spirituelle.',
                    contact_content_fr='Contactez-nous pour toute question ou demande.',
                )
            
            # Sérialiser avec le contexte de la requête pour les URLs absolues
            serializer = self.get_serializer(settings, context={'request': request})
            
            # Retourner le JSON directement (DRF le formate automatiquement)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except SiteSettings.DoesNotExist:
            # Créer l'instance si elle n'existe pas
            try:
                settings = SiteSettings.objects.create(
                    pk=1,
                    site_name='Diocese Makamba',
                    description='Site officiel du Diocese Makamba Connect',
                    contact_email='info@makamba-diocese.org',
                    contact_phone='+257 22 23 45 67',
                    contact_address='Makamba, Burundi',
                    hero_title_fr='Diocèse de Makamba',
                    hero_subtitle_fr='Servir Dieu et notre prochain au cœur de Makamba.',
                    about_content_fr='Bienvenue sur le site du Diocese Makamba, une communauté dédiée à la croissance spirituelle.',
                    contact_content_fr='Contactez-nous pour toute question ou demande.',
                )
                serializer = self.get_serializer(settings, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as create_error:
                logger.error(f"Erreur lors de la création de SiteSettings: {create_error}", exc_info=True)
                return Response(
                    {
                        'detail': f'Erreur lors de la création des paramètres: {str(create_error)}',
                        'error': 'creation_error'
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            import traceback
            error_detail = str(e)
            error_traceback = traceback.format_exc() if django_settings.DEBUG else None
            logger.error(f"Erreur dans current(): {error_detail}", exc_info=True)
            return Response(
                {
                    'detail': f'Erreur lors de la récupération des paramètres: {error_detail}',
                    'error': 'retrieval_error',
                    'traceback': error_traceback
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

