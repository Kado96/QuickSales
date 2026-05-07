from django.db import models

class TimelineEvent(models.Model):
    year = models.CharField(max_length=50, verbose_name="Année / Période", blank=True, null=True)
    
    title_fr = models.CharField(max_length=255, verbose_name="Titre (FR)", blank=True, null=True)
    title_en = models.CharField(max_length=255, verbose_name="Titre (EN)", blank=True, null=True)
    
    description_fr = models.TextField(verbose_name="Description détaillée (FR)", blank=True, null=True)
    description_en = models.TextField(verbose_name="Description détaillée (EN)", blank=True, null=True)
    
    image = models.ImageField(upload_to='history/', blank=True, null=True, verbose_name="Image de l'événement")
    order = models.IntegerField(default=0, help_text="Ordre d'affichage")

    # Obsolete titles/description for migration
    title = models.CharField(max_length=255, verbose_name="Titre (Obsolète)", blank=True, null=True)
    description = models.TextField(verbose_name="Description (Obsolète)", blank=True, null=True)
    language = models.CharField(max_length=2, choices=(("fr", "Français"), ("en", "English")), default="fr", verbose_name="Langue (Obsolète)", blank=True, null=True)

    class Meta:
        ordering = ['order', 'year']
        verbose_name = "Événement Historique"
        verbose_name_plural = "Chronologie - Historique"

    def __str__(self):
        return f"{self.year} - {self.title_fr or self.title}"

