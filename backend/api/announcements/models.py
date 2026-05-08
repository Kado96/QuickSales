from django.db import models
from django.conf import settings

class Announcement(models.Model):
    PRIORITY_CHOICES = [
        ('basse', 'Basse'),
        ('normale', 'Normale'),
        ('haute', 'Haute'),
    ]

    CATEGORY_CHOICES = [
        ('temoignages', 'Témoignages'),
        ('evenements', 'Événements'),
        ('nouvelles', 'Nouvelles'),
    ]

    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('rn', 'Kirundi'),
        ('en', 'English'),
        ('sw', 'Kiswahili'),
    ]

    title_fr = models.CharField(max_length=255, verbose_name="Titre (FR)", default="")
    title_en = models.CharField(max_length=255, verbose_name="Titre (EN)", default="", blank=True)
    content_fr = models.TextField(verbose_name="Contenu (FR)", default="")
    content_en = models.TextField(verbose_name="Contenu (EN)", default="", blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='nouvelles')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normale')
    
    # Obsolète - sera supprimé après migration
    title = models.CharField(max_length=255, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr', null=True, blank=True)
    event_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='announcements/', blank=True, null=True, verbose_name="Image à la une")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class AnnouncementImage(models.Model):
    announcement = models.ForeignKey(Announcement, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='announcements/gallery/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


class Comment(models.Model):
    """
    Commentaire sur un article (Announcement).
    - Visiteurs anonymes : remplissent author_name + author_email
    - Administrateurs/Éditeurs connectés : liés via le champ 'user'
    """
    announcement = models.ForeignKey(
        Announcement,
        related_name='comments',
        on_delete=models.CASCADE,
        verbose_name="Article"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Utilisateur connecté"
    )
    author_name = models.CharField(
        max_length=100,
        verbose_name="Nom de l'auteur",
        help_text="Rempli automatiquement si l'utilisateur est connecté"
    )
    author_email = models.EmailField(
        verbose_name="Email de l'auteur",
        blank=True,
        default=""
    )
    content = models.TextField(verbose_name="Commentaire")
    is_approved = models.BooleanField(
        default=True,
        verbose_name="Approuvé",
        help_text="Décochez pour masquer ce commentaire"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Commentaire"
        verbose_name_plural = "Commentaires"

    def __str__(self):
        return f"{self.author_name} - {self.announcement.title_fr[:30]}..."
