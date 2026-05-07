import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Users, Loader2, Home, Cross, Church } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useParishes, useParoissesPresentation } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";

const defaultImage = "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=1200&auto=format&fit=crop";

const zoneList = ["Toutes", "Makamba", "Kayogoro", "Nyanza-Lac", "Kibago", "Mabanda", "Vugizo", "Bukemba", "Rutana", "Bururi", "Rumonge", "Matana", "Mugamba"];


const Paroisses = () => {
  const { data: apiParishes, isLoading: loadingParishes } = useParishes();
  const { data: presentationList, isLoading: loadingPresentation } = useParoissesPresentation();
  const presentation = presentationList?.[0];
  
  const [activeZone, setActiveZone] = useState("Toutes");
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const isLoading = loadingParishes || loadingPresentation;

  const displayParishes = apiParishes || [];

  const filtered = activeZone === "Toutes"
    ? displayParishes
    : displayParishes.filter((p: any) => p.zone === activeZone);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-body">
      <Header />

      {/* 
        HERO SECTION DYNAMIQUE (STYLE PRO)
      */}
      <div className="relative w-full h-[60vh] min-h-[450px] flex shrink-0 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={presentation?.hero_image_display || "/images/paroisses-hero.png"}
            alt="Nos paroisses"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-semibold tracking-widest uppercase mb-6 border border-white/20 shadow-lg">
              {presentation?.[`hero_badge_${lang}`] || t('parishes_hero_badge', 'PRÉSENCE COMMUNAUTAIRE')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-heading mb-6 tracking-tight drop-shadow-xl leading-tight">
              {presentation?.[`hero_title_${lang}`] || t('parishes_hero_title', 'Nos Paroisses')}
            </h1>
            <p className="text-lg md:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
              {presentation?.[`hero_subtitle_${lang}`] || t('parishes_hero_description')}
            </p>
          </motion.div>
        </div>
        {/* Background Decorative Title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none tracking-tighter whitespace-nowrap uppercase">
          {presentation?.[`hero_title_${lang}`] || t('nav_parishes', 'Paroisses')}
        </h1>
      </div>

      <main className="flex-grow pb-24">
        {/* Filters Section */}
        <section className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-4 overflow-x-auto custom-scrollbar">
            <div className="flex gap-2 min-w-max justify-center items-center">
              {zoneList.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setActiveZone(zone)}
                  className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeZone === zone
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  {zone === "Toutes" ? t('parishes_zone_all', 'Toutes') : t(`zone_${zone.toLowerCase().replace(/\s+/g, '_')}`, zone)}
                </button>
              ))}

            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 pt-16">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-32">
              <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50 mb-4" />
              <p className="text-slate-500 font-medium">{t('parishes_loading', 'Chargement des paroisses locales...')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((parish, index) => (
                  <motion.div
                    key={parish.id || parish.name}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                    className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden relative"
                  >
                    {/* Image Block */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={parish.image_display || defaultImage}
                        alt={`Photo de la Paroisse ${parish.name}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Name layered on image */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Church className="h-4 w-4 text-emerald-300" />
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                            {parish.zone}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl font-bold leading-tight">
                          {parish.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content Block */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Pastor */}
                        <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                          <div className="mt-0.5 bg-emerald-100/80 p-1.5 rounded-full text-emerald-600">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-slate-400 mb-0.5">{t('parishes_pastor_label', 'Pasteur Responsable')}</p>
                            <p className="text-sm font-semibold text-slate-800">{parish.pastor}</p>
                          </div>
                        </div>

                        {/* Faithful */}
                        <div className="flex items-center gap-3 text-slate-600 px-1">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">{t('parishes_commune', 'Commune de')} <strong className="text-slate-800">{parish.zone}</strong></span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600 px-1">
                          <Cross className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">~<strong className="text-slate-800">{parish.faithful || "N/A"}</strong> {t('parishes_faithful_active', 'fidèles actifs')}</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px w-full bg-slate-100 my-2" />

                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {parish.phone || t('parishes_no_phone', "Non renseigné")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!isLoading && filtered.length === 0 && (
                <div className="col-span-full py-20 text-center flex flex-col items-center">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Church className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{t('parishes_not_found', 'Aucune paroisse trouvée')}</h3>
                  <p className="text-slate-500 max-w-md">
                    {t('parishes_not_found_desc', "Nous n'avons pas encore de paroisses répertoriées pour la zone de")} "{activeZone === 'Toutes' ? t('parishes_zone_all', 'Toutes') : t(`zone_${activeZone.toLowerCase().replace(/\s+/g, '_')}`, activeZone)}".
                  </p>

                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Paroisses;
