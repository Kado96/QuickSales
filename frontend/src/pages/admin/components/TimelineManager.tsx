import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, Loader2, Check, History, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import ImageFieldWithPreview from "./ImageFieldWithPreview";
import { Card, CardContent } from "@/components/ui/card";

const ItemCard = ({ title, subtitle, content, icon, image, onEdit, onDelete }: any) => (
    <Card className="group rounded-3xl border-slate-200/60 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-violet-200/20 transition-all duration-300 overflow-hidden bg-white">
        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
            {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 opacity-20">
                    <Library className="h-10 w-10" />
                </div>
            )}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    type="button" 
                    id={`btn-edit-timeline-${title}`}
                    name={`edit_timeline_${title}`}
                    variant="secondary" 
                    size="icon" 
                    onClick={onEdit} 
                    className="h-9 w-9 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-violet-600 rounded-full shadow-lg border border-white/50"
                >
                    <Edit className="h-4.5 w-4.5" />
                </Button>
                <Button 
                    type="button" 
                    id={`btn-delete-timeline-${title}`}
                    name={`delete_timeline_${title}`}
                    variant="secondary" 
                    size="icon" 
                    onClick={onDelete} 
                    className="h-9 w-9 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 rounded-full shadow-lg border border-white/50"
                >
                    <Trash2 className="h-4.5 w-4.5" />
                </Button>
            </div>
        </div>
        <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
                {icon && <div className="text-violet-500 font-bold">{icon}</div>}
                <h3 className="font-heading font-bold text-slate-900 leading-tight line-clamp-1">{title}</h3>
            </div>
            {subtitle && <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-2 px-2 py-0.5 bg-violet-50 rounded-full inline-block">{subtitle}</p>}
            <p className="text-xs font-medium text-slate-500 line-clamp-2 font-body leading-relaxed">{content}</p>
        </CardContent>
    </Card>
);

