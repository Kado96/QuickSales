import os
import mimetypes
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings as django_settings
from django.core.files.storage import default_storage

class MediaManagerView(APIView):
    """
    API pour lister, uploader et supprimer les fichiers médias du projet (local ou S3 Supabase)
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def _get_storage_info(self):
        """Détermine le type de stockage actif"""
        use_s3 = getattr(django_settings, 'USE_S3_STORAGE', False)
        use_sqlite = getattr(django_settings, 'USE_LOCAL_SQLITE', True)
        if use_s3 and not use_sqlite:
            return "Supabase S3", True
        return "Local", False

    def get(self, request):
        media_root = Path(django_settings.MEDIA_ROOT)
        files_data = []
        total_size = 0
        categories = set()

        storage_type, is_s3 = self._get_storage_info()

        if is_s3:
            # Mode Supabase S3 / django-storages
            try:
                # S3Boto3Storage ne liste pas facilement récursivement sans pagination lourde.
                # Pour éviter les ralentissements ou les blocages, on inspecte la structure
                # des fichiers réels référencés en base, ou on utilise le listdir standard du storage.
                # Django storages supporte listdir.
                # Par sécurité et simplicité d'intégration, nous allons lister les répertoires standards.
                subdirs = ['settings', 'announcements', 'parishes', 'sermons', 'testimonials', 'diocese', 'ministries']
                for subdir in subdirs:
                    try:
                        dirs, files = default_storage.listdir(subdir)
                        for file in files:
                            if not file:
                                continue
                            file_path = f"{subdir}/{file}"
                            try:
                                size = default_storage.size(file_path)
                            except Exception:
                                size = 0
                            url = default_storage.url(file_path)
                            # Nettoyer l'URL si elle a des paramètres S3 de signature
                            if '?' in url:
                                url = url.split('?')[0]
                            
                            mime_type, _ = mimetypes.guess_type(file)
                            categories.add(subdir)
                            total_size += size
                            
                            files_data.append({
                                'name': file,
                                'path': file_path,
                                'category': subdir,
                                'size': size,
                                'url': url,
                                'mime_type': mime_type or 'application/octet-stream'
                            })
                    except Exception:
                        continue
            except Exception as e:
                return Response({'error': f"Impossible de lister Supabase S3: {str(e)}"}, status=500)
        else:
            # Mode Local FileSystem
            if not media_root.exists():
                media_root.mkdir(parents=True, exist_ok=True)
            
            # Parcourir récursivement les sous-dossiers locaux
            for root, dirs, files in os.walk(media_root):
                for file in files:
                    full_path = Path(root) / file
                    try:
                        size = full_path.stat().st_size
                    except Exception:
                        size = 0
                    
                    # Déterminer la catégorie d'après le sous-dossier direct dans media
                    relative_parts = full_path.relative_to(media_root).parts
                    category = relative_parts[0] if len(relative_parts) > 1 else 'general'
                    categories.add(category)
                    total_size += size
                    
                    # Construire l'URL absolue pour l'admin
                    media_url_path = '/'.join(relative_parts)
                    relative_url = f"{django_settings.MEDIA_URL}{media_url_path}"
                    absolute_url = request.build_absolute_uri(relative_url)
                    
                    mime_type, _ = mimetypes.guess_type(file)
                    
                    files_data.append({
                        'name': file,
                        'path': str(full_path.relative_to(media_root)).replace('\\', '/'),
                        'category': category,
                        'size': size,
                        'url': absolute_url,
                        'mime_type': mime_type or 'application/octet-stream'
                    })

        # Trier par nom ou catégorie
        files_data.sort(key=lambda x: (x['category'], x['name']))

        return Response({
            'files_count': len(files_data),
            'total_size_bytes': total_size,
            'total_size_mb': round(total_size / (1024 * 1024), 2),
            'categories_count': len(categories),
            'categories': list(categories),
            'storage_provider': storage_type,
            'files': files_data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Téléverser un nouveau média directement
        POST /api/media-manager/
        Params: file (File), category (String, default: settings)
        """
        uploaded_file = request.FILES.get('file')
        category = request.data.get('category', 'settings')

        if not uploaded_file:
            return Response({'error': 'Aucun fichier fourni'}, status=status.HTTP_400_BAD_REQUEST)

        # Nettoyage et construction du chemin propre
        from api.utils.storage import _clean_filename
        clean_name = _clean_filename(uploaded_file.name)
        target_path = f"{category}/{clean_name}"

        try:
            # Enregistrer via le storage par défaut de Django (Local ou Supabase S3)
            saved_path = default_storage.save(target_path, uploaded_file)
            url = default_storage.url(saved_path)
            if '?' in url:
                url = url.split('?')[0]

            # Si local, on reconstruit l'URL absolue propre
            storage_type, is_s3 = self._get_storage_info()
            if not is_s3:
                relative_url = f"{django_settings.MEDIA_URL}{saved_path}"
                url = request.build_absolute_uri(relative_url)

            return Response({
                'message': 'Fichier téléversé avec succès',
                'name': clean_name,
                'path': saved_path,
                'category': category,
                'url': url,
                'size': uploaded_file.size
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f"Erreur lors de l'upload: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        """
        Supprimer un média
        DELETE /api/media-manager/
        Params: path (String, ex: 'settings/logo.png')
        """
        file_path = request.data.get('path')
        if not file_path:
            return Response({'error': 'Chemin du fichier manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
                return Response({'message': f"Fichier {file_path} supprimé avec succès"}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Le fichier n\'existe pas'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f"Erreur lors de la suppression: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
