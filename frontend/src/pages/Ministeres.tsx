import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Users, 
  Heart, 
  BookOpen, 
  Sprout, 
  Shield, 
  Cross, 
  Target, 
  Star, 
  HandHeart, 
  GraduationCap, 
  Baby, 
  Church,
  ChevronRight,
  Quote,
  Loader2,
  ArrowDown
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMinistries, useMinistryPage } from "@/hooks/useApi";

const ICON_MAP: Record<string, any> = {
  Users, Heart, BookOpen, Sprout, Shield, Cross, Target, Star,
  HandHeart, GraduationCap, Baby, Church,
};

const Ministeres = () => {
  const { t, i18n } = useTranslation();
  const { data: apiMinistries, isLoading: loadingM } = useMinistries();
  const { data: pageData, isLoading: loadingP } = useMinistryPage();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const isLoading = loadingM || loadingP;

  const displayMinistries = (Array.isArray(apiMinistries) ? apiMinistries : (apiMinistries?.results || []))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  const heroTitle = pageData?.[`hero_title_${lang}`] || t('ministries_hero_title', 'Nos Ministères');
  const heroDesc = pageData?.[`hero_description_${lang}`] || t('ministries_hero_desc', 'Découvrez comment nous servons Dieu et notre communauté à travers nos différents départements.');
  const heroBadge = pageData?.[`hero_badge_${lang}`] || t('ministries_badge', 'Engagement & Service');
  const heroImgUrl = pageData?.hero_image_display || "https://images.unsplash.com/photo-1544427928-c49cd049cc6d?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-body selection:bg-primary/10">
      <Header />

      {/* --- HERO SECTION PREMIUM --- */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end justify-center overflow-hidden pb-40 md:pb-56">
        <div className="absolute inset-0 z-0">
          <img src={heroImgUrl} alt="Hero" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-[#FDFDFD]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 px-6 text-center max-w-5xl h-full flex flex-col">
          {/* Security Spacer for Header */}
          <div className="h-32 md:h-48 shrink-0" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col justify-end pb-12 md:pb-20"
          >
            <span className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-black uppercase tracking-[0.3em] mb-8 shadow-2xl">
              {heroBadge}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white mb-8 tracking-tighter leading-[1] drop-shadow-2xl">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md mb-8">
              {heroDesc}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FDFDFD] to-transparent" />
      </section>

      <main className="relative z-30 container px-6 max-w-7xl mx-auto pb-32">
        
        {/* Pill Button Overlap */}
        <div className="flex justify-center -mt-8 mb-10 relative z-40">
           <motion.a 
              href="#explore"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/5 border border-slate-100 hover:bg-primary hover:text-white transition-all duration-300 max-w-fit"
            >
              Découvrir nos missions <ArrowDown className="h-4 w-4 animate-bounce" />
            </motion.a>
        </div>
        
        <div id="explore" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-40 pt-4">
          {displayMinistries.map((ministry, index) => {
            const MinistryIcon = ICON_MAP[ministry.icon] || Users;
            const mTitle = ministry[`title_${lang}`] || ministry.title_fr;
            
            return (
              <motion.a
                key={ministry.id}
                href={`#ministry-${ministry.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-300 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
                <div className="relative z-10 mb-6 p-6 rounded-[2rem] bg-slate-50 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <MinistryIcon className="h-10 w-10" />
                </div>
                <h3 className="relative z-10 text-xl font-heading font-black text-slate-900 mb-2 tracking-tight group-hover:text-primary transition-colors">
                  {mTitle}
                </h3>
                <span className="relative z-10 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary/60 transition-colors">En savoir plus</span>
                <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="space-y-40">
          {displayMinistries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-slate-50">
              <Sprout className="h-20 w-20 text-slate-200 mx-auto mb-6" />
              <p className="text-2xl font-heading font-bold text-slate-400">Aucun ministère n'est encore enregistré.</p>
            </div>
          ) : (
            displayMinistries.map((ministry, index) => {
              const isEven = index % 2 === 0;
              const MinistryIcon = ICON_MAP[ministry.icon] || Users;
              const mTitle = ministry[`title_${lang}`] || ministry.title_fr;
              const mMission = ministry[`mission_${lang}`] || ministry.mission_fr;
              const mTestimony = ministry[`testimony_quote_${lang}`] || ministry.testimony_quote_fr;

              return (
                <section id={`ministry-${ministry.id}`} key={ministry.id} className="scroll-mt-32">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8 }}
                      className={`lg:col-span-5 ${!isEven ? "lg:order-2" : ""}`}
                    >
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-violet-200/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        {ministry.image_display ? (
                          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/5] border-8 border-white">
                            <img src={ministry.image_display} alt={mTitle} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                        ) : (
                          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-violet-100/50 aspect-[4/5] bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center border-8 border-white">
                            <MinistryIcon className="h-32 w-32 text-white/20" />
                          </div>
                        )}
                        <div className={`absolute -bottom-10 ${isEven ? "-right-10" : "-left-10"} hidden xl:flex bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white gap-6 items-center animate-bounce-slow`}>
                           <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                              <MinistryIcon className="h-10 w-10" />
                           </div>
                           <div className="pr-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Impact Global</p>
                              <p className="text-xl font-heading font-black text-slate-900 leading-none">Service Fidèle</p>
                           </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8 }}
                      className={`lg:col-span-7 ${!isEven ? "lg:order-1" : ""}`}
                    >
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-1.5 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                          <h2 className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tighter leading-tight">{mTitle}</h2>
                        </div>
                        <p className="font-body text-slate-600 text-lg leading-relaxed mb-8 text-justify">{mMission}</p>
                        {ministry.activities && ministry.activities.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {ministry.activities.map((act: any) => (
                              <div key={act.id} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group/act">
                                <div className="h-3 w-3 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                                <span className="font-bold text-slate-700 tracking-tight">{act[`title_${lang}`] || act.title_fr}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {mTestimony && (
                          <div className="relative mt-12 p-10 rounded-[3rem] bg-slate-900 text-white overflow-hidden group/test">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover/test:scale-150" />
                            <Quote className="h-12 w-12 text-primary/40 mb-6" />
                            <p className="text-xl md:text-2xl font-heading font-medium leading-relaxed italic mb-8 relative z-10">"{mTestimony}"</p>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="w-12 h-px bg-primary/50" />
                               <span className="font-black uppercase tracking-widest text-xs text-primary">{ministry.testimony_author || "Membre du Ministère"}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default Ministeres;
