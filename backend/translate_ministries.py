import os
import django
import sys

# Configuration de l'environnement Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.ministries.models import Ministry, MinistryActivity

def translate():
    print("🌍 Traduction des Ministères en cours...")
    
    translations = {
        "Union des Mères": {
            "en": "Mothers' Union",
            "mission_en": "Support families and promote the role of women in the Church and society through prayer and action."
        },
        "Jeunesse": {
            "en": "Youth Ministry",
            "mission_en": "Empowering and mentoring the next generation of Christian leaders through fellowship and training."
        },
        "Développement": {
            "en": "Development",
            "mission_en": "Improving community livelihoods through sustainable projects in agriculture, water, and sanitation."
        },
        "Éducation": {
            "en": "Education",
            "mission_en": "Providing quality education and training to empower children and youth for a brighter future."
        },
        "Santé": {
            "en": "Health",
            "mission_en": "Promoting holistic health services and awareness to the most vulnerable communities."
        },
        "Évangélisation": {
            "en": "Evangelism",
            "mission_en": "Proclaiming the Gospel of Jesus Christ and making disciples in every corner of the diocese."
        },
        "Musique et Adoration": {
            "en": "Music and Worship",
            "mission_en": "Leading the community into a deeper relationship with God through spiritual songs and worship."
        }
    }

    ministries = Ministry.objects.all()
    for m in ministries:
        for fr_title, data in translations.items():
            if fr_title.lower() in m.title_fr.lower():
                m.title_en = data['en']
                m.mission_en = data['mission_en']
                m.save()
                print(f"✅ Traduit: {m.title_fr} -> {m.title_en}")
                
                # Traduire les activités liées
                for activity in m.activities.all():
                    if "Réunion" in activity.title_fr:
                        activity.title_en = "Weekly Meeting"
                        activity.save()
                    elif "Formation" in activity.title_fr:
                        activity.title_en = "Training Session"
                        activity.save()

    print("🎉 Toutes les traductions dynamiques ont été appliquées.")

if __name__ == "__main__":
    translate()
