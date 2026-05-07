from django.contrib import admin
from .models import TimelineEvent, MissionAxe, VisionValue, TeamMember, DiocesePresentation, ParoissesPresentation, ContactMessage

@admin.register(TimelineEvent)
class TimelineEventAdmin(admin.ModelAdmin):
    list_display = ('year', 'title_fr', 'order', 'image')
    list_editable = ('order',)
    search_fields = ('year', 'title_fr', 'description_fr')
    fieldsets = (
        ('Informations Générales', {
            'fields': ('year', 'order', 'image')
        }),
        ('Contenu Bilingue', {
            'fields': (
                ('title_fr', 'title_en'),
                ('description_fr', 'description_en'),
            )
        }),
    )

@admin.register(MissionAxe)
class MissionAxeAdmin(admin.ModelAdmin):
    list_display = ('text_fr', 'order')
    list_editable = ('order',)
    fieldsets = (
        ('Général', {
            'fields': ('order', 'image')
        }),
        ('Contenu Bilingue', {
            'fields': (('text_fr', 'text_en'),)
        }),
    )

@admin.register(VisionValue)
class VisionValueAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'icon', 'order')
    list_editable = ('order',)
    fieldsets = (
        ('Général', {
            'fields': ('icon', 'order', 'image')
        }),
        ('Contenu Bilingue', {
            'fields': (
                ('title_fr', 'title_en'),
                ('description_fr', 'description_en'),
            )
        }),
    )

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role_fr', 'order', 'image')
    list_editable = ('order',)
    fieldsets = (
        ('Général', {
            'fields': ('name', 'order', 'image')
        }),
        ('Contenu Bilingue', {
            'fields': (
                ('role_fr', 'role_en'),
                ('description_fr', 'description_en'),
            )
        }),
    )

@admin.register(DiocesePresentation)
class DiocesePresentationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Bandeau Héro & Navigation', {
            'fields': (
                'hero_image', 
                ('hero_title_fr', 'hero_title_en'),
                ('hero_subtitle_fr', 'hero_subtitle_en'),
                ('nav_history_fr', 'nav_history_en'),
                ('nav_bishop_fr', 'nav_bishop_en'),
                ('nav_vision_fr', 'nav_vision_en'),
                ('nav_team_fr', 'nav_team_en'),
            )
        }),
        ('Section : Notre Organisation', {
            'fields': (
                ('organization_title_fr', 'organization_title_en'),
                ('organization_subtitle_fr', 'organization_subtitle_en'),
                ('organization_text_fr', 'organization_text_en'),
            )
        }),
        ('Section : Historique', {
            'fields': (
                'history_image',
                ('history_title_fr', 'history_title_en'),
                ('history_text_fr', 'history_text_en'),
            )
        }),
        ("Section : Mot de l'Évêque", {
            'fields': (
                'bishop_photo',
                'bishop_name',
                ('bishop_title_fr', 'bishop_title_en'),
                ('bishop_message_fr', 'bishop_message_en'),
            )
        }),
        ('Section : Vision', {
            'fields': (
                'vision_image',
                ('vision_badge_fr', 'vision_badge_en'),
                ('vision_title_fr', 'vision_title_en'),
                ('vision_description_fr', 'vision_description_en'),
            )
        }),
        ('Section : Mission', {
            'fields': (
                'mission_image',
                ('mission_badge_fr', 'mission_badge_en'),
                ('mission_title_fr', 'mission_title_en'),
                ('mission_description_fr', 'mission_description_en'),
            )
        }),
        ('Section : Valeurs', {
            'fields': (
                'values_image',
                ('values_badge_fr', 'values_badge_en'),
                ('values_title_fr', 'values_title_en'),
                ('values_description_fr', 'values_description_en'),
            )
        }),
        ('Section : Introduction Équipe', {
            'fields': (
                ('team_badge_fr', 'team_badge_en'),
                ('team_title_fr', 'team_title_en'),
                ('team_description_fr', 'team_description_en'),
            )
        }),
    )

    def has_add_permission(self, request):
        if DiocesePresentation.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(ParoissesPresentation)
class ParoissesPresentationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Bandeau Héro', {
            'fields': (
                'hero_image',
                ('hero_badge_fr', 'hero_badge_en'),
                ('hero_title_fr', 'hero_title_en'),
                ('hero_subtitle_fr', 'hero_subtitle_en'),
            )
        }),
    )

    def has_add_permission(self, request):
        if ParoissesPresentation.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')
