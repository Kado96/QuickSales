from rest_framework import serializers
from .models import TimelineEvent, MissionAxe, VisionValue, TeamMember, DiocesePresentation, ParoissesPresentation, ContactMessage

class TimelineEventSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = TimelineEvent
        fields = ['id', 'year', 'image', 'image_display', 'order', 'title', 'description', 'title_fr', 'title_en', 'description_fr', 'description_en']

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang') or request.query_params.get('language') or 'fr'
        return 'fr'

    def get_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'title_{lang}', None)
        if localized_val:
            return localized_val
        return obj.title_fr or obj.title

    def get_description(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'description_{lang}', None)
        if localized_val:
            return localized_val
        return obj.description_fr or obj.description

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class MissionAxeSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    text = serializers.SerializerMethodField()

    class Meta:
        model = MissionAxe
        fields = ['id', 'order', 'image', 'image_display', 'text', 'text_fr', 'text_en']

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang') or request.query_params.get('language') or 'fr'
        return 'fr'

    def get_text(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'text_{lang}', None)
        if localized_val:
            return localized_val
        return obj.text_fr or obj.text

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class VisionValueSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = VisionValue
        fields = ['id', 'icon', 'order', 'image', 'image_display', 'title', 'description', 'title_fr', 'title_en', 'description_fr', 'description_en']

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang') or request.query_params.get('language') or 'fr'
        return 'fr'

    def get_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'title_{lang}', None)
        if localized_val:
            return localized_val
        return obj.title_fr or obj.title

    def get_description(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'description_{lang}', None)
        if localized_val:
            return localized_val
        return obj.description_fr or obj.description

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class TeamMemberSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'order', 'image', 'image_display', 'role', 'description', 'role_fr', 'role_en', 'description_fr', 'description_en']

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang') or request.query_params.get('language') or 'fr'
        return 'fr'

    def get_role(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'role_{lang}', None)
        if localized_val:
            return localized_val
        return obj.role_fr or obj.role

    def get_description(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'description_{lang}', None)
        if localized_val:
            return localized_val
        return obj.description_fr or obj.description

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class DiocesePresentationSerializer(serializers.ModelSerializer):
    hero_image_display = serializers.SerializerMethodField()
    history_image_display = serializers.SerializerMethodField()
    bishop_photo_display = serializers.SerializerMethodField()
    
    # Virtual localized fields
    hero_title = serializers.SerializerMethodField()
    hero_subtitle = serializers.SerializerMethodField()
    history_title = serializers.SerializerMethodField()
    history_text = serializers.SerializerMethodField()
    bishop_message = serializers.SerializerMethodField()
    bishop_title = serializers.SerializerMethodField()
    organization_title = serializers.SerializerMethodField()
    organization_subtitle = serializers.SerializerMethodField()
    organization_text = serializers.SerializerMethodField()
    
    nav_history = serializers.SerializerMethodField()
    nav_bishop = serializers.SerializerMethodField()
    nav_vision = serializers.SerializerMethodField()
    nav_team = serializers.SerializerMethodField()

    vision_title = serializers.SerializerMethodField()
    vision_description = serializers.SerializerMethodField()
    vision_badge = serializers.SerializerMethodField()
    
    mission_title = serializers.SerializerMethodField()
    mission_description = serializers.SerializerMethodField()
    mission_badge = serializers.SerializerMethodField()

    values_title = serializers.SerializerMethodField()
    values_description = serializers.SerializerMethodField()
    values_badge = serializers.SerializerMethodField()
    
    team_title = serializers.SerializerMethodField()
    team_description = serializers.SerializerMethodField()
    team_badge = serializers.SerializerMethodField()

    vision_image_display = serializers.SerializerMethodField()
    mission_image_display = serializers.SerializerMethodField()
    values_image_display = serializers.SerializerMethodField()

    class Meta:
        model = DiocesePresentation
        fields = [
            'id', 'hero_image', 'history_image', 'bishop_photo', 'vision_image', 'mission_image', 'values_image',
            'hero_image_display', 'history_image_display', 'bishop_photo_display', 'vision_image_display', 'mission_image_display', 'values_image_display',
            'bishop_name', 'hero_title', 'hero_subtitle', 'history_title', 'history_text', 'bishop_message', 'bishop_title', 
            'organization_title', 'organization_subtitle', 'organization_text',
            'nav_history', 'nav_bishop', 'nav_vision', 'nav_team',
            'vision_title', 'vision_description', 'vision_badge',
            'mission_title', 'mission_description', 'mission_badge',
            'values_title', 'values_description', 'values_badge',
            'team_title', 'team_description', 'team_badge',
            # Raw localized fields
            'hero_subtitle_fr', 'hero_subtitle_en',
            'history_title_fr', 'history_title_en',
            'history_text_fr', 'history_text_en',
            'bishop_message_fr', 'bishop_message_en',
            'organization_text_fr', 'organization_text_en',
            # Vision
            'vision_title_fr', 'vision_title_en',
            'vision_description_fr', 'vision_description_en',
            # Mission
            'mission_title_fr', 'mission_title_en',
            'mission_description_fr', 'mission_description_en',
            # Values Intro
            'values_title_fr', 'values_title_en',
            'values_description_fr', 'values_description_en',
            # Team Intro
            'team_badge_fr', 'team_badge_en',
            'team_title_fr', 'team_title_en',
            'team_description_fr', 'team_description_en',
            # Organization
            'organization_title_fr', 'organization_title_en',
            'organization_subtitle_fr', 'organization_subtitle_en',
            # Section Badges
            'vision_badge_fr', 'vision_badge_en',
            'mission_badge_fr', 'mission_badge_en',
            'values_badge_fr', 'values_badge_en',
            # Bishop Title
            'bishop_title_fr', 'bishop_title_en',
            'hero_title_fr', 'hero_title_en',
            'nav_history_fr', 'nav_history_en',
            'nav_bishop_fr', 'nav_bishop_en',
            'nav_vision_fr', 'nav_vision_en',
            'nav_team_fr', 'nav_team_en',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang') or request.query_params.get('language') or 'fr'
        return 'fr'

    def get_hero_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'hero_title_{lang}', None)
        return localized_val if localized_val else obj.hero_title_fr

    def get_hero_subtitle(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'hero_subtitle_{lang}', None)
        return localized_val if localized_val else obj.hero_subtitle_fr

    def get_history_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'history_title_{lang}', None)
        return localized_val if localized_val else obj.history_title_fr

    def get_history_text(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'history_text_{lang}', None)
        return localized_val if localized_val else obj.history_text_fr

    def get_bishop_message(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'bishop_message_{lang}', None)
        return localized_val if localized_val else obj.bishop_message_fr

    def get_bishop_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'bishop_title_{lang}', None)
        return localized_val if localized_val else obj.bishop_title_fr

    def get_organization_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'organization_title_{lang}', None)
        return localized_val if localized_val else obj.organization_title_fr

    def get_organization_subtitle(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'organization_subtitle_{lang}', None)
        return localized_val if localized_val else obj.organization_subtitle_fr

    def get_organization_text(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'organization_text_{lang}', None)
        return localized_val if localized_val else obj.organization_text_fr

    def get_nav_history(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'nav_history_{lang}', None)
        return localized_val if localized_val else obj.nav_history_fr

    def get_nav_bishop(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'nav_bishop_{lang}', None)
        return localized_val if localized_val else obj.nav_bishop_fr

    def get_nav_vision(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'nav_vision_{lang}', None)
        return localized_val if localized_val else obj.nav_vision_fr

    def get_nav_team(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'nav_team_{lang}', None)
        return localized_val if localized_val else obj.nav_team_fr

    def get_vision_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'vision_title_{lang}', None)
        return localized_val if localized_val else obj.vision_title_fr

    def get_vision_description(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'vision_description_{lang}', None)
        return localized_val if localized_val else obj.vision_description_fr

    def get_vision_badge(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'vision_badge_{lang}', None)
        return localized_val if localized_val else obj.vision_badge_fr

    def get_mission_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'mission_title_{lang}', None)
        return localized_val if localized_val else obj.mission_title_fr

    def get_mission_description(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'mission_description_{lang}', None)
        return localized_val if localized_val else obj.mission_description_fr

    def get_mission_badge(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'mission_badge_{lang}', None)
        return localized_val if localized_val else obj.mission_badge_fr

    def get_values_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'values_title_{lang}', None)
        return localized_val if localized_val else obj.values_title_fr

    def get_values_description(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'values_description_{lang}', None)
        return localized_val if localized_val else obj.values_description_fr

    def get_values_badge(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'values_badge_{lang}', None)
        return localized_val if localized_val else obj.values_badge_fr

    def get_team_title(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'team_title_{lang}', None)
        return localized_val if localized_val else obj.team_title_fr

    def get_team_description(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'team_description_{lang}', None)
        return localized_val if localized_val else obj.team_description_fr

    def get_team_badge(self, obj):
        lang = self._get_lang()
        localized_val = getattr(obj, f'team_badge_{lang}', None)
        return localized_val if localized_val else obj.team_badge_fr

    def get_hero_image_display(self, obj):
        return self._get_image_url(obj, 'hero_image')

    def get_history_image_display(self, obj):
        return self._get_image_url(obj, 'history_image')
        
    def get_bishop_photo_display(self, obj):
        return self._get_image_url(obj, 'bishop_photo')

    def get_vision_image_display(self, obj):
        return self._get_image_url(obj, 'vision_image')

    def get_mission_image_display(self, obj):
        return self._get_image_url(obj, 'mission_image')

    def get_values_image_display(self, obj):
        return self._get_image_url(obj, 'values_image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class ParoissesPresentationSerializer(serializers.ModelSerializer):
    hero_image_display = serializers.SerializerMethodField()

    class Meta:
        model = ParoissesPresentation
        fields = '__all__'

    def get_hero_image_display(self, obj):
        if not obj.hero_image:
            return None
        return obj.hero_image.url

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

