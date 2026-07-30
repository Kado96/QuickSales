from rest_framework import serializers
from django.conf import settings
from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_url_display = serializers.SerializerMethodField()
    hero_image_display = serializers.SerializerMethodField()
    about_image_display = serializers.SerializerMethodField()
    team_image_display = serializers.SerializerMethodField()
    quote_author_image_display = serializers.SerializerMethodField()
    vision_bg_image_display = serializers.SerializerMethodField()
    engage_bg_image_display = serializers.SerializerMethodField()
    stories_bg_image_display = serializers.SerializerMethodField()
    parishes_bg_image_display = serializers.SerializerMethodField()
    
    # New Image Displays
    history_image_display = serializers.SerializerMethodField()
    bishop_photo_display = serializers.SerializerMethodField()
    vision_image_display = serializers.SerializerMethodField()
    mission_image_display = serializers.SerializerMethodField()
    values_image_display = serializers.SerializerMethodField()
    
    # Dynamic localized fields
    hero_title = serializers.SerializerMethodField()
    hero_subtitle = serializers.SerializerMethodField()
    hero_badge = serializers.SerializerMethodField()
    hero_btn1_text = serializers.SerializerMethodField()
    hero_btn1_link = serializers.SerializerMethodField()
    hero_btn2_text = serializers.SerializerMethodField()
    hero_btn2_link = serializers.SerializerMethodField()
    about_title = serializers.SerializerMethodField()
    about_title_accent = serializers.SerializerMethodField()
    about_badge = serializers.SerializerMethodField()
    about_content = serializers.SerializerMethodField()
    bible_verse = serializers.SerializerMethodField()
    bible_verse_ref = serializers.SerializerMethodField()
    quote_text = serializers.SerializerMethodField()
    quote_author_name = serializers.SerializerMethodField()
    quote_author_subtitle = serializers.SerializerMethodField()
    diocese_subtitle = serializers.SerializerMethodField()
    history_subtitle = serializers.SerializerMethodField()
    vision_subtitle = serializers.SerializerMethodField()
    footer_description = serializers.SerializerMethodField()
    footer_copyright = serializers.SerializerMethodField()
    
    # Stats localized fields
    stat_years_label = serializers.SerializerMethodField()
    stat_years_desc = serializers.SerializerMethodField()
    stat_emissions = serializers.SerializerMethodField()
    stat_emissions_desc = serializers.SerializerMethodField()
    stat_audience = serializers.SerializerMethodField()
    stat_audience_desc = serializers.SerializerMethodField()
    stat_languages = serializers.SerializerMethodField()
    stat_languages_desc = serializers.SerializerMethodField()
    stats_cta_title = serializers.SerializerMethodField()
    stats_cta_link_text = serializers.SerializerMethodField()

    # Section Intros
    history_intro_title = serializers.SerializerMethodField()
    history_intro_text = serializers.SerializerMethodField()
    vision_text = serializers.SerializerMethodField()
    mission_intro = serializers.SerializerMethodField()
    bishop_bio_p1 = serializers.SerializerMethodField()
    bishop_bio_p2 = serializers.SerializerMethodField()

    # Vision & Mission Pillars
    vision_title = serializers.SerializerMethodField()
    vision_description = serializers.SerializerMethodField()
    vision_pillar1_title = serializers.SerializerMethodField()
    vision_pillar1_desc = serializers.SerializerMethodField()
    vision_pillar2_title = serializers.SerializerMethodField()
    vision_pillar2_desc = serializers.SerializerMethodField()
    vision_pillar3_title = serializers.SerializerMethodField()
    vision_pillar3_desc = serializers.SerializerMethodField()

    # Engagement Section
    engage_title = serializers.SerializerMethodField()
    engage_description = serializers.SerializerMethodField()
    engage_item1_title = serializers.SerializerMethodField()
    engage_item1_desc = serializers.SerializerMethodField()
    engage_item1_cta = serializers.SerializerMethodField()
    engage_item2_title = serializers.SerializerMethodField()
    engage_item2_desc = serializers.SerializerMethodField()
    engage_item2_cta = serializers.SerializerMethodField()
    engage_item3_title = serializers.SerializerMethodField()
    engage_item3_desc = serializers.SerializerMethodField()
    engage_item3_cta = serializers.SerializerMethodField()

    # Stories Section
    stories_badge = serializers.SerializerMethodField()
    stories_title = serializers.SerializerMethodField()

    # Info Message (Flash Info)
    info_message_text = serializers.SerializerMethodField()
    info_badge_text = serializers.SerializerMethodField()

    # New Localized Fields for Admin Components
    organization_title = serializers.SerializerMethodField()
    organization_subtitle = serializers.SerializerMethodField()
    organization_text = serializers.SerializerMethodField()
    history_title = serializers.SerializerMethodField()
    history_text = serializers.SerializerMethodField()
    bishop_title = serializers.SerializerMethodField()
    bishop_message = serializers.SerializerMethodField()
    vision_badge = serializers.SerializerMethodField()
    mission_badge = serializers.SerializerMethodField()
    mission_title = serializers.SerializerMethodField()
    mission_description = serializers.SerializerMethodField()
    values_badge = serializers.SerializerMethodField()
    values_title = serializers.SerializerMethodField()
    values_description = serializers.SerializerMethodField()
    team_badge = serializers.SerializerMethodField()
    nav_history = serializers.SerializerMethodField()
    nav_bishop = serializers.SerializerMethodField()
    nav_vision = serializers.SerializerMethodField()
    nav_team = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_name', 'description', 
            'logo', 'logo_url', 'logo_url_display',
            'hero_image', 'hero_image_display',
            'about_image', 'about_image_display',
            'team_image', 'team_image_display',
            'quote_author_image', 'quote_author_image_display',
            'vision_bg_image', 'vision_bg_image_display',
            'engage_bg_image', 'engage_bg_image_display',
            'stories_bg_image', 'stories_bg_image_display',
            'parishes_bg_image', 'parishes_bg_image_display',
            
            # Formatted localized fields
            'hero_title', 'hero_subtitle', 'hero_badge', 'hero_btn1_text', 'hero_btn1_link', 'hero_btn2_text', 'hero_btn2_link',
            'about_title', 'about_title_accent', 'about_badge', 'about_content',
            'bible_verse', 'bible_verse_ref',
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
            'engage_title', 'engage_description', 'engage_item1_title', 'engage_item1_desc', 'engage_item1_cta',
            'engage_item2_title', 'engage_item2_desc', 'engage_item2_cta',
            'engage_item3_title', 'engage_item3_desc', 'engage_item3_cta',
            'stories_badge', 'stories_title',
            'info_message_text', 'info_badge_text',
            
            # New Images and Fields
            'history_image', 'history_image_display',
            'bishop_photo', 'bishop_photo_display',
            'vision_image', 'vision_image_display',
            'mission_image', 'mission_image_display',
            'values_image', 'values_image_display',
            'bishop_name',
            'organization_title', 'organization_subtitle', 'organization_text',
            'history_title', 'history_text', 'bishop_title', 'bishop_message',
            'vision_badge', 'mission_badge', 'mission_title', 'mission_description',
            'values_badge', 'values_title', 'values_description', 'team_badge',
            'nav_history', 'nav_bishop', 'nav_vision', 'nav_team',
            
            # Additional localized fields
            # Info Message raw fields
            'info_message_text_fr', 'info_message_text_en', 'info_badge_text_fr', 'info_badge_text_en', 'info_message_link', 'info_message_active',
            
            # Stats Localized Labels
            'stat_years_label_fr', 'stat_years_label_en',             'stat_emissions_fr', 'stat_emissions_en',             'stat_audience_fr', 'stat_audience_en',             'stat_languages_fr', 'stat_languages_en',             'stat_years_desc_fr', 'stat_years_desc_en',             'stat_emissions_desc_fr', 'stat_emissions_desc_en',             'stat_audience_desc_fr', 'stat_audience_desc_en',             'stat_languages_desc_fr', 'stat_languages_desc_en',             
            # Vision & Mission (Localized)
            'vision_title_fr', 'vision_title_en',             'vision_description_fr', 'vision_description_en',             'vision_pillar1_title_fr', 'vision_pillar1_title_en',             'vision_pillar1_desc_fr', 'vision_pillar1_desc_en',             'vision_pillar2_title_fr', 'vision_pillar2_title_en',             'vision_pillar2_desc_fr', 'vision_pillar2_desc_en',             'vision_pillar3_title_fr', 'vision_pillar3_title_en',             'vision_pillar3_desc_fr', 'vision_pillar3_desc_en',             'vision_pillar1_icon', 'vision_pillar2_icon', 'vision_pillar3_icon',

            # Engagement (Localized)
            'engage_title_fr', 'engage_title_en',             'engage_description_fr', 'engage_description_en',             'engage_item1_title_fr', 'engage_item1_title_en',             'engage_item1_desc_fr', 'engage_item1_desc_en',             'engage_item1_cta_fr', 'engage_item1_cta_en',             'engage_item2_title_fr', 'engage_item2_title_en',             'engage_item2_desc_fr', 'engage_item2_desc_en',             'engage_item2_cta_fr', 'engage_item2_cta_en',             'engage_item3_title_fr', 'engage_item3_title_en',             'engage_item3_desc_fr', 'engage_item3_desc_en',             'engage_item3_cta_fr', 'engage_item3_cta_en',             'engage_item1_href', 'engage_item1_icon', 'engage_item2_href', 'engage_item2_icon', 'engage_item3_href', 'engage_item3_icon',

            # Parishes Section (Localized)
            'parishes_title_fr', 'parishes_title_en',             'parishes_description_fr', 'parishes_description_en',             'parishes_map_title_fr', 'parishes_map_title_en',             'parishes_map_subtitle_fr', 'parishes_map_subtitle_en',             'parishes_map_stats_fr', 'parishes_map_stats_en', 
            # Stories / Actualités Section (Localized)
            'stories_badge_fr', 'stories_badge_en',             'stories_title_fr', 'stories_title_en', 
            # Stats CTA (Localized)
            'stats_cta_title_fr', 'stats_cta_title_en',             'stats_cta_link_text_fr', 'stats_cta_link_text_en', 
            # Misc Localized
            'about_content_fr', 'about_content_en',             'bible_verse_fr', 'bible_verse_en',             'bible_verse_ref_fr', 'bible_verse_ref_en', 
            # Quote (Localized)
            'quote_text_fr', 'quote_text_en',             'quote_author_name_fr', 'quote_author_name_en',             'quote_author_subtitle_fr', 'quote_author_subtitle_en', 
            # Team (Localized)
            'team_title_fr', 'team_title_en',             'team_description_fr', 'team_description_en', 
            # About Features (Localized)
            'about_feature1_fr', 'about_feature1_en',             'about_feature2_fr', 'about_feature2_en',             'about_feature3_fr', 'about_feature3_en',             'about_feature4_fr', 'about_feature4_en', 
            # About Title & Badge (Localized)
            'about_title_fr', 'about_title_en',             'about_title_accent_fr', 'about_title_accent_en',             'about_badge_fr', 'about_badge_en', 
            # Contact (Localized)
            'contact_content_fr', 'contact_content_en',             'contact_badge_fr', 'contact_badge_en', 
            # Diocese / History / Vision Intro (Localized)
            'diocese_subtitle_fr', 'diocese_subtitle_en',
            'history_subtitle_fr', 'history_subtitle_en',
            'history_intro_title_fr', 'history_intro_title_en',
            'history_intro_text_fr', 'history_intro_text_en',
            'vision_subtitle_fr', 'vision_subtitle_en',
            'vision_text_fr', 'vision_text_en',
            'mission_intro_fr', 'mission_intro_en',
            'bishop_bio_p1_fr', 'bishop_bio_p1_en',
            'bishop_bio_p2_fr', 'bishop_bio_p2_en',
            
            # New Raw Fields for FR and EN
            'organization_title_fr', 'organization_title_en',
            'organization_subtitle_fr', 'organization_subtitle_en',
            'organization_text_fr', 'organization_text_en',
            'history_title_fr', 'history_title_en',
            'history_text_fr', 'history_text_en',
            'bishop_title_fr', 'bishop_title_en',
            'bishop_message_fr', 'bishop_message_en',
            'vision_badge_fr', 'vision_badge_en',
            'mission_badge_fr', 'mission_badge_en',
            'mission_title_fr', 'mission_title_en',
            'mission_description_fr', 'mission_description_en',
            'values_badge_fr', 'values_badge_en',
            'values_title_fr', 'values_title_en',
            'values_description_fr', 'values_description_en',
            'team_badge_fr', 'team_badge_en',
            'nav_history_fr', 'nav_history_en',
            'nav_bishop_fr', 'nav_bishop_en',
            'nav_vision_fr', 'nav_vision_en',
            'nav_team_fr', 'nav_team_en',

            # Button labels (Localized)
            'btn_emissions_fr', 'btn_emissions_en',             'btn_teachings_fr', 'btn_teachings_en',             'btn_meditation_fr', 'btn_meditation_en', 
            # Section Featured (Localized)
            'section_featured_fr', 'section_featured_en',             'section_featured_badge_fr', 'section_featured_badge_en',             'section_featured_accent_fr', 'section_featured_accent_en',             'section_featured_desc_fr', 'section_featured_desc_en', 
            # Section Categories (Localized)
            'section_categories_fr', 'section_categories_en',             'section_categories_accent_fr', 'section_categories_accent_en',             'section_categories_desc_fr', 'section_categories_desc_en', 
            # Section Announcements (Localized)
            'section_announcements_badge_fr', 'section_announcements_badge_en',             'section_announcements_title_fr', 'section_announcements_title_en',             'section_announcements_accent_fr', 'section_announcements_accent_en',             'section_announcements_desc_fr', 'section_announcements_desc_en', 
            # Section Testimonials (Localized)
            'section_testimonials_badge_fr', 'section_testimonials_badge_en',             'section_testimonials_title_fr', 'section_testimonials_title_en',             'section_testimonials_accent_fr', 'section_testimonials_accent_en',             'section_testimonials_desc_fr', 'section_testimonials_desc_en', 
            # Page titles (Localized)
            'page_courses_title_fr', 'page_courses_title_en',             'page_about_title_fr', 'page_about_title_en',             'page_contact_title_fr', 'page_contact_title_en', 
            # Footer Brand
            'footer_brand_name', 'footer_brand_subtitle',

            # Footer Quick Links & Social (Localized)
            'footer_quick_links_title_fr', 'footer_quick_links_title_en',             'footer_contact_title_fr', 'footer_contact_title_en',             'footer_social_title_fr', 'footer_social_title_en', 
            # Header options
            'show_admin_button',

            # Style fields
            'primary_color', 'secondary_color', 'text_color', 'background_color', 'accent_color',
            'heading_font', 'body_font',
            'heading_size', 'subheading_size', 'body_size', 'small_size',

            # Other fields
            'default_language', 'contact_email', 'contact_phone', 'contact_address',
            'facebook_url', 'youtube_url', 'instagram_url', 'twitter_url', 'whatsapp_url',
            'stat_years_value', 'stat_emissions_value', 'stat_audience_value', 'stat_languages_value',
            'stats_cta_href',
            
            # Hero Fields (Localized)
            'hero_title_fr', 'hero_title_en',             'hero_subtitle_fr', 'hero_subtitle_en',             'hero_badge_fr', 'hero_badge_en',             'hero_btn1_text_fr', 'hero_btn1_text_en',             'hero_btn1_link_fr', 'hero_btn1_link_en',             'hero_btn2_text_fr', 'hero_btn2_text_en',             'hero_btn2_link_fr', 'hero_btn2_link_en', 
            # Header & Footer Fields (Localized)
            'header_slogan_fr', 'header_slogan_en',             'header_admin_btn_fr', 'header_admin_btn_en',             'footer_description_fr', 'footer_description_en',             'footer_copyright_fr', 'footer_copyright_en', 
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            # Allow URL fields to be empty strings (blank=True in model, but DRF URLField
            # rejects "" by default → causes 400 when admin form submits empty URL inputs)
            'logo_url':       {'allow_blank': True, 'required': False},
            'facebook_url':   {'allow_blank': True, 'required': False},
            'youtube_url':    {'allow_blank': True, 'required': False},
            'instagram_url':  {'allow_blank': True, 'required': False},
            'twitter_url':    {'allow_blank': True, 'required': False},
            'whatsapp_url':   {'allow_blank': True, 'required': False},
            # Make all image fields optional on PATCH
            'logo':                 {'required': False},
            'hero_image':           {'required': False},
            'about_image':          {'required': False},
            'team_image':           {'required': False},
            'quote_author_image':   {'required': False},
            'vision_bg_image':      {'required': False},
            'engage_bg_image':      {'required': False},
            'stories_bg_image':     {'required': False},
            'parishes_bg_image':    {'required': False},
            'history_image':        {'required': False},
            'bishop_photo':         {'required': False},
            'vision_image':         {'required': False},
            'mission_image':        {'required': False},
            'values_image':         {'required': False},
        }

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            # Handle both DRF Request (query_params) and Django Request (GET)
            params = getattr(request, 'query_params', getattr(request, 'GET', {}))
            return params.get('lang') or params.get('language') or 'fr'
        return 'fr'

    def _resolve_localized(self, obj, field_base):
        lang = self._get_lang()
        try:
            val = getattr(obj, f'{field_base}_{lang}', None)
            if not val: # Fallback if empty string or None
                val = getattr(obj, f'{field_base}_fr', '')
            return val
        except AttributeError:
            return ''

    def get_hero_title(self, obj): return self._resolve_localized(obj, 'hero_title')
    def get_hero_subtitle(self, obj): return self._resolve_localized(obj, 'hero_subtitle')
    def get_hero_badge(self, obj): return self._resolve_localized(obj, 'hero_badge')
    def get_hero_btn1_text(self, obj): return self._resolve_localized(obj, 'hero_btn1_text')
    def get_hero_btn1_link(self, obj): return self._resolve_localized(obj, 'hero_btn1_link')
    def get_hero_btn2_text(self, obj): return self._resolve_localized(obj, 'hero_btn2_text')
    def get_hero_btn2_link(self, obj): return self._resolve_localized(obj, 'hero_btn2_link')
    def get_about_title(self, obj): return self._resolve_localized(obj, 'about_title')
    def get_about_title_accent(self, obj): return self._resolve_localized(obj, 'about_title_accent')
    def get_about_badge(self, obj): return self._resolve_localized(obj, 'about_badge')
    def get_about_content(self, obj): return self._resolve_localized(obj, 'about_content')
    def get_bible_verse(self, obj): return self._resolve_localized(obj, 'bible_verse')
    def get_bible_verse_ref(self, obj): return self._resolve_localized(obj, 'bible_verse_ref')
    def get_quote_text(self, obj): return self._resolve_localized(obj, 'quote_text')
    def get_quote_author_name(self, obj): return self._resolve_localized(obj, 'quote_author_name')
    def get_quote_author_subtitle(self, obj): return self._resolve_localized(obj, 'quote_author_subtitle')
    def get_diocese_subtitle(self, obj): return self._resolve_localized(obj, 'diocese_subtitle')
    def get_history_subtitle(self, obj): return self._resolve_localized(obj, 'history_subtitle')
    def get_vision_subtitle(self, obj): return self._resolve_localized(obj, 'vision_subtitle')
    def get_footer_description(self, obj): return self._resolve_localized(obj, 'footer_description')
    def get_footer_copyright(self, obj): return self._resolve_localized(obj, 'footer_copyright')
    
    def get_stat_years_label(self, obj): return self._resolve_localized(obj, 'stat_years_label')
    def get_stat_years_desc(self, obj): return self._resolve_localized(obj, 'stat_years_desc')
    def get_stat_emissions(self, obj): return self._resolve_localized(obj, 'stat_emissions')
    def get_stat_emissions_desc(self, obj): return self._resolve_localized(obj, 'stat_emissions_desc')
    def get_stat_audience(self, obj): return self._resolve_localized(obj, 'stat_audience')
    def get_stat_audience_desc(self, obj): return self._resolve_localized(obj, 'stat_audience_desc')
    def get_stat_languages(self, obj): return self._resolve_localized(obj, 'stat_languages')
    def get_stat_languages_desc(self, obj): return self._resolve_localized(obj, 'stat_languages_desc')
    def get_stats_cta_title(self, obj): return self._resolve_localized(obj, 'stats_cta_title')
    def get_stats_cta_link_text(self, obj): return self._resolve_localized(obj, 'stats_cta_link_text')
    
    def get_history_intro_title(self, obj): return self._resolve_localized(obj, 'history_intro_title')
    def get_history_intro_text(self, obj): return self._resolve_localized(obj, 'history_intro_text')
    def get_vision_text(self, obj): return self._resolve_localized(obj, 'vision_text')
    def get_mission_intro(self, obj): return self._resolve_localized(obj, 'mission_intro')
    def get_bishop_bio_p1(self, obj): return self._resolve_localized(obj, 'bishop_bio_p1')
    def get_bishop_bio_p2(self, obj): return self._resolve_localized(obj, 'bishop_bio_p2')

    def get_vision_title(self, obj): return self._resolve_localized(obj, 'vision_title')
    def get_vision_description(self, obj): return self._resolve_localized(obj, 'vision_description')
    def get_vision_pillar1_title(self, obj): return self._resolve_localized(obj, 'vision_pillar1_title')
    def get_vision_pillar1_desc(self, obj): return self._resolve_localized(obj, 'vision_pillar1_desc')
    def get_vision_pillar2_title(self, obj): return self._resolve_localized(obj, 'vision_pillar2_title')
    def get_vision_pillar2_desc(self, obj): return self._resolve_localized(obj, 'vision_pillar2_desc')
    def get_vision_pillar3_title(self, obj): return self._resolve_localized(obj, 'vision_pillar3_title')
    def get_vision_pillar3_desc(self, obj): return self._resolve_localized(obj, 'vision_pillar3_desc')

    def get_engage_title(self, obj): return self._resolve_localized(obj, 'engage_title')
    def get_engage_description(self, obj): return self._resolve_localized(obj, 'engage_description')
    def get_engage_item1_title(self, obj): return self._resolve_localized(obj, 'engage_item1_title')
    def get_engage_item1_desc(self, obj): return self._resolve_localized(obj, 'engage_item1_desc')
    def get_engage_item1_cta(self, obj): return self._resolve_localized(obj, 'engage_item1_cta')
    def get_engage_item2_title(self, obj): return self._resolve_localized(obj, 'engage_item2_title')
    def get_engage_item2_desc(self, obj): return self._resolve_localized(obj, 'engage_item2_desc')
    def get_engage_item2_cta(self, obj): return self._resolve_localized(obj, 'engage_item2_cta')
    def get_engage_item3_title(self, obj): return self._resolve_localized(obj, 'engage_item3_title')
    def get_engage_item3_desc(self, obj): return self._resolve_localized(obj, 'engage_item3_desc')
    def get_engage_item3_cta(self, obj): return self._resolve_localized(obj, 'engage_item3_cta')

    def get_stories_badge(self, obj): return self._resolve_localized(obj, 'stories_badge')
    def get_stories_title(self, obj): return self._resolve_localized(obj, 'stories_title')
    def get_info_message_text(self, obj): return self._resolve_localized(obj, 'info_message_text')
    def get_info_badge_text(self, obj): return self._resolve_localized(obj, 'info_badge_text')
    
    # New localized getters
    def get_organization_title(self, obj): return self._resolve_localized(obj, 'organization_title')
    def get_organization_subtitle(self, obj): return self._resolve_localized(obj, 'organization_subtitle')
    def get_organization_text(self, obj): return self._resolve_localized(obj, 'organization_text')
    def get_history_title(self, obj): return self._resolve_localized(obj, 'history_title')
    def get_history_text(self, obj): return self._resolve_localized(obj, 'history_text')
    def get_bishop_title(self, obj): return self._resolve_localized(obj, 'bishop_title')
    def get_bishop_message(self, obj): return self._resolve_localized(obj, 'bishop_message')
    def get_vision_badge(self, obj): return self._resolve_localized(obj, 'vision_badge')
    def get_mission_badge(self, obj): return self._resolve_localized(obj, 'mission_badge')
    def get_mission_title(self, obj): return self._resolve_localized(obj, 'mission_title')
    def get_mission_description(self, obj): return self._resolve_localized(obj, 'mission_description')
    def get_values_badge(self, obj): return self._resolve_localized(obj, 'values_badge')
    def get_values_title(self, obj): return self._resolve_localized(obj, 'values_title')
    def get_values_description(self, obj): return self._resolve_localized(obj, 'values_description')
    def get_team_badge(self, obj): return self._resolve_localized(obj, 'team_badge')
    def get_nav_history(self, obj): return self._resolve_localized(obj, 'nav_history')
    def get_nav_bishop(self, obj): return self._resolve_localized(obj, 'nav_bishop')
    def get_nav_vision(self, obj): return self._resolve_localized(obj, 'nav_vision')
    def get_nav_team(self, obj): return self._resolve_localized(obj, 'nav_team')

    def to_representation(self, instance):
        """S'assurer que tous les champs sont présents dans le JSON, même s'ils sont vides"""
        try:
            # Essayer la sérialisation normale
            data = super().to_representation(instance)
            
            # S'assurer que tous les champs sont présents avec des valeurs par défaut si None
            try:
                for field in self.Meta.fields:
                    if field not in data:
                        # Initialiser les champs manquants
                        if field in ['logo', 'logo_url', 'logo_url_display', 'hero_image', 'hero_image_display', 'facebook_url', 
                                    'youtube_url', 'instagram_url', 'twitter_url', 'whatsapp_url']:
                            data[field] = None
                        else:
                            # Pour les autres champs, essayer de récupérer la valeur depuis l'instance
                            try:
                                value = getattr(instance, field, None)
                                data[field] = value if value is not None else ''
                            except Exception:
                                data[field] = ''
            except Exception as field_error:
                # Si erreur lors de l'itération, continuer avec les données déjà sérialisées
                import logging
                logger = logging.getLogger(__name__)
                logger.warning(f"Erreur lors de l'initialisation des champs: {field_error}")
            
            return data
        except Exception as e:
            # En cas d'erreur, retourner les données de base
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur dans to_representation: {str(e)}", exc_info=True)
            
            # Retourner un dictionnaire minimal pour éviter les erreurs 500
            try:
                minimal_data = {
                    'id': getattr(instance, 'id', 1),
                    'site_name': getattr(instance, 'site_name', 'Diocese Makamba'),
                    'description': getattr(instance, 'description', ''),
                    'logo': None,
                    'logo_url': getattr(instance, 'logo_url', '') or None,
                    'logo_url_display': None,
                    'contact_email': getattr(instance, 'contact_email', '') or '',
                    'contact_phone': getattr(instance, 'contact_phone', '') or '',
                    'contact_address': getattr(instance, 'contact_address', '') or '',
                    'facebook_url': getattr(instance, 'facebook_url', '') or None,
                    'youtube_url': getattr(instance, 'youtube_url', '') or None,
                    'instagram_url': getattr(instance, 'instagram_url', '') or None,
                    'twitter_url': getattr(instance, 'twitter_url', '') or None,
                    'whatsapp_url': getattr(instance, 'whatsapp_url', '') or None,
                }
                
                # Ajouter les champs multilingues de base (français)
                try:
                    minimal_data['hero_title_fr'] = getattr(instance, 'hero_title_fr', '') or ''
                    minimal_data['hero_subtitle_fr'] = getattr(instance, 'hero_subtitle_fr', '') or ''
                    minimal_data['about_content_fr'] = getattr(instance, 'about_content_fr', '') or ''
                    minimal_data['contact_content_fr'] = getattr(instance, 'contact_content_fr', '') or ''
                except Exception:
                    pass
                
                return minimal_data
            except Exception as minimal_error:
                logger.error(f"Erreur même lors de la création de la réponse minimale: {minimal_error}", exc_info=True)
                # Dernier recours : retourner un dictionnaire très basique
                return {
                    'id': 1,
                    'site_name': 'Diocese Makamba',
                    'description': 'Site officiel du Diocese Makamba Connect',
                    'error': 'serialization_error',
                    'message': f'Erreur de sérialisation: {str(e)}'
                }
    
    def get_logo_url_display(self, obj):
        """Retourne l'URL complète du logo (soit URL externe, soit fichier uploadé)"""
        if not obj:
            return None
        
        # Priorité 1: logo_url (URL externe)
        if hasattr(obj, 'logo_url') and obj.logo_url:
            return obj.logo_url
        
        # Priorité 2: logo (fichier uploadé)
        return self._get_image_url(obj, 'logo')

    def _get_image_url(self, obj, field_name):
        """Méthode utilitaire pour obtenir l'URL d'un champ image"""
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image_field.url)
            # Fallback si pas de requête dans le contexte
            return image_field.url
        except Exception:
            return None

    def get_hero_image_display(self, obj):
        """Retourne l'URL complète de l'image héro"""
        return self._get_image_url(obj, 'hero_image')

    def get_about_image_display(self, obj):
        """Retourne l'URL complète de l'image À Propos"""
        return self._get_image_url(obj, 'about_image')

    def get_team_image_display(self, obj):
        """Retourne l'URL complète de la photo d'équipe"""
        return self._get_image_url(obj, 'team_image')

    def get_quote_author_image_display(self, obj):
        """Retourne l'URL complète de la photo du pasteur (citation)"""
        return self._get_image_url(obj, 'quote_author_image')

    def get_vision_bg_image_display(self, obj):
        return self._get_image_url(obj, 'vision_bg_image')

    def get_engage_bg_image_display(self, obj):
        return self._get_image_url(obj, 'engage_bg_image')

    def get_stories_bg_image_display(self, obj):
        return self._get_image_url(obj, 'stories_bg_image')

    def get_parishes_bg_image_display(self, obj):
        return self._get_image_url(obj, 'parishes_bg_image')

    def get_history_image_display(self, obj): return self._get_image_url(obj, 'history_image')
    def get_bishop_photo_display(self, obj): return self._get_image_url(obj, 'bishop_photo')
    def get_vision_image_display(self, obj): return self._get_image_url(obj, 'vision_image')
    def get_mission_image_display(self, obj): return self._get_image_url(obj, 'mission_image')
    def get_values_image_display(self, obj): return self._get_image_url(obj, 'values_image')
