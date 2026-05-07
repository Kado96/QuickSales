import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Calendar,
    User,
    Tag,
    ChevronLeft,
    Share2,
    MessageCircle,
    Clock,
    Loader2,
    ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ArticleDetail = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || "fr").split('-')[0].toLowerCase();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", id, i18n.language],
        queryFn: async () => {
            const response = await api.get(`/api/announcements/${id}/?language=${i18n.language}`);
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground font-medium animate-pulse">{t('loading_article', "Chargement de l'article...")}</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-xl mx-auto py-40 text-center px-4">
                    <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">{t('article_not_found', 'Article introuvable')}</h1>
                    <p className="text-slate-500 mb-8">{t('article_not_found_desc', "Désolé, l'article que vous recherchez n'existe pas ou a été déplacé.")}</p>
                    <Link to="/">
                        <Button className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90">
                            {t('back_home', "Retour à l'accueil")}
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/30">
            <Header />

            {/* 📊 Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-[100] origin-left shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                style={{ scaleX }}
            />

            <main className="pb-20">
                {/* 🏷️ Article Hero - Edge-to-Edge Style like News Listing */}
                <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-slate-950">
                    {/* Background Layer */}
                    <div className="absolute inset-0">
                        {article.image_display ? (
                            <motion.div 
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.5 }}
                                className="h-full w-full"
                            >
                                <img
                                    src={article.image_display}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Gradients for Premium Look & Readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
                            </motion.div>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900" />
                        )}
                    </div>

                    {/* Content Overlay */}
                    <div className="container relative h-full flex flex-col px-6 lg:px-12 z-20 mx-auto">
                        {/* Security Spacer for Header */}
                        <div className="h-32 md:h-48 shrink-0" />

                        <div className="flex-1 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="space-y-6 max-w-4xl"
                            >
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                        {article.category_display || article.category}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md bg-white/10 px-4 py-1.5 rounded-xl border border-white/20">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>{t('read_time', '5 min de lecture')}</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-heading font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl">
                                    {article[`title_${lang}`] || article.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden">
                                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                                <User className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-sm uppercase tracking-wider">{t('diocese_of_makamba', 'Diocèse de Makamba')}</p>
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">{t('official_comm', 'Communication Officielle')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 font-black text-sm uppercase tracking-widest">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <span>{new Date(article.created_at).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto max-w-6xl px-4 mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* 📝 Content Column */}
                        <div className="lg:col-span-8 space-y-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-xl shadow-slate-200/40 border border-slate-100 relative"
                            >
                                <div className="absolute top-0 left-12 w-1 h-20 bg-primary/20 rounded-b-full hidden md:block" />
                                <div className="prose prose-lg max-w-none prose-slate prose-headings:font-heading prose-headings:font-bold prose-p:font-body prose-p:text-slate-600 prose-p:leading-[1.9] prose-p:text-lg">
                                    {/* Formatage intelligent du texte pour simuler un article riche */}
                                    {(article[`content_${lang}`] || article.content).split(/\n\s*\n/).map((paragraph: string, idx: number) => (
                                        <p key={idx} className={idx === 0
                                            ? "text-xl md:text-2xl font-medium text-slate-800 border-l-8 border-primary pl-8 py-4 mb-10 bg-primary/5 rounded-r-3xl leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-primary first-letter:mt-2"
                                            : "mb-8 text-slate-600 hover:text-slate-900 transition-colors"}>
                                            {paragraph.trim()}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>

                            {/* 🖼️ Gallery Section */}
                            {article.gallery && article.gallery.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-px bg-slate-200 flex-1" />
                                        <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">{t('photo_gallery', 'Galerie Photo')}</h2>
                                        <div className="h-px bg-slate-200 flex-1" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {article.gallery.map((img: any, idx: number) => (
                                            <motion.div
                                                key={img.id}
                                                whileHover={{ y: -5 }}
                                                className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg group cursor-zoom-in ${idx % 3 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-square'
                                                    }`}
                                            >
                                                <img
                                                    src={img.image_url}
                                                    alt={img.caption || `Image ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                {img.caption && (
                                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                        <p className="text-white text-sm font-medium">{img.caption}</p>
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-white/30 text-white">
                                                    <Maximize className="h-5 w-5" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* 🔗 Social Share */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                <div>
                                    <h4 className="font-heading font-bold text-slate-900">{t('share_article_title', 'Vous avez aimé cet article ?')}</h4>
                                    <p className="text-slate-500 text-sm">{t('share_article_desc', "Partagez l'œuvre de Dieu avec vos proches.")}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="rounded-xl gap-2 h-12 border-primary/20 text-primary hover:bg-primary/5">
                                        <Share2 className="h-4 w-4" /> {t('share', 'Partager')}
                                    </Button>
                                    <Button className="rounded-xl gap-2 h-12 bg-indigo-600 hover:bg-indigo-700">
                                        <MessageCircle className="h-4 w-4" /> {t('comment', 'Commenter')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 🔍 Sidebar Column */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Actions Rapid */}
                            <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <Megaphone className="h-32 w-32 rotate-12" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold mb-4 relative z-10">{t('newspaper_title', "Suivez l'actualité en direct")}</h3>
                                <p className="text-indigo-100/70 mb-8 font-medium leading-relaxed relative z-10">{t('newspaper_desc', "Abonnez-vous pour recevoir les dernières nouvelles du diocèse directement par email.")}</p>
                                <Button className="w-full h-14 bg-white text-indigo-900 hover:bg-white/90 rounded-2xl font-bold shadow-lg shadow-black/20 relative z-10">
                                    {t('subscribe_now', "S'abonner maintenant")}
                                </Button>
                            </div>

                            {/* Tags Section */}
                            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                                <h3 className="font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-primary" /> {t('keywords', 'Mots clés')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Évangile', 'Célébration', 'Makamba', 'Diocèse', 'Jeunesse', 'Burundi', 'Mission'].map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border-none font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination rapid */}
                            <div className="space-y-4 pt-10 border-t border-slate-200">
                                <Link to="/actualites" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ChevronLeft className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase">{t('back', 'Retour')}</p>
                                        <p className="font-heading font-bold text-slate-900">{t('view_all_news', 'Voir toutes les actualités')}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center pt-6">{t('continue_reading', 'Continuer la lecture')}</p>
                                <Link to="/" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group opacity-70 grayscale hover:opacity-100 hover:grayscale-0">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase">{t('prev_article', 'Article Précédent')}</p>
                                        <p className="font-heading font-bold text-slate-900 line-clamp-1">{t('prev_article_fallback', 'Visite pastorale à Nyanza-Lac...')}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

// Help Icons from Lucide (added locally for completeness)
const Maximize = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 3 6 6-6 6-6-6 6-6Z" /><path d="M9 21 3 15l6-6 6 6-6 6Z" /></svg>
);

const Megaphone = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2Z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
);

export default ArticleDetail;
