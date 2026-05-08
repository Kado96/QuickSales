import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Calendar,
    Tag,
    ChevronLeft,
    Share2,
    MessageCircle,
    Clock,
    Loader2,
    ArrowRight,
    Megaphone,
    Send,
    Shield,
    ThumbsUp,
    MoreHorizontal
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

    // ─── ÉTAT COMMENTAIRES ───
    const [commentName, setCommentName] = useState('');
    const [commentEmail, setCommentEmail] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", id, i18n.language],
        queryFn: async () => {
            const response = await api.get(`/api/announcements/${id}/?language=${lang}`);
            return response.data;
        },
    });

    const { data: comments = [], isLoading: loadingComments } = useQuery({
        queryKey: ['comments', id],
        queryFn: () => fetchComments(Number(id)),
        enabled: !!id,
    });

    const commentMutation = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            setCommentContent('');
            setIsSubmitting(false);
        },
        onError: () => setIsSubmitting(false)
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim() || !commentName.trim()) return;
        setIsSubmitting(true);
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="min-h-screen bg-white md:bg-slate-50">
            <Header />
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-[100]" style={{ scaleX }} />

            {/* Hero Image */}
            <div className="relative h-[45vh] md:h-[60vh] w-full">
                {article.image_display && (
                    <img src={article.image_display} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="container mx-auto max-w-5xl">
                        <Badge className="mb-4 bg-indigo-600">{article.category_display || article.category}</Badge>
                        <h1 className="text-3xl md:text-5xl font-heading font-black leading-tight">
                            {article[`title_${lang}`] || article.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        {/* Article Content */}
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 mb-8">
                            <div className="flex items-center gap-4 text-slate-400 text-sm mb-8">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(article.created_at).toLocaleDateString(i18n.language)}</span>
                                <Clock className="h-4 w-4 ml-4" />
                                <span>5 min</span>
                            </div>

                            <div 
                                className="prose prose-slate prose-lg max-w-none mb-12"
                                dangerouslySetInnerHTML={{ __html: article[`content_${lang}`] || article.content }}
                            />

                            {/* Share & Comment Actions */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <Button variant="ghost" className="text-slate-500 gap-2" onClick={scrollToComments}>
                                    <MessageCircle className="h-5 w-5" />
                                    <span className="hidden sm:inline">Commenter</span>
                                    {comments.length > 0 && `(${comments.length})`}
                                </Button>
                                <Button variant="ghost" className="text-slate-500 gap-2">
                                    <Share2 className="h-5 w-5" />
                                    <span className="hidden sm:inline">Partager</span>
                                </Button>
                            </div>
                        </div>

                        {/* 🟦 FACEBOOK STYLE COMMENTS SECTION */}
                        <div ref={commentsRef} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-20">
                            <h3 className="text-lg font-bold text-slate-900 mb-8">Commentaires ({comments.length})</h3>

                            {/* Comment Form (Facebook Like) */}
                            <form onSubmit={handleSubmitComment} className="flex gap-3 mb-10">
                                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-500">
                                    ?
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="Votre nom"
                                            required
                                            value={commentName}
                                            onChange={e => setCommentName(e.target.value)}
                                            className="bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                            name="author_name"
                                            id="comment-author-name"
                                        />
                                        <input 
                                            type="email" 
                                            placeholder="Email (optionnel)"
                                            value={commentEmail}
                                            onChange={e => setCommentEmail(e.target.value)}
                                            className="bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                            name="author_email"
                                            id="comment-author-email"
                                        />
                                    </div>
                                    <div className="relative">
                                        <textarea 
                                            placeholder="Écrivez un commentaire..."
                                            required
                                            rows={2}
                                            value={commentContent}
                                            onChange={e => setCommentContent(e.target.value)}
                                            className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20"
                                            name="content"
                                            id="comment-body"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting || !commentContent.trim()}
                                            className="absolute right-3 bottom-3 text-indigo-600 disabled:text-slate-300 transition-colors"
                                            id="btn-send-comment"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {loadingComments ? (
                                    <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                                ) : comments.length === 0 ? (
                                    <div className="text-center py-6 text-slate-400 text-sm italic">Aucun commentaire pour le moment.</div>
                                ) : (
                                    comments.map((comment: Comment) => (
                                        <div key={comment.id} className="flex gap-3 group" id={`comment-${comment.id}`}>
                                            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-white ${comment.is_admin ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                                                {comment.author_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="bg-slate-100 rounded-2xl px-4 py-2 inline-block max-w-full">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-bold text-sm text-slate-900">{comment.author_name}</span>
                                                        {comment.is_admin && (
                                                            <Badge className="bg-indigo-600 h-4 px-1 text-[9px] uppercase"><Shield className="w-2 h-2 mr-1" /> {comment.user_role || 'Admin'}</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-700 leading-snug">{comment.content}</p>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 ml-2 text-[12px] font-bold text-slate-500">
                                                    <button className="hover:underline">J'aime</button>
                                                    <button className="hover:underline">Répondre</button>
                                                    <span className="font-normal text-slate-400">
                                                        {new Date(comment.created_at).toLocaleDateString(lang, { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 self-start">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl">
                            <Megaphone className="h-10 w-10 mb-4 text-indigo-300" />
                            <h3 className="text-xl font-bold mb-2">Restez informé</h3>
                            <p className="text-indigo-100/70 text-sm mb-6">Abonnez-vous pour ne rien manquer.</p>
                            <Button className="w-full bg-white text-indigo-900 hover:bg-white/90 rounded-xl font-bold">M'abonner</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ArticleDetail;
