import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useSiteSettings, useParishes } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

const ParishesSection = () => {
  const { data: settings } = useSiteSettings();
  const { data: parishesData, isLoading } = useParishes();
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const parishes = parishesData?.slice(0, 8).map(p => p.name) || [];

  const title = settings?.[`parishes_title_${lang}`] || settings?.parishes_title_fr || t('parishes_hero_title', "Nos paroisses");
  const description = settings?.[`parishes_description_${lang}`] || settings?.parishes_description_fr || t('parishes_hero_description', "Le diocèse de Makamba compte une vingtaine de paroisses réparties dans toute la province, chacune au service de sa communauté locale avec des équipes pastorales dévouées.");
  const mapTitle = settings?.[`parishes_map_title_${lang}`] || settings?.parishes_map_title_fr || t('parishes_map_title_fr', "Province de Makamba");
  const mapSubtitle = settings?.[`parishes_map_subtitle_${lang}`] || settings?.parishes_map_subtitle_fr || t('parishes_map_subtitle_fr', "Burundi, Afrique de l'Est");
  const badge = settings?.[`parishes_badge_${lang}`] || settings?.parishes_badge_fr || t('stats_cta_title', 'Découvrir le diocèse');
  const statParishes = settings?.stat_audience_value || "20";
  const statCommunes = settings?.stat_languages_value || "8";
  
  const statParishesLabel = settings?.[`stat_audience_${lang}`] || settings?.stat_audience_fr || t('parishes_faithful_active', 'paroisses en activité');
  const statCommunesLabel = settings?.[`stat_languages_${lang}`] || settings?.stat_languages_fr || t('parishes_commune', 'communes couvertes');

  return (
    <section className="section-padding bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT COLUMN : The Map (Carte) */}
          <div className="lg:w-1/2 flex justify-center items-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative w-full aspect-square max-w-[450px] shadow-lg rounded-[2rem] overflow-hidden border-4 border-white"
            >
              <iframe
                title="Localisation de la province de Makamba"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038755.701382902!2d28.298108!3d-4.130953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c417c2f6d892cb%3A0xc3b53c713807d9f7!2sProvince%20de%20Makamba%2C%20Burundi!5e0!3m2!1sfr!2s!4v1714574937219!5m2!1sfr!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              {/* Overlay minimaliste cliquable ou pour l'esthéthique */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                Makamba, Burundi
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN : Text & Stats Operations (ALIMA Style) */}
          <div className="lg:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-body text-primary font-bold text-sm uppercase tracking-[0.15em] mb-3">
                {badge}
              </p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {title}
              </h2>
              <div className="h-1 w-12 bg-secondary mb-8"></div>

              <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed mb-12 max-w-lg">
                {description}
              </p>

              {/* Big Stats Row */}
              <div className="flex flex-row gap-12 md:gap-20">
                <div className="flex flex-col">
                  <p className="font-heading text-6xl md:text-7xl font-extrabold text-primary mb-2 tracking-tighter">
                    {statParishes}
                  </p>
                  <p className="font-body text-foreground font-bold text-xs md:text-sm uppercase tracking-wider">
                    {statParishesLabel}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="font-heading text-6xl md:text-7xl font-extrabold text-primary mb-2 tracking-tighter">
                    {statCommunes}
                  </p>
                  <p className="font-body text-foreground font-bold text-xs md:text-sm uppercase tracking-wider">
                    {statCommunesLabel}
                  </p>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ParishesSection;
