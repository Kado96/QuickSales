"""
Script pour peupler les champs anglais de DiocesePresentation.
Usage: python manage.py shell < populate_en_content.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.pages.models import DiocesePresentation

p, _ = DiocesePresentation.objects.get_or_create(id=1)

# ── Vision ──
if not p.vision_description_en:
    p.vision_description_en = (
        "The Anglican Church of Burundi being one, regardless of the Dioceses, "
        "the vision of the Anglican Diocese of Makamba automatically becomes that of "
        "the Province of the Anglican Church of Burundi:\n"
        "A world transformed by the Word of God where peoples enjoy integral and sustainable development. "
        "A Burundian community where all people enjoy a dignified, abundant and fulfilled life.\n"
        "The Diocese of Makamba embraces the five marks of mission of the Anglican Communion:\n"
        "✓ To proclaim and share the Gospel of Jesus Christ;\n"
        "✓ To teach, baptize and encourage new believers;\n"
        "✓ To support people through loving service;\n"
        "✓ To transform unjust structures of society;\n"
        "✓ To strive to safeguard the integrity of creation and sustain and renew the life of the earth."
    )
    print("✅ vision_description_en set")

if not p.vision_title_en:
    p.vision_title_en = "Vision & Mission"
    print("✅ vision_title_en set")

if not p.vision_badge_en:
    p.vision_badge_en = "OUR VISION"
    print("✅ vision_badge_en set")

# ── Mission ──
if not p.mission_description_en:
    p.mission_description_en = (
        "The Diocese of Makamba is committed to serving God and communities through concrete actions. "
        "Our mission is structured around strategic axes that guide our evangelical and social engagement "
        "across the entire province."
    )
    print("✅ mission_description_en set")

if not p.mission_title_en:
    p.mission_title_en = "Our Mission"
    print("✅ mission_title_en set")

if not p.mission_badge_en:
    p.mission_badge_en = "OUR MISSION"
    print("✅ mission_badge_en set")

# ── Values ──
if not p.values_description_en:
    p.values_description_en = (
        "Rooted in Scripture and the Anglican tradition, these core values guide every aspect "
        "of our ministry and community life."
    )
    print("✅ values_description_en set")

if not p.values_title_en:
    p.values_title_en = "Our Core Values"
    print("✅ values_title_en set")

if not p.values_badge_en:
    p.values_badge_en = "OUR VALUES"
    print("✅ values_badge_en set")

# ── Team ──
if not p.team_title_en:
    p.team_title_en = "The Diocesan Team"
    print("✅ team_title_en set")

if not p.team_badge_en:
    p.team_badge_en = "Leadership"
    print("✅ team_badge_en set")

if not p.team_description_en:
    p.team_description_en = (
        "The dedicated leaders who accompany the daily life, ministries "
        "and projects of the diocese."
    )
    print("✅ team_description_en set")

# ── Organization ──
if not p.organization_title_en:
    p.organization_title_en = "Our Origin & Organization"
    print("✅ organization_title_en set")

if not p.organization_subtitle_en:
    p.organization_subtitle_en = "Presentation of the Anglican Diocese of MAKAMBA."
    print("✅ organization_subtitle_en set")

if not p.organization_text_en and p.organization_text_fr:
    p.organization_text_en = (
        "The Anglican Diocese of Makamba is part of the Anglican Church of Burundi. "
        "It is organized into deaneries, each grouping several parishes spread "
        "across the communes of the province."
    )
    print("✅ organization_text_en set")

# ── Hero ──
if not p.hero_title_en:
    p.hero_title_en = "The Diocese"
    print("✅ hero_title_en set")

if not p.hero_subtitle_en:
    p.hero_subtitle_en = (
        "The Anglican Church of Makamba Diocese, founded in 2009, "
        "is a spiritual and social pillar of the province."
    )
    print("✅ hero_subtitle_en set")

# ── History ──
if not p.history_title_en:
    p.history_title_en = "Major Timeline (Key Dates)"
    print("✅ history_title_en set")

if not p.history_text_en and p.history_text_fr:
    # Translate the FR history text
    p.history_text_en = (
        "The Anglican Church arrived in the Makamba province through the evangelistic efforts "
        "of missionaries and local faithful. Over the decades, it has grown to become a major "
        "spiritual and social force, establishing parishes, schools, and health centers "
        "to serve the surrounding communities."
    )
    print("✅ history_text_en set")

# ── Bishop ──
if not p.bishop_title_en:
    p.bishop_title_en = "Bishop of Makamba"
    print("✅ bishop_title_en set")

if not p.bishop_message_en and p.bishop_message_fr:
    p.bishop_message_en = (
        "Our call is to serve with love and humility, carrying the light "
        "of the Gospel into every home in Makamba."
    )
    print("✅ bishop_message_en set")

# ── Navigation labels ──
if not p.nav_history_en:
    p.nav_history_en = "History"
    print("✅ nav_history_en set")
if not p.nav_bishop_en:
    p.nav_bishop_en = "The Bishop"
    print("✅ nav_bishop_en set")
if not p.nav_vision_en:
    p.nav_vision_en = "Vision & Mission"
    print("✅ nav_vision_en set")
if not p.nav_team_en:
    p.nav_team_en = "The Team"
    print("✅ nav_team_en set")

p.save()
print("\n🎉 All English content has been saved to DiocesePresentation!")
