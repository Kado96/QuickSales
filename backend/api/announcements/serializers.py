from rest_framework import serializers
from .models import Announcement, AnnouncementImage, Comment

class AnnouncementImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AnnouncementImage
        fields = ['id', 'image', 'image_url', 'caption', 'order']

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

class AnnouncementSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    gallery = AnnouncementImageSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    
    # Champs dynamiques pour la traduction
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'title_fr', 'title_en', 'content_fr', 'content_en',
            'category', 'category_display', 'priority', 'event_date', 'image', 'image_display',
            'is_active', 'created_at', 'updated_at', 'gallery', 'comments_count'
        ]

    def get_image_display(self, obj):
        return obj.image.url if obj.image else None

    def get_title(self, obj):
        lang = self.context.get('request').query_params.get('language', 'fr') if self.context.get('request') else 'fr'
        if lang == 'en' and obj.title_en:
            return obj.title_en
        return obj.title_fr or obj.title

    def get_content(self, obj):
        lang = self.context.get('request').query_params.get('language', 'fr') if self.context.get('request') else 'fr'
        if lang == 'en' and obj.content_en:
            return obj.content_en
        return obj.content_fr or obj.content

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer pour les commentaires d'articles.
    - is_admin: indique si l'auteur est un administrateur/éditeur
    - user_role: rôle affiché (Admin, Éditeur, ou vide pour les visiteurs)
    """
    is_admin = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'announcement', 'author_name', 'author_email',
            'content', 'is_approved', 'is_admin', 'user_role',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_approved', 'is_admin', 'user_role', 'created_at', 'updated_at']

    def get_is_admin(self, obj):
        """Vérifie si le commentaire vient d'un utilisateur connecté (staff)"""
        return obj.user is not None and (obj.user.is_staff or obj.user.is_superuser)

    def get_user_role(self, obj):
        """Retourne le rôle visible de l'auteur"""
        if obj.user is None:
            return ""
        if obj.user.is_superuser:
            return "Administrateur"
        if obj.user.is_staff:
            return "Éditeur"
        return ""

    def create(self, validated_data):
        """Auto-remplit l'utilisateur et le nom si l'utilisateur est connecté"""
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['user'] = request.user
            # Utiliser le nom complet de l'utilisateur connecté
            full_name = request.user.get_full_name()
            if full_name:
                validated_data['author_name'] = full_name
            elif not validated_data.get('author_name'):
                validated_data['author_name'] = request.user.username
            if not validated_data.get('author_email'):
                validated_data['author_email'] = request.user.email or ""
        return super().create(validated_data)
