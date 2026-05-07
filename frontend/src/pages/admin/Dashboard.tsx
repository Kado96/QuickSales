import { motion } from "framer-motion";
import {
    Plus,
    Users,
    Eye,
    MessageSquare,
    TrendingUp,
    ArrowUpRight,
    Monitor,
    Calendar,
    Clock,
    ChevronRight,
    ExternalLink,
    Edit3,
    HelpCircle,
    BarChart3,
    Megaphone,
    Settings,
    Home
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useApi";

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { data: siteSettings } = useSiteSettings();
    const user = JSON.parse(localStorage.getItem("user") || '{"username": "Admin"}');
    const stats = [
        { label: t('stats_total_views', "Vues Totales"), value: "125.4K", change: "+12%", icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
        { label: t('nav_news', "Annonces"), value: "3", change: "0", icon: Megaphone, color: "text-orange-500", bg: "bg-orange-50" },
        { label: t('stats_media_impact', "Impact Médias"), value: "89%", change: "+5%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    const userRole = user.role || 'admin';
    const isAdmin = userRole === 'admin' || user.is_superuser;

    const quickActions = [
        { label: t('admin_homepage', "Accueil"), icon: Home, color: "bg-blue-600", hover: "hover:bg-blue-700", path: "/admin/homepage" },
        { label: t('admin_about_us', "À Propos"), icon: Users, color: "bg-violet-600", hover: "hover:bg-violet-700", path: "/admin/a-propos" },
        { label: t('admin_settings', "Paramètres"), icon: Settings, color: "bg-slate-600", hover: "hover:bg-slate-700", path: "/admin/settings" },
        { label: t('admin_view_site', "Voir le Site"), icon: ExternalLink, iconSize: 20, color: "bg-orange-500", hover: "hover:bg-orange-600", path: "/", external: true },
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_welcome', "Bienvenue")}, {user.username} ! <span className="text-4xl animate-bounce">👋</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">{t('admin_welcome_subtitle', "Voici ce qui se passe sur votre plateforme")} <span className="text-primary font-bold">{siteSettings?.site_name || "Anglicane Makamba"}</span> {t('admin_today', "aujourd'hui.")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Action Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {quickActions.map((action, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => action.external ? window.open(action.path, '_blank') : navigate(action.path || '')}
                            className={`${action.color} ${action.hover} p-6 rounded-[2rem] text-white shadow-xl shadow-current/10 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                                <action.icon className="h-8 w-8 text-white" />
                            </div>
                            <span className="font-heading font-bold text-lg tracking-tight">{action.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Stats & Help Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Overview Card */}
                    <Card className="lg:col-span-2 rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-xl font-heading font-bold text-slate-900">{t('admin_overview', "Vue d'Ensemble")}</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary">
                                {t('admin_details', 'Détails')} <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                                {stats.map((stat, i) => (
                                    <div key={i} className="flex items-start gap-5 group">
                                        <div className={`${stat.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-3xl font-heading font-black text-slate-900">{stat.value}</span>
                                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    {stat.change} <ArrowUpRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Help/Support Side Card */}
                    <Card className="bg-[#1e293b] rounded-[2rem] border-none shadow-2xl shadow-slate-900/20 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-20 bg-primary/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
                        <CardHeader className="relative z-10 pt-10 pb-6">
                            <CardTitle className="text-2xl font-heading font-bold flex items-center gap-3">
                                {t('admin_need_help', "Besoin d'aide ?")} <span className="text-3xl">🤝</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-8 pb-10">
                            <p className="text-slate-400 font-medium leading-relaxed">
                                {t('admin_help_desc', "Si vous rencontrez des difficultés pour gérer vos sermons ou annonces, notre équipe est là pour vous.")}
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item">
                                    <div className="bg-primary p-3 rounded-xl shadow-lg shadow-primary/20 group-hover/item:scale-110 transition-transform">
                                        <HelpCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t('admin_docs', "Documentation")}</p>
                                        <p className="text-xs text-slate-500">{t('admin_docs_desc', "Guide d'utilisation")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item">
                                    <div className="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-500/20 group-hover/item:scale-110 transition-transform">
                                        <MessageSquare className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t('admin_support', "Support Client")}</p>
                                        <p className="text-xs text-slate-500">{t('admin_support_desc', "Contact technique")}</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold h-14 rounded-2xl gap-2 mt-4 translate-y-0 active:translate-y-1 transition-all">
                                {t('admin_quick_tutorial', 'Tutoriel Rapide')} <ArrowUpRight className="h-5 w-5" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Mini-Table */}
                <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40">
                    <CardHeader className="pb-2 border-b border-slate-50 px-8 py-6">
                        <CardTitle className="text-xl font-heading font-bold text-slate-900">{t('admin_recent_activity', "Activités Récentes")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center justify-between p-6 px-8 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-white transition-colors group-hover:shadow-sm">
                                            <Clock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{t(`admin_activity_${item}_title`)}</p>
                                            <p className="text-xs text-slate-400 font-medium">{t(`admin_activity_${item}_time`)}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-primary transition-colors">
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50/50 text-center">
                            <Button variant="link" className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-primary">
                                {t('admin_view_all', 'Voir Tout')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
