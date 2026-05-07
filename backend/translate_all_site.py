import os
import django
import sys

# Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.pages.models import (
    DiocesePresentation, TimelineEvent, MissionAxe, 
    VisionValue, TeamMember, ParoissesPresentation
)
from api.parishes.models import Parish
from api.ministries.models import Ministry, MinistryPage, MinistryActivity
from api.settings.models import SiteSettings

def translate_all():
    print("🚀 Démarrage de la traduction globale et correction du site...")

    # 0. SITE SETTINGS (NOUVEAU - TRÈS IMPORTANT)
    try:
        ss = SiteSettings.objects.first()
        if ss:
            # Hero
            ss.hero_badge_en = "ANGLICAN CHURCH OF BURUNDI"
            ss.hero_title_en = "Grow in Faith"
            ss.hero_subtitle_en = "Discover biblical teachings, meditation and prayer to deepen your relationship with God."
            ss.hero_btn1_text_en = "Discover the diocese"
            ss.hero_btn2_text_en = "Diocese Life"
            
            # About
            ss.about_badge_en = "About Us"
            ss.about_title_en = "Our History"
            ss.about_title_accent_en = "& Vision"
            ss.about_content_en = "Welcome to the Makamba Diocese website, a community dedicated to spiritual growth and social transformation."
            ss.about_feature1_en = "Biblical Teaching"
            ss.about_feature2_en = "Heart Healing"
            ss.about_feature3_en = "Spiritual Awakening"
            ss.about_feature4_en = "Our Commitments"
            
            # Quote
            ss.quote_text_en = "The Word of God is a power that transforms lives and builds communities."
            ss.quote_author_name_en = "Rt. Rev. Samuel Nduwayo"
            ss.quote_author_subtitle_en = "Bishop of Makamba Diocese"
            
            # Vision & Mission
            ss.vision_title_en = "Our Vision & Mission"
            ss.vision_description_en = "Rooted in the Gospel, the Diocese of Makamba is committed to serving God and the community through fundamental pillars."
            ss.vision_pillar1_title_en = "Living Faith"
            ss.vision_pillar1_desc_en = "A rich sacramental life, rooted in Anglican liturgy and community prayer."
            ss.vision_pillar2_title_en = "Local Rooting"
            ss.vision_pillar2_desc_en = "Parishes close to communities, with dedicated local teams."
            ss.vision_pillar3_title_en = "Social Engagement"
            ss.vision_pillar3_desc_en = "Education, health and development: acting to transform lives."
            
            # Engagement
            ss.engage_title_en = "Engage with the Diocese"
            ss.engage_description_en = "Everyone has a role to play in our Church's mission."
            ss.engage_item1_title_en = "Join a ministry"
            ss.engage_item1_desc_en = "Youth, women, education... Find your place in the diocese."
            ss.engage_item1_cta_en = "Discover ministries"
            ss.engage_item2_title_en = "Support a project"
            ss.engage_item2_desc_en = "Participate in funding our health and development projects."
            ss.engage_item2_cta_en = "Make a donation"
            ss.engage_item3_title_en = "Participate in prayer"
            ss.engage_item3_desc_en = "Join our prayer groups and spiritual celebrations."
            ss.engage_item3_cta_en = "See calendar"
            
            # Stats
            ss.stat_years_label_en = "Years of Service"
            ss.stat_emissions_en = "Broadcasts"
            ss.stat_audience_en = "Listeners"
            ss.stat_languages_en = "Topics"
            
            # Parishes
            ss.parishes_badge_en = "DISCOVER THE DIOCESE"
            ss.parishes_title_en = "Our Parishes"
            ss.parishes_description_en = "The Diocese of Makamba has about twenty parishes spread throughout the province."
            ss.parishes_map_title_en = "Makamba Province"
            ss.parishes_map_stats_en = "20 parishes • 8 communes"
            
            # Footer & Header
            ss.footer_description_en = "A Christian ministry focused on inner healing, meditation on God's Word, and spiritual growth."
            ss.footer_copyright_en = "All rights reserved"
            ss.header_admin_btn_en = "Admin Login"
            
            # Stories
            ss.stories_badge_en = "On the ground"
            ss.stories_title_en = "All the latest from our actions"
            
            ss.save()
            print("✅ SiteSettings (Paramètres) mis à jour.")
    except Exception as e:
        print(f"❌ Erreur SiteSettings: {e}")

    # 1. DIOCÈSE PRÉSENTATION
    try:
        dp = DiocesePresentation.objects.first()
        if dp:
            dp.hero_title_en = "The Diocese"
            dp.hero_subtitle_en = "The Anglican Church of Makamba Diocese, founded in 2009, is a spiritual and social pillar of the province of Burundi."
            dp.save()
            print("✅ Presentation Diocèse mise à jour.")
    except Exception as e:
        print(f"❌ Erreur DiocesePresentation: {e}")

    # 2. CHRONOLOGIE (TIMELINE)
    try:
        for event in TimelineEvent.objects.all():
            if "missionnaires" in (event.title_fr or "").lower():
                event.title_en = "Arrival of the First Missionaries"
                event.description_en = "Anglican missionaries from the Church Missionary Society (CMS) arrive in the Burundi region to plant the seeds of faith."
            elif "création" in (event.title_fr or "").lower():
                event.title_en = "Creation of the Diocese"
                event.description_en = "Official establishment of the Makamba Diocese, marking a new era of spiritual independence and growth."
            event.save()
            print(f"✅ Événement Chrono traduit: {event.year}")
    except Exception as e:
        print(f"❌ Erreur Timeline: {e}")

    # 3. PAGE MINISTÈRES
    try:
        mp = MinistryPage.objects.first()
        if mp:
            mp.hero_badge_en = "OUR ACTIONS"
            mp.hero_title_en = "Ministries"
            mp.hero_description_en = "Serving the spiritual and social transformation of Makamba communities."
            mp.save()
            print("✅ Page Introduction Ministères traduite.")
    except Exception as e:
        print(f"❌ Erreur MinistryPage: {e}")

    # 4. PAROISSES
    try:
        for p in Parish.objects.all():
            if "Cathédrale" in p.name: p.name_en = "Saint John Cathedral"
            elif "Paroisse" in p.name: p.name_en = p.name.replace("Paroisse", "Parish")
            else: p.name_en = p.name
            p.save()
            print(f"✅ Paroisse traduite: {p.name}")
    except Exception as e:
        print(f"❌ Erreur Parish: {e}")

    print("\n✨ TRADUCTION FINALE RÉUSSIE !")

if __name__ == "__main__":
    translate_all()
