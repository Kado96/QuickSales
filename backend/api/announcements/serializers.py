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
    
    # Champs dynamiques pour la traduction
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'title_fr', 'title_en', 'content_fr', 'content_en',
            'category', 'category_display', 'priority', 'event_date', 'image', 'image_display',
            'is_active', 'created_at', 'updated_at', 'gallery'
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


class CommentSerializer(serializers.ModelSerializer):
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
        return obj.user is not None and (obj.user.is_staff or obj.user.is_superuser)

    def get_user_role(self, obj):
        if obj.user is None: return ""
        if obj.user.is_superuser: return "Administrateur"
        if obj.user.is_staff: return "Éditeur"
        return ""

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['user'] = request.user
            full_name = request.user.get_full_name()
            validated_data['author_name'] = full_name if full_name else request.user.username
            validated_data['author_email'] = request.user.email or ""
        return super().create(validated_data)
