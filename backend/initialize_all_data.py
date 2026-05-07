import os
import django
import sys

# Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.pages.models import (
    DiocesePresentation, ParoissesPresentation, 
    TimelineEvent, MissionAxe, VisionValue
)
from api.parishes.models import Parish
from api.ministries.models import Ministry, MinistryActivity, MinistryPage

def initialize_all():
    print("🚀 Démarrage de l'initialisation complète de l'administration...")

    # 1. DIOCESE PRESENTATION
    print("--- Initialisation du Diocèse ---")
    diocese, _ = DiocesePresentation.objects.get_or_create(pk=1)
    diocese.hero_title_fr = "Le Diocèse"
    diocese.hero_title_en = "The Diocese"
    diocese.hero_subtitle_fr = "L'Église Anglicane du Diocèse de Makamba, fondée en 2009, est un pilier spirituel et social de la province du Burundi."
    diocese.hero_subtitle_en = "The Anglican Church of Makamba Diocese, founded in 2009, is a spiritual and social pillar of the province of Burundi."
    diocese.organization_title_fr = "Notre Origine & Organisation"
    diocese.organization_title_en = "Our Origin & Organisation"
    diocese.organization_subtitle_fr = "Présentation du Diocèse Anglican de MAKAMBA."
    diocese.organization_subtitle_en = "Presentation of the Anglican Diocese of MAKAMBA."
    diocese.organization_text_fr = "Le Diocèse de Makamba est l'un des diocèses de l'Église Anglicane du Burundi. Il couvre la province de Makamba et s'engage dans la mission de propagation de l'Évangile et le développement communautaire."
    diocese.organization_text_en = "The Diocese of Makamba is one of the dioceses of the Anglican Church of Burundi. It covers the Makamba province and is committed to the mission of spreading the Gospel and community development."
    diocese.history_title_fr = "Chronologie Majeure"
    diocese.history_title_en = "Major Timeline"
    diocese.history_text_fr = "Le Diocèse de Makamba a été officiellement érigé en 2009. Depuis sa création, il a connu une croissance spirituelle et structurelle remarquable."
    diocese.history_text_en = "The Diocese of Makamba was officially established in 2009. Since its creation, it has experienced remarkable growth."
    diocese.bishop_name = "Rt. Rev. Samuel Nduwayo"
    diocese.bishop_title_fr = "Évêque de Makamba"
    diocese.bishop_title_en = "Bishop of Makamba"
    diocese.bishop_message_fr = "Bienvenue sur notre portail. Que la paix du Seigneur soit avec vous."
    diocese.bishop_message_en = "Welcome to our portal. May the Lord's peace be with you."
    diocese.nav_history_fr = "Historique"
    diocese.nav_bishop_fr = "L'Évêque"
    diocese.nav_vision_fr = "Vision & Mission"
    diocese.nav_team_fr = "L'Équipe"
    diocese.save()

    # 2. PAROISSES PRESENTATION
    print("--- Initialisation de la page Paroisses ---")
    p_hero, _ = ParoissesPresentation.objects.get_or_create(pk=1)
    p_hero.hero_badge_fr = "PRÉSENCE COMMUNAUTAIRE"
    p_hero.hero_badge_en = "COMMUNITY PRESENCE"
    p_hero.hero_title_fr = "Nos Paroisses"
    p_hero.hero_title_en = "Our Parishes"
    p_hero.hero_subtitle_fr = "Découvrez nos lieux de culte et nos communautés dynamiques à travers toute la province de Makamba."
    p_hero.hero_subtitle_en = "Discover our places of worship and dynamic communities across the entire Makamba province."
    p_hero.save()

    # 3. LISTE DES PAROISSES (Exemples réels)
    print("--- Création de paroisses exemples ---")
    parishes_data = [
        {"name": "Cathédrale Saint-Jean", "zone": "Makamba", "pastor": "Rév. Canon Jean Bosco", "faithful": "1500"},
        {"name": "Paroisse Kayogoro", "zone": "Kayogoro", "pastor": "Rév. Marc Ndayisenga", "faithful": "800"},
        {"name": "Paroisse Nyanza-Lac", "zone": "Nyanza-Lac", "pastor": "Rév. Protais Ntakarutimana", "faithful": "1200"},
        {"name": "Paroisse Mabanda", "zone": "Mabanda", "pastor": "Rév. Élie Niyonzima", "faithful": "600"},
    ]
    for p in parishes_data:
        Parish.objects.get_or_create(
            name=p['name'], 
            defaults={
                "zone": p['zone'], 
                "pastor": p['pastor'], 
                "faithful": p['faithful'],
                "language": "fr"
            }
        )

    # 4. MINISTRIES PAGE
    print("--- Initialisation de la page Ministères ---")
    m_page, _ = MinistryPage.objects.get_or_create(pk=1)
    m_page.hero_badge_fr = "ENGAGEMENT & SERVICE"
    m_page.hero_badge_en = "COMMITMENT & SERVICE"
    m_page.hero_title_fr = "Nos Ministères"
    m_page.hero_title_en = "Our Ministries"
    m_page.hero_description_fr = "Découvrez comment nous servons Dieu et notre communauté à travers nos différents départements."
    m_page.hero_description_en = "Discover how we serve God and our community through our different departments."
    m_page.save()

    # 5. LISTE DES MINISTÈRES
    print("--- Création de ministères exemples ---")
    ministries_data = [
        {
            "title_fr": "Union des Mères", "title_en": "Mothers' Union", "icon": "Heart", "order": 1,
            "mission_fr": "Soutenir les familles et promouvoir le rôle de la femme dans l'Église et la société.",
            "mission_en": "Support families and promote the role of women in the Church and society."
        },
        {
            "title_fr": "Jeunesse", "title_en": "Youth Ministry", "icon": "Users", "order": 2,
            "mission_fr": "Encadrer et former la prochaine génération de leaders chrétiens.",
            "mission_en": "Mentor and train the next generation of Christian leaders."
        },
        {
            "title_fr": "Développement", "title_en": "Development", "icon": "Sprout", "order": 3,
            "mission_fr": "Améliorer les conditions de vie des communautés par des projets durables.",
            "mission_en": "Improve community living conditions through sustainable projects."
        }
    ]
    for m in ministries_data:
        ministry, _ = Ministry.objects.get_or_create(
            title_fr=m['title_fr'],
            defaults={
                "title_en": m['title_en'],
                "icon": m['icon'],
                "order": m['order'],
                "mission_fr": m['mission_fr'],
                "mission_en": m['mission_en']
            }
        )
        # Ajouter une activité par défaut
        MinistryActivity.objects.get_or_create(
            ministry=ministry,
            title_fr="Réunion hebdomadaire",
            defaults={"title_en": "Weekly meeting"}
        )

    # 6. TIMELINE EVENTS
    print("--- Création d'événements historiques ---")
    TimelineEvent.objects.get_or_create(year="2009", defaults={"title_fr": "Érection du Diocèse", "title_en": "Establishment of the Diocese", "description_fr": "Séparation du Diocèse de Matana."})
    TimelineEvent.objects.get_or_create(year="2010", defaults={"title_fr": "Premier Évêque", "title_en": "First Bishop", "description_fr": "Sacre de Mgr Martin Blaise Nyaboho."})

    # 7. VISION / MISSION AXES
    print("--- Création des axes et valeurs ---")
    axes = [
        "Proclamer l'Évangile de Jésus-Christ",
        "Formation de disciples engagés",
        "Promouvoir l'éducation et la santé"
    ]
    for axe in axes:
        MissionAxe.objects.get_or_create(text_fr=axe, defaults={"text_en": axe})

    values = [
        {"title_fr": "Foi", "icon": "Cross", "desc_fr": "Enracinés dans les Écritures."},
        {"title_fr": "Amour", "icon": "Heart", "desc_fr": "L'amour du prochain au centre."},
    ]
    for val in values:
        VisionValue.objects.get_or_create(title_fr=val['title_fr'], defaults={"icon": val['icon'], "description_fr": val['desc_fr']})

    print("✅ Félicitations ! Toute l'administration a été peuplée avec succès.")

if __name__ == "__main__":
    initialize_all()
