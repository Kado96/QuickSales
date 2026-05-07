import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2, Check, Layout, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import ImageFieldWithPreview from "./ImageFieldWithPreview";

const ParoissesPresentationTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [activeLang, setActiveLang] = useState("fr");

    const langs = [
        { code: "fr", label: "🇫🇷 Français" },
        { code: "en", label: "🇬🇧 English" },
    ];

    const { data: presentationList, isLoading } = useQuery({
        queryKey: ["admin-paroisses-presentation"],
        queryFn: async () => {
            const res = await api.get(`/api/pages/paroisses-presentation/current/`);
            return res.data;
        }
    });

    const presentation = presentationList?.[0];

    const saveMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            await api.patch(`/api/pages/paroisses-presentation/current/`, data, config);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-paroisses-presentation"] });
            queryClient.invalidateQueries({ queryKey: ["paroisses-presentation"] });
            toast.success(t('admin_save_success', "Présentation mise à jour avec succès"));
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
    });

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
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

            // Avoid sending empty strings for image fields
            const isImageField = key.endsWith('_image') || key.endsWith('_photo');
            if (isImageField && value === "") return;

            cleanedFormData.append(key, value);
        });

        saveMutation.mutate(cleanedFormData);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-slate-500 font-medium">{t('admin_loading', 'Chargement...')}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Section Image Hero */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <CardTitle className="text-lg font-heading font-bold flex items-center gap-2">
                                <Layout className="h-5 w-5 text-emerald-500" /> {t('admin_hero_section', "Section Hero (Entête)")}
                            </CardTitle>
                            <CardDescription>{t('admin_hero_desc_long', "L'immense photo qui s'affiche tout en haut de la page Paroisses.")}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <label htmlFor="hero_image" className="sr-only">{t('admin_hero_bg_label', "Image de fond du Héro")}</label>
                            <ImageFieldWithPreview
                                fieldName="hero_image"
                                label={t('admin_hero_bg_label', "Image de fond du Héro")}
                                currentImageUrl={presentation?.hero_image_display}
                                aspectRatio="video"
                            />
                        </CardContent>
                    </Card>

                    <Button 
                        type="submit" 
                        disabled={saveMutation.isPending}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-95"
                    >
                        {saveMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <Save className="h-6 w-6 mr-2" />}
                        {t('admin_save_all', "Enregistrer les modifications")}
                    </Button>
                </div>

                {/* Section Textes (Multilingue) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-heading font-bold flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-emerald-500" /> {t('admin_content_texts', "Textes & Titres")}
                                </CardTitle>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    {langs.map(l => (
                                        <button
                                            key={l.code}
                                            type="button"
                                            onClick={() => setActiveLang(l.code)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === l.code ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor={`hero_badge_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_hero_badge', "Badge Hero")} ({activeLang})</label>
                                    <Input 
                                        id={`hero_badge_${activeLang}`}
                                        name={`hero_badge_${activeLang}`} 
                                        key={`hero_badge_${activeLang}`}
                                        defaultValue={presentation?.[`hero_badge_${activeLang}`]} 
                                        placeholder="Ex: PRÉSENCE COMMUNAUTAIRE"
                                        className="rounded-xl h-12 shadow-sm border-slate-200"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor={`hero_title_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_hero_title', "Titre Hero")} ({activeLang})</label>
                                    <Input 
                                        id={`hero_title_${activeLang}`}
                                        name={`hero_title_${activeLang}`} 
                                        key={`hero_title_${activeLang}`}
                                        defaultValue={presentation?.[`hero_title_${activeLang}`]} 
                                        placeholder="Ex: Nos Paroisses"
                                        className="rounded-xl h-12 shadow-sm border-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor={`hero_subtitle_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_hero_subtitle', "Sous-titre Hero")} ({activeLang})</label>
                                <Textarea 
                                    id={`hero_subtitle_${activeLang}`}
                                    name={`hero_subtitle_${activeLang}`} 
                                    key={`hero_subtitle_${activeLang}`}
                                    defaultValue={presentation?.[`hero_subtitle_${activeLang}`]} 
                                    placeholder="Une description engageante de vos paroisses..."
                                    className="rounded-xl min-h-[120px] shadow-sm border-slate-200 text-lg leading-relaxed"
                                />
                            </div>

                            {/* Hidden fields for other language to prevent data loss if the backend isn't handling partial updates correctly for all fields */}
                            {langs.filter(l => l.code !== activeLang).map(l => (
                                <div key={l.code} className="hidden">
                                    <Input name={`hero_badge_${l.code}`} defaultValue={presentation?.[`hero_badge_${l.code}`]} />
                                    <Input name={`hero_title_${l.code}`} defaultValue={presentation?.[`hero_title_${l.code}`]} />
                                    <Textarea name={`hero_subtitle_${l.code}`} defaultValue={presentation?.[`hero_subtitle_${l.code}`]} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
};

export default ParoissesPresentationTab;
