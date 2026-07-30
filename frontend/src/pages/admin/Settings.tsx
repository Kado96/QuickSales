import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Settings,
    Save,
    Loader2,
    Globe,
    Mail,
    Fingerprint,
    MapPin,
    Palette,
    BarChart3,
    Users
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Sub-components
import LanguageTabContent from "./components/LanguageTabContent";
import StatsTabContent from "./components/StatsTabContent";
import ContactTabContent from "./components/ContactTabContent";
import DesignTabContent from "./components/DesignTabContent";
import { useTranslation } from "react-i18next";
import IdentityTabContent from "./components/IdentityTabContent";

const AdminSettings = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("fr");

    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setSearchParams({ tab: value }, { replace: true });
    };

    const { data: settings, isLoading } = useQuery({
        queryKey: ["admin-settings"],
        queryFn: async () => {
            const response = await api.get("/api/settings/current/");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache for admin
    });

    const updateMutation = useMutation({
        mutationFn: async (formData: any) => {
            await api.patch("/api/settings/1/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
            queryClient.invalidateQueries({ queryKey: ["site-settings"] });
            toast.success(t('admin_settings_save_success', "Paramètres enregistrés avec succès"));
        },
        onError: (error: any) => {
            console.error("Update Error:", error);
            const detail = error.response?.data?.detail ||
                (error.response?.data && typeof error.response.data === 'object' ?
                    Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(', ') :
                    t('admin_settings_save_error', "Erreur lors de l'enregistrement"));

            toast.error(detail, {
                duration: 5000,
            });
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Nettoyer les champs vides pour éviter les erreurs 400 (Bad Request)
        // car DRF peut rejeter des chaînes vides pour certains champs ou des fichiers null
        const cleanedFormData = new FormData();
        formData.forEach((value, key) => {
            // Skip empty file inputs (user didn't select a file)
            if (value instanceof File && value.size === 0) return;
            // Skip literal "null" or "undefined" strings
            if (value === "null" || value === "undefined") return;
            // Allow empty strings so users can clear fields
            cleanedFormData.append(key, value);
        });

        updateMutation.mutate(cleanedFormData);
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium">{t('admin_loading_content', "Chargement des paramètres...")}</p>
                </div>
            </AdminLayout>
        );
    }

    // ⚠️  IMPORTANT: AdminLayout contains <input name="search"> and <button> elements in the header.
    // Wrapping AdminLayout itself inside a <form> causes React Fiber DOM corruption (insertBefore crash)
    // because those elements become form children and conflict with conditional renders (Loader2/Save icon swap).
    // Fix: AdminLayout is the outer wrapper; the <form> only wraps the page content.

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 animate-fade-up" encType="multipart/form-data">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_settings_title', "Paramètres du Site")} <Settings className="h-8 w-8 text-slate-400" />
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">{t('admin_settings_subtitle', "Gérez l'identité et les contenus globaux de votre plateforme.")}</p>
                    </div>
                    <Button
                        type="submit"
                        id="btn-save-settings"
                        name="save_settings"
                        disabled={updateMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {t('admin_save_changes', "Enregistrer")}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Général Content */}
                        <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40">
                            <CardHeader className="p-8 border-b border-slate-50">
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-500" /> {t('admin_content_by_lang', "Contenu par Langue")}
                                </CardTitle>
                                <CardDescription>{t('admin_content_desc', "Éditez le contenu affiché sur les pages publiques.")}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                    <TabsList className="bg-slate-100 p-1 rounded-xl mb-3 flex flex-wrap h-auto">
                                        <TabsTrigger value="fr" className="rounded-lg font-bold">🇫🇷 {t('lang_fr', 'Français')}</TabsTrigger>
                                        <TabsTrigger value="en" className="rounded-lg font-bold">🇬🇧 {t('lang_en', 'English')}</TabsTrigger>
                                        <TabsTrigger value="identity" className="rounded-lg font-bold">
                                            <Fingerprint className="h-4 w-4 mr-2 text-indigo-500" /> {t('admin_identity', 'Identité')}
                                        </TabsTrigger>
                                        <TabsTrigger value="design" className="rounded-lg font-bold bg-rose-50 text-rose-700 data-[state=active]:bg-rose-600 data-[state=active]:text-white gap-2 py-2 px-4 shadow-sm border border-rose-100">
                                            <Palette className="h-4 w-4" /> {t('admin_tab_design', "Design & Alertes")}
                                        </TabsTrigger>
                                        <TabsTrigger value="stats" className="rounded-lg font-bold bg-amber-50 text-amber-700 data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-2 py-2 px-4 shadow-sm border border-amber-100">
                                            <BarChart3 className="h-4 w-4" /> {t('admin_tab_stats', "Statistiques")}
                                        </TabsTrigger>
                                        <TabsTrigger value="contact" className="rounded-lg font-bold bg-emerald-50 text-emerald-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-2 py-2 px-4 shadow-sm border border-emerald-100">
                                            <Globe className="h-4 w-4" /> {t('admin_tab_contact', "Contact & Réseaux")}
                                        </TabsTrigger>
                                    </TabsList>
                                    {/* Link must be OUTSIDE TabsList — anchor inside Radix TabsList causes React DOM crash */}
                                    <div className="mb-4">
                                        <Link to="/admin/users" className="inline-flex items-center gap-2 rounded-lg font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 py-2 px-4 shadow-sm border border-teal-100 transition-colors text-sm">
                                            <Users className="h-4 w-4" /> {t('admin_users_management', "Utilisateurs")}
                                        </Link>
                                    </div>

                                    {["fr", "en"].map((lang) => (
                                        <TabsContent key={lang} value={lang} className="mt-0">
                                            <LanguageTabContent lang={lang} settings={settings} />
                                        </TabsContent>
                                    ))}

                                    <TabsContent value="design" className="mt-0">
                                        <DesignTabContent settings={settings} />
                                    </TabsContent>
                                    
                                    <TabsContent value="stats" className="mt-0">
                                        <StatsTabContent settings={settings} />
                                    </TabsContent>

                                    <TabsContent value="contact" className="mt-0">
                                        <ContactTabContent settings={settings} />
                                    </TabsContent>

                                    <TabsContent value="identity" className="mt-0">
                                        <IdentityTabContent settings={settings} />
                                    </TabsContent>

                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="hidden lg:block space-y-6">
                        {/* Logo Preview Card on the right */}
                        <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40 p-8 bg-white flex flex-col items-center justify-center text-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                                {t("admin_site_logo_preview", "LOGO DU SITE")}
                            </h3>
                            <div className="w-40 h-40 rounded-[2rem] border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden p-4 shadow-inner">
                                {settings?.logo_url_display ? (
                                    <img
                                        src={settings.logo_url_display}
                                        alt={settings.site_name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-xs font-bold text-slate-300">Aucun logo</span>
                                )}
                            </div>
                            <span className="text-xs font-medium text-slate-400 mt-6">
                                {t("admin_logo_hint_aspect", "Format carré conseillé")}
                            </span>
                        </Card>

                        <Card className="rounded-[2rem] border-blue-100 bg-blue-50/30 p-8 shadow-sm">
                            <h3 className="font-heading font-bold text-blue-900 mb-2">{t("admin_tip_title")}</h3>
                            <p className="text-sm text-blue-700/80 leading-relaxed">
                                {t("admin_tip_text")}
                            </p>
                        </Card>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
};

export default AdminSettings;
