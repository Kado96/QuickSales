from django.db import models
from django.core.cache import cache


class SiteSettings(models.Model):
    """Paramètres du site (singleton - une seule instance)"""
    
    # Informations générales
    site_name = models.CharField(max_length=200, default="Diocese Makamba")
    description = models.TextField(blank=True, default="Site officiel du Diocese Makamba Connect")
    
    # Message d'information (Bandeau type France 24)
    info_message_text_fr = models.TextField(blank=True, default="", help_text="Texte du message d'information (FR)")
    info_message_text_en = models.TextField(blank=True, default="", help_text="Texte du message d'information (EN)")
    info_badge_text_fr = models.CharField(max_length=50, blank=True, default="INFO SHALOM", help_text="Texte du badge (FR)")
    info_badge_text_en = models.CharField(max_length=50, blank=True, default="INFO SHALOM", help_text="Texte du badge (EN)")
    info_message_link = models.CharField(max_length=255, blank=True, default="", help_text="Lien optionnel pour le message d'info")
    info_message_active = models.BooleanField(default=False, help_text="Activer/Désactiver le bandeau d'information")
    
    DEFAULT_LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('en', 'English'),
    ]
    default_language = models.CharField(
        max_length=2, 
        choices=DEFAULT_LANGUAGE_CHOICES, 
        default='fr',
        help_text="Langue par défaut du site"
    )
    
    # Logo & Hero
    logo = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Logo du site")
    logo_url = models.URLField(blank=True, help_text="OU URL du logo (si pas d'upload)")
    hero_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond de la section Héro")
    
    # Images des sections
    about_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de la section À Propos (ex: église)")
    team_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Photo de l'équipe")
    quote_author_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Photo du pasteur pour la citation")
    
    # Citation du pasteur (multilingue)
    # Français
    quote_text_fr = models.TextField(blank=True, default="La Parole de Dieu est une puissance qui transforme les vies et bâtit les communautés.", help_text="Citation de l'Évêque")
    quote_author_name_fr = models.CharField(max_length=200, blank=True, default="Mgr Samuel Nduwayo")
    quote_author_subtitle_fr = models.CharField(max_length=200, blank=True, default="Évêque du Diocèse de Makamba")
    # English
    quote_text_en = models.TextField(blank=True, default="The Word of God is not just a story, it is a power that recreates the soul and aligns the spirit.")
    quote_author_name_en = models.CharField(max_length=200, blank=True, default="Rt. Rev. Samuel Nduwayo")
    quote_author_subtitle_en = models.CharField(max_length=200, blank=True, default="Bishop of Makamba Diocese")
    
    # Section Équipe (multilingue)
    # Français
    team_title_fr = models.CharField(max_length=200, blank=True, default="Notre Équipe")
    team_description_fr = models.TextField(blank=True, default="Une équipe dévouée au service du Royaume pour vous accompagner dans votre parcours chrétien.")
    # English
    team_title_en = models.CharField(max_length=200, blank=True, default="Our Team")
    team_description_en = models.TextField(blank=True, default="A team dedicated to serving the Kingdom to accompany you in your Christian journey.")
    
    # Titles of features About (multilingual)
    # Français
    about_feature1_fr = models.CharField(max_length=100, blank=True, default="Enseignement Biblique")
    about_feature2_fr = models.CharField(max_length=100, blank=True, default="Guérison du Cœur")
    about_feature3_fr = models.CharField(max_length=100, blank=True, default="Éveil Spirituel")
    about_feature4_fr = models.CharField(max_length=100, blank=True, default="Nos Engagements")
    # English
    about_feature1_en = models.CharField(max_length=100, blank=True, default="Biblical Teaching")
    about_feature2_en = models.CharField(max_length=100, blank=True, default="Heart Healing")
    about_feature3_en = models.CharField(max_length=100, blank=True, default="Spiritual Awakening")
    about_feature4_en = models.CharField(max_length=100, blank=True, default="Our Commitments")
    
    # Contact
    contact_email = models.EmailField(blank=True, default="info@makamba-diocese.org")
    contact_phone = models.CharField(max_length=50, blank=True, default="+257 22 23 45 67")
    contact_address = models.TextField(blank=True, default="Makamba, Burundi")
    
    # Réseaux sociaux
    facebook_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    whatsapp_url = models.URLField(blank=True)

    # Navigation Labels (multilingue)
    # Français
    nav_home_fr = models.CharField(max_length=100, blank=True, default="Accueil")
    nav_about_fr = models.CharField(max_length=100, blank=True, default="À Propos")
    nav_news_fr = models.CharField(max_length=100, blank=True, default="Actualités")
    nav_contact_fr = models.CharField(max_length=100, blank=True, default="Contact")
    
    # English
    nav_home_en = models.CharField(max_length=100, blank=True, default="Home")
    nav_about_en = models.CharField(max_length=100, blank=True, default="About Us")
    nav_news_en = models.CharField(max_length=100, blank=True, default="News")
    nav_contact_en = models.CharField(max_length=100, blank=True, default="Contact")
    
    # Contenu pages (par langue)
    # Français
    hero_badge_fr = models.CharField(max_length=150, blank=True, default="ÉGLISE ANGLICANE DU BURUNDI")
    hero_title_fr = models.CharField(max_length=255, default="À propos de nous", verbose_name="Titre Hero (FR)")
    hero_subtitle_fr = models.TextField(blank=True, default="Servir Dieu et notre prochain au cœur de Makamba. Annoncer l'Évangile, bâtir la paix, promouvoir l'éducation et la solidarité.")
    hero_btn1_text_fr = models.CharField(max_length=100, blank=True, default="Gundua diyosisi")
    hero_btn1_link_fr = models.CharField(max_length=255, blank=True, default="/a-propos")
    hero_btn2_text_fr = models.CharField(max_length=100, blank=True, default="Maisha ya diyosisi")
    hero_btn2_link_fr = models.CharField(max_length=255, blank=True, default="/ministeres")
    
    about_content_fr = models.TextField(blank=True, default="Bienvenue sur le site du Diocese Makamba, une communauté dédiée à la croissance spirituelle.")
    about_title_fr = models.CharField(max_length=200, blank=True, default="Notre Histoire")
    about_title_accent_fr = models.CharField(max_length=200, blank=True, default="& Vision")
    about_badge_fr = models.CharField(max_length=100, blank=True, default="À Propos")
    
    contact_content_fr = models.TextField(blank=True, default="Contactez-nous pour toute question ou demande.")
    contact_badge_fr = models.CharField(max_length=100, blank=True, default="Contact")

    # English
    hero_badge_en = models.CharField(max_length=150, blank=True, default="ANGLICAN CHURCH OF BURUNDI")
    hero_title_en = models.CharField(max_length=255, default="About Us", verbose_name="Titre Hero (EN)")
    hero_subtitle_en = models.TextField(blank=True, default="Serving God and our neighbor in the heart of Makamba. Proclaiming the Gospel, building peace, promoting education and solidarity.")
    hero_btn1_text_en = models.CharField(max_length=100, blank=True, default="Discover the diocese")
    hero_btn1_link_en = models.CharField(max_length=255, blank=True, default="/a-propos")
    hero_btn2_text_en = models.CharField(max_length=100, blank=True, default="Diocese life")
    hero_btn2_link_en = models.CharField(max_length=255, blank=True, default="/ministeres")
    
    about_content_en = models.TextField(blank=True, default="Welcome to the Makamba Diocese website, a community dedicated to spiritual growth.")
    about_title_en = models.CharField(max_length=200, blank=True, default="Our History")
    about_title_accent_en = models.CharField(max_length=200, blank=True, default="& Vision")
    about_badge_en = models.CharField(max_length=100, blank=True, default="About Us")
    
    contact_content_en = models.TextField(blank=True, default="Contact us for any questions or requests.")
    contact_badge_en = models.CharField(max_length=100, blank=True, default="Contact")
    
    # Verset biblique
    bible_verse_fr = models.TextField(blank=True, default="Que le Dieu de l'espérance vous remplisse de toute joie et de toute paix dans la foi, pour que vous abondiez en espérance par la puissance du Saint-Esprit !")
    bible_verse_ref_fr = models.CharField(max_length=50, blank=True, default="Romains 15:13")
    
    bible_verse_en = models.TextField(blank=True, default="May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit!")
    bible_verse_ref_en = models.CharField(max_length=50, blank=True, default="Romans 15:13")
    
    # Boutons
    btn_emissions_fr = models.CharField(max_length=100, blank=True, default="Émissions")
    btn_teachings_fr = models.CharField(max_length=100, blank=True, default="Enseignements")
    btn_meditation_fr = models.CharField(max_length=100, blank=True, default="Paroles de méditation")
    
    btn_emissions_en = models.CharField(max_length=100, blank=True, default="Broadcasts")
    btn_teachings_en = models.CharField(max_length=100, blank=True, default="Teachings")
    btn_meditation_en = models.CharField(max_length=100, blank=True, default="Meditation words")
    
    # Diocese & Page Intros (multilingue)
    # Français
    diocese_subtitle_fr = models.TextField(blank=True, default="L'Église Anglicane du Diocèse de Makamba, fondée en 2009, est un pilier spirituel et social de la province de Makamba au Burundi.")
    history_subtitle_fr = models.TextField(blank=True, default="Des origines missionnaires à un diocèse enraciné au cœur de Makamba.")
    history_intro_title_fr = models.CharField(max_length=255, blank=True, default="Les origines")
    history_intro_text_fr = models.TextField(blank=True, default="L'histoire de l'anglicanisme au Burundi remonte aux premières missions...")
    vision_subtitle_fr = models.TextField(blank=True, default="Notre boussole spirituelle et notre engagement concret au service des communautés de Makamba.")
    vision_text_fr = models.TextField(blank=True, default="« Être une Église vivante, ancrée dans l'Évangile... »")
    mission_intro_fr = models.TextField(blank=True, default="Le diocèse de Makamba s'engage à travers six axes missionnels complémentaires :")
    
    # Nouveaux champs pour DiocesePresentationTab & VisionIntroManager (FR)
    organization_title_fr = models.CharField(max_length=200, blank=True, default="")
    organization_subtitle_fr = models.CharField(max_length=200, blank=True, default="")
    organization_text_fr = models.TextField(blank=True, default="")
    history_title_fr = models.CharField(max_length=200, blank=True, default="")
    history_text_fr = models.TextField(blank=True, default="")
    bishop_name = models.CharField(max_length=200, blank=True, default="")
    bishop_title_fr = models.CharField(max_length=200, blank=True, default="")
    bishop_message_fr = models.TextField(blank=True, default="")
    vision_badge_fr = models.CharField(max_length=100, blank=True, default="")
    mission_badge_fr = models.CharField(max_length=100, blank=True, default="")
    mission_title_fr = models.CharField(max_length=200, blank=True, default="")
    mission_description_fr = models.TextField(blank=True, default="")
    values_badge_fr = models.CharField(max_length=100, blank=True, default="")
    values_title_fr = models.CharField(max_length=200, blank=True, default="")
    values_description_fr = models.TextField(blank=True, default="")
    team_badge_fr = models.CharField(max_length=100, blank=True, default="")
    nav_history_fr = models.CharField(max_length=100, blank=True, default="")
    nav_bishop_fr = models.CharField(max_length=100, blank=True, default="")
    nav_vision_fr = models.CharField(max_length=100, blank=True, default="")
    nav_team_fr = models.CharField(max_length=100, blank=True, default="")
    
    # English
    diocese_subtitle_en = models.TextField(blank=True, default="The Anglican Church of the Diocese of Makamba, founded in 2009, is a spiritual and social pillar of the Makamba province in Burundi.")
    history_subtitle_en = models.TextField(blank=True, default="From missionary origins to a diocese rooted in the heart of Makamba.")
    history_intro_title_en = models.CharField(max_length=255, blank=True, default="Origins")
    history_intro_text_en = models.TextField(blank=True, default="The history of Anglicanism in Burundi dates back to the first missions...")
    vision_subtitle_en = models.TextField(blank=True, default="Our spiritual compass and our concrete commitment to serving the communities of Makamba.")
    vision_text_en = models.TextField(blank=True, default="'Being a living Church, anchored in the Gospel...'")
    mission_intro_en = models.TextField(blank=True, default="The Diocese of Makamba is committed through six complementary missional axes:")
    
    # Nouveaux champs pour DiocesePresentationTab & VisionIntroManager (EN)
    organization_title_en = models.CharField(max_length=200, blank=True, default="")
    organization_subtitle_en = models.CharField(max_length=200, blank=True, default="")
    organization_text_en = models.TextField(blank=True, default="")
    history_title_en = models.CharField(max_length=200, blank=True, default="")
    history_text_en = models.TextField(blank=True, default="")
    bishop_title_en = models.CharField(max_length=200, blank=True, default="")
    bishop_message_en = models.TextField(blank=True, default="")
    vision_badge_en = models.CharField(max_length=100, blank=True, default="")
    mission_badge_en = models.CharField(max_length=100, blank=True, default="")
    mission_title_en = models.CharField(max_length=200, blank=True, default="")
    mission_description_en = models.TextField(blank=True, default="")
    values_badge_en = models.CharField(max_length=100, blank=True, default="")
    values_title_en = models.CharField(max_length=200, blank=True, default="")
    values_description_en = models.TextField(blank=True, default="")
    team_badge_en = models.CharField(max_length=100, blank=True, default="")
    nav_history_en = models.CharField(max_length=100, blank=True, default="")
    nav_bishop_en = models.CharField(max_length=100, blank=True, default="")
    nav_vision_en = models.CharField(max_length=100, blank=True, default="")
    nav_team_en = models.CharField(max_length=100, blank=True, default="")
    
    # Leadership
    bishop_bio_p1_fr = models.TextField(blank=True, default="Ordonné prêtre en 1995, Mgr Samuel Nduwayo a consacré sa vie au service de l'Église...")
    bishop_bio_p2_fr = models.TextField(blank=True, default="Sa vision d'une Église engagée socialement a permis le développement de projets...")
    
    bishop_bio_p1_en = models.TextField(blank=True, default="Ordained a priest in 1995, Rt. Rev. Samuel Nduwayo has dedicated his life to serving the Church...")
    bishop_bio_p2_en = models.TextField(blank=True, default="His vision of a socially engaged Church has allowed the development of projects...")

    # Stats - Valeurs (universelles)
    stat_years_value = models.CharField(max_length=50, blank=True, default="25+")
    stat_emissions_value = models.CharField(max_length=50, blank=True, default="120+")
    stat_audience_value = models.CharField(max_length=50, blank=True, default="8K")
    stat_languages_value = models.CharField(max_length=50, blank=True, default="15")

    # Stats - Labels (multilingues)
    # Français
    stat_years_label_fr = models.CharField(max_length=100, blank=True, default="Années de service")
    stat_emissions_fr = models.CharField(max_length=50, blank=True, default="Émissions")
    stat_audience_fr = models.CharField(max_length=50, blank=True, default="Auditeurs")
    stat_languages_fr = models.CharField(max_length=50, blank=True, default="Thématiques")
    
    # English
    stat_years_label_en = models.CharField(max_length=100, blank=True, default="Years of Service")
    stat_emissions_en = models.CharField(max_length=50, blank=True, default="Broadcasts")
    stat_audience_en = models.CharField(max_length=50, blank=True, default="Listeners")
    stat_languages_en = models.CharField(max_length=50, blank=True, default="Languages")

    # Stats descriptions (multilingue)
    stat_years_desc_fr = models.CharField(max_length=200, blank=True, default="au service de Dieu")
    stat_years_desc_en = models.CharField(max_length=200, blank=True, default="serving God")
    stat_emissions_desc_fr = models.CharField(max_length=200, blank=True, default="Diffusées")
    stat_emissions_desc_en = models.CharField(max_length=200, blank=True, default="Broadcast")
    stat_audience_desc_fr = models.CharField(max_length=200, blank=True, default="Audience globale")
    stat_audience_desc_en = models.CharField(max_length=200, blank=True, default="Global audience")
    stat_languages_desc_fr = models.CharField(max_length=200, blank=True, default="Abordées")
    stat_languages_desc_en = models.CharField(max_length=200, blank=True, default="Covered")
    
    section_featured_fr = models.CharField(max_length=100, blank=True, default="Émissions en vedette")
    section_featured_badge_fr = models.CharField(max_length=100, blank=True, default="Nouveauté")
    section_featured_accent_fr = models.CharField(max_length=100, blank=True, default="Vidéos")
    section_featured_desc_fr = models.TextField(blank=True, default="Découvrez nos dernières productions")

    section_featured_en = models.CharField(max_length=100, blank=True, default="Featured Broadcasts")
    section_featured_badge_en = models.CharField(max_length=100, blank=True, default="New Content")
    section_featured_accent_en = models.CharField(max_length=100, blank=True, default="Videos")
    section_featured_desc_en = models.TextField(blank=True, default="Discover our latest productions")
    
    section_categories_fr = models.CharField(max_length=100, blank=True, default="Catégories")
    section_categories_accent_fr = models.CharField(max_length=100, blank=True, default="Emissions")
    section_categories_desc_fr = models.TextField(blank=True, default="Explorez nos différentes catégories d'émissions pour enrichir votre vie spirituelle")

    section_categories_en = models.CharField(max_length=100, blank=True, default="Categories")
    section_categories_accent_en = models.CharField(max_length=100, blank=True, default="Programs")
    section_categories_desc_en = models.TextField(blank=True, default="Explore our different broadcast categories to enrich your spiritual life")

    section_announcements_badge_fr = models.CharField(max_length=100, blank=True, default="Annonces")
    section_announcements_title_fr = models.CharField(max_length=200, blank=True, default="Infos & Événements")
    section_announcements_accent_fr = models.CharField(max_length=100, blank=True, default="")
    section_announcements_desc_fr = models.TextField(blank=True, default="Restez informé des activités de notre ministère")

    section_announcements_badge_en = models.CharField(max_length=100, blank=True, default="Announcements")
    section_announcements_title_en = models.CharField(max_length=200, blank=True, default="Info & Events")
    section_announcements_accent_en = models.CharField(max_length=100, blank=True, default="")
    section_announcements_desc_en = models.TextField(blank=True, default="Stay informed about our ministry activities")

    section_testimonials_badge_fr = models.CharField(max_length=100, blank=True, default="Témoignages")
    section_testimonials_title_fr = models.CharField(max_length=200, blank=True, default="Ce qu'ils disent")
    section_testimonials_accent_fr = models.CharField(max_length=100, blank=True, default="de nous")
    section_testimonials_desc_fr = models.TextField(blank=True, default="Découvrez comment le Diocese Makamba transforme des vies")

    section_testimonials_badge_en = models.CharField(max_length=100, blank=True, default="Testimonials")
    section_testimonials_title_en = models.CharField(max_length=200, blank=True, default="What people say")
    section_testimonials_accent_en = models.CharField(max_length=100, blank=True, default="about us")
    section_testimonials_desc_en = models.TextField(blank=True, default="Discover how Diocese Makamba transforms lives")
    
    diocese_name_fr = models.CharField(max_length=200, blank=True, default="Diocèse de Makamba")
    diocese_name_en = models.CharField(max_length=200, blank=True, default="Diocese of Makamba")
    
    # Vision Section Title & Description (multilingue)
    # Français
    vision_title_fr = models.CharField(max_length=200, blank=True, default="Notre Vision & Mission")
    vision_description_fr = models.TextField(blank=True, default="Enraciné dans l'Évangile, le Diocèse de Makamba s'engage à servir Dieu et la communauté à travers trois piliers fondamentaux.")
    # English
    vision_title_en = models.CharField(max_length=200, blank=True, default="Our Vision & Mission")
    vision_description_en = models.TextField(blank=True, default="Rooted in the Gospel, the Diocese of Makamba is committed to serving God and the community through three fundamental pillars.")

    # Piliers Vision (FR)
    vision_pillar1_title_fr = models.CharField(max_length=200, blank=True, default="Foi vivante")
    vision_pillar1_desc_fr = models.TextField(blank=True, default="Une vie sacramentelle riche, ancrée dans la liturgie anglicane et la prière communautaire au quotidien.")
    vision_pillar1_icon = models.CharField(max_length=50, blank=True, default="Cross")
    
    vision_pillar2_title_fr = models.CharField(max_length=200, blank=True, default="Enracinement local")
    vision_pillar2_desc_fr = models.TextField(blank=True, default="Des paroisses proches des communautés, avec des équipes engagées issues du terroir de Makamba.")
    vision_pillar2_icon = models.CharField(max_length=50, blank=True, default="MapPin")
    
    vision_pillar3_title_fr = models.CharField(max_length=200, blank=True, default="Engagement social")
    vision_pillar3_desc_fr = models.TextField(blank=True, default="Éducation, santé et développement communautaire : agir concrètement pour transformer les vies.")
    vision_pillar3_icon = models.CharField(max_length=50, blank=True, default="Lightbulb")

    # Piliers Vision (EN)
    vision_pillar1_title_en = models.CharField(max_length=200, blank=True, default="Living Faith")
    vision_pillar1_desc_en = models.TextField(blank=True, default="A rich sacramental life, rooted in Anglican liturgy and daily community prayer.")
    
    vision_pillar2_title_en = models.CharField(max_length=200, blank=True, default="Local Rooting")
    vision_pillar2_desc_en = models.TextField(blank=True, default="Parishes close to communities, with dedicated teams from the local Makamba area.")
    
    vision_pillar3_title_en = models.CharField(max_length=200, blank=True, default="Social Engagement")
    vision_pillar3_desc_en = models.TextField(blank=True, default="Education, health and community development: concrete action to transform lives.")

    # Section Engagement (multilingue)
    engage_title_fr = models.CharField(max_length=200, blank=True, default="S'engager avec le diocèse")
    engage_description_fr = models.TextField(blank=True, default="Chaucun a un rôle à jouer dans la mission de notre Église")
    engage_title_en = models.CharField(max_length=200, blank=True, default="Engage with the Diocese")
    engage_description_en = models.TextField(blank=True, default="Everyone has a role to play in the mission of our Church")
    
    # Points d'engagement (FR)
    engage_item1_title_fr = models.CharField(max_length=200, blank=True, default="Rejoindre un ministère")
    engage_item1_desc_fr = models.TextField(blank=True, default="Jeunes, femmes, éducation… Trouvez votre place dans la vie du diocèse.")
    engage_item1_cta_fr = models.CharField(max_length=100, blank=True, default="Découvrir les ministères")
    engage_item1_href = models.CharField(max_length=255, blank=True, default="/ministeres")
    engage_item1_icon = models.CharField(max_length=50, blank=True, default="Users")
    
    engage_item2_title_fr = models.CharField(max_length=200, blank=True, default="Soutenir un projet")
    engage_item2_desc_fr = models.TextField(blank=True, default="Participez au financement de nos projets d'éducation, santé et développement.")
    engage_item2_cta_fr = models.CharField(max_length=100, blank=True, default="Faire un don")
    engage_item2_href = models.CharField(max_length=255, blank=True, default="/contact")
    engage_item2_icon = models.CharField(max_length=50, blank=True, default="HandHeart")
    
    engage_item3_title_fr = models.CharField(max_length=200, blank=True, default="Participer à la prière")
    engage_item3_desc_fr = models.TextField(blank=True, default="Rejoignez nos groupes de prière, retraites spirituelles et célébrations.")
    engage_item3_cta_fr = models.CharField(max_length=100, blank=True, default="Voir l'agenda")
    engage_item3_href = models.CharField(max_length=255, blank=True, default="/actualites")
    engage_item3_icon = models.CharField(max_length=50, blank=True, default="BookOpen")

    # Points d'engagement (EN)
    engage_item1_title_en = models.CharField(max_length=200, blank=True, default="Join a ministry")
    engage_item1_desc_en = models.TextField(blank=True, default="Youth, women, education… Find your place in the life of the diocese.")
    engage_item1_cta_en = models.CharField(max_length=100, blank=True, default="Discover ministries")
    
    engage_item2_title_en = models.CharField(max_length=200, blank=True, default="Support a project")
    engage_item2_desc_en = models.TextField(blank=True, default="Participate in funding our education, health, and development projects.")
    engage_item2_cta_en = models.CharField(max_length=100, blank=True, default="Make a donation")
    
    engage_item3_title_en = models.CharField(max_length=200, blank=True, default="Participate in prayer")
    engage_item3_desc_en = models.TextField(blank=True, default="Join our prayer groups, spiritual retreats, and celebrations.")
    engage_item3_cta_en = models.CharField(max_length=100, blank=True, default="See calendar")

    # Section Paroisses (multilingue)
    parishes_badge_fr = models.CharField(max_length=150, blank=True, default="DÉCOUVRIR LE DIOCÈSE")
    parishes_title_fr = models.CharField(max_length=200, blank=True, default="Nos paroisses")
    parishes_description_fr = models.TextField(blank=True, default="Le diocèse de Makamba compte une vingtaine de paroisses réparties dans toute la province...")
    parishes_map_title_fr = models.CharField(max_length=200, blank=True, default="Province de Makamba")
    parishes_map_subtitle_fr = models.CharField(max_length=200, blank=True, default="Burundi, Afrique de l'Est")
    parishes_map_stats_fr = models.CharField(max_length=200, blank=True, default="20 paroisses • 8 communes")

    parishes_badge_en = models.CharField(max_length=150, blank=True, default="DISCOVER THE DIOCESE")
    parishes_title_en = models.CharField(max_length=200, blank=True, default="Our Parishes")
    parishes_description_en = models.TextField(blank=True, default="The diocese of Makamba has about twenty parishes spread throughout the province...")
    parishes_map_title_en = models.CharField(max_length=200, blank=True, default="Makamba Province")
    parishes_map_subtitle_en = models.CharField(max_length=200, blank=True, default="Burundi, East Africa")
    parishes_map_stats_en = models.CharField(max_length=200, blank=True, default="20 parishes • 8 communes")
    
    # ═══════════════════════════════════════════
    # Section Actualités / Stories (multilingue)
    # ═══════════════════════════════════════════
    stories_badge_fr = models.CharField(max_length=100, blank=True, default="Sur le terrain")
    stories_title_fr = models.CharField(max_length=200, blank=True, default="Toute l'actualité de nos actions")
    stories_badge_en = models.CharField(max_length=100, blank=True, default="On the ground")
    stories_title_en = models.CharField(max_length=200, blank=True, default="All the latest from our actions")

    # Stats CTA (multilingue)
    stats_cta_title_fr = models.CharField(max_length=200, blank=True, default="Découvrir le diocèse")
    stats_cta_link_text_fr = models.CharField(max_length=100, blank=True, default="En savoir plus")
    stats_cta_title_en = models.CharField(max_length=200, blank=True, default="Discover the diocese")
    stats_cta_link_text_en = models.CharField(max_length=100, blank=True, default="Learn more")
    stats_cta_href = models.CharField(max_length=255, blank=True, default="/diocese")

    # Section background images
    vision_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Vision")
    engage_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Engagement")
    stories_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Actualités")
    parishes_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Paroisses")
    
    # Nouveaux champs d'images pour VisionIntroManager & DiocesePresentationTab
    history_image = models.ImageField(upload_to='settings/', blank=True, null=True)
    bishop_photo = models.ImageField(upload_to='settings/', blank=True, null=True)
    vision_image = models.ImageField(upload_to='settings/', blank=True, null=True)
    mission_image = models.ImageField(upload_to='settings/', blank=True, null=True)
    values_image = models.ImageField(upload_to='settings/', blank=True, null=True)

    # Footer brand
    footer_brand_name = models.CharField(max_length=200, blank=True, default="Diocèse de Makamba")
    footer_brand_subtitle = models.CharField(max_length=300, blank=True, default="Église Anglicane du Burundi. Servir Dieu et notre prochain au cœur de Makamba.")

    # Personnalisation Header (multilingue)
    # Français
    header_admin_btn_fr = models.CharField(max_length=50, blank=True, default="Connexion Admin", help_text="Texte du bouton admin")
    header_slogan_fr = models.CharField(max_length=200, blank=True, default="", help_text="Slogan dans le header")
    # English
    header_admin_btn_en = models.CharField(max_length=50, blank=True, default="Admin Login")
    header_slogan_en = models.CharField(max_length=200, blank=True, default="")
    
    # Options Header
    show_admin_button = models.BooleanField(default=True, help_text="Afficher le bouton admin dans le header")
    
    # Personnalisation Footer (multilingue)
    # Français
    footer_description_fr = models.TextField(blank=True, default="Un ministère chrétien centré sur la guérison intérieure, la méditation de la Parole de Dieu, l'enseignement biblique et la croissance personnelle.")
    footer_quick_links_title_fr = models.CharField(max_length=100, blank=True, default="Liens rapides")
    footer_contact_title_fr = models.CharField(max_length=100, blank=True, default="Contactez-nous")
    footer_social_title_fr = models.CharField(max_length=100, blank=True, default="Suivez-nous")
    footer_copyright_fr = models.CharField(max_length=200, blank=True, default="Tous droits réservés")
    # English
    footer_description_en = models.TextField(blank=True, default="A Christian ministry focused on inner healing, meditation on God's Word, biblical teaching and personal growth.")
    footer_quick_links_title_en = models.CharField(max_length=100, blank=True, default="Quick Links")
    footer_contact_title_en = models.CharField(max_length=100, blank=True, default="Contact Us")
    footer_social_title_en = models.CharField(max_length=100, blank=True, default="Follow Us")
    footer_copyright_en = models.CharField(max_length=200, blank=True, default="All rights reserved")
    
    # Personnalisation des titres de pages (multilingue)
    # Français
    page_courses_title_fr = models.CharField(max_length=200, blank=True, default="Toutes les émissions", help_text="Titre de la page des émissions")
    page_about_title_fr = models.CharField(max_length=255, default="À propos de nous", verbose_name="Titre Page À Propos (FR)")
    page_contact_title_fr = models.CharField(max_length=200, blank=True, default="Contactez-nous", help_text="Titre de la page Contact")
    # English
    page_courses_title_en = models.CharField(max_length=200, blank=True, default="All Courses")
    page_about_title_en = models.CharField(max_length=255, default="About Us", verbose_name="Titre Page À Propos (EN)")
    page_contact_title_en = models.CharField(max_length=200, blank=True, default="Contact Us")
    
    # Personnalisation des styles
    # Couleurs
    primary_color = models.CharField(max_length=20, default="#1D8B5D", help_text="Couleur principale (hex: #RRGGBB)")
    secondary_color = models.CharField(max_length=20, default="#19324D", help_text="Couleur secondaire")
    text_color = models.CharField(max_length=7, blank=True, default="#1F2937", help_text="Couleur du texte principal")
    background_color = models.CharField(max_length=7, blank=True, default="#FFFFFF", help_text="Couleur de fond")
    accent_color = models.CharField(max_length=20, default="#F59E0B", help_text="Couleur d'accentuation")
    
    # Polices (fonts)
    heading_font = models.CharField(max_length=100, blank=True, default="Playfair Display", help_text="Police pour les titres")
    body_font = models.CharField(max_length=100, blank=True, default="Inter", help_text="Police pour le corps de texte")
    
    # Tailles de texte (en pixels ou rem)
    heading_size = models.CharField(max_length=10, blank=True, default="2.5rem", help_text="Taille des titres principaux")
    subheading_size = models.CharField(max_length=10, blank=True, default="1.5rem", help_text="Taille des sous-titres")
    body_size = models.CharField(max_length=10, blank=True, default="1rem", help_text="Taille du texte normal")
    small_size = models.CharField(max_length=10, blank=True, default="0.875rem", help_text="Taille du petit texte")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Paramètres du site"
        verbose_name_plural = "Paramètres du site"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Paramètres - {self.site_name}"
    
    def save(self, *args, **kwargs):
        # Toujours une seule instance
        self.pk = 1
        super().save(*args, **kwargs)
        # Invalider le cache
        cache.delete('site_settings')
    
    @classmethod
    def get_settings(cls):
        """Récupère les paramètres (avec cache)"""
        try:
            settings = cache.get('site_settings')
            if settings is None:
                try:
                    settings, _ = cls.objects.get_or_create(pk=1)
                    cache.set('site_settings', settings, 3600)  # Cache 1 heure
                except Exception as e:
                    # Si get_or_create échoue, essayer de récupérer directement
                    try:
                        settings = cls.objects.get(pk=1)
                        cache.set('site_settings', settings, 3600)
                    except cls.DoesNotExist:
                        # Si l'instance n'existe pas, créer avec valeurs par défaut
                        settings = cls.objects.create(
                            pk=1,
                            site_name='Diocese Makamba',
                            description='Site officiel du Diocese Makamba Connect',
                            contact_email='info@makamba-diocese.org',
                            contact_phone='+257 22 23 45 67',
                            contact_address='Makamba, Burundi',
                            stat_audience_value='8K',
                            stat_languages_value='15',
                        )
                        cache.set('site_settings', settings, 3600)
            return settings
        except Exception as e:
            # En cas d'erreur, essayer de récupérer ou créer sans cache
            try:
                return cls.objects.get(pk=1)
            except cls.DoesNotExist:
                return cls.objects.create(pk=1, site_name="Diocese Makamba", contact_email="info@makamba-diocese.org")

