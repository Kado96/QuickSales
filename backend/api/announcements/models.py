from django.db import models
from django.conf import settings

class Announcement(models.Model):
    PRIORITY_CHOICES = [
        ('basse', 'Basse'),
        ('normale', 'Normale'),
        ('haute', 'Haute'),
    ]
    
    CATEGORY_CHOICES = [
        ('evenement', 'Événement'),
        ('nouvelle', 'Nouvelle'),
        ('communique', 'Communiqué'),
        ('urgent', 'Urgent'),
    ]
    
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('en', 'Anglais'),
    ]

    # Anciens champs (mis en optionnel pour éviter les erreurs de migration)
    title = models.CharField(max_length=200, blank=True, default="")
    content = models.TextField(blank=True, default="")
    
    # Nouveaux champs pour la traduction
    title_fr = models.CharField(max_length=200, verbose_name="Titre (FR)", blank=True, null=True)
    title_en = models.CharField(max_length=200, verbose_name="Titre (EN)", blank=True, null=True)
    content_fr = models.TextField(verbose_name="Contenu (FR)", blank=True, null=True)
    content_en = models.TextField(verbose_name="Contenu (EN)", blank=True, null=True)
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='nouvelle')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normale')
    event_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='announcements/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', '-created_at']

    def __str__(self):
        return self.title_fr or self.title or "Sans titre"


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
    Supporte les réponses (threaded comments) et les likes.
    """
    announcement = models.ForeignKey(
        Announcement,
        related_name='comments',
        on_delete=models.CASCADE,
        verbose_name="Article"
    )
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies',
        verbose_name="Réponse à"
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
        blank=True,
        default="Anonyme"
    )
    author_email = models.EmailField(
        verbose_name="Email de l'auteur",
        blank=True,
        default=""
    )
    content = models.TextField(verbose_name="Commentaire")
    likes = models.PositiveIntegerField(default=0, verbose_name="J'aime")
    
    is_approved = models.BooleanField(
        default=True,
        verbose_name="Approuvé"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = "Commentaire"
        verbose_name_plural = "Commentaires"

    def __str__(self):
        prefix = "RE: " if self.parent else ""
        return f"{prefix}{self.author_name} - {self.announcement.title_fr[:20] if self.announcement.title_fr else '...'}"
