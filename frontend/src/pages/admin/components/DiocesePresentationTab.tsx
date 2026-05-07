import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import ImageFieldWithPreview from "./ImageFieldWithPreview";
import TimelineManager from "./TimelineManager";

const DiocesePresentationTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data: presentation, isLoading } = useQuery({
        queryKey: ["admin-diocese-presentation"],
        queryFn: async () => {
            const response = await api.get("/api/pages/diocese-presentation/current/");
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const updateMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.patch("/api/pages/diocese-presentation/current/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-diocese-presentation"] });
            toast.success(t('admin_save_success', "Présentation du diocèse mise à jour avec succès"));
        },
        onError: (error: any) => {
            console.error("Update Error:", error);
            const detail = error.response?.data?.detail || t('admin_save_error', "Erreur lors de l'enregistrement");
            toast.error(detail);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const cleanedFormData = new FormData();

        formData.forEach((value, key) => {
            if (key.startsWith('clear_')) return;
            
            if (value instanceof File) {
                if (value.size > 0) {
                    cleanedFormData.append(key, value);
                } else if (formData.get(`clear_${key}`) === 'true') {
                    cleanedFormData.append(key, '');
                }
                return;
            }

            if (value === "null" || value === "undefined") return;
            
            // Avoid sending empty strings for image fields if they are not being cleared
            const isImageField = key.endsWith('_image') || key.endsWith('_photo');
            if (isImageField && value === "") return;

            cleanedFormData.append(key, value);
        });

        updateMutation.mutate(cleanedFormData);
    };

    const [activeLang, setActiveLang] = React.useState("fr");

    const langs = [
        { code: "fr", label: `🇫🇷 ${t('lang_fr', 'Français')}` },
        { code: "en", label: `🇬🇧 ${t('lang_en', 'English')}` },
    ];

    if (isLoading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement de la présentation...")}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/30">
            {/* ── Language Selector ── */}
            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 inline-flex gap-1">
                {langs.map((l) => (
                    <button
                        key={l.code}
                        id={`btn-pres-lang-${l.code}`}
                        name={`pres_lang_${l.code}`}
                        type="button"
                        onClick={() => setActiveLang(l.code)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeLang === l.code
                            ? "bg-violet-600 text-white shadow-md"
                            : "text-slate-500 hover:bg-white hover:text-slate-700"
                            }`}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* HERO SETTINGS */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_section_hero', "Entête de la page (Hero)")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_hero_image_tip', "L'immense photo et le texte qui s'affichent tout en haut de la page Diocese.")}</p>
                </div>

                <div className="space-y-4">
                    <ImageFieldWithPreview
                        fieldName="hero_image"
                        label={t('admin_hero_image_label', "Image de fond du Héro")}
                        currentImageUrl={presentation?.[0]?.hero_image_display}
                        hint={t('admin_image_tip_high', 'JPG, PNG (Très haute résolution, format paysage)')}
                        aspectRatio="21/9"
                        maxPreviewHeight="200px"
                    />
                    <div className="space-y-4 border-l-4 border-violet-500 pl-4 py-2 bg-violet-50/30 rounded-r-xl">
                    <div className="space-y-2">
                        <label htmlFor={`hero_title_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_hero_title_label', "Titre Héro")} ({activeLang})</label>
                        <Input
                            id={`hero_title_${activeLang}`}
                            name={`hero_title_${activeLang}`}
                            key={`hero_title_${activeLang}`}
                            defaultValue={presentation?.[0]?.[`hero_title_${activeLang}`] || ""}
                            className="rounded-xl h-12 bg-white"
                            placeholder={t('admin_hero_title_placeholder', "Ex: Le Diocèse")}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor={`hero_subtitle_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_hero_subtitle_label', "Sous-titre Héro")} ({activeLang})</label>
                        <Textarea
                            id={`hero_subtitle_${activeLang}`}
                            name={`hero_subtitle_${activeLang}`}
                            key={`hero_subtitle_${activeLang}`}
                            defaultValue={presentation?.[0]?.[`hero_subtitle_${activeLang}`] || ""}
                            rows={3}
                            className="w-full rounded-2xl min-h-[80px] bg-white"
                            placeholder={t('admin_hero_subtitle_placeholder', "Texte d'accroche sous le titre principal...")}
                        />
                    </div>
                </div>
            </div>
        </div>

            {/* O R G A N I S A T I O N */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_organization_title', "Notre Organisation")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_organization_tip', "Gérez le titre, le petit slogan et le texte descriptif de la section organisation.")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`organization_title_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_org_title_label', "Titre de la section")} ({activeLang})</label>
                        <Input
                            id={`organization_title_${activeLang}`}
                            name={`organization_title_${activeLang}`}
                            key={`organization_title_${activeLang}`}
                            defaultValue={presentation?.[0]?.[`organization_title_${activeLang}`] || ""}
                            className="rounded-xl h-11 bg-slate-50/50"
                            placeholder="Ex: Notre Origine & Organisation"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`organization_subtitle_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_org_subtitle_label', "Petit Sous-titre")} ({activeLang})</label>
                        <Input
                            id={`organization_subtitle_${activeLang}`}
                            name={`organization_subtitle_${activeLang}`}
                            key={`organization_subtitle_${activeLang}`}
                            defaultValue={presentation?.[0]?.[`organization_subtitle_${activeLang}`] || ""}
                            className="rounded-xl h-11 bg-slate-50/50"
                            placeholder="Ex: Présentation du Diocèse..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor={`organization_text_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_organization_label', 'Texte descriptif principal')} ({activeLang})</label>
                    <Textarea
                        id={`organization_text_${activeLang}`}
                        name={`organization_text_${activeLang}`}
                        key={`organization_text_${activeLang}`}
                        defaultValue={presentation?.[0]?.[`organization_text_${activeLang}`] || ""}
                        rows={5}
                        className="w-full rounded-2xl min-h-[100px] bg-slate-50/50"
                        placeholder={t('admin_organization_placeholder', "Comment est structuré le diocèse, ses entités clés...")}
                    />
                </div>
            </div>

            {/* H I S T O I R E */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_tab_history', "Texte Historique")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_history_text_tip', "Le long texte racontant l'histoire complète du diocèse.")}</p>
                </div>

                <div className="space-y-4">
                    <Textarea
                        id={`history_text_${activeLang}`}
                        name={`history_text_${activeLang}`}
                        key={`history_text_${activeLang}`}
                        defaultValue={presentation?.[0]?.[`history_text_${activeLang}`] || ""}
                        rows={8}
                        className="w-full rounded-2xl min-h-[150px] bg-slate-50/50"
                        placeholder={t('admin_history_text_placeholder', "Rédigez l'histoire du diocèse de Makamba ici...")}
                    />
                </div>

                <ImageFieldWithPreview
                    fieldName="history_image"
                    label={t('admin_history_image_label', 'Image décorative de l\'histoire')}
                    currentImageUrl={presentation?.[0]?.history_image_display}
                    hint={t('admin_image_tip_landscape', 'JPG, PNG (Ratio Paysage recommandé)')}
                    aspectRatio="16/9"
                    maxPreviewHeight="160px"
                />
            </div>

            {/* Titre de la section Chronologie */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_tab_history_timeline_title', "Titre de la Chronologie")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_timeline_title_tip', "Modifiez le titre affiché au-dessus de la ligne du temps (ex: Chronologie Majeure).")}</p>
                </div>
                <div className="space-y-2">
                    <Input
                        id={`history_title_${activeLang}`}
                        name={`history_title_${activeLang}`}
                        key={`history_title_${activeLang}`}
                        defaultValue={presentation?.[0]?.[`history_title_${activeLang}`] || ""}
                        className="rounded-xl h-12 bg-slate-50/50"
                        placeholder="Ex: Chronologie Majeure, Dates Clés..."
                    />
                </div>
            </div>

            {/* C H R O N O L O G I E  (TIMELINE) Manager intégré */}
            <TimelineManager activeLang={activeLang} />

            {/* E V Ê Q U E */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_bishop_word', "Le mot de l'Évêque")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_bishop_tip', "Informations sur l'évêque et son message pastoral.")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="bishop_name" className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_bishop_name_label', "Nom de l'Évêque")}</label>
                        <Input
                            id="bishop_name"
                            type="text"
                            name="bishop_name"
                            defaultValue={presentation?.[0]?.bishop_name || ""}
                            className="rounded-xl h-11 bg-slate-50/50"
                            placeholder={t('admin_bishop_name_placeholder', "Ex: Rt. Rev. Martin Blaise Nyaboho")}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`bishop_title_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_bishop_title_label', "Titre de l'Évêque")} ({activeLang})</label>
                        <Input
                            id={`bishop_title_${activeLang}`}
                            type="text"
                            name={`bishop_title_${activeLang}`}
                            defaultValue={presentation?.[0]?.[`bishop_title_${activeLang}`] || ""}
                            className="rounded-xl h-11 bg-slate-50/50"
                            placeholder={t('admin_bishop_title_placeholder', "Ex: Évêque de Makamba")}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor={`bishop_message_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_bishop_message_label', "Message / Mot de l'Evêque")} ({activeLang})</label>
                    <Textarea
                        id={`bishop_message_${activeLang}`}
                        name={`bishop_message_${activeLang}`}
                        key={`bishop_message_${activeLang}`}
                        defaultValue={presentation?.[0]?.[`bishop_message_${activeLang}`] || ""}
                        rows={6}
                        className="w-full rounded-2xl min-h-[120px] bg-slate-50/50"
                        placeholder={t('admin_bishop_message_placeholder', "Message de bienvenue ou de la vision pastoral... ")}
                    />
                </div>

                <ImageFieldWithPreview
                    fieldName="bishop_photo"
                    label={t('admin_photo_official_label', 'Photo Officielle de l\'Évêque')}
                    currentImageUrl={presentation?.[0]?.bishop_photo_display}
                    hint={t('admin_image_tip_portrait', 'JPG, PNG (Ratio Portrait recommandé)')}
                    aspectRatio="3/4"
                    maxPreviewHeight="200px"
                />
            </div>

            {/* N A V I G A T I O N */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_nav_labels', "Étiquettes de Navigation")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_nav_labels_tip', "Modifiez les textes des liens du menu interne de la page (Barre collante).")}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`nav_history_${activeLang}`} className="text-xs font-bold text-slate-500 uppercase cursor-pointer">{t('diocese_history', 'Historique')}</label>
                        <Input id={`nav_history_${activeLang}`} name={`nav_history_${activeLang}`} defaultValue={presentation?.[0]?.[`nav_history_${activeLang}`] || ""} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`nav_bishop_${activeLang}`} className="text-xs font-bold text-slate-500 uppercase cursor-pointer">{t('diocese_bishop_message', "L'Évêque")}</label>
                        <Input id={`nav_bishop_${activeLang}`} name={`nav_bishop_${activeLang}`} defaultValue={presentation?.[0]?.[`nav_bishop_${activeLang}`] || ""} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`nav_vision_${activeLang}`} className="text-xs font-bold text-slate-500 uppercase cursor-pointer">{t('vision_title', 'Vision')}</label>
                        <Input id={`nav_vision_${activeLang}`} name={`nav_vision_${activeLang}`} defaultValue={presentation?.[0]?.[`nav_vision_${activeLang}`] || ""} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`nav_team_${activeLang}`} className="text-xs font-bold text-slate-500 uppercase cursor-pointer">{t('diocese_team', "L'Équipe")}</label>
                        <Input id={`nav_team_${activeLang}`} name={`nav_team_${activeLang}`} defaultValue={presentation?.[0]?.[`nav_team_${activeLang}`] || ""} className="h-10 rounded-lg" />
                    </div>
                </div>
            </div>


            {/* Hidden fields for other language to prevent data loss during tab switching */}
            {langs.filter(l => l.code !== activeLang).map(l => (
                <div key={l.code} className="hidden">
                    <Input name={`hero_title_${l.code}`} defaultValue={presentation?.[0]?.[`hero_title_${l.code}`] || ""} />
                    <Textarea name={`hero_subtitle_${l.code}`} defaultValue={presentation?.[0]?.[`hero_subtitle_${l.code}`] || ""} />
                    <Input name={`organization_title_${l.code}`} defaultValue={presentation?.[0]?.[`organization_title_${l.code}`] || ""} />
                    <Input name={`organization_subtitle_${l.code}`} defaultValue={presentation?.[0]?.[`organization_subtitle_${l.code}`] || ""} />
                    <Textarea name={`organization_text_${l.code}`} defaultValue={presentation?.[0]?.[`organization_text_${l.code}`] || ""} />
                    <Textarea name={`history_text_${l.code}`} defaultValue={presentation?.[0]?.[`history_text_${l.code}`] || ""} />
                    <Input name={`history_title_${l.code}`} defaultValue={presentation?.[0]?.[`history_title_${l.code}`] || ""} />
                    <Input name={`bishop_title_${l.code}`} defaultValue={presentation?.[0]?.[`bishop_title_${l.code}`] || ""} />
                    <Textarea name={`bishop_message_${l.code}`} defaultValue={presentation?.[0]?.[`bishop_message_${l.code}`] || ""} />
                    <Input name={`nav_history_${l.code}`} defaultValue={presentation?.[0]?.[`nav_history_${l.code}`] || ""} />
                    <Input name={`nav_bishop_${l.code}`} defaultValue={presentation?.[0]?.[`nav_bishop_${l.code}`] || ""} />
                    <Input name={`nav_vision_${l.code}`} defaultValue={presentation?.[0]?.[`nav_vision_${l.code}`] || ""} />
                    <Input name={`nav_team_${l.code}`} defaultValue={presentation?.[0]?.[`nav_team_${l.code}`] || ""} />
                </div>
            ))}

            <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button
                    type="submit"
                    id="btn-save-presentation"
                    name="save_presentation"
                    disabled={updateMutation.isPending}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-2 h-12 px-8 rounded-xl shadow-lg shadow-violet-200 transition-all active:scale-95 text-lg font-bold"
                >
                    {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {t('admin_save_presentation', "Enregistrer la présentation")}
                </Button>
            </div>
        </form>
    );
};

export default DiocesePresentationTab;