class MissionAxe(models.Model):
    text_fr = models.CharField(max_length=255, verbose_name="Axe de mission (FR)", blank=True, null=True)
    text_en = models.CharField(max_length=255, verbose_name="Axe de mission (EN)", blank=True, null=True)
    
    image = models.ImageField(upload_to='axes/', blank=True, null=True, verbose_name="Photo de l'axe")
    order = models.IntegerField(default=0)

    # Obsolete
    text = models.CharField(max_length=255, verbose_name="Texte (Obsolète)", blank=True, null=True)
    language = models.CharField(max_length=2, choices=(("fr", "Français"), ("en", "English")), default="fr", verbose_name="Langue (Obsolète)", blank=True, null=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Axe de Mission"
        verbose_name_plural = "Axes de Mission"

    def __str__(self):
        return self.text_fr or self.text or "Mission Axe"

class VisionValue(models.Model):
    icon = models.CharField(max_length=50, help_text="Nom Lucide (Cross, Heart, Users, etc.)")
    
    title_fr = models.CharField(max_length=255, verbose_name="Titre (FR)", blank=True, null=True)
    title_en = models.CharField(max_length=255, verbose_name="Titre (EN)", blank=True, null=True)
    
    description_fr = models.TextField(verbose_name="Description (FR)", blank=True, null=True)
    description_en = models.TextField(verbose_name="Description (EN)", blank=True, null=True)
    
    image = models.ImageField(upload_to='values/', blank=True, null=True, verbose_name="Photo de la valeur")
    order = models.IntegerField(default=0)

    # Obsolete
    title = models.CharField(max_length=255, verbose_name="Titre (Obsolète)", blank=True, null=True)
    description = models.TextField(verbose_name="Description (Obsolète)", blank=True, null=True)
    language = models.CharField(max_length=2, choices=(("fr", "Français"), ("en", "English")), default="fr", verbose_name="Langue (Obsolète)", blank=True, null=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Valeur"
        verbose_name_plural = "Valeurs"

    def __str__(self):
        return self.title_fr or self.title or "Vision Value"

class TeamMember(models.Model):
    name = models.CharField(max_length=255)
    
    role_fr = models.CharField(max_length=255, verbose_name="Rôle (FR)", blank=True, null=True)
    role_en = models.CharField(max_length=255, verbose_name="Rôle (EN)", blank=True, null=True)
    
    description_fr = models.TextField(verbose_name="Description (FR)", blank=True, null=True)
    description_en = models.TextField(verbose_name="Description (EN)", blank=True, null=True)
    
    image = models.ImageField(upload_to='team/', blank=True, null=True, verbose_name="Photo de profil")
    order = models.IntegerField(default=0)

    # Obsolete
    role = models.CharField(max_length=255, verbose_name="Rôle (Obsolète)", blank=True, null=True)
    description = models.TextField(verbose_name="Description (Obsolète)", blank=True, null=True)
    language = models.CharField(max_length=2, choices=(("fr", "Français"), ("en", "English")), default="fr", verbose_name="Langue (Obsolète)", blank=True, null=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Membre de l'équipe"
        verbose_name_plural = "Équipe Diocésaine"

    def __str__(self):
        return f"{self.name} - {self.role_fr or self.role}"

class DiocesePresentation(models.Model):
    hero_image = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Image Hero (Bandeau)")
    
    # French
    hero_subtitle_fr = models.TextField(verbose_name="Sous-titre Héro (FR)", blank=True, null=True, default="L'Église Anglicane du Diocèse de Makamba, fondée en 2009, est un pilier spirituel et social de la province du Burundi.")
    history_title_fr = models.CharField(max_length=255, verbose_name="Titre Historique (FR)", blank=True, null=True, default="Chronologie Majeure (Dates Clés)")
    history_text_fr = models.TextField(verbose_name="Texte de l'historique (FR)", blank=True, null=True)
    bishop_message_fr = models.TextField(verbose_name="Message de l'évêque (FR)", blank=True, null=True)
    organization_text_fr = models.TextField(verbose_name="Texte sur l'organisation (FR)", blank=True, null=True)
    
    # English
    hero_subtitle_en = models.TextField(verbose_name="Sous-titre Héro (EN)", blank=True, null=True, default="The Anglican Church of Makamba Diocese, founded in 2009, is a spiritual and social pillar of the province.")
    history_title_en = models.CharField(max_length=255, verbose_name="Titre Historique (EN)", blank=True, null=True, default="Major Timeline (Key Dates)")
    history_text_en = models.TextField(verbose_name="Texte de l'historique (EN)", blank=True, null=True)
    bishop_message_en = models.TextField(verbose_name="Message de l'évêque (EN)", blank=True, null=True)
    organization_text_en = models.TextField(verbose_name="Texte sur l'organisation (EN)", blank=True, null=True)

    # Vision Block
    vision_title_fr = models.CharField(max_length=255, verbose_name="Titre Vision (FR)", blank=True, null=True, default="Notre Vision")
    vision_description_fr = models.TextField(verbose_name="Description Vision (FR)", blank=True, null=True)
    vision_title_en = models.CharField(max_length=255, verbose_name="Titre Vision (EN)", blank=True, null=True, default="Our Vision")
    vision_description_en = models.TextField(verbose_name="Description Vision (EN)", blank=True, null=True)
    vision_image = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Image de la Vision")

    # Mission Block
    mission_title_fr = models.CharField(max_length=255, verbose_name="Titre Mission (FR)", blank=True, null=True, default="Notre Mission")
    mission_description_fr = models.TextField(verbose_name="Description Mission (FR)", blank=True, null=True)
    mission_title_en = models.CharField(max_length=255, verbose_name="Titre Mission (EN)", blank=True, null=True, default="Our Mission")
    mission_description_en = models.TextField(verbose_name="Description Mission (EN)", blank=True, null=True)
    mission_image = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Image de la Mission")

    # Values Intro Block
    values_title_fr = models.CharField(max_length=255, verbose_name="Titre Valeurs (FR)", blank=True, null=True, default="Nos Valeurs")
    values_description_fr = models.TextField(verbose_name="Description Valeurs (FR)", blank=True, null=True)
    values_title_en = models.CharField(max_length=255, verbose_name="Titre Valeurs (EN)", blank=True, null=True, default="Our Values")
    values_description_en = models.TextField(verbose_name="Description Valeurs (EN)", blank=True, null=True)
    values_image = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Image des Valeurs")

    # Team Intro Block
    team_badge_fr = models.CharField(max_length=255, verbose_name="Badge Équipe (FR)", blank=True, null=True, default="Leadership")
    team_badge_en = models.CharField(max_length=255, verbose_name="Badge Équipe (EN)", blank=True, null=True, default="Leadership")
    
    team_title_fr = models.CharField(max_length=255, verbose_name="Titre Équipe (FR)", blank=True, null=True, default="L'Équipe Diocésaine")
    team_title_en = models.CharField(max_length=255, verbose_name="Titre Équipe (EN)", blank=True, null=True, default="The Diocesan Team")
    
    team_description_fr = models.TextField(verbose_name="Description Équipe (FR)", blank=True, null=True)
    team_description_en = models.TextField(verbose_name="Description Équipe (EN)", blank=True, null=True)

    # Organization Intro
    organization_title_fr = models.CharField(max_length=255, verbose_name="Titre Organisation (FR)", blank=True, null=True, default="Notre Origine & Organisation")
    organization_title_en = models.CharField(max_length=255, verbose_name="Titre Organisation (EN)", blank=True, null=True, default="Our Origin & Organisation")
    
    organization_subtitle_fr = models.CharField(max_length=255, verbose_name="Sous-titre Organisation (FR)", blank=True, null=True, default="Présentation du Diocèse Anglican de MAKAMBA.")
    organization_subtitle_en = models.CharField(max_length=255, verbose_name="Sous-titre Organisation (EN)", blank=True, null=True, default="Presentation of the Anglican Diocese of MAKAMBA.")

    # Hero & Nav
    hero_title_fr = models.CharField(max_length=255, verbose_name="Titre Hero (FR)", blank=True, null=True, default="Le Diocèse")
    hero_title_en = models.CharField(max_length=255, verbose_name="Titre Hero (EN)", blank=True, null=True, default="The Diocese")

    nav_history_fr = models.CharField(max_length=255, verbose_name="Label Nav Historique (FR)", blank=True, null=True, default="Historique")
    nav_history_en = models.CharField(max_length=255, verbose_name="Label Nav Historique (EN)", blank=True, null=True, default="History")

    nav_bishop_fr = models.CharField(max_length=255, verbose_name="Label Nav Évêque (FR)", blank=True, null=True, default="L'Évêque")
    nav_bishop_en = models.CharField(max_length=255, verbose_name="Label Nav Évêque (EN)", blank=True, null=True, default="The Bishop")

    nav_vision_fr = models.CharField(max_length=255, verbose_name="Label Nav Vision (FR)", blank=True, null=True, default="Vision & Mission")
    nav_vision_en = models.CharField(max_length=255, verbose_name="Label Nav Vision (EN)", blank=True, null=True, default="Vision & Mission")

    nav_team_fr = models.CharField(max_length=255, verbose_name="Label Nav Équipe (FR)", blank=True, null=True, default="L'Équipe")
    nav_team_en = models.CharField(max_length=255, verbose_name="Label Nav Équipe (EN)", blank=True, null=True, default="The Team")

    # Badges for sections
    vision_badge_fr = models.CharField(max_length=255, verbose_name="Badge Vision (FR)", blank=True, null=True, default="Idéalisme")
    vision_badge_en = models.CharField(max_length=255, verbose_name="Badge Vision (EN)", blank=True, null=True, default="Idealism")

    mission_badge_fr = models.CharField(max_length=255, verbose_name="Badge Mission (FR)", blank=True, null=True, default="Stratégie")
    mission_badge_en = models.CharField(max_length=255, verbose_name="Badge Mission (EN)", blank=True, null=True, default="Strategy")

    values_badge_fr = models.CharField(max_length=255, verbose_name="Badge Valeurs (FR)", blank=True, null=True, default="Étiquette")
    values_badge_en = models.CharField(max_length=255, verbose_name="Badge Valeurs (EN)", blank=True, null=True, default="Values")

    history_image = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Image de l'historique")
    bishop_name = models.CharField(max_length=255, verbose_name="Nom de l'évêque", blank=True, null=True)
    bishop_title_fr = models.CharField(max_length=255, verbose_name="Titre de l'évêque (FR)", blank=True, null=True, default="Évêque de Makamba")
    bishop_title_en = models.CharField(max_length=255, verbose_name="Titre de l'évêque (EN)", blank=True, null=True, default="Bishop of Makamba")
    bishop_photo = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Photo de l'évêque")

    class Meta:
        verbose_name = "Présentation du Diocèse"
        verbose_name_plural = "Présentation du Diocèse"

    def __str__(self):
        return "Présentation du Diocèse"

    def save(self, *args, **kwargs):
        if self.__class__.objects.count() and not self.pk:
            self.pk = self.__class__.objects.first().pk
        super().save(*args, **kwargs)

class ParoissesPresentation(models.Model):
    hero_image = models.ImageField(upload_to='paroisses/', blank=True, null=True, verbose_name="Image Hero (Bandeau)")
    
    # French
    hero_badge_fr = models.CharField(max_length=255, verbose_name="Badge Hero (FR)", blank=True, null=True, default="PRÉSENCE COMMUNAUTAIRE")
    hero_title_fr = models.CharField(max_length=255, verbose_name="Titre Hero (FR)", blank=True, null=True, default="Nos Paroisses")
    hero_subtitle_fr = models.TextField(verbose_name="Sous-titre Héro (FR)", blank=True, null=True, default="Découvrez les paroisses du diocèse de Makamba. De véritables foyers spirituels, au cœur de chaque communauté, pour partager la foi et grandir ensemble.")
    
    # English
    hero_badge_en = models.CharField(max_length=255, verbose_name="Badge Hero (EN)", blank=True, null=True, default="COMMUNITY PRESENCE")
    hero_title_en = models.CharField(max_length=255, verbose_name="Titre Hero (EN)", blank=True, null=True, default="Our Parishes")
    hero_subtitle_en = models.TextField(verbose_name="Sous-titre Héro (EN)", blank=True, null=True, default="Discover the parishes of the Diocese of Makamba. True spiritual homes at the heart of every community.")

    class Meta:
        verbose_name = "Présentation de la page Paroisses"
        verbose_name_plural = "Présentation de la page Paroisses"

    def __str__(self):
        return "Présentation de la page Paroisses"

    def save(self, *args, **kwargs):
        if self.__class__.objects.count() and not self.pk:
            self.pk = self.__class__.objects.first().pk
        super().save(*args, **kwargs)

class ContactMessage(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nom complet")
    email = models.EmailField(verbose_name="Email")
    subject = models.CharField(max_length=255, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    is_read = models.BooleanField(default=False, verbose_name="Lu")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Message de Contact"
        verbose_name_plural = "Messages de Contact"

    def __str__(self):
        return f"Message de {self.name} - {self.subject}"

