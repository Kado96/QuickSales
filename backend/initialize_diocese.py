import os
import django

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.pages.models import DiocesePresentation

def initialize_diocese():
    print("Initialisation des données du Diocèse...")
    
    # On récupère l'unique instance ou on la crée
    presentation, created = DiocesePresentation.objects.get_or_create(pk=1)
    
    # Valeurs par défaut basées sur le site public
    presentation.hero_title_fr = "Le Diocèse"
    presentation.hero_title_en = "The Diocese"
    
    presentation.hero_subtitle_fr = "L'Église Anglicane du Diocèse de Makamba, fondée en 2009, est un pilier spirituel et social de la province du Burundi."
    presentation.hero_subtitle_en = "The Anglican Church of Makamba Diocese, founded in 2009, is a spiritual and social pillar of the province of Burundi."
    
    presentation.organization_title_fr = "Notre Origine & Organisation"
    presentation.organization_title_en = "Our Origin & Organisation"
    
    presentation.organization_subtitle_fr = "Présentation du Diocèse Anglican de MAKAMBA."
    presentation.organization_subtitle_en = "Presentation of the Anglican Diocese of MAKAMBA."
    
    presentation.organization_text_fr = "Le Diocèse de Makamba est l'un des diocèses de l'Église Anglicane du Burundi. Il couvre la province de Makamba et s'engage dans la mission de propagation de l'Évangile et le développement communautaire."
    presentation.organization_text_en = "The Diocese of Makamba is one of the dioceses of the Anglican Church of Burundi. It covers the Makamba province and is committed to the mission of spreading the Gospel and community development."
    
    presentation.history_title_fr = "Chronologie Majeure (Dates Clés)"
    presentation.history_title_en = "Major Timeline (Key Dates)"
    
    presentation.history_text_fr = "Le Diocèse de Makamba a été officiellement érigé en 2009, se détachant du Diocèse de Matana pour mieux servir la population du sud du Burundi. Depuis sa création, il a connu une croissance spirituelle et structurelle remarquable, avec la construction de nombreuses paroisses, écoles et centres de santé."
    presentation.history_text_en = "The Diocese of Makamba was officially established in 2009, separating from the Diocese of Matana to better serve the population of southern Burundi. Since its creation, it has experienced remarkable spiritual and structural growth."
    
    presentation.vision_title_fr = "Notre Vision"
    presentation.vision_title_en = "Our Vision"
    presentation.vision_description_fr = "Un diocèse spirituellement mûr, socialement transformé et économiquement stable, témoignant de l'amour de Christ dans tout le Burundi."
    presentation.vision_description_en = "A spiritually mature, socially transformed and economically stable diocese, witnessing Christ's love throughout Burundi."
    
    presentation.mission_title_fr = "Notre Mission"
    presentation.mission_title_en = "Our Mission"
    presentation.mission_description_fr = "Prêcher l'Évangile de Jésus-Christ, faire des disciples et servir les communautés par des actions concrètes de développement et de compassion."
    presentation.mission_description_en = "Preach the Gospel of Jesus Christ, make disciples and serve communities through concrete development and compassion actions."
    
    presentation.values_title_fr = "Nos Valeurs"
    presentation.values_title_en = "Our Values"
    presentation.values_description_fr = "Foi, Intégrité, Service, Amour et Unité. Ces piliers guident chaque action du diocèse vers l'édification du Royaume de Dieu."
    presentation.values_description_en = "Faith, Integrity, Service, Love and Unity. These pillars guide every action of the diocese towards building the Kingdom of God."
    
    presentation.bishop_name = "Rt. Rev. Samuel Nduwayo"
    presentation.bishop_title_fr = "Évêque de Makamba"
    presentation.bishop_title_en = "Bishop of Makamba"
    presentation.bishop_message_fr = "Bienvenue sur le portail numérique de notre Diocèse. Que la paix du Seigneur soit avec vous alors que vous découvrez notre mission et notre engagement au Burundi."
    presentation.bishop_message_en = "Welcome to our Diocese's digital portal. May the Lord's peace be with you as you discover our mission and commitment in Burundi."
    
    # Nav labels
    presentation.nav_history_fr = "Historique"
    presentation.nav_history_en = "History"
    presentation.nav_bishop_fr = "L'Évêque"
    presentation.nav_bishop_en = "The Bishop"
    presentation.nav_vision_fr = "Vision & Mission"
    presentation.nav_vision_en = "Vision & Mission"
    presentation.nav_team_fr = "L'Équipe"
    presentation.nav_team_en = "The Team"
    
    presentation.save()
    print("✅ Données initialisées avec succès !")

if __name__ == "__main__":
    initialize_diocese()
