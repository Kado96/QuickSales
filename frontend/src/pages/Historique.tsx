import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import historyImage from "@/assets/history-church.jpg";
import { useTimeline, useSiteSettings } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

const Historique = () => {
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();
  
  const { data: apiTimeline, isLoading: loadingTimeline } = useTimeline();
  const { data: settings, isLoading: loadingSettings } = useSiteSettings();

  const displayTimeline = apiTimeline && apiTimeline.length > 0
    ? [...apiTimeline].filter(item => (item.language || 'fr').split('-')[0] === lang).sort((a, b) => a.order - b.order)
    : [];

  const isLoading = loadingTimeline || loadingSettings;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHero
        title={t('diocese_history', "Historique")}
        subtitle={settings?.[`history_subtitle_${lang}`] || settings?.history_subtitle_fr || "Des origines missionnaires à un diocèse enraciné au cœur de Makamba."}
      />
      <main>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <section className="section-padding bg-background">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-xl overflow-hidden mb-12"
              >
                <img
                  src={historyImage}
                  alt="Ancienne église anglicane"
                  className="w-full h-64 md:h-96 object-cover"
                  loading="lazy"
                />
              </motion.div>
 
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="prose max-w-none mb-16"
              >
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {settings?.[`history_intro_title_${lang}`] || settings?.history_intro_title_fr || "Les origines"}
                </h2>
                <p className="font-body text-muted-foreground text-lg leading-relaxed">
                  {settings?.[`history_intro_text_${lang}`] || settings?.history_intro_text_fr || "L'histoire de l'anglicanisme au Burundi remonte aux premières missions de la Church Missionary Society dans la région des Grands Lacs africains. Les missionnaires ont apporté non seulement la foi chrétienne, mais aussi des initiatives d'éducation et de santé qui ont marqué durablement les communautés locales."}
                </p>
                {!settings?.history_intro_text && (
                  <p className="font-body text-muted-foreground text-lg leading-relaxed mt-4">
                    Au fil des décennies, l'Église anglicane s'est profondément enracinée dans la culture et la vie sociale
                    du Burundi, formant des leaders locaux et établissant des paroisses dans les zones les plus reculées.
                  </p>
                )}
              </motion.div>

              {/* Timeline */}
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
                Les grandes étapes
              </h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

                <div className="space-y-10">
                  {displayTimeline.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Aucun événement historique enregistré.</p>
                    </div>
                  ) : displayTimeline.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`relative flex flex-col md:flex-row items-start gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                    >
                      {/* Dot */}
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 mt-2 z-10 ring-4 ring-background" />

                      {/* Content */}
                      <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-body text-xs font-bold uppercase tracking-wider mb-2">
                          {event.year}
                        </span>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-2">{event.title}</h3>
                        {event.image_display && (
                          <div className="rounded-lg overflow-hidden mb-3 border border-border shadow-sm">
                            <img
                              src={event.image_display}
                              alt={event.title}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        <p className="font-body text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section >
        )}
      </main >
      <Footer />
    </div >
  );
};

export default Historique;
