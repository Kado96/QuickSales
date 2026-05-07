import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, HandHeart, BookOpen, Heart, Lightbulb, MapPin, Cross } from "lucide-react";
import { useSiteSettings } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, any> = {
  Users,
  HandHeart,
  BookOpen,
  Heart,
  Lightbulb,
  MapPin,
  Cross,
};

const EngageSection = () => {
  const { data: settings } = useSiteSettings();
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();
  const title = settings?.[`engage_title_${lang}`] || settings?.engage_title_fr || t('nav_engage', "S'engager avec le diocèse");
  const subtitle = settings?.[`engage_description_${lang}`] || settings?.engage_description_fr || t('vision_subtitle_default', "Chacun a un rôle à jouer dans la mission de notre Église");

  const engagements = [
    {
      icon: iconMap[settings?.engage_item1_icon || "Users"] || Users,
      title: settings?.[`engage_item1_title_${lang}`] || settings?.engage_item1_title_fr || t('nav_ministries', "Rejoindre un ministère"),
      description: settings?.[`engage_item1_desc_${lang}`] || settings?.engage_item1_desc_fr || t('team_description_default', "Jeunes, femmes, éducation… Trouvez votre place dans la vie du diocèse."),
      cta: settings?.[`engage_item1_cta_${lang}`] || settings?.engage_item1_cta_fr || t('hero_discover', "Découvrir les ministères"),
      href: settings?.engage_item1_href || "/ministeres",
    },
    {
      icon: iconMap[settings?.engage_item2_icon || "HandHeart"] || HandHeart,
      title: settings?.[`engage_item2_title_${lang}`] || settings?.engage_item2_title_fr || t('nav_engage', "Soutenir un projet"),
      description: settings?.[`engage_item2_desc_${lang}`] || settings?.engage_item2_desc_fr || t('vision_desc_default', "Participez au financement de nos projets d'éducation, santé et développement."),
      cta: settings?.[`engage_item2_cta_${lang}`] || settings?.engage_item2_cta_fr || t('nav_contact', "Faire un don"),
      href: settings?.engage_item2_href || "/contact",
    },
    {
      icon: iconMap[settings?.engage_item3_icon || "BookOpen"] || BookOpen,
      title: settings?.[`engage_item3_title_${lang}`] || settings?.engage_item3_title_fr || t('nav_actualites', "Participer à la prière"),
      description: settings?.[`engage_item3_desc_${lang}`] || settings?.engage_item3_desc_fr || t('vision_subtitle_default', "Rejoignez nos groupes de prière, retraites spirituelles et célébrations."),
      cta: settings?.[`engage_item3_cta_${lang}`] || settings?.engage_item3_cta_fr || t('nav_news', "Voir l'agenda"),
      href: settings?.engage_item3_href || "/actualites",
    },
  ];


  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-3">
            {title}
          </h2>
          <p className="font-body text-secondary-foreground/80 text-lg max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {engagements.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-secondary-foreground/5 backdrop-blur-sm border border-secondary-foreground/10 rounded-xl p-8 text-center hover:bg-secondary-foreground/10 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent text-accent-foreground mb-5">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary-foreground mb-3">{item.title}</h3>
                <p className="font-body text-secondary-foreground/80 text-sm leading-relaxed mb-5">{item.description}</p>
                <Link
                  to={item.href}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-accent text-accent-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {item.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EngageSection;
