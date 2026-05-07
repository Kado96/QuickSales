import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useApi";

const StatsSection = () => {
  const { data: settings } = useSiteSettings();
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const stats = [
    {
      value: settings?.stat_years_value || "10+",
      label: settings?.[`stat_years_label_${lang}`] || settings?.stat_years_label_fr || t('stat_years_label', "Années de service"),
      description: settings?.[`stat_years_desc_${lang}`] || settings?.stat_years_desc_fr || t('stat_years_desc', "au service de Dieu")
    },
    {
      value: settings?.stat_emissions_value || "120+",
      label: settings?.[`stat_emissions_${lang}`] || settings?.stat_emissions_fr || t('stat_emissions', "Émissions"),
      description: settings?.[`stat_emissions_desc_${lang}`] || settings?.stat_emissions_desc_fr || t('stat_emissions_desc', "Diffusées")
    },
    {
      value: settings?.stat_audience_value || "8K",
      label: settings?.[`stat_audience_${lang}`] || settings?.stat_audience_fr || t('stat_audience', "Auditeurs"),
      description: settings?.[`stat_audience_desc_${lang}`] || settings?.stat_audience_desc_fr || t('stat_audience_desc', "Audience globale")
    },
    {
      value: settings?.stat_languages_value || "15",
      label: settings?.[`stat_languages_${lang}`] || settings?.stat_languages_fr || t('stat_languages', "Thématiques"),
      description: settings?.[`stat_languages_desc_${lang}`] || settings?.stat_languages_desc_fr || t('stat_languages_desc', "Abordées")
    },
  ];

  const ctaTitle = settings?.[`stats_cta_title_${lang}`] || settings?.stats_cta_title_fr || t('stats_cta_title', "Découvrir le diocèse");
  const ctaLinkText = settings?.[`stats_cta_link_text_${lang}`] || settings?.stats_cta_link_text_fr || t('read_more', "En savoir plus");


  return (
    <section className="w-full max-w-7xl mx-auto px-4 -mt-12 mb-16 relative z-10">
      <div className="flex flex-col lg:flex-row bg-card shadow-xl rounded-xl overflow-hidden border border-border/50">
        {/* Left Side: Stats (70%) */}
        <div className="flex-1 p-8 lg:p-12 flex items-center justify-center bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center flex flex-col items-center"
              >
                <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-3">
                  {stat.value}
                </p>
                <div className="h-0.5 w-8 bg-secondary mx-auto mb-4 rounded-full"></div>
                <p className="font-body font-bold text-foreground text-sm uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="font-body text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Call to Action (30%) */}
        <div className="lg:w-[350px] bg-primary p-8 lg:p-12 flex flex-col justify-center text-primary-foreground">
          <div className="h-1 w-12 bg-secondary mb-6 rounded-full"></div>
          <h3 className="font-heading text-2xl font-bold mb-4">
            {ctaTitle}
          </h3>
          <div className="mt-auto">
            <a
              href={settings?.stats_cta_href || "/diocese"}
              className="inline-flex items-center gap-2 font-body font-semibold text-sm hover:gap-3 transition-all text-secondary"
            >
              {ctaLinkText} <span className="text-lg leading-none">&#8594;</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;
