import os
import sys
import django
from django.utils import timezone

# Configure Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.pages.models import (
    DiocesePresentation, ParoissesPresentation, 
    TimelineEvent, MissionAxe, VisionValue, TeamMember
)
from api.parishes.models import Parish
from api.ministries.models import Ministry, MinistryActivity, MinistryPage
from api.settings.models import SiteSettings
from api.sermons.models import Sermon, SermonCategory
from api.testimonials.models import Testimonial
from api.announcements.models import Announcement

def run():
    print("🚀 Démarrage du nettoyage et de la population de la base de données QuickSales...")

    # 1. Nettoyage de l'ancienne base de données
    print("🧹 Nettoyage des anciennes données...")
    Parish.objects.all().delete()
    Ministry.objects.all().delete()
    MinistryActivity.objects.all().delete()
    TimelineEvent.objects.all().delete()
    MissionAxe.objects.all().delete()
    VisionValue.objects.all().delete()
    TeamMember.objects.all().delete()
    Sermon.objects.all().delete()
    SermonCategory.objects.all().delete()
    Testimonial.objects.all().delete()
    Announcement.objects.all().delete()

    # 2. Configuration des paramètres globaux (SiteSettings)
    print("⚙️ Configuration des paramètres généraux de QuickSales...")
    settings, _ = SiteSettings.objects.get_or_create(pk=1)
    settings.site_name = "QuickSales"
    settings.description = "Votre partenaire en Data, Marketing, Distribution et Transformation Digitale au Burundi."
    
    # Couleurs professionnelles haut de gamme (Bleu Premium / Orange Accent) conformes au logo
    settings.primary_color = "#0D3895"  # Bleu Royal (QuickSales)
    settings.secondary_color = "#0F172A"  # Dark Slate (Gris foncé/noir premium)
    settings.accent_color = "#F57200"  # Orange Vibrant (QuickSales)
    settings.logo_url = "/api/media/settings/logo_quicksales.png"
    
    # Textes FR
    settings.hero_badge_fr = "DEPUIS 2019"
    settings.hero_title_fr = "Votre partenaire en Data, Marketing, Distribution et Transformation Digitale"
    settings.hero_subtitle_fr = "Depuis 2019, QuickSales accompagne les entreprises, ONG et institutions dans leurs projets de collecte de données, d'études de marché, de marketing, de vente, de distribution et de transformation digitale grâce à une expertise reconnue et une couverture nationale."
    settings.hero_btn1_text_fr = "Découvrir nos services"
    settings.hero_btn1_link_fr = "/ministeres"
    settings.hero_btn2_text_fr = "Demander un devis"
    settings.hero_btn2_link_fr = "/contact"
    settings.header_slogan_fr = "DATA • MARKETING • DISTRIBUTION • DIGITAL"
    
    # Textes EN
    settings.hero_badge_en = "SINCE 2019"
    settings.hero_title_en = "Your Partner in Data, Marketing, Distribution & Digital Transformation"
    settings.hero_subtitle_en = "Since 2019, QuickSales has supported companies, NGOs, and institutions in their data collection, market research, marketing, sales, distribution, and digital transformation projects with recognized expertise and national coverage."
    settings.hero_btn1_text_en = "Our Services"
    settings.hero_btn1_link_en = "/ministeres"
    settings.hero_btn2_text_en = "Get a Quote"
    settings.hero_btn2_link_en = "/contact"
    settings.header_slogan_en = "DATA • MARKETING • DISTRIBUTION • DIGITAL"

    # Chiffres clés (Stats)
    settings.stat_years_value = "6+"
    settings.stat_years_label_fr = "Années d'expérience"
    settings.stat_years_label_en = "Years of experience"
    settings.stat_years_desc_fr = "expertises cumulées"
    settings.stat_years_desc_en = "accumulated expertise"

    settings.stat_emissions_value = "9+"
    settings.stat_emissions_fr = "Grands projets"
    settings.stat_emissions_en = "Major projects"
    settings.stat_emissions_desc_fr = "réalisés avec succès"
    settings.stat_emissions_desc_en = "successfully completed"

    settings.stat_audience_value = "9 586+"
    settings.stat_audience_fr = "Points de vente"
    settings.stat_audience_en = "Points of Sale"
    settings.stat_audience_desc_fr = "géolocalisés au Burundi"
    settings.stat_audience_desc_en = "geolocated in Burundi"

    settings.stat_languages_value = "111"
    settings.stat_languages_fr = "Agents terrain"
    settings.stat_languages_en = "Field Agents"
    settings.stat_languages_desc_fr = "actifs sur tout le territoire"
    settings.stat_languages_desc_en = "active nationwide"

    # Citation du fondateur au lieu du verset / évêque
    settings.bible_verse_fr = "Transformer les données en opportunités de croissance grâce à des solutions innovantes, personnalisées et orientées résultats."
    settings.bible_verse_ref_fr = "Notre Mission"
    settings.bible_verse_en = "Transforming data into growth opportunities through innovative, customized, and result-oriented solutions."
    settings.bible_verse_ref_en = "Our Mission"

    # Section Équipe intro
    settings.team_title_fr = "Notre équipe dirigeante"
    settings.team_title_en = "Our Leadership Team"
    settings.team_description_fr = "Des experts multidisciplinaires engagés à mener vos projets vers le succès."
    settings.team_description_en = "Multidisciplinary experts committed to steering your projects towards success."

    # Contact & Socials
    settings.contact_email = "info@quicksales.bi"
    settings.contact_phone = "+257 22 27 00 00"
    settings.contact_address = "Bujumbura, Burundi"
    settings.facebook_url = "https://facebook.com/quicksales"
    settings.twitter_url = "https://twitter.com/quicksales"
    settings.whatsapp_url = "https://wa.me/25722270000"

    settings.save()

    # 3. Présentation générale (DiocesePresentation)
    print("🏢 Configuration de la présentation générale de QuickSales...")
    presentation, _ = DiocesePresentation.objects.get_or_create(id=1)
    presentation.hero_title_fr = "Qui sommes-nous ?"
    presentation.hero_title_en = "Who are we?"
    presentation.hero_subtitle_fr = "QuickSales est une entreprise burundaise fondée en 2019, spécialisée dans les services de collecte de données, d'analyse stratégique, d'études de marché, de marketing, de vente et de distribution."
    presentation.hero_subtitle_en = "QuickSales is a Burundian company founded in 2019, specializing in data collection, strategic analysis, market research, marketing, sales, and distribution services."
    
    presentation.organization_title_fr = "Notre Organisation"
    presentation.organization_title_en = "Our Organization"
    presentation.organization_subtitle_fr = "Une expertise multidisciplinaire"
    presentation.organization_subtitle_en = "Multidisciplinary expertise"
    presentation.organization_text_fr = "Notre objectif est d'aider les organisations à prendre de meilleures décisions grâce à des données fiables, des analyses précises et des stratégies adaptées aux réalités du terrain.\n\nNotre équipe est composée de spécialistes en data, marketing, opérations, finance, communication et développement commercial, capables d'accompagner des projets de toute envergure."
    presentation.organization_text_en = "Our goal is to help organizations make better decisions through reliable data, precise analysis, and strategies tailored to field realities.\n\nOur team is made of specialists in data, marketing, operations, finance, communication, and business development, capable of supporting projects of any scale."
    
    presentation.history_title_fr = "Notre Histoire"
    presentation.history_title_en = "Our History"
    presentation.history_text_fr = "Depuis notre création en 2019, nous accompagnons les acteurs majeurs du développement économique et social au Burundi."
    presentation.history_text_en = "Since our creation in 2019, we have supported major economic and social development players in Burundi."
    
    presentation.bishop_name = "SINZINKAYO Fleury Martin"
    presentation.bishop_title_fr = "Co-fondateur & Visionnaire"
    presentation.bishop_title_en = "Co-founder & Visionary"
    presentation.bishop_message_fr = "QuickSales a été créé afin d'offrir aux entreprises des solutions innovantes en collecte de données, marketing et distribution, adaptées aux réalités locales."
    presentation.bishop_message_en = "QuickSales was created to offer companies innovative solutions in data collection, marketing, and distribution, tailored to local realities."
    
    # Mission & Vision badges & texts
    presentation.vision_badge_fr = "NOTRE VISION"
    presentation.vision_badge_en = "OUR VISION"
    presentation.vision_title_fr = "Notre Vision"
    presentation.vision_title_en = "Our Vision"
    presentation.vision_description_fr = "Être la référence en Afrique de l'Est dans les services de données, de marketing, de vente et de transformation digitale."
    presentation.vision_description_en = "To be the reference in East Africa for data, marketing, sales, and digital transformation services."
    
    presentation.mission_badge_fr = "NOTRE MISSION"
    presentation.mission_badge_en = "OUR MISSION"
    presentation.mission_title_fr = "Notre Mission"
    presentation.mission_description_fr = "Transformer les données en opportunités de croissance grâce à des solutions innovantes, personnalisées et orientées résultats."
    presentation.mission_title_en = "Our Mission"
    presentation.mission_description_en = "Transforming data into growth opportunities through innovative, customized, and result-oriented solutions."
    
    presentation.values_badge_fr = "NOS VALEURS"
    presentation.values_badge_en = "OUR VALUES"
    presentation.values_title_fr = "Nos Valeurs"
    presentation.values_title_en = "Our Values"
    presentation.values_description_fr = "L'ensemble des principes qui guident notre travail au quotidien."
    presentation.values_description_en = "The set of principles that guide our work on a daily basis."

    presentation.save()

    # 4. Axes et Valeurs (VisionValue)
    print("💎 Ajout des valeurs d'entreprise...")
    values = [
        {"title_fr": "Innovation", "title_en": "Innovation", "icon": "Lightbulb", "desc_fr": "Créer de nouvelles solutions adaptées.", "desc_en": "Creating new tailored solutions."},
        {"title_fr": "Engagement", "title_en": "Commitment", "icon": "Heart", "desc_fr": "S'investir pleinement pour le succès de nos clients.", "desc_en": "Fully investing in our clients' success."},
        {"title_fr": "Confiance", "title_en": "Trust", "icon": "ShieldCheck", "desc_fr": "Bâtir des relations honnêtes et transparentes.", "desc_en": "Building honest and transparent relationships."},
        {"title_fr": "Excellence", "title_en": "Excellence", "icon": "Award", "desc_fr": "Rechercher la meilleure qualité dans nos livrables.", "desc_en": "Seeking the highest quality in our deliverables."},
        {"title_fr": "Travail d'équipe", "title_en": "Teamwork", "icon": "Users", "desc_fr": "Collaborer activement pour de meilleurs résultats.", "desc_en": "Collaborating actively for better results."},
        {"title_fr": "Intégrité", "title_en": "Integrity", "icon": "Lock", "desc_fr": "Respecter les normes éthiques les plus strictes.", "desc_en": "Respecting the strict ethical standards."},
    ]
    for i, val in enumerate(values):
        VisionValue.objects.create(
            title_fr=val['title_fr'],
            title_en=val['title_en'],
            icon=val['icon'],
            description_fr=val['desc_fr'],
            description_en=val['desc_en'],
            order=i
        )

    # 5. Chronologie Historique (TimelineEvent)
    print("📅 Ajout de l'histoire (Timeline)...")
    timeline = [
        {"year": "2019", "title_fr": "Création de QuickSales", "title_en": "QuickSales Foundation", "desc_fr": "Fondation de l'entreprise au Burundi.", "desc_en": "Foundation of the company in Burundi."},
        {"year": "2020", "title_fr": "Premiers projets nationaux", "title_en": "First National Projects", "desc_fr": "Développement des premiers projets d'envergure nationale.", "desc_en": "Development of first major national projects."},
        {"year": "2021", "title_fr": "Expansion marketing et commerciale", "title_en": "Marketing & Sales Expansion", "desc_fr": "Déploiement des services commerciaux et d'activations.", "desc_en": "Deployment of sales and activation services."},
        {"year": "2023", "title_fr": "Partenariats Internationaux", "title_en": "International Partnerships", "desc_fr": "Signature de contrats avec des organisations internationales.", "desc_en": "Signing contracts with international organizations."},
        {"year": "Aujourd'hui", "title_fr": "Leader national", "title_en": "National Leader", "desc_fr": "Leader burundais dans les services de collecte de données, marketing et distribution.", "desc_en": "Burundian leader in data collection, marketing, and distribution services."}
    ]
    for i, event in enumerate(timeline):
        TimelineEvent.objects.create(
            year=event['year'],
            title_fr=event['title_fr'],
            title_en=event['title_en'],
            description_fr=event['desc_fr'],
            description_en=event['desc_en'],
            order=i
        )

    # 6. Membres de l'équipe (TeamMember)
    print("👥 Ajout de l'équipe QuickSales...")
    team = [
        {
            "name": "SINZINKAYO Fleury Martin",
            "role_fr": "Co-fondateur",
            "role_en": "Co-founder",
            "desc_fr": "Visionnaire et entrepreneur, il a créé QuickSales afin d'offrir aux entreprises des solutions innovantes en collecte de données, marketing et distribution. Parmi les réalisations marquantes figure le lancement national de Mirinda.",
            "desc_en": "Visionary and entrepreneur, he co-founded QuickSales to offer businesses innovative data collection, marketing, and distribution solutions. Notable achievements include the national launch of Mirinda.",
            "order": 1
        },
        {
            "name": "ISHIMWE Benitha",
            "role_fr": "Directrice Générale",
            "role_en": "General Manager",
            "desc_fr": "Elle pilote la stratégie de l'entreprise, assure la qualité des services et entretient des relations solides avec les partenaires. La collaboration avec CRDB Bank constitue l'un des projets qui a renforcé la réputation de QuickSales.",
            "desc_en": "She drives the company's strategy, ensures service quality, and maintains strong partnerships. The collaboration with CRDB Bank is one of the projects that reinforced QuickSales' reputation.",
            "order": 2
        },
        {
            "name": "Gaturagi Jean Claude",
            "role_fr": "Responsable Financier",
            "role_en": "Chief Financial Officer",
            "desc_fr": "Garant de la bonne gestion des ressources financières, il accompagne la croissance de l'entreprise et la réussite des projets (DKT Burundi, Modern Dairy).",
            "desc_en": "Guarantor of sound financial resource management, he supports company growth and project success (DKT Burundi, Modern Dairy).",
            "order": 3
        },
        {
            "name": "Kandeke Donald",
            "role_fr": "Data Engineer",
            "role_en": "Data Engineer",
            "desc_fr": "Spécialisé dans la collecte, le traitement et l'analyse des données, il transforme les informations en stratégies performantes pour les clients (Modern Dairy distribution optimization).",
            "desc_en": "Specialized in data collection, processing, and analysis, he transforms information into powerful strategies for clients (Modern Dairy distribution optimization).",
            "order": 4
        },
        {
            "name": "Ndayisenga Arnaud",
            "role_fr": "Responsable des Opérations",
            "role_en": "Operations Manager",
            "desc_fr": "Il coordonne les activités de terrain et veille à la qualité opérationnelle des projets, notamment la campagne nationale menée avec PSI Burundi.",
            "desc_en": "He coordinates field activities and ensures operational quality of projects, notably the campaign national run with PSI Burundi.",
            "order": 5
        },
        {
            "name": "Mutasha Juste",
            "role_fr": "Community Manager",
            "role_en": "Community Manager",
            "desc_fr": "Responsable de la communication digitale, il développe la visibilité des partenaires grâce à des campagnes créatives, notamment pour AKEZAMUTIMA.",
            "desc_en": "Responsible for digital communication, he boosts partners' visibility through creative campaigns, notably for AKEZAMUTIMA.",
            "order": 6
        }
    ]
    for member in team:
        TeamMember.objects.create(
            name=member['name'],
            role_fr=member['role_fr'],
            role_en=member['role_en'],
            description_fr=member['desc_fr'],
            description_en=member['desc_en'],
            order=member['order']
        )

    # 7. Services (Ministry Page & Ministry Models)
    print("🛠️ Configuration de la page des Services (anciennement Ministères)...")
    m_page, _ = MinistryPage.objects.get_or_create(id=1)
    m_page.hero_badge_fr = "NOTRE EXPERTISE"
    m_page.hero_badge_en = "OUR EXPERTISE"
    m_page.hero_title_fr = "Nos Services"
    m_page.hero_title_en = "Our Services"
    m_page.hero_description_fr = "Découvrez notre gamme complète de services conçus pour stimuler votre croissance et optimiser vos opérations."
    m_page.hero_description_en = "Discover our comprehensive range of services designed to boost your growth and optimize operations."
    m_page.save()

    services = [
        {
            "title_fr": "Collecte de données", "title_en": "Data Collection", "icon": "Database", "order": 1,
            "mission_fr": "Enquêtes terrain, études quantitatives et qualitatives, géolocalisation, recensements et contrôle qualité rigoureux.",
            "mission_en": "Field surveys, quantitative & qualitative studies, geolocation, censuses, and strict quality control.",
            "activities": ["Enquêtes terrain", "Études quantitatives", "Études qualitatives", "Géolocalisation", "Recensements", "Contrôle qualité"]
        },
        {
            "title_fr": "Études de marché", "title_en": "Market Research", "icon": "LineChart", "order": 2,
            "mission_fr": "Analyse approfondie des consommateurs, études sectorielles, analyses concurrentielles et suivi de la satisfaction client.",
            "mission_en": "In-depth consumer analysis, sector studies, competitive analysis, and customer satisfaction tracking.",
            "activities": ["Analyse des consommateurs", "Études sectorielles", "Études de concurrence", "Satisfaction client"]
        },
        {
            "title_fr": "Analyse des données", "title_en": "Data Analytics", "icon": "PieChart", "order": 3,
            "mission_fr": "Création de dashboards dynamiques, rapports décisionnels Power BI, visualisation interactive et suivi des KPI.",
            "mission_en": "Creation of dynamic dashboards, Power BI decision reports, interactive visualization, and KPI tracking.",
            "activities": ["Dashboards", "Rapports Power BI", "Visualisation", "Statistiques", "Suivi des KPI"]
        },
        {
            "title_fr": "Marketing", "title_en": "Marketing", "icon": "Megaphone", "order": 4,
            "mission_fr": "Activations de marques, trade marketing, campagnes promotionnelles nationales et stratégies de communication digitale.",
            "mission_en": "Brand activations, trade marketing, national promotional campaigns, and digital communication strategies.",
            "activities": ["Activation de marque", "Trade Marketing", "Campagnes promotionnelles", "Communication digitale"]
        },
        {
            "title_fr": "Vente", "title_en": "Sales & Force", "icon": "Coins", "order": 5,
            "mission_fr": "Force de vente externalisée, merchandising terrain et stratégies de développement commercial.",
            "mission_en": "Outsourced sales force, field merchandising, and commercial development strategies.",
            "activities": ["Force de vente", "Merchandising", "Développement commercial"]
        },
        {
            "title_fr": "Distribution", "title_en": "Distribution", "icon": "Truck", "order": 6,
            "mission_fr": "Réseau de distribution nationale, gestion optimisée des points de vente et suivi commercial analytique.",
            "mission_en": "National distribution network, optimized points of sale management, and analytical sales tracking.",
            "activities": ["Distribution nationale", "Gestion des points de vente", "Suivi commercial"]
        },
        {
            "title_fr": "Digital", "title_en": "Digital Solutions", "icon": "Cpu", "order": 7,
            "mission_fr": "Développement de logiciels sur mesure, automatisation, intelligence artificielle, applications mobiles et sites web.",
            "mission_en": "Custom software development, automation, artificial intelligence, mobile apps, and websites.",
            "activities": ["Développement de logiciels", "Automatisation", "Intelligence artificielle", "Applications mobiles", "Sites web"]
        }
    ]
    for s in services:
        ministry = Ministry.objects.create(
            title_fr=s['title_fr'],
            title_en=s['title_en'],
            mission_fr=s['mission_fr'],
            mission_en=s['mission_en'],
            icon=s['icon'],
            order=s['order']
        )
        for act in s['activities']:
            MinistryActivity.objects.create(
                ministry=ministry,
                title_fr=act,
                title_en=act
            )

    # 8. Réseau / Points de contact (anciennement Paroisses)
    print("📍 Configuration du réseau de distribution / points de contact...")
    p_presentation, _ = ParoissesPresentation.objects.get_or_create(id=1)
    p_presentation.hero_badge_fr = "NOTRE COUVERTURE"
    p_presentation.hero_badge_en = "OUR COVERAGE"
    p_presentation.hero_title_fr = "Présence Nationale"
    p_presentation.hero_subtitle_fr = "Découvrez nos agences et notre réseau de distribution s'étendant sur l'ensemble du Burundi."
    p_presentation.hero_title_en = "National Presence"
    p_presentation.hero_subtitle_en = "Discover our agencies and distribution network extending across all of Burundi."
    p_presentation.save()

    agencies = [
        {"name": "Agence de Bujumbura (Siège)", "zone": "Bujumbura Mairie", "faithful": "21 Enquêteurs", "pastor": "Responsable : ISHIMWE Benitha", "phone": "+257 22 27 00 00"},
        {"name": "Zone Gitega (Centre)", "zone": "Gitega", "faithful": "35 Agents", "pastor": "Responsable : Ndayisenga Arnaud", "phone": "+257 22 27 00 01"},
        {"name": "Zone Ngozi (Nord)", "zone": "Ngozi", "faithful": "28 Agents", "pastor": "Superviseur local", "phone": "+257 22 27 00 02"},
        {"name": "Zone Makamba (Sud)", "zone": "Makamba", "faithful": "27 Agents", "pastor": "Superviseur local", "phone": "+257 22 27 00 03"},
        {"name": "Zone Rumonge (Sud-Ouest)", "zone": "Rumonge", "faithful": "21 Agents", "pastor": "Superviseur local", "phone": "+257 22 27 00 04"}
    ]
    for agency in agencies:
        Parish.objects.create(
            name=agency['name'],
            zone=agency['zone'],
            faithful=agency['faithful'],
            pastor=agency['pastor'],
            phone=agency['phone'],
            language="fr"
        )

    # 9. Realisations / Case studies as Sermons/Resources
    print("📈 Ajout des réalisations phares de QuickSales...")
    cat_realisations, _ = SermonCategory.objects.get_or_create(name_fr="Études de cas", defaults={"description_fr": "Projets majeurs menés par QuickSales"})
    cat_tech, _ = SermonCategory.objects.get_or_create(name_fr="Technologies", defaults={"description_fr": "Outils technologiques utilisés"})

    realisations = [
        {"title_fr": "Lancement national de Mirinda", "desc_fr": "Campagne d'activation nationale et distribution massive de la marque Mirinda au Burundi."},
        {"title_fr": "Projet CRDB Bank", "desc_fr": "Étude d'implantation de points de vente et géolocalisation pour CRDB Bank."},
        {"title_fr": "Projet Modern Dairy", "desc_fr": "Étude de marché et optimisation logistique du réseau de distribution des produits laitiers."},
        {"title_fr": "Géolocalisation de 9586 points de vente", "desc_fr": "Cartographie complète et base de données SIG des commerces au Burundi."},
        {"title_fr": "PSI Burundi et DKT International", "desc_fr": "Études quantitatives et campagnes de santé communautaire."}
    ]
    for r in realisations:
        Sermon.objects.create(
            title_fr=r['title_fr'],
            description_fr=r['desc_fr'],
            category=cat_realisations,
            content_type='audio',
            preacher_name="QuickSales",
            audio_url="/dummy.pdf",
            sermon_date=timezone.now().date()
        )

    techs = [
        {"title_fr": "Power BI et Tableau", "desc_fr": "Visualisation de données avancée et KPI d'aide à la décision."},
        {"title_fr": "SurveyCTO et DHIS2", "desc_fr": "Formulaires d'enquête sécurisés et collecte mobile sécurisée hors-ligne."},
        {"title_fr": "Systemes d Information Geographique", "desc_fr": "Cartographie et optimisation d'itinéraires terrain."}
    ]
    for t in techs:
        Sermon.objects.create(
            title_fr=t['title_fr'],
            description_fr=t['desc_fr'],
            category=cat_tech,
            content_type='audio',
            preacher_name="QuickSales",
            audio_url="/dummy.pdf",
            sermon_date=timezone.now().date()
        )

    print("✅ Base de données QuickSales populée avec succès !")

if __name__ == "__main__":
    run()
