import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Megaphone,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Plus,
    Bell,
    Search,
    Cross,
    Radio,
    Quote,
    Library,
    Layers,
    BarChart3,
    MapPin,
    Mail,
    User,
    ChevronDown,
    BookOpen,
    Globe,
    UserCog,
    Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useApi";
import { api } from "@/lib/api";

interface AdminLayoutProps {
    children: ReactNode;
}

const sidebarItems = [
    { icon: LayoutDashboard, labelKey: "admin_dashboard", href: "/admin", color: "text-blue-500", adminOnly: false },
    { icon: Home, labelKey: "admin_home", href: "/admin/homepage", color: "text-primary", adminOnly: true },
    { icon: Library, labelKey: "admin_diocese", href: "/admin/a-propos", color: "text-violet-500", adminOnly: true },
    { icon: Mail, labelKey: "admin_contact", href: "/admin/messages", color: "text-indigo-500", adminOnly: false },
    { icon: Megaphone, labelKey: "admin_news", href: "/admin/announcements", color: "text-orange-500", adminOnly: false },
    { icon: Quote, labelKey: "admin_testimonials", href: "/admin/testimonials", color: "text-amber-500", adminOnly: true },
    { icon: UserCog, labelKey: "admin_users_management", href: "/admin/users", color: "text-teal-500", adminOnly: true },
    { icon: Settings, labelKey: "admin_settings", href: "/admin/settings", color: "text-slate-400", adminOnly: true },
    { icon: FileText, labelKey: "admin_manual", href: "/admin/documentation", color: "text-indigo-500", adminOnly: false },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { t, i18n } = useTranslation();
    const { data: siteSettings } = useSiteSettings();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{"username": "Admin", "role": "admin"}');
    const userRole = user.role || 'admin';
    const isAdmin = userRole === 'admin' || user.is_superuser;

    // Filtrer les éléments du sidebar selon le rôle
    const filteredSidebarItems = sidebarItems.filter(item => {
        if (item.adminOnly && !isAdmin) return false;
        return true;
    });

    // Effect to set initial language from settings if not set in localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('i18nextLng');
        if (!savedLang && siteSettings?.default_language) {
            i18n.changeLanguage(siteSettings.default_language);
        }
    }, [siteSettings, i18n]);

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await api.get('/api/messages/unread_count/');
                setUnreadMessages(res.data.unread_count ?? 0);
            } catch {
                // Silently ignore — user may not be authenticated yet
            }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/admin/login");
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-body">
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? (isMobile ? "280px" : "260px") : "0px",
                    x: isMobile && !isSidebarOpen ? -280 : 0
                }}
                className={`fixed lg:sticky top-0 h-screen bg-[#1e293b] text-slate-300 z-50 overflow-hidden shadow-2xl transition-all duration-300 ease-in-out`}
            >
                <div className="flex flex-col h-full w-[260px] md:w-[280px]">
                    {/* Sidebar Header */}
                    <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
                        <div className="bg-white/10 p-2 rounded-lg border border-white/10 shadow-lg min-w-[40px] min-h-[40px] flex items-center justify-center overflow-hidden">
                            {siteSettings?.logo_url_display ? (
                                <img src={siteSettings.logo_url_display} alt={siteSettings.site_name} className="h-6 w-6 object-contain" />
                            ) : (
                                <Cross className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <span className="font-heading font-bold text-white text-lg tracking-tight leading-tight">
                            {siteSettings?.site_name || "Anglicane Makamba"}
                        </span>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        {filteredSidebarItems.map((item) => {
                            const isActive = location.pathname === item.href.split('?')[0] &&
                                (item.href.includes('?') ? location.search === `?${item.href.split('?')[1]}` : true);
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : item.color} group-hover:scale-110 transition-transform`} />
                                    <span className="font-medium text-sm">{t(item.labelKey)}</span>
                                    {item.labelKey === "admin_contact" && unreadMessages > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {unreadMessages}
                                        </span>
                                    )}
                                    {isActive && item.labelKey !== "admin_contact" && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 mt-auto">
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-semibold text-sm"
                            >
                                <LogOut className="h-4 w-4" />
                                {t("admin_logout")}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>

                        <div className="hidden md:flex items-center gap-4">
                            <a href="/" target="_blank" rel="noopener noreferrer">
                                <Button type="button" variant="ghost" size="sm" className="font-body font-medium text-slate-600 gap-2">
                                    <LayoutDashboard className="h-4 w-4" /> {t("admin_view_site")}
                                </Button>
                            </a>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="ghost" size="sm" className="font-body font-medium text-slate-600 gap-2">
                                        <Plus className="h-4 w-4" /> {t("admin_new")}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48 rounded-xl p-1 shadow-xl border-slate-200">
                                    <DropdownMenuItem asChild>
                                        <Link to="/admin/announcements" className="flex items-center gap-2 px-3 py-2 cursor-pointer font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                                            <Bell className="h-4 w-4 text-amber-500" /> {t("nav_news")}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Language Switcher in Admin Header */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="ghost" size="sm" className="flex items-center gap-2 px-3 hover:bg-slate-100 rounded-xl transition-colors">
                                    <Globe className="h-4 w-4 text-indigo-500" />
                                    <span className="font-bold text-xs uppercase text-slate-600">{i18n.language}</span>
                                    <ChevronDown className="h-3 w-3 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-xl border-slate-200">
                                <DropdownMenuItem onClick={() => changeLanguage('fr')} className="flex items-center gap-3 px-3 py-2 cursor-pointer font-medium text-slate-700 hover:bg-slate-50 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                    <span className="text-base">🇫🇷</span> {t('lang_fr', 'Français')}
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => changeLanguage('en')} className="flex items-center gap-3 px-3 py-2 cursor-pointer font-medium text-slate-700 hover:bg-slate-50 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                    <span className="text-base">🇬🇧</span> {t('lang_en', 'English')}
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="hidden sm:flex items-center relative">
                            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="admin-global-search"
                                name="search"
                                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white h-10 w-48 lg:w-32 rounded-xl"
                                placeholder={t("admin_search_placeholder")}
                            />
                        </div>

                        <Button type="button" variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 rounded-full">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>

                        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user.username}</p>
                                <div className="flex items-center justify-end gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{t("admin_online")}</p>
                                </div>
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-slate-50 group-hover:border-primary/20 transition-colors shadow-sm">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
