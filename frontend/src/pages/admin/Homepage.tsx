import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Home,
    Save,
    Loader2,
    Image as ImageIcon,
    Type,
    BarChart3,
    Newspaper,
    Eye,
    Users,
    MapPin,
    Trash2,
    Upload,
    ChevronDown,
    ChevronUp,
    Sparkles,
    X,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { api } from "@/lib/api";

// ─── Image Upload Block ─────────────────────────────────
interface ImageBlockProps {
    label: string;
    name: string;
    id: string;
    currentUrl?: string | null;
    hint?: string;
    onDelete?: () => void;
}

const ImageBlock = ({ label, name, id, currentUrl, hint, onDelete }: ImageBlockProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const displayUrl = preview || currentUrl;

    return (
        <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/60 space-y-3">
            <label htmlFor={id} className="text-sm font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                <ImageIcon className="h-4 w-4 text-blue-500" /> {label}
            </label>
            <div className="flex items-center gap-4">
                {displayUrl ? (
                    <div className="relative group">
                        <img
                            src={displayUrl}
                            alt={t('admin_preview', 'Aperçu')}
                            className="w-36 h-24 object-cover rounded-xl border-2 border-white shadow-md group-hover:shadow-lg transition-shadow"
                        />
                        {onDelete && (displayUrl) && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="absolute -top-3 -right-3 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-all border-2 border-white flex items-center justify-center z-10"
                                title={t('admin_delete', "Supprimer")}
                            >
                                <X className="h-4 w-4 stroke-[3px]" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="w-36 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-white/50">
                        <Upload className="h-6 w-6 text-slate-300" />
                    </div>
                )}
                <div className="flex-1 space-y-2">
                    <Input
                        id={id}
                        type="file"
                        name={name}
                        accept="image/*"
                        onChange={handleChange}
                        className="rounded-xl border-slate-200 bg-white text-sm"
                    />
                    {hint && (
                        <p className="text-[10px] text-slate-400 font-medium italic">{hint}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Collapsible Section ────────────────────────────────
interface SectionBlockProps {
    title: string;
    icon: any;
    color: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const SectionBlock = ({ title, icon: Icon, color, children, defaultOpen = true }: SectionBlockProps) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden">
            <CardHeader
                className={`cursor-pointer p-6 flex flex-row items-center justify-between border-b border-slate-100 transition-colors hover:bg-slate-50/50`}
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${color} shadow-sm`}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg font-heading font-bold text-slate-900">{title}</CardTitle>
                </div>
                {open ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </CardHeader>
            {open && <CardContent className="p-6 md:p-8 space-y-6">{children}</CardContent>}
        </Card>
    );
};

// ─── Main Component ─────────────────────────────────────
const AdminHomepage = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [activeLang, setActiveLang] = useState("fr");
    const [deletedImages, setDeletedImages] = useState<string[]>([]);

    const { data: settings, isLoading } = useQuery({
        queryKey: ["admin-settings"],
        queryFn: async () => {
            const response = await api.get("/api/settings/current/");
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const updateMutation = useMutation({
        mutationFn: async (formData: any) => {
            await api.patch("/api/settings/1/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
            queryClient.invalidateQueries({ queryKey: ["admin-homepage"] });
            queryClient.invalidateQueries({ queryKey: ["site-settings"] });
            setDeletedImages([]);
            toast.success(t('admin_save_success', "Modifications de l'accueil enregistrées"));
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement")),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const cleanedFormData = new FormData();

        formData.forEach((value, key) => {
            // Skip empty file inputs (user didn't select a file)
            if (value instanceof File && value.size === 0) return;
            // Skip literal "null" or "undefined" strings
            if (value === "null" || value === "undefined") return;
            // Allow empty strings so users can clear fields
            cleanedFormData.append(key, value);
        });

        // Handle deleted images
        deletedImages.forEach((field) => {
            cleanedFormData.append(field, "");
        });

        updateMutation.mutate(cleanedFormData);
    };

    const markImageForDeletion = (fieldName: string) => {
        setDeletedImages((prev) => [...prev, fieldName]);
        toast.info(t('admin_image_marked_deletion', "Image marquée pour suppression. Cliquez Enregistrer pour confirmer."));
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement des contenus de l'accueil...")}</p>
                </div>
            </AdminLayout>
        );
    }

    const langs = [
        { code: "fr", label: `🇫🇷 ${t('lang_fr', 'Français')}` },
        { code: "en", label: `🇬🇧 ${t('lang_en', 'English')}` },
    ];

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 animate-fade-up pb-12">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_homepage_title', "Gestion de l'Accueil")} <Home className="h-8 w-8 text-primary" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-1">{t('admin_homepage_subtitle', "Personnalisez les sections et les accroches de votre page d'entrée.")}</p>
                    </div>
                    <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {updateMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="h-5 w-5" />
                        )}
                        {t('admin_save_changes', "Enregistrer les modifications")}
                    </Button>
                </div>

                {/* ── Language Selector ── */}
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm inline-flex gap-1">
                    {langs.map((l) => (
                        <button
                            key={l.code}
                            type="button"
                            onClick={() => setActiveLang(l.code)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeLang === l.code
                                ? "bg-primary text-white shadow-md"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            {t(`lang_${l.code}`, l.label)}
                        </button>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════
                    SECTION 1: HERO (ENTÊTE)
                ═══════════════════════════════════════════════════ */}
                <SectionBlock title={t('admin_section_hero', "Section Hero (Entête)")} icon={Sparkles} color="bg-indigo-500" defaultOpen={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor={`hero_badge_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_badge_label', "Badge (Sur-titre)")}</label>
                                <Input
                                    id={`hero_badge_${activeLang}`}
                                    name={`hero_badge_${activeLang}`}
                                    key={`hero_badge_${activeLang}`}
                                    defaultValue={settings?.[`hero_badge_${activeLang}`]}
                                    placeholder="KANISA LA ANGLIKANA BURUNDI"
                                    className="rounded-xl border-slate-200 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`hero_title_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_title_label', "Titre Principal")}</label>
                                <Input
                                    id={`hero_title_${activeLang}`}
                                    name={`hero_title_${activeLang}`}
                                    key={`hero_title_${activeLang}`}
                                    defaultValue={settings?.[`hero_title_${activeLang}`]}
                                    placeholder="Diyosisi ya Makamba"
                                    className="rounded-xl border-slate-200 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`hero_subtitle_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_subtitle_label', "Sous-titre")}</label>
                                <Textarea
                                    id={`hero_subtitle_${activeLang}`}
                                    name={`hero_subtitle_${activeLang}`}
                                    key={`hero_subtitle_${activeLang}`}
                                    defaultValue={settings?.[`hero_subtitle_${activeLang}`]}
                                    placeholder="Servir Dieu et notre prochain..."
                                    className="rounded-xl border-slate-200 min-h-[120px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <ImageBlock
                                label={t('admin_hero_image', "Image de fond")}
                                id="hero_image"
                                name="hero_image"
                                currentUrl={!deletedImages.includes("hero_image") ? settings?.hero_image_display : null}
                                hint={t('admin_hero_image_hint', "Image haute résolution recommandée (min 1920x1080)")}
                                onDelete={() => markImageForDeletion("hero_image")}
                            />
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="space-y-4">
                            <h4 className="font-bold text-indigo-600 text-sm flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> {t('admin_hero_btn1', "Bouton Principal (Bouton 1)")}
                            </h4>
                            <div className="space-y-2">
                                <label htmlFor={`hero_btn1_text_${activeLang}`} className="text-xs font-bold text-slate-500">{t('admin_text_label', "Texte")}</label>
                                <Input
                                    id={`hero_btn1_text_${activeLang}`}
                                    name={`hero_btn1_text_${activeLang}`}
                                    key={`hero_btn1_text_${activeLang}`}
                                    defaultValue={settings?.[`hero_btn1_text_${activeLang}`]}
                                    placeholder="Gundua diyosisi"
                                    className="rounded-xl border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`hero_btn1_link_${activeLang}`} className="text-xs font-bold text-slate-500">{t('admin_link_label', "Lien (ex: /diocese)")}</label>
                                <Input
                                    id={`hero_btn1_link_${activeLang}`}
                                    name={`hero_btn1_link_${activeLang}`}
                                    key={`hero_btn1_link_${activeLang}`}
                                    defaultValue={settings?.[`hero_btn1_link_${activeLang}`]}
                                    placeholder="/diocese"
                                    className="rounded-xl border-slate-200 font-mono text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-600 text-sm flex items-center gap-2">
                                <Type className="h-4 w-4" /> {t('admin_hero_btn2', "Bouton Secondaire (Bouton 2)")}
                            </h4>
                            <div className="space-y-2">
                                <label htmlFor={`hero_btn2_text_${activeLang}`} className="text-xs font-bold text-slate-500">{t('admin_text_label', "Texte")}</label>
                                <Input
                                    id={`hero_btn2_text_${activeLang}`}
                                    name={`hero_btn2_text_${activeLang}`}
                                    key={`hero_btn2_text_${activeLang}`}
                                    defaultValue={settings?.[`hero_btn2_text_${activeLang}`]}
                                    placeholder="Maisha ya diyosisi"
                                    className="rounded-xl border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`hero_btn2_link_${activeLang}`} className="text-xs font-bold text-slate-500">{t('admin_link_label', "Lien (ex: /actualites)")}</label>
                                <Input
                                    id={`hero_btn2_link_${activeLang}`}
                                    name={`hero_btn2_link_${activeLang}`}
                                    key={`hero_btn2_link_${activeLang}`}
                                    defaultValue={settings?.[`hero_btn2_link_${activeLang}`]}
                                    placeholder="/actualites"
                                    className="rounded-xl border-slate-200 font-mono text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </SectionBlock>


                {/* ═══════════════════════════════════════════════════
                    SECTION 3: ACTUALITÉS / STORIES
                ═══════════════════════════════════════════════════ */}
                <SectionBlock title={t('admin_section_news', "Section Actualités")} icon={Newspaper} color="bg-orange-500" defaultOpen={false}>
                    <ImageBlock
                        id="stories_bg_image"
                        label={t('admin_bg_image_label', "Image de fond de la section")}
                        name="stories_bg_image"
                        currentUrl={!deletedImages.includes("stories_bg_image") ? settings?.stories_bg_image_display : null}
                        hint={t('admin_news_bg_hint', "Optionnel. Image d'arrière-plan de la section actualités.")}
                        onDelete={() => markImageForDeletion("stories_bg_image")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor={`stories_badge_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_badge_label', "Badge / Sous-label")}</label>
                            <Input
                                id={`stories_badge_${activeLang}`}
                                name={`stories_badge_${activeLang}`}
                                key={`stories_badge_${activeLang}`}
                                defaultValue={settings?.[`stories_badge_${activeLang}`]}
                                placeholder="Sur le terrain"
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`stories_title_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_title_label', "Titre de la section")}</label>
                            <Input
                                id={`stories_title_${activeLang}`}
                                name={`stories_title_${activeLang}`}
                                key={`stories_title_${activeLang}`}
                                defaultValue={settings?.[`stories_title_${activeLang}`]}
                                placeholder="Toute l'actualité de nos actions"
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                        <p className="text-xs text-amber-700 font-medium italic">
                            💡 {t('admin_news_tip', "Les articles affichés proviennent de la section Actualités (menu de gauche). Ici vous gérez uniquement le titre et le badge de la section sur la page d'accueil.")}
                        </p>
                    </div>
                </SectionBlock>

                {/* ═══════════════════════════════════════════════════
                    SECTION 4: VISION & MISSION
                ═══════════════════════════════════════════════════ */}
                <SectionBlock title={t('admin_section_vision', "Section Vision & Mission")} icon={Eye} color="bg-violet-500" defaultOpen={false}>
                    <ImageBlock
                        id="vision_bg_image"
                        label={t('admin_bg_image_label', "Image de fond de la section")}
                        name="vision_bg_image"
                        currentUrl={!deletedImages.includes("vision_bg_image") ? settings?.vision_bg_image_display : null}
                        hint={t('admin_vision_bg_hint', "Optionnel. Image d'arrière-plan de la section Vision.")}
                        onDelete={() => markImageForDeletion("vision_bg_image")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor={`vision_title_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_vision_title', "Titre Vision")}</label>
                            <Input
                                id={`vision_title_${activeLang}`}
                                name={`vision_title_${activeLang}`}
                                key={`vision_title_${activeLang}`}
                                defaultValue={settings?.[`vision_title_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`vision_description_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_vision_desc', "Description Vision")}</label>
                            <Textarea
                                id={`vision_description_${activeLang}`}
                                name={`vision_description_${activeLang}`}
                                key={`vision_desc_${activeLang}`}
                                defaultValue={settings?.[`vision_description_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                    </div>

                    {/* 3 Pillars */}
                    <h4 className="font-bold text-slate-800 text-sm pt-2">{t('admin_pillars_title', "Les 3 piliers")}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="p-4 bg-violet-50/30 rounded-xl border border-violet-100/50 space-y-3">
                                <label htmlFor={`vision_pillar${num}_title_${activeLang}`} className="text-xs font-bold text-violet-600 uppercase">{t('admin_pillar_label', 'Pilier')} {num}</label>
                                <Input
                                    id={`vision_pillar${num}_title_${activeLang}`}
                                    name={`vision_pillar${num}_title_${activeLang}`}
                                    key={`vp_title_${num}_${activeLang}`}
                                    placeholder={t('admin_title_label', "Titre")}
                                    defaultValue={settings?.[`vision_pillar${num}_title_${activeLang}`]}
                                    className="rounded-lg h-9"
                                />
                                <label htmlFor={`vision_pillar${num}_desc_${activeLang}`} className="sr-only">Description Pilier {num}</label>
                                <Textarea
                                    id={`vision_pillar${num}_desc_${activeLang}`}
                                    name={`vision_pillar${num}_desc_${activeLang}`}
                                    key={`vp_desc_${num}_${activeLang}`}
                                    placeholder={t('admin_desc_label', "Description")}
                                    defaultValue={settings?.[`vision_pillar${num}_desc_${activeLang}`]}
                                    className="rounded-lg text-xs"
                                />
                                {activeLang === "fr" && (
                                    <div className="space-y-1">
                                        <label htmlFor={`vision_pillar${num}_icon`} className="text-[10px] font-bold text-slate-400">{t('admin_icon_label', "Icône (Lucide)")}</label>
                                        <Input
                                            id={`vision_pillar${num}_icon`}
                                            name={`vision_pillar${num}_icon`}
                                            defaultValue={settings?.[`vision_pillar${num}_icon`]}
                                            placeholder="Cross, MapPin, Lightbulb..."
                                            className="rounded-lg h-8 text-xs font-mono"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionBlock>

                {/* ═══════════════════════════════════════════════════
                    SECTION 5: PAROISSES
                ═══════════════════════════════════════════════════ */}
                <SectionBlock title={t('admin_section_parishes', "Section Paroisses")} icon={MapPin} color="bg-teal-500" defaultOpen={false}>
                    <ImageBlock
                        id="parishes_bg_image"
                        label={t('admin_bg_image_label', "Image de fond de la section")}
                        name="parishes_bg_image"
                        currentUrl={!deletedImages.includes("parishes_bg_image") ? settings?.parishes_bg_image_display : null}
                        hint={t('admin_parishes_bg_hint', "Optionnel. Image d'arrière-plan de la section Paroisses.")}
                        onDelete={() => markImageForDeletion("parishes_bg_image")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor={`parishes_title_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_title_label', 'Titre Section')}</label>
                            <Input
                                id={`parishes_title_${activeLang}`}
                                name={`parishes_title_${activeLang}`}
                                key={`par_title_${activeLang}`}
                                defaultValue={settings?.[`parishes_title_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`parishes_description_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_desc_label', 'Description')}</label>
                            <Textarea
                                id={`parishes_description_${activeLang}`}
                                name={`parishes_description_${activeLang}`}
                                key={`par_desc_${activeLang}`}
                                defaultValue={settings?.[`parishes_description_${activeLang}`]}
                                className="rounded-xl border-slate-200 min-h-[80px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`parishes_map_title_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_map_title', 'Titre Carte')}</label>
                            <Input
                                id={`parishes_map_title_${activeLang}`}
                                name={`parishes_map_title_${activeLang}`}
                                key={`par_map_t_${activeLang}`}
                                defaultValue={settings?.[`parishes_map_title_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`parishes_map_subtitle_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_map_subtitle', 'Sous-titre Carte')}</label>
                            <Input
                                id={`parishes_map_subtitle_${activeLang}`}
                                name={`parishes_map_subtitle_${activeLang}`}
                                key={`par_map_s_${activeLang}`}
                                defaultValue={settings?.[`parishes_map_subtitle_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="space-y-2 col-span-full">
                            <label htmlFor={`parishes_map_stats_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_map_stats', 'Stats Carte')}</label>
                            <Input
                                id={`parishes_map_stats_${activeLang}`}
                                name={`parishes_map_stats_${activeLang}`}
                                key={`par_map_stats_${activeLang}`}
                                defaultValue={settings?.[`parishes_map_stats_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                    </div>
                </SectionBlock>

                {/* ═══════════════════════════════════════════════════
                    SECTION 6: ENGAGEMENT
                ═══════════════════════════════════════════════════ */}
                <SectionBlock title={t('admin_section_engage', "Section Engagement")} icon={Users} color="bg-rose-500" defaultOpen={false}>
                    <ImageBlock
                        id="engage_bg_image"
                        label={t('admin_bg_image_label', "Image de fond de la section")}
                        name="engage_bg_image"
                        currentUrl={!deletedImages.includes("engage_bg_image") ? settings?.engage_bg_image_display : null}
                        hint={t('admin_engage_bg_hint', "Optionnel. Image d'arrière-plan de la section Engagement.")}
                        onDelete={() => markImageForDeletion("engage_bg_image")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor={`engage_title_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_title_label', 'Titre Engagement')}</label>
                            <Input
                                id={`engage_title_${activeLang}`}
                                name={`engage_title_${activeLang}`}
                                key={`eng_title_${activeLang}`}
                                defaultValue={settings?.[`engage_title_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`engage_description_${activeLang}`} className="text-sm font-bold text-slate-700">{t('admin_desc_label', 'Description')}</label>
                            <Textarea
                                id={`engage_description_${activeLang}`}
                                name={`engage_description_${activeLang}`}
                                key={`eng_desc_${activeLang}`}
                                defaultValue={settings?.[`engage_description_${activeLang}`]}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                    </div>

                    {/* 3 Engagement Items */}
                    <h4 className="font-bold text-slate-800 text-sm pt-2">{t('admin_engagement_items', "Points d'engagement")}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="p-4 bg-rose-50/30 rounded-xl border border-rose-100/50 space-y-3">
                                <label htmlFor={`engage_item${num}_title_${activeLang}`} className="text-xs font-bold text-rose-600 uppercase cursor-pointer">{t('admin_point_label', 'Point')} {num}</label>
                                <Input
                                    id={`engage_item${num}_title_${activeLang}`}
                                    name={`engage_item${num}_title_${activeLang}`}
                                    key={`ei_title_${num}_${activeLang}`}
                                    placeholder={t('admin_title_label', "Titre")}
                                    defaultValue={settings?.[`engage_item${num}_title_${activeLang}`]}
                                    className="rounded-lg h-9"
                                />
                                <label htmlFor={`engage_item${num}_desc_${activeLang}`} className="sr-only">Description Point {num}</label>
                                <Textarea
                                    id={`engage_item${num}_desc_${activeLang}`}
                                    name={`engage_item${num}_desc_${activeLang}`}
                                    key={`ei_desc_${num}_${activeLang}`}
                                    placeholder={t('admin_desc_label', "Description")}
                                    defaultValue={settings?.[`engage_item${num}_desc_${activeLang}`]}
                                    className="rounded-lg text-xs"
                                />
                                <label htmlFor={`engage_item${num}_cta_${activeLang}`} className="sr-only">Bouton Point {num}</label>
                                <Input
                                    id={`engage_item${num}_cta_${activeLang}`}
                                    name={`engage_item${num}_cta_${activeLang}`}
                                    key={`ei_cta_${num}_${activeLang}`}
                                    placeholder={t('admin_text_label', "Texte bouton")}
                                    defaultValue={settings?.[`engage_item${num}_cta_${activeLang}`]}
                                    className="rounded-lg h-9"
                                />
                                {activeLang === "fr" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label htmlFor={`engage_item${num}_href`} className="text-[10px] font-bold text-slate-400 cursor-pointer">{t('admin_link_label', "Lien")}</label>
                                            <Input
                                                id={`engage_item${num}_href`}
                                                name={`engage_item${num}_href`}
                                                defaultValue={settings?.[`engage_item${num}_href`]}
                                                placeholder="/..."
                                                className="h-8 text-[10px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor={`engage_item${num}_icon`} className="text-[10px] font-bold text-slate-400 cursor-pointer">{t('admin_icon_label', "Icône")}</label>
                                            <Input
                                                id={`engage_item${num}_icon`}
                                                name={`engage_item${num}_icon`}
                                                defaultValue={settings?.[`engage_item${num}_icon`]}
                                                placeholder="Users..."
                                                className="h-8 text-[10px]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionBlock>


                {/* ── Bottom Save ── */}
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-white gap-2 h-14 px-10 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 text-lg font-bold"
                    >
                        {updateMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="h-5 w-5" />
                        )}
                        {t('admin_save_all', "Enregistrer toutes les modifications")}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
};

export default AdminHomepage;