const TimelineManager = ({ activeLang }: { activeLang: string }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const { data: timeline, isLoading } = useQuery({
        queryKey: ["admin-timeline", activeLang],
        queryFn: async () => {
            const res = await api.get(`/api/pages/timeline/?lang=${activeLang}`);
            return res.data.results || res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/pages/timeline/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
            queryClient.invalidateQueries({ queryKey: ["timeline"] });
            toast.success(t('admin_delete_success', "Événement supprimé avec succès"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
    });

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: FormData, id?: number }) => {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (id) {
                await api.patch(`/api/pages/timeline/${id}/`, data, config);
            } else {
                await api.post(`/api/pages/timeline/`, data, config);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-timeline"] });
            queryClient.invalidateQueries({ queryKey: ["timeline"] });
            toast.success(t('admin_save_success', "Enregistré avec succès"));
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
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
            } else {
                if (value === "null" || value === "undefined") return;
                cleanedFormData.append(key, value);
            }
        });

        // Always append the current active language if language is not set
        if (!cleanedFormData.has('language')) {
            cleanedFormData.append('language', activeLang);
        }

        saveMutation.mutate({
            data: cleanedFormData,
            id: editingItem?.id
        });
    };

    const timelineItems = Array.isArray(timeline) ? timeline : (timeline?.results || []);

    return (
        <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex justify-end mb-4">

                <Dialog open={isAddDialogOpen || !!editingItem} onOpenChange={(open) => {
                    if (!open) {
                        setIsAddDialogOpen(false);
                        setEditingItem(null);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button 
                            id="btn-add-timeline-event"
                            name="add_timeline_event"
                            // Using type="button" to prevent it from submitting the external Presentation form
                            type="button" 
                            onClick={() => setIsAddDialogOpen(true)} 
                            className="bg-violet-100 hover:bg-violet-200 text-violet-700 gap-2 h-10 px-4 rounded-xl font-bold transition-all"
                        >
                            <Plus className="h-4 w-4" /> {t('admin_add_item', "Ajouter")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl border-white/20 bg-white/90 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                                   onInteractOutside={(e) => {
                                       // Only close if we are not loading. Prevent accidental closes if form got complex
                                       if (saveMutation.isPending) e.preventDefault();
                                   }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-heading font-bold text-slate-900">
                                {editingItem ? t('admin_edit_item', "Modifier l'événement") : t('admin_new_item', "Ajouter un événement")}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                {t('admin_fill_info', "Remplissez les informations de cette date clé.")}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <label htmlFor="diocese-year" className="text-sm font-bold text-slate-700">{t('admin_history_year', 'Année / Période')} <span className="text-slate-400 font-normal">(Optionnel)</span></label>
                                <Input id="diocese-year" name="year" defaultValue={editingItem?.year} placeholder={t('admin_history_year_placeholder', "Ex: 1935 ou 1935-1940")} className="rounded-xl h-11 shadow-sm border-slate-200" />
                            </div>

                            {/* Section Français */}
                            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">🇫🇷 {t('lang_fr', 'FRANÇAIS')}</span>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="title_fr" className="text-xs font-bold text-slate-600">{t('admin_title_label', 'Titre')}</label>
                                    <Input id="title_fr" name="title_fr" defaultValue={editingItem?.title_fr || editingItem?.title} placeholder="Titre en français..." className="rounded-xl h-10 bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="description_fr" className="text-xs font-bold text-slate-600">{t('admin_desc_label', 'Description')}</label>
                                    <Textarea id="description_fr" name="description_fr" defaultValue={editingItem?.description_fr || editingItem?.description} required placeholder="Description en français..." className="rounded-xl min-h-[80px] bg-white text-sm" />
                                </div>
                            </div>

                            {/* Section Anglais */}
                            <div className="space-y-4 p-4 bg-violet-50/50 rounded-2xl border border-violet-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-violet-200 shadow-sm text-violet-600">🇬🇧 {t('lang_en', 'ENGLISH')}</span>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="title_en" className="text-xs font-bold text-slate-600">{t('admin_title_label_en', 'Title (EN)')}</label>
                                    <Input id="title_en" name="title_en" defaultValue={editingItem?.title_en} placeholder="English title..." className="rounded-xl h-10 bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="description_en" className="text-xs font-bold text-slate-600">{t('admin_desc_label_en', 'Description (EN)')}</label>
                                    <Textarea id="description_en" name="description_en" defaultValue={editingItem?.description_en} placeholder="English description..." className="rounded-xl min-h-[80px] bg-white text-sm" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="diocese-timeline-order" className="text-sm font-bold text-slate-700">{t('admin_order_label', 'Ordre')}</label>
                                <Input id="diocese-timeline-order" name="order" type="number" defaultValue={editingItem?.order || 0} className="rounded-xl h-11 shadow-sm border-slate-200" />
                            </div>
                            <ImageFieldWithPreview
                                fieldName="image"
                                label={t('admin_photo_label', 'Photo / Image (Optionnel)')}
                                currentImageUrl={editingItem?.image_display}
                                aspectRatio="video"
                            />

                            <DialogFooter className="sticky bottom-0 pt-4 bg-white/80 backdrop-blur-sm">
                                <Button 
                                    type="submit" 
                                    id="btn-save-timeline-event"
                                    name="save_timeline_event"
                                    disabled={saveMutation.isPending} 
                                    className="w-full bg-violet-600 hover:bg-violet-700 h-12 rounded-xl text-white font-bold text-lg"
                                >
                                    {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
                                    {editingItem ? t('admin_save_changes', "Enregistrer") : t('admin_confirm_add', "Ajouter")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
                </div>
            ) : timelineItems.length === 0 ? (
                <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <History className="h-12 w-12 text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">Aucun événement n'est encore enregistré pour cette langue.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {timelineItems.map((item: any) => (
                        <ItemCard 
                            key={item.id} 
                            title={item.year && item.year.trim() !== "" ? item.year : (item.title || "Événement sans date")} 
                            subtitle={item.year && item.year.trim() !== "" ? item.title : ""} 
                            content={item.description} 
                            image={item.image_display} 
                            onEdit={() => { setEditingItem(item); setIsAddDialogOpen(true); }} 
                            onDelete={() => deleteMutation.mutate(item.id)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimelineManager;
