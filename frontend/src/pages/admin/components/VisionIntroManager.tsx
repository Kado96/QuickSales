import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

import ImageFieldWithPreview from "./ImageFieldWithPreview";

const VisionIntroManager = ({ activeLang, filter }: { activeLang: string, filter?: "mission" | "team" | "all" }) => {
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
            toast.success(t('admin_save_success', "Contenus mis à jour avec succès"));
        },
        onError: (error: any) => {
            console.error("Update Error:", error);
            toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"));
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const cleanedFormData = new FormData();

        formData.forEach((value, key) => {
            if (value === "null" || value === "undefined") return;
            
            // Handle image clearing
            if (key.startsWith('clear_')) {
                const fieldName = key.replace('clear_', '');
                if (value === 'true') {
                    cleanedFormData.append(fieldName, "");
                }
                return;
            }

            if (value instanceof File) {
                if (value.size > 0) {
                    cleanedFormData.append(key, value);
                }
                // If file size is 0, we don't append it to avoid 400 errors
                return;
            }

            // For non-file fields, we append them normally
            // But we avoid sending empty strings for image/photo names if not clearing
            const isImageField = key.endsWith('_image') || key.endsWith('_photo');
            if (isImageField && value === "") return;

            cleanedFormData.append(key, value);
        });

        updateMutation.mutate(cleanedFormData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
            </div>
        );
    }

    const SectionConfig = [
        { id: "organization", label: t('admin_org_block', "Section Organisation"), titleKey: `organization_title_${activeLang}`, descKey: `organization_text_${activeLang}`, tab: "mission" },
        { id: "vision", label: t('admin_vision_block', "Section Vision"), badgeKey: `vision_badge_${activeLang}`, titleKey: `vision_title_${activeLang}`, descKey: `vision_description_${activeLang}`, imgKey: "vision_image", imgDisplayKey: "vision_image_display", tab: "mission" },
        { id: "mission", label: t('admin_mission_block', "Section Mission"), badgeKey: `mission_badge_${activeLang}`, titleKey: `mission_title_${activeLang}`, descKey: `mission_description_${activeLang}`, imgKey: "mission_image", imgDisplayKey: "mission_image_display", tab: "mission" },
        { id: "values", label: t('admin_values_block', "Introduction Valeurs"), badgeKey: `values_badge_${activeLang}`, titleKey: `values_title_${activeLang}`, descKey: `values_description_${activeLang}`, imgKey: "values_image", imgDisplayKey: "values_image_display", tab: "mission" },
        { id: "team", label: t('admin_team_block', "Introduction Équipe"), badgeKey: `team_badge_${activeLang}`, titleKey: `team_title_${activeLang}`, descKey: `team_description_${activeLang}`, tab: "team" },
        { id: "bishop", label: t('admin_bishop_block', "Titre de l'Évêque"), titleKey: `bishop_title_${activeLang}`, tab: "team" },
        // { id: "navigation", label: t('admin_nav_block', "Hero & Navigation"), titleKey: `hero_title_${activeLang}`, descKey: `hero_subtitle_${activeLang}`, badgeKey: `nav_history_${activeLang}`, tab: "all" },
        // { id: "nav_details", label: t('admin_nav_details', "Détails Menu Collant"), titleKey: `nav_bishop_${activeLang}`, badgeKey: `nav_vision_${activeLang}`, descKey: `nav_team_${activeLang}`, tab: "all" },
    ].filter(s => !filter || filter === "all" || s.tab === filter);

    return (
        <form onSubmit={handleSubmit} className="space-y-8 mb-12">
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900">{t('admin_editorial_title', "Contenus Éditoriaux")}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t('admin_editorial_tip', "Gérez les textes et images des blocs principaux : Vision, Mission, Valeurs et Équipe.")}</p>
                </div>
                <Button 
                    type="submit" 
                    id="btn-save-vision-intro"
                    name="save_vision_intro"
                    disabled={updateMutation.isPending}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-2 rounded-xl h-12 px-8"
                >
                    {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {t('admin_save_all', "Enregistrer tout")}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {SectionConfig.map((section) => (
                    <div key={section.id} className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <h4 className="text-lg font-bold text-violet-600 flex items-center gap-2">
                                    <div className="w-2 h-8 bg-violet-600 rounded-full"></div>
                                    {section.label}
                                </h4>
                                
                                {section.badgeKey && (
                                    <div className="space-y-2">
                                        <label htmlFor={section.badgeKey} className="text-sm font-bold text-slate-700">{t('admin_label_badge', "Petit Badge / Label")} ({activeLang})</label>
                                        <Input
                                            id={section.badgeKey}
                                            name={section.badgeKey}
                                            key={section.badgeKey}
                                            defaultValue={presentation?.[0]?.[section.badgeKey] || ""}
                                            className="rounded-xl h-11 bg-slate-50 border-slate-200"
                                            placeholder="Ex: LEADERSHIP"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor={section.titleKey} className="text-sm font-bold text-slate-700">{t('admin_label_title', "Titre")} ({activeLang})</label>
                                    <Input
                                        id={section.titleKey}
                                        name={section.titleKey}
                                        key={section.titleKey}
                                        defaultValue={presentation?.[0]?.[section.titleKey] || ""}
                                        className="rounded-xl h-11 bg-slate-50 border-slate-200"
                                    />
                                </div>

                                {section.descKey && (
                                    <div className="space-y-2">
                                        <label htmlFor={section.descKey} className="text-sm font-bold text-slate-700">{t('admin_label_description', "Description / Texte")} ({activeLang})</label>
                                        <Textarea
                                            id={section.descKey}
                                            name={section.descKey}
                                            key={section.descKey}
                                            defaultValue={presentation?.[0]?.[section.descKey] || ""}
                                            rows={section.id === 'team' ? 4 : 8}
                                            className="w-full rounded-xl bg-slate-50 border-slate-200 whitespace-pre-wrap"
                                            placeholder={t('admin_desc_placeholder', "Saisissez votre texte ici... Utilisez des retours à la ligne pour aérer.")}
                                        />
                                    </div>
                                )}
                            </div>

                            {section.imgKey && (
                                <div className="w-full lg:w-72 space-y-2">
                                    <label htmlFor={section.imgKey} className="text-sm font-bold text-slate-700">{t('admin_label_image', "Image d'illustration")}</label>
                                    <ImageFieldWithPreview
                                        fieldName={section.imgKey}
                                        currentImageUrl={presentation?.[0]?.[section.imgDisplayKey]}
                                        label={section.label}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hidden fields for other language to prevent data loss during tab switching */}
            {["fr", "en"].filter(l => l !== activeLang).map(otherLang => (
                <div key={otherLang} className="hidden">
                    {SectionConfig.map(section => {
                        const sBadgeKey = section.badgeKey?.replace(`_${activeLang}`, `_${otherLang}`);
                        const sTitleKey = section.titleKey?.replace(`_${activeLang}`, `_${otherLang}`);
                        const sDescKey = section.descKey?.replace(`_${activeLang}`, `_${otherLang}`);
                        
                        return (
                            <React.Fragment key={section.id}>
                                {sBadgeKey && <Input name={sBadgeKey} defaultValue={presentation?.[0]?.[sBadgeKey] || ""} />}
                                {sTitleKey && <Input name={sTitleKey} defaultValue={presentation?.[0]?.[sTitleKey] || ""} />}
                                {sDescKey && <Textarea name={sDescKey} defaultValue={presentation?.[0]?.[sDescKey] || ""} />}
                            </React.Fragment>
                        );
                    })}
                </div>
            ))}
        </form>
    );
};

export default VisionIntroManager;
