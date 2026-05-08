import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
    Calendar,
    ChevronLeft,
    Share2,
    MessageCircle,
    Clock,
    Loader2,
    Megaphone,
    Send,
    Shield,
    ThumbsUp,
    MoreHorizontal
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api, fetchComments, postComment, likeComment } from "@/lib/api";
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
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // ─── ÉTAT ───
    const [commentName, setCommentName] = useState(localStorage.getItem('comment_author_name') || '');
    const [commentEmail, setCommentEmail] = useState(localStorage.getItem('comment_author_email') || '');
    const [commentContent, setCommentContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [likedComments, setLikedComments] = useState<number[]>(JSON.parse(localStorage.getItem('liked_comments') || '[]'));

    // ─── QUERIES ───
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

    // ─── MUTATIONS ───
    const commentMutation = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            setCommentContent('');
            setReplyingTo(null);
            localStorage.setItem('comment_author_name', commentName);
            localStorage.setItem('comment_author_email', commentEmail);
        }
    });

    const likeMutation = useMutation({
        mutationFn: likeComment,
        onSuccess: (data, commentId) => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            const newLiked = [...likedComments, commentId];
            setLikedComments(newLiked);
            localStorage.setItem('liked_comments', JSON.stringify(newLiked));
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleActionLike = (commentId: number) => {
        if (likedComments.includes(commentId)) return;
        likeMutation.mutate(commentId);
    };

    const scrollToComments = () => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmitComment = (e: React.FormEvent, parentId: number | null = null) => {
        e.preventDefault();
        const content = commentContent;
        if (!content.trim() || !commentName.trim()) return;
        
        commentMutation.mutate({
            announcement: Number(id),
            author_name: commentName,
            author_email: commentEmail,
            content: content,
            parent: parentId
        });
    };

    // ─── RENDU COMPOSANT COMMENTAIRE ───
    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
        <motion.div 
            initial={{ opacity: 0, x: isReply ? 20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-3 group ${isReply ? 'mt-4 ml-6 md:ml-12' : 'mt-6'}`} 
            id={`comment-${comment.id}`}
        >
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-white shadow-sm ${comment.is_admin ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                {comment.author_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-slate-100 rounded-2xl px-4 py-2.5 inline-block max-w-full">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[13px] md:text-sm text-slate-900">{comment.author_name}</span>
                        {comment.is_admin && (
                            <Badge className="bg-indigo-600 h-4 px-1.5 text-[9px] uppercase tracking-tighter">
                                <Shield className="w-2.5 h-2.5 mr-1" /> {comment.user_role || 'Admin'}
                            </Badge>
                        )}
                    </div>
                    <p className="text-[13px] md:text-sm text-slate-700 leading-snug whitespace-pre-line">{comment.content}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-1.5 ml-2 text-[12px] font-bold text-slate-500">
                    <button 
                        onClick={() => handleActionLike(comment.id)}
                        className={`hover:underline transition-colors flex items-center gap-1 ${likedComments.includes(comment.id) ? 'text-indigo-600' : ''}`}
                    >
                        {likedComments.includes(comment.id) && <ThumbsUp className="h-3 w-3 fill-current" />}
                        {t('like', 'J\'aime')} {comment.likes > 0 && <span>({comment.likes})</span>}
                    </button>
                    <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className={`hover:underline ${replyingTo === comment.id ? 'text-indigo-600' : ''}`}
                    >
                        {t('reply', 'Répondre')}
                    </button>
                    <span className="font-normal text-slate-400">
                        {new Date(comment.created_at).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })}
                    </span>
                </div>

                {/* Formulaire de réponse */}
                <AnimatePresence>
                    {replyingTo === comment.id && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4"
                        >
                            <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="flex gap-2">
                                <div className="flex-1 relative">
                                    <textarea 
                                        autoFocus
                                        placeholder={`${t('reply_to', 'Répondre à')} ${comment.author_name}...`}
                                        required
                                        rows={1}
                                        value={commentContent}
                                        onChange={e => setCommentContent(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={commentMutation.isPending || !commentContent.trim()}
                                        className="absolute right-2 bottom-2 text-indigo-600 disabled:text-slate-300"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Affichage des réponses */}
                {comments.filter(c => c.parent === comment.id).map(reply => (
                    <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
            </div>
        </motion.div>
    );

    if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;
    if (!article) return null;

    const rootComments = comments.filter(c => !c.parent);

    return (
        <div className="min-h-screen bg-white md:bg-slate-50">
            <Header />
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-[100]" style={{ scaleX }} />

            <div className="relative h-[40vh] w-full">
                {article.image_display && <img src={article.image_display} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-heading font-black text-white">{article[`title_${lang}`] || article.title}</h1>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-12">
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 mb-8">
                    <div className="prose prose-slate max-w-none mb-10" dangerouslySetInnerHTML={{ __html: article[`content_${lang}`] || article.content }} />
                    <div className="flex gap-4 border-t pt-6">
                        <Button variant="ghost" onClick={scrollToComments} className="gap-2 text-slate-500"><MessageCircle className="h-5 w-5" /> {t('comment', 'Commenter')}</Button>
                        <Button variant="ghost" className="gap-2 text-slate-500"><Share2 className="h-5 w-5" /> {t('share', 'Partager')}</Button>
                    </div>
                </div>

                {/* SECTION COMMENTAIRES TRADUITE */}
                <div ref={commentsRef} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                        {t('comments_count', 'Commentaires')} ({comments.length})
                    </h3>

                    <form onSubmit={(e) => handleSubmitComment(e)} className="flex gap-3 mb-12">
                        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-400">?</div>
                        <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input 
                                    placeholder={t('your_name', 'Votre nom')} required value={commentName} onChange={e => setCommentName(e.target.value)}
                                    className="bg-slate-100 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <input 
                                    placeholder={`${t('your_email', 'Email')} (${t('optional', 'optionnel')})`} value={commentEmail} onChange={e => setCommentEmail(e.target.value)}
                                    className="bg-slate-100 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                            <div className="relative">
                                <textarea 
                                    placeholder={t('comment_input_placeholder', 'Qu\'en pensez-vous ?')} required rows={3} value={commentContent} onChange={e => setCommentContent(e.target.value)}
                                    className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <button type="submit" disabled={commentMutation.isPending || !commentContent.trim()} className="absolute right-3 bottom-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg shadow-indigo-600/20 disabled:bg-slate-300">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-2">
                        {loadingComments ? (
                            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-slate-200" /></div>
                        ) : rootComments.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 italic">{t('be_first', 'Soyez le premier à réagir à cet article.')}</div>
                        ) : (
                            rootComments.map(comment => <CommentItem key={comment.id} comment={comment} />)
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ArticleDetail;
