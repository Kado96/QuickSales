import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import ImageFieldWithPreview from "./ImageFieldWithPreview";

const MinistryIntroManager = ({ activeLang }: { activeLang: string }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data: pageData, isLoading } = useQuery({
        queryKey: ["admin-ministry-page"],
        queryFn: async () => {
            const response = await api.get("/api/ministries/page/current/");
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const updateMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.patch("/api/ministries/page/current/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-ministry-page"] });
            queryClient.invalidateQueries({ queryKey: ["ministry-page"] });
            toast.success(t('admin_save_success', "En-tête mis à jour avec succès"));
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const cleanedFormData = new FormData();
        
        formData.forEach((value, key) => {
            if (value === "null" || value === "undefined") return;

            if (value instanceof File) {
                if (value.size > 0) {
                    cleanedFormData.append(key, value);
                }
                return;
            }

            // Avoid sending empty strings for image fields
            const isImageField = key.endsWith('_image') || key.endsWith('_photo');
            if (isImageField && value === "") return;

            cleanedFormData.append(key, value);
        });
        
        updateMutation.mutate(cleanedFormData);
    };

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mb-12 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden relative group">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="h-10 w-1.5 bg-blue-600 rounded-full"></div>
                             <div>
                                <h3 className="text-xl font-heading font-bold text-slate-900 leading-tight">
                                    {t('admin_ministries_intro_title', 'En-tête & Grande Photo')}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium font-body">{t('admin_ministries_intro_desc', 'Gérez l\'image de fond et les textes du Hero.')}</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor={`hero_badge_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">Badge Hero ({activeLang})</label>
                                <Input 
                                    id={`hero_badge_${activeLang}`}
                                    name={`hero_badge_${activeLang}`} 
                                    key={`hero_badge_${activeLang}`}
                                    defaultValue={pageData?.[`hero_badge_${activeLang}`]} 
                                    placeholder="Ex: NOS ACTIONS"
                                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`hero_title_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">Titre Hero ({activeLang})</label>
                                <Input 
                                    id={`hero_title_${activeLang}`}
                                    name={`hero_title_${activeLang}`} 
                                    key={`hero_title_${activeLang}`}
                                    defaultValue={pageData?.[`hero_title_${activeLang}`]} 
                                    placeholder="Ex: Ministères"
                                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor={`hero_description_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">Description Hero ({activeLang})</label>
                            <Textarea 
                                id={`hero_description_${activeLang}`}
                                name={`hero_description_${activeLang}`} 
                                key={`hero_description_${activeLang}`}
                                defaultValue={pageData?.[`hero_description_${activeLang}`]} 
                                rows={3}
                                placeholder="Description courte..."
                                className="rounded-xl bg-slate-50/50 border-slate-200"
                            />
                        </div>

                        {/* Hidden fields for other language to prevent data loss during tab switching */}
                        {['fr', 'en'].filter(l => l !== activeLang).map(l => (
                            <div key={l} className="hidden">
                                <Input name={`hero_badge_${l}`} defaultValue={pageData?.[`hero_badge_${l}`] || ""} />
                                <Input name={`hero_title_${l}`} defaultValue={pageData?.[`hero_title_${l}`] || ""} />
                                <Textarea name={`hero_description_${l}`} defaultValue={pageData?.[`hero_description_${l}`] || ""} />
                            </div>
                        ))}

                        <div className="flex justify-end pt-2">
                            <Button 
                                type="submit" 
                                disabled={updateMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl h-12 px-8 shadow-lg shadow-blue-200/50 transition-all active:scale-95"
                            >
                                {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t('admin_save_intro', 'Mettre à jour l\'en-tête')}
                            </Button>
                        </div>
                    </div>

                    <div className="w-full lg:w-72">
                        <label htmlFor="hero_image" className="text-sm font-bold text-slate-700 mb-3 block cursor-pointer">Grande Photo (Hero)</label>
                        <ImageFieldWithPreview
                            fieldName="hero_image"
                            currentImageUrl={pageData?.hero_image_display}
                            label="Photo Hero Ministères"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default MinistryIntroManager;
