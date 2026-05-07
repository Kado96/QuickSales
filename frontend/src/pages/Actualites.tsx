import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Loader2, ArrowRight, ChevronLeft, ChevronRight, Share2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAnnouncements, FALLBACK_IMAGES } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Actualites = () => {
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();
  
  const [activeCategory, setActiveCategory] = useState(t('cat_all', "Toutes"));
  const { data: announcements, isLoading } = useAnnouncements();
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    t('cat_all', "Toutes"),
    t('cat_testimonials', "Témoignages"),
    t('cat_events', "Événements"),
    t('cat_news', "Nouvelles")
  ];

  const getTranslatedCategory = (cat: string) => {
    switch(cat) {
      case 'temoignages': return t('cat_testimonials', "Témoignages");
      case 'evenements': return t('cat_events', "Événements");
      case 'nouvelles': return t('cat_news', "Nouvelles");
      default: return cat;
    }
  };

  const announcementList = (Array.isArray(announcements) ? announcements : (announcements?.results || []))
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const featuredNews = announcementList.slice(0, 3);

  const filtered = activeCategory === t('cat_all', "Toutes")
    ? announcementList
    : announcementList?.filter((a: any) => {
      const translatedCat = getTranslatedCategory(a.category);
      return translatedCat === activeCategory;
    });

  // Auto-slide carousel
  useEffect(() => {
    if (featuredNews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredNews.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-body selection:bg-primary/10">
      <Header />

      {/* --- HERO CAROUSEL SECTION --- */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          {featuredNews.map((article: any, index: number) => (
            index === currentSlide && (
              <motion.div
                key={article.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0 scale-105">
                  <img
                    src={article.image_display || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="container relative h-full flex flex-col px-6 lg:px-12 z-20">
                   {/* Security Spacer for Header */}
                   <div className="h-32 md:h-48 shrink-0" />
                   
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, duration: 0.8 }}
                     className="flex-1 flex flex-col justify-center space-y-4 md:space-y-5"
                   >
                     <div className="flex items-center gap-3">
                        <Badge className="bg-primary text-white border-none px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em]">
                          {getTranslatedCategory(article.category)}
                        </Badge>
                        <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                           <Calendar className="h-3 w-3" />
                           {new Date(article.created_at).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                     </div>

                     <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white leading-[1.1] tracking-tight drop-shadow-xl max-w-4xl">
                        {article[`title_${lang}`] || article.title}
                     </h1>
                     
                     <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-2xl line-clamp-2 drop-shadow-md">
                        {article[`content_${lang}`] || article.content}
                     </p>

                     <div className="flex items-center gap-4 pt-4">
                        <Link to={`/actualites/${article.id}`}>
                           <Button size="lg" className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 border-none">
                              Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        </Link>
                        <Button variant="outline" className="h-12 w-12 rounded-xl border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/50">
                           <Share2 className="h-4 w-4" />
                        </Button>
                     </div>
                   </motion.div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-24 md:bottom-32 right-6 md:right-12 z-30 flex items-center gap-4">
           <Button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length)}
            variant="outline" className="h-10 w-10 md:h-12 md:w-12 rounded-xl border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10"
           >
              <ChevronLeft className="h-5 w-5" />
           </Button>
           <div className="flex gap-2">
              {featuredNews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? "w-8 bg-primary" : "w-1.5 bg-white/30"}`}
                />
              ))}
           </div>
           <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredNews.length)}
            className="h-10 w-10 md:h-12 md:w-12 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all flex items-center justify-center"
           >
              <ChevronRight className="h-5 w-5" />
           </button>
        </div>
      </section>

      {/* --- FILTER & MAIN CONTENT --- */}
      <main className="container px-6 lg:px-12 max-w-7xl mx-auto -mt-8 relative z-30">
        
        {/* Filters Bar - Premium Pill Design */}
        <div className="bg-white rounded-full p-2.5 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-wrap items-center justify-center gap-2 mb-20 max-w-fit mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${activeCategory === cat
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- NEWS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40">
           {filtered?.map((article: any, index: number) => (
             <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[550px] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 hover:shadow-primary/20 transition-all duration-700 ring-1 ring-slate-100"
             >
                <Link to={`/actualites/${article.id}`} className="absolute inset-0">
                   {/* Article Image */}
                   <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={article.image_display || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                   </div>

                   {/* Badges & Date */}
                   <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                      <Badge className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                        {getTranslatedCategory(article.category)}
                      </Badge>
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white">
                         <span className="text-lg font-black leading-none">{new Date(article.created_at).getDate()}</span>
                         <span className="text-[8px] font-black uppercase tracking-tighter">{new Date(article.created_at).toLocaleDateString(i18n.language, { month: 'short' })}</span>
                      </div>
                   </div>

                   {/* Content */}
                   <div className="absolute inset-x-8 bottom-8 p-0 flex flex-col gap-6">
                      <div className="space-y-4">
                         <h3 className="text-3xl font-heading font-black text-white leading-tight tracking-tight group-hover:text-primary transition-colors">
                            {article[`title_${lang}`] || article.title}
                         </h3>
                         <p className="text-white/60 text-sm leading-relaxed line-clamp-3 font-light">
                            {article[`content_${lang}`] || article.content}
                         </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                               <ArrowRight className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{t('read_more', 'Découvrir')}</span>
                         </div>
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{new Date(article.created_at).getFullYear()}</span>
                      </div>
                   </div>
                </Link>
             </motion.article>
           ))}
        </div>

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
           <div className="text-center py-40">
              <Loader2 className="h-16 w-16 text-slate-200 animate-spin mx-auto mb-6" />
              <p className="text-2xl font-heading font-bold text-slate-400">Aucune actualité ne correspond à cette catégorie.</p>
           </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Actualites;
