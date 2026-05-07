from rest_framework import serializers
from .models import SermonCategory, Sermon


class SermonCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonCategory
        fields = ("id", "name", "slug", "description", "icon")


class SermonListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()
    audio_display_url = serializers.SerializerMethodField()
    video_display_url = serializers.SerializerMethodField()
    document_display_url = serializers.SerializerMethodField()
    
    # Champs dynamiques pour la traduction
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = (
            "id",
            "title",
            "title_fr",
            "title_en",
            "content_type",
            "slug",
            "description",
            "description_fr",
            "description_en",
            "preacher_name",
            "category",
            "category_name",
            "language_primary",
            "image",
            "image_url",
            "video_url",
            "video_file",
            "video_display_url",
            "audio_url",
            "audio_file",
            "audio_display_url",
            "document_file",
            "document_display_url",
            "featured",
            "is_active",
            "sermon_date",
            "duration_minutes",
            "views_count",
        )

    def get_title(self, obj):
        lang = self.context.get('request').query_params.get('language', 'fr') if self.context.get('request') else 'fr'
        if lang == 'en' and obj.title_en:
            return obj.title_en
        return obj.title_fr or obj.title

    def get_description(self, obj):
        lang = self.context.get('request').query_params.get('language', 'fr') if self.context.get('request') else 'fr'
        if lang == 'en' and obj.description_en:
            return obj.description_en
        return obj.description_fr or obj.description

    def _get_absolute_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        url = file_field.url
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_image_url(self, obj):
        return self._get_absolute_url(obj.image)

    def get_audio_display_url(self, obj):
        if obj.audio_url:
            return obj.audio_url
        return self._get_absolute_url(obj.audio_file)

    def get_video_display_url(self, obj):
        if obj.video_url:
            return obj.video_url
        return self._get_absolute_url(obj.video_file)

    def get_document_display_url(self, obj):
        return self._get_absolute_url(obj.document_file)


class SermonDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()
    audio_display_url = serializers.SerializerMethodField()
    video_display_url = serializers.SerializerMethodField()
    document_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "preacher_name",
            "category",
            "category_name",
            "language",
            "duration_minutes",
            "video_url",
            "video_file",
            "video_display_url",
            "audio_url",
            "audio_file",
            "audio_display_url",
            "document_file",
            "document_display_url",
            "image",
            "image_url",
            "featured",
            "is_active",
            "sermon_date",
            "views_count",
            "created_at",
            "updated_at",
        )

    def _get_absolute_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        url = file_field.url
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_image_url(self, obj):
        return self._get_absolute_url(obj.image)

    def get_audio_display_url(self, obj):
        if obj.audio_url:
            return obj.audio_url
        return self._get_absolute_url(obj.audio_file)

    def get_video_display_url(self, obj):
        if obj.video_url:
            return obj.video_url
        return self._get_absolute_url(obj.video_file)

    def get_document_display_url(self, obj):
        return self._get_absolute_url(obj.document_file)


class AdminSermonSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()
    audio_display_url = serializers.SerializerMethodField()
    video_display_url = serializers.SerializerMethodField()
    document_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "preacher_name",
            "category",
            "category_name",
            "language",
            "duration_minutes",
            "video_url",
            "video_file",
            "video_display_url",
            "audio_url",
            "audio_file",
            "audio_display_url",
            "document_file",
            "document_display_url",
            "image",
            "image_url",
            "featured",
            "is_active",
            "sermon_date",
            "views_count",
            "created_at",
            "updated_at",
        )

    def _get_absolute_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        url = file_field.url
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_image_url(self, obj):
        return self._get_absolute_url(obj.image)

    def get_audio_display_url(self, obj):
        if obj.audio_url:
            return obj.audio_url
        return self._get_absolute_url(obj.audio_file)

    def get_video_display_url(self, obj):
        if obj.video_url:
            return obj.video_url
        return self._get_absolute_url(obj.video_file)

    def get_document_display_url(self, obj):
        return self._get_absolute_url(obj.document_file)
