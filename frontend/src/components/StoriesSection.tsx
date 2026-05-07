import { motion } from "framer-motion";
import { ArrowRight, Loader2, Tag, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnnouncements, FALLBACK_IMAGES } from "@/hooks/useApi";
import { useSiteSettings } from "@/hooks/useApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const StoriesSection = () => {
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();
  
  const [activeCategory, setActiveCategory] = useState<string>(t('cat_all', "Toutes"));
  const { data: announcements, isLoading } = useAnnouncements();
  const { data: settings } = useSiteSettings();

  const badge = settings?.[`stories_badge_${lang}`] || settings?.stories_badge_fr || t('stories_badge_default', "Sur le terrain");
  const title = settings?.[`stories_title_${lang}`] || settings?.stories_title_fr || t('stories_title_default', "Toute l'actualité de nos actions");

  const getTranslatedCategory = (cat: string) => {
    switch(cat) {
      case 'temoignages': return t('cat_testimonials', "Témoignages");
      case 'evenements': return t('cat_events', "Événements");
      case 'nouvelles': return t('cat_news', "Nouvelles");
      default: return cat;
    }
  };

  // Filtrer par catégorie puis Limiter à 3 histoires pour la page d'accueil
  const filteredAnnouncements = announcements?.filter(story => {
    if (activeCategory === t('cat_all', "Toutes")) return true;
    return getTranslatedCategory(story.category) === activeCategory;
  }) || [];

  const stories = filteredAnnouncements.slice(0, 3);

  const categories = [
    t('cat_all', "Toutes"),
    t('cat_testimonials', "Témoignages"),
    t('cat_events', "Événements"),
    t('cat_news', "Nouvelles")
  ];

  return (
    <section className="section-padding section-alt">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <p className="font-body text-muted-foreground text-sm font-semibold uppercase tracking-wider text-primary mb-1">
            {badge}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>

          {/* Filtres compacts - Style Segmented Control pour réduire l'espace à zéro visuellement */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex flex-wrap items-center bg-card border border-border/40 p-1.5 rounded-full shadow-sm gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-body text-xs md:text-sm font-semibold transition-all ${activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 aspect-[4/5] block"
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={story.image_display || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Dégradé sombre progressif pour lisibilité optimale */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 group-hover:via-black/60 transition-colors duration-500"></div>
                </div>

                {/* Foreground Content Layer */}
                <div className="relative z-10 h-full w-full p-6 lg:p-8 flex flex-col">
                  {/* Top: Badge */}
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded bg-primary text-primary-foreground font-body text-xs font-bold uppercase tracking-wider shadow-sm">
                      {getTranslatedCategory(story.category)}
                    </span>
                  </div>

                  {/* Bottom: Text Content */}
                  <div className="mt-auto">
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3 leading-tight drop-shadow-sm line-clamp-3 group-hover:text-primary-100 transition-colors">
                      {story.title}
                    </h3>
                    <p className="font-body text-white/90 text-sm leading-relaxed mb-6 line-clamp-2">
                      {story.content}
                    </p>

                    {/* Meta & Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/80 font-body">
                        <Calendar className="h-4 w-4" /> {new Date(story.event_date || story.created_at).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>

                      <Link
                        to={`/actualites/${story.id}`}
                        className="inline-flex items-center gap-2 text-white bg-white/20 hover:bg-primary border border-white/20 px-5 py-2.5 rounded-full font-body font-bold text-xs md:text-sm transition-all backdrop-blur-md shadow-lg group-hover:scale-105 active:scale-95"
                      >
                        {t('read_more', 'Lire la suite')} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoriesSection;
