from django.contrib import admin
from .models import Announcement, AnnouncementImage, Comment

class AnnouncementImageInline(admin.TabularInline):
    model = AnnouncementImage
    extra = 3

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ('author_name', 'author_email', 'content', 'user', 'created_at')
    fields = ('author_name', 'author_email', 'content', 'user', 'is_approved', 'created_at')
    can_delete = True

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'category', 'priority', 'event_date', 'is_active', 'comments_count')
    list_filter = ('category', 'priority', 'is_active', 'event_date')
    search_fields = ('title_fr', 'title_en', 'content_fr', 'content_en')
    inlines = [AnnouncementImageInline, CommentInline]
    fieldsets = (
        ('Français', {
            'fields': ('title_fr', 'content_fr')
        }),
        ('English', {
            'fields': ('title_en', 'content_en')
        }),
        ('Configuration', {
            'fields': ('category', 'priority', 'event_date', 'image', 'is_active'),
        }),
        ('Migration (Obsolète)', {
            'classes': ('collapse',),
            'fields': ('title', 'content', 'language'),
        }),
    )

    def comments_count(self, obj):
        return obj.comments.count()
    comments_count.short_description = "Commentaires"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'announcement', 'is_approved', 'is_staff_comment', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('author_name', 'author_email', 'content')
    list_editable = ('is_approved',)
    readonly_fields = ('user', 'created_at', 'updated_at')
    actions = ['approve_comments', 'reject_comments']

    def is_staff_comment(self, obj):
        return obj.user is not None and obj.user.is_staff
    is_staff_comment.boolean = True
    is_staff_comment.short_description = "Staff"

    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approuver les commentaires sélectionnés"

    def reject_comments(self, request, queryset):
        queryset.update(is_approved=False)
    reject_comments.short_description = "Rejeter les commentaires sélectionnés"
