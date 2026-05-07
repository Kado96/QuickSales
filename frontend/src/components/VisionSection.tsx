import { motion } from "framer-motion";
import { Cross, MapPin, Lightbulb, Heart, BookOpen, Users } from "lucide-react";
import { useSiteSettings } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, any> = {
  Cross,
  MapPin,
  Lightbulb,
  Heart,
  BookOpen,
  Users,
};

const VisionSection = () => {
  const { data: settings } = useSiteSettings();
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const title = settings?.[`vision_title_${lang}`] || settings?.vision_title_fr || t('vision_title_default', "Notre vision et notre mission");
  const description = settings?.[`vision_description_${lang}`] || settings?.vision_description_fr || t('vision_desc_default', "Fondé sur l'Évangile, nous nous engageons à servir Dieu et les communautés à travers trois piliers fondamentaux.");

  const pillars = [
    {
      icon: iconMap[settings?.vision_pillar1_icon || "Cross"] || Cross,
      title: settings?.[`vision_pillar1_title_${lang}`] || settings?.vision_pillar1_title_fr || t('vision_pillar1_title', "Foi vivante"),
      description: settings?.[`vision_pillar1_desc_${lang}`] || settings?.vision_pillar1_desc_fr || t('vision_pillar1_desc', "Une vie sacramentelle riche, ancrée dans la liturgie anglicane et la prière communautaire au quotidien."),
    },
    {
      icon: iconMap[settings?.vision_pillar2_icon || "MapPin"] || MapPin,
      title: settings?.[`vision_pillar2_title_${lang}`] || settings?.vision_pillar2_title_fr || t('vision_pillar2_title', "Enracinement local"),
      description: settings?.[`vision_pillar2_desc_${lang}`] || settings?.vision_pillar2_desc_fr || t('vision_pillar2_desc', "Des paroisses proches des communautés, avec des équipes engagées issues du terroir de Makamba."),
    },
    {
      icon: iconMap[settings?.vision_pillar3_icon || "Lightbulb"] || Lightbulb,
      title: settings?.[`vision_pillar3_title_${lang}`] || settings?.vision_pillar3_title_fr || t('vision_pillar3_title', "Engagement social"),
      description: settings?.[`vision_pillar3_desc_${lang}`] || settings?.vision_pillar3_desc_fr || t('vision_pillar3_desc', "Éducation, santé et développement communautaire : agir concrètement pour transformer les vies."),
    },
  ];


  return (
    <section className="section-padding bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">

          {/* Colonne de Gauche : Titre, Intro et Bouton (40%) */}
          <div className="lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {title}
              </h2>
              <div className="h-1 w-12 bg-secondary mb-6"></div>
              <p className="font-body text-muted-foreground text-sm lg:text-base leading-relaxed mb-8">
                {description}
              </p>

              <a
                href="/a-propos"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-heading font-bold uppercase tracking-wider text-xs md:text-sm px-6 py-3 md:px-8 md:py-3.5 rounded-sm hover:bg-secondary/90 transition-all shadow-md hover:shadow-lg"
              >
                {t('hero_cta_learn', 'Découvrir le diocèse')}
              </a>
            </motion.div>
          </div>

          {/* Colonne du Milieu : Grand Icône Central (20%) */}
          <div className="hidden lg:flex lg:w-2/12 justify-center items-center mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-32 h-32 md:w-36 md:h-36 bg-secondary rounded-full flex items-center justify-center shadow-lg"
            >
              <Cross className="w-12 h-12 md:w-16 md:h-16 text-secondary-foreground" />
            </motion.div>
          </div>

          {/* Colonne de Droite : Liste numérotée des piliers (40%) */}
          <div className="lg:w-5/12 flex flex-col gap-6 md:gap-8 lg:mt-4">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                className="flex gap-5 md:gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-2xl shadow-md">
                  {index + 1}
                </div>
                <div className="pt-1">
                  <h3 className="font-heading font-bold text-foreground text-lg md:text-xl mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisionSection;
