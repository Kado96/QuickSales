import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    ArrowRight,
    Send,
    Shield,
    CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api, fetchComments, postComment } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/lib/types";

const ArticleDetail = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || "fr").split('-')[0].toLowerCase();
    const queryClient = useQueryClient();
    const commentsRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // ─── COMMENTAIRES : State et logique ───
    const [commentName, setCommentName] = useState('');
    const [commentEmail, setCommentEmail] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentSuccess, setCommentSuccess] = useState(false);

    const { data: comments = [], isLoading: loadingComments } = useQuery({
        queryKey: ['comments', id],
        queryFn: () => fetchComments(Number(id)),
        enabled: !!id,
    });

    const commentMutation = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            setCommentName('');
            setCommentEmail('');
            setCommentContent('');
            setCommentSuccess(true);
            setTimeout(() => setCommentSuccess(false), 4000);
        },
    });

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim() || !commentName.trim()) return;
        commentMutation.mutate({
            announcement: Number(id),
            author_name: commentName,
            author_email: commentEmail,
            content: commentContent,
        });
    };

    const scrollToComments = () => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", id, i18n.language],
        queryFn: async () => {
            const response = await api.get(`/api/announcements/${id}/?language=${i18n.language}`);
            return response.data;
        }
    });

    // Mettre à jour les balises Meta (SEO et Réseaux Sociaux) dynamiquement
    useEffect(() => {
        if (article) {
            const title = article[`title_${lang}`] || article.title;
            const description = (article[`content_${lang}`] || article.content).substring(0, 150) + '...';
            const image = article.image_display || "";
            const url = window.location.href;

            document.title = `${title} | Diocèse Makamba`;

            // Fonction pour créer ou mettre à jour une balise meta
            const setMetaTag = (property: string, content: string) => {
                let element = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
                if (!element) {
                    element = document.createElement('meta');
                    if (property.startsWith('og:')) {
                        element.setAttribute('property', property);
                    } else {
                        element.setAttribute('name', property);
                    }
                    document.head.appendChild(element);
                }
                element.setAttribute('content', content);
            };

            setMetaTag('description', description);
            setMetaTag('og:title', title);
            setMetaTag('og:description', description);
            setMetaTag('og:image', image);
            setMetaTag('og:url', url);
            setMetaTag('og:type', 'article');
            setMetaTag('twitter:card', 'summary_large_image');
        }
    }, [article, lang]);

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
                                    <Button 
                                        variant="outline" 
                                        className="rounded-xl gap-2 h-12 border-primary/20 text-primary hover:bg-primary/5"
                                        onClick={async () => {
                                            const title = article[`title_${lang}`] || article.title;
                                            const description = (article[`content_${lang}`] || article.content).substring(0, 120) + '...';
                                            const url = window.location.href;
                                            const category = article.category_display || article.category || "Diocèse Makamba";
                                            const dateObj = new Date(article.created_at);
                                            const day = String(dateObj.getDate());
                                            const month = dateObj.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }).toUpperCase();
                                            const year = String(dateObj.getFullYear());
                                            
                                            try {
                                                // ═══════════════════════════════════════════
                                                // 🎨 GÉNÉRATEUR DE CARTE VISUELLE PREMIUM
                                                // Format carte arrondie pour réseaux sociaux
                                                // ═══════════════════════════════════════════
                                                let shareFile: File | null = null;
                                                if (article.image_display) {
                                                    shareFile = await new Promise<File>((resolve, reject) => {
                                                        const img = new Image();
                                                        img.crossOrigin = "Anonymous";
                                                        img.onload = () => {
                                                            const canvas = document.createElement('canvas');
                                                            const cardW = 1080;
                                                            const cardH = 1350; // Format 4:5 portrait (idéal Instagram/WhatsApp)
                                                            canvas.width = cardW;
                                                            canvas.height = cardH;
                                                            const ctx = canvas.getContext('2d');
                                                            if (!ctx) return reject('No context');

                                                            // Fonction utilitaire : rectangle arrondi
                                                            const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
                                                                ctx.beginPath();
                                                                ctx.moveTo(x + r, y);
                                                                ctx.lineTo(x + w - r, y);
                                                                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                                                                ctx.lineTo(x + w, y + h - r);
                                                                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                                                                ctx.lineTo(x + r, y + h);
                                                                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                                                                ctx.lineTo(x, y + r);
                                                                ctx.quadraticCurveTo(x, y, x + r, y);
                                                                ctx.closePath();
                                                            };

                                                            // Fonction utilitaire : texte multi-lignes
                                                            const wrapText = (text: string, x: number, y: number, maxW: number, lh: number): number => {
                                                                const words = text.split(' ');
                                                                let line = '';
                                                                let cy = y;
                                                                for (let i = 0; i < words.length; i++) {
                                                                    const test = line + words[i] + ' ';
                                                                    if (ctx.measureText(test).width > maxW && i > 0) {
                                                                        ctx.fillText(line.trim(), x, cy);
                                                                        line = words[i] + ' ';
                                                                        cy += lh;
                                                                    } else {
                                                                        line = test;
                                                                    }
                                                                }
                                                                ctx.fillText(line.trim(), x, cy);
                                                                return cy + lh;
                                                            };

                                                            // ──── 1. FOND EXTÉRIEUR (gris clair) ────
                                                            ctx.fillStyle = '#e8e8e8';
                                                            ctx.fillRect(0, 0, cardW, cardH);

                                                            // ──── 2. OMBRE DE LA CARTE ────
                                                            const pad = 50;
                                                            const rad = 48;
                                                            ctx.shadowColor = 'rgba(0,0,0,0.25)';
                                                            ctx.shadowBlur = 40;
                                                            ctx.shadowOffsetX = 0;
                                                            ctx.shadowOffsetY = 12;
                                                            roundRect(pad, pad, cardW - pad * 2, cardH - pad * 2, rad);
                                                            ctx.fillStyle = '#ffffff';
                                                            ctx.fill();
                                                            ctx.shadowColor = 'transparent';

                                                            // ──── 3. CLIP CARTE ARRONDIE ────
                                                            ctx.save();
                                                            roundRect(pad, pad, cardW - pad * 2, cardH - pad * 2, rad);
                                                            ctx.clip();

                                                            const cw = cardW - pad * 2;
                                                            const ch = cardH - pad * 2;
                                                            const cx = pad;
                                                            const cy = pad;

                                                            // ──── 4. IMAGE DE L'ARTICLE (60% supérieur) ────
                                                            const imgZoneH = ch * 0.52;
                                                            const sc = Math.max(cw / img.width, imgZoneH / img.height);
                                                            const ix = cx + (cw / 2) - (img.width / 2) * sc;
                                                            const iy = cy + (imgZoneH / 2) - (img.height / 2) * sc;
                                                            ctx.drawImage(img, ix, iy, img.width * sc, img.height * sc);

                                                            // ──── 5. LÉGER VOILE SUR L'IMAGE ────
                                                            const imgGrad = ctx.createLinearGradient(cx, cy + imgZoneH * 0.5, cx, cy + imgZoneH);
                                                            imgGrad.addColorStop(0, 'rgba(0,0,0,0)');
                                                            imgGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
                                                            ctx.fillStyle = imgGrad;
                                                            ctx.fillRect(cx, cy, cw, imgZoneH);

                                                            // ──── 6. ZONE DE CONTENU (fond sombre premium) ────
                                                            const contentY = cy + imgZoneH;
                                                            const contentH = ch - imgZoneH;
                                                            const darkGrad = ctx.createLinearGradient(cx, contentY, cx, cy + ch);
                                                            darkGrad.addColorStop(0, '#1a1a2e');
                                                            darkGrad.addColorStop(0.6, '#16213e');
                                                            darkGrad.addColorStop(1, '#0f1626');
                                                            ctx.fillStyle = darkGrad;
                                                            ctx.fillRect(cx, contentY, cw, contentH);

                                                            // Ligne décorative entre image et contenu
                                                            ctx.fillStyle = '#22c55e';
                                                            ctx.fillRect(cx, contentY, cw, 5);

                                                            // ──── 7. BADGE CATÉGORIE (en haut à gauche) ────
                                                            ctx.font = 'bold 26px Arial, Helvetica, sans-serif';
                                                            const catText = category.toUpperCase();
                                                            const catMet = ctx.measureText(catText);
                                                            const badgePx = 22;
                                                            const badgeX = cx + 45;
                                                            const badgeY = cy + 45;
                                                            const badgeW = catMet.width + badgePx * 2;
                                                            const badgeH = 48;
                                                            roundRect(badgeX, badgeY, badgeW, badgeH, 10);
                                                            ctx.fillStyle = '#22c55e';
                                                            ctx.fill();
                                                            ctx.fillStyle = '#ffffff';
                                                            ctx.textAlign = 'left';
                                                            ctx.textBaseline = 'middle';
                                                            ctx.fillText(catText, badgeX + badgePx, badgeY + badgeH / 2 + 1);

                                                            // ──── 8. CERCLE DATE (en haut à droite) ────
                                                            const circR = 52;
                                                            const circX = cx + cw - 80;
                                                            const circY = cy + 80;
                                                            ctx.beginPath();
                                                            ctx.arc(circX, circY, circR, 0, Math.PI * 2);
                                                            ctx.fillStyle = 'rgba(255,255,255,0.92)';
                                                            ctx.fill();
                                                            ctx.textAlign = 'center';
                                                            ctx.textBaseline = 'middle';
                                                            ctx.font = 'bold 40px Arial, Helvetica, sans-serif';
                                                            ctx.fillStyle = '#1a1a2e';
                                                            ctx.fillText(day, circX, circY - 10);
                                                            ctx.font = 'bold 18px Arial, Helvetica, sans-serif';
                                                            ctx.fillStyle = '#555';
                                                            ctx.fillText(month, circX, circY + 20);

                                                            // ──── 9. TITRE DE L'ARTICLE ────
                                                            const textX = cx + 50;
                                                            const textMaxW = cw - 100;
                                                            ctx.textAlign = 'left';
                                                            ctx.textBaseline = 'top';
                                                            ctx.font = 'bold 56px Arial, Helvetica, sans-serif';
                                                            ctx.fillStyle = '#ffffff';
                                                            let nextY = wrapText(title, textX, contentY + 50, textMaxW, 68);

                                                            // ──── 10. DESCRIPTION ────
                                                            ctx.font = 'normal 28px Arial, Helvetica, sans-serif';
                                                            ctx.fillStyle = 'rgba(255,255,255,0.65)';
                                                            nextY = wrapText(description, textX, nextY + 20, textMaxW, 38);

                                                            // ──── 11. LIGNE SÉPARATRICE ────
                                                            const sepY = cy + ch - 110;
                                                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                                                            ctx.lineWidth = 1;
                                                            ctx.beginPath();
                                                            ctx.moveTo(textX, sepY);
                                                            ctx.lineTo(cx + cw - 50, sepY);
                                                            ctx.stroke();

                                                            // ──── 12. "LIRE LA SUITE" + Année ────
                                                            const footY = cy + ch - 65;
                                                            ctx.font = 'bold 24px Arial, Helvetica, sans-serif';
                                                            ctx.fillStyle = '#22c55e';
                                                            ctx.textAlign = 'left';
                                                            ctx.textBaseline = 'middle';
                                                            ctx.fillText('LIRE LA SUITE', textX, footY);
                                                            // Soulignement décoratif
                                                            const lsW = ctx.measureText('LIRE LA SUITE').width;
                                                            ctx.strokeStyle = '#22c55e';
                                                            ctx.lineWidth = 2;
                                                            ctx.beginPath();
                                                            ctx.moveTo(textX, footY + 16);
                                                            ctx.lineTo(textX + lsW, footY + 16);
                                                            ctx.stroke();

                                                            // Année à droite
                                                            ctx.textAlign = 'right';
                                                            ctx.fillStyle = 'rgba(255,255,255,0.35)';
                                                            ctx.font = 'bold 28px Arial, Helvetica, sans-serif';
                                                            ctx.fillText(year, cx + cw - 50, footY);

                                                            ctx.restore(); // Fin du clip

                                                            // ──── 13. URL DU SITE (sous la carte) ────
                                                            ctx.textAlign = 'center';
                                                            ctx.textBaseline = 'top';
                                                            ctx.font = 'bold 22px Arial, Helvetica, sans-serif';
                                                            ctx.fillStyle = '#888';
                                                            ctx.fillText('🌐  anglicanemakamba.wuaze.com', cardW / 2, cardH - pad + 10);

                                                            // ──── EXPORT ────
                                                            canvas.toBlob((blob) => {
                                                                if (blob) {
                                                                    resolve(new File([blob], 'makamba-diocese-article.jpg', { type: 'image/jpeg' }));
                                                                } else {
                                                                    reject('Blob creation failed');
                                                                }
                                                            }, 'image/jpeg', 0.95);
                                                        };
                                                        img.onerror = () => reject('Image load error');
                                                        img.src = article.image_display;
                                                    }).catch((e) => { console.log('Erreur génération image:', e); return null; }) as File | null;
                                                }

                                                // ═══════════════════════════════════════════
                                                // 📤 PARTAGE MULTI-PLATEFORME
                                                // Image + Texte + Lien pour WhatsApp, FB, IG
                                                // ═══════════════════════════════════════════
                                                if (navigator.share) {
                                                    const shareData: Record<string, any> = {
                                                        title: title,
                                                        text: `✝️ ${title}\n\n${description}\n\n📖 Lire l'article complet :\n${url}`,
                                                    };
                                                    
                                                    // Joindre l'image générée si le navigateur le supporte
                                                    if (shareFile && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
                                                        shareData.files = [shareFile];
                                                    }
                                                    
                                                    await navigator.share(shareData);
                                                } else {
                                                    // Fallback pour Desktop : copier le lien
                                                    await navigator.clipboard.writeText(`${title}\n\n${url}`);
                                                    alert(t('link_copied', 'Lien copié dans le presse-papier ! 📋'));
                                                }
                                            } catch (err: any) {
                                                if (err?.name !== 'AbortError') {
                                                    console.log('Erreur lors du partage:', err);
                                                }
                                            }
                                        }}
                                    >
                                        <Share2 className="h-4 w-4" /> {t('share', 'Partager')}
                                    </Button>
                                    <Button 
                                        className="rounded-xl gap-2 h-12 bg-indigo-600 hover:bg-indigo-700"
                                        onClick={scrollToComments}
                                        id="btn-scroll-comments"
                                    >
                                        <MessageCircle className="h-4 w-4" /> {t('comment', 'Commenter')} {(comments && comments.length > 0) && `(${comments.length})`}
                                    </Button>
                                </div>
                            </div>

                            {/* ═══════════════════════════════════════════ */}
                            {/* 💬 SECTION COMMENTAIRES PREMIUM            */}
                            {/* ═══════════════════════════════════════════ */}
                            <div ref={commentsRef} id="section-comments" className="scroll-mt-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/40 border border-slate-100"
                                >
                                    {/* En-tête de section */}
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                                            <MessageCircle className="h-7 w-7 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 id="comments-title" className="text-2xl font-heading font-bold text-slate-900">
                                                {t('comments_section', 'Commentaires')}
                                                {comments && comments.length > 0 && (
                                                    <span className="ml-3 text-base font-normal text-slate-400">({comments.length})</span>
                                                )}
                                            </h3>
                                            <p className="text-slate-500 text-sm">{t('comments_subtitle', 'Partagez votre avis sur cet article')}</p>
                                        </div>
                                    </div>

                                    {/* ─── Formulaire de commentaire ─── */}
                                    <form onSubmit={handleSubmitComment} id="form-comment" name="comment-form" className="mb-10">
                                        <div className="bg-slate-50/80 rounded-2xl p-6 md:p-8 border border-slate-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label htmlFor="comment-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                        {t('your_name', 'Votre nom')} *
                                                    </label>
                                                    <input
                                                        id="comment-name"
                                                        name="author_name"
                                                        type="text"
                                                        required
                                                        value={commentName}
                                                        onChange={(e) => setCommentName(e.target.value)}
                                                        placeholder={t('name_placeholder', 'Ex: Jean Ndikumana')}
                                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="comment-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                        {t('your_email', 'Votre email')} <span className="text-slate-400 normal-case font-normal">({t('optional', 'optionnel')})</span>
                                                    </label>
                                                    <input
                                                        id="comment-email"
                                                        name="author_email"
                                                        type="email"
                                                        value={commentEmail}
                                                        onChange={(e) => setCommentEmail(e.target.value)}
                                                        placeholder={t('email_placeholder', 'votre@email.com')}
                                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="comment-content" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                    {t('your_comment', 'Votre commentaire')} *
                                                </label>
                                                <textarea
                                                    id="comment-content"
                                                    name="content"
                                                    required
                                                    rows={4}
                                                    value={commentContent}
                                                    onChange={(e) => setCommentContent(e.target.value)}
                                                    placeholder={t('comment_placeholder', 'Écrivez votre commentaire ici...')}
                                                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm resize-none"
                                                />
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <Button
                                                    type="submit"
                                                    id="btn-submit-comment"
                                                    disabled={commentMutation.isPending || !commentContent.trim() || !commentName.trim()}
                                                    className="rounded-xl gap-2 h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                                                >
                                                    {commentMutation.isPending ? (
                                                        <><Loader2 className="h-4 w-4 animate-spin" /> {t('sending', 'Envoi...')}</>
                                                    ) : (
                                                        <><Send className="h-4 w-4" /> {t('post_comment', 'Publier le commentaire')}</>
                                                    )}
                                                </Button>
                                                {commentSuccess && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex items-center gap-2 text-emerald-600 font-semibold text-sm"
                                                    >
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        {t('comment_posted', 'Commentaire publié avec succès !')}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </form>

                                    {/* ─── Liste des commentaires ─── */}
                                    <div id="comments-list" className="space-y-6">
                                        {loadingComments ? (
                                            <div className="flex justify-center py-10">
                                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                            </div>
                                        ) : !comments || comments.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                                    <MessageCircle className="h-10 w-10 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-medium">{t('no_comments', 'Aucun commentaire pour le moment')}</p>
                                                <p className="text-slate-400 text-sm mt-1">{t('be_first', 'Soyez le premier à commenter cet article !')}</p>
                                            </div>
                                        ) : (
                                            comments.map((comment: Comment, idx: number) => (
                                                <motion.div
                                                    key={comment.id}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    id={`comment-${comment.id}`}
                                                    className={`group relative p-6 rounded-2xl border transition-all hover:shadow-md ${
                                                        comment.is_admin
                                                            ? 'bg-indigo-50/50 border-indigo-200/60 hover:border-indigo-300'
                                                            : 'bg-white border-slate-100 hover:border-slate-200'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {/* Avatar */}
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-md ${
                                                            comment.is_admin
                                                                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700'
                                                                : 'bg-gradient-to-br from-slate-400 to-slate-600'
                                                        }`}>
                                                            {comment.author_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        {/* Contenu */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                <span className="font-bold text-slate-900 text-sm">
                                                                    {comment.author_name}
                                                                </span>
                                                                {comment.is_admin && comment.user_role && (
                                                                    <Badge className="bg-indigo-100 text-indigo-700 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider gap-1">
                                                                        <Shield className="h-3 w-3" />
                                                                        {comment.user_role}
                                                                    </Badge>
                                                                )}
                                                                <span className="text-slate-400 text-xs">
                                                                    {new Date(comment.created_at).toLocaleDateString(i18n.language, {
                                                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                                                {comment.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
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
