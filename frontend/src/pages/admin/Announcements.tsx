import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Megaphone,
    CheckCircle,
    XCircle,
    Loader2,
    Calendar,
    Bell,
    Image as ImageIcon,
    PlusCircle
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";

const AdminAnnouncements = () => {
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Fetch sans filtre de langue pour l'admin (pour voir tous les articles bilingues)
    const { data: announcements, isLoading } = useQuery({
        queryKey: ["admin-announcements"],
        queryFn: async () => {
            const response = await api.get(`/api/announcements/admin/`);
            return response.data.results || response.data;
        }
    });

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: FormData, id?: number }) => {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
            if (id) {
                await api.patch(`/api/announcements/admin/${id}/`, data, config);
            } else {
                await api.post("/api/announcements/admin/", data, config);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            toast.success(t('admin_save_success', "Opération réussie"));
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
    });

    const removeImageMutation = useMutation({
        mutationFn: async ({ announcementId, imageId }: { announcementId: number; imageId: number }) => {
            await api.post(`/api/announcements/admin/${announcementId}/remove-image/`, { image_id: imageId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            toast.success(t('admin_photo_removed', "Photo supprimée de la galerie"));
        },
        onError: () => toast.error(t('admin_photo_remove_error', "Erreur lors de la suppression de la photo"))
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/announcements/admin/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            toast.success(t('admin_delete_success', "Annonce supprimée"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
            await api.patch(`/api/announcements/admin/${id}/`, { is_active });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            toast.success(t('admin_save_success', "Statut mis à jour"));
        },
        onError: () => {
            toast.error(t('admin_save_error', "Erreur de mise à jour"));
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const cleanedFormData = new FormData();
        formData.forEach((value, key) => {
            if (value instanceof File && (value as File).size === 0) return;
            if (value === "" && !key.includes('title') && !key.includes('content')) return;
            cleanedFormData.append(key, value);
        });

        saveMutation.mutate({ data: cleanedFormData, id: editingItem?.id });
    };

    const filteredItems = (Array.isArray(announcements) ? announcements : (announcements?.results || [])).filter((item: any) =>
        item.title_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content_fr?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_news_title', "Actualités & Annonces")} <Megaphone className="h-8 w-8 text-orange-500" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-1">{t('admin_news_subtitle', "Gérez les communications officielles et les témoignages du diocèse.")}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Dialog open={isAddDialogOpen || !!editingItem} onOpenChange={(open) => {
                            if (!open) {
                                setIsAddDialogOpen(false);
                                setEditingItem(null);
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button 
                                    id="btn-add-announcement"
                                    name="add_announcement"
                                    onClick={() => setIsAddDialogOpen(true)} 
                                    className="bg-orange-500 hover:bg-orange-600 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-none"
                                >
                                    <Plus className="h-5 w-5" /> {t('admin_add_item', "Ajouter")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px] rounded-3xl bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <DialogHeader className="mb-6">
                                    <DialogTitle className="text-2xl font-heading font-bold text-slate-900">
                                        {editingItem ? t('admin_edit_item', "Modifier l'annonce") : t('admin_new_item', "Ajouter une annonce")}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        {t('admin_fill_info_bilingual', "Saisissez les informations en français et en anglais.")}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-8 pt-4 pb-8">
                                    {/* Langue Française */}
                                    <div className="space-y-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Badge variant="outline" className="bg-white text-slate-700 font-bold px-3 py-1">🇫🇷 {t('lang_fr', 'FRANÇAIS')}</Badge>
                                        <div className="space-y-2">
                                            <label htmlFor="title_fr" className="text-sm font-bold text-slate-700">{t('admin_title_label', 'Titre')}</label>
                                            <Input id="title_fr" name="title_fr" defaultValue={editingItem?.title_fr || editingItem?.title} required placeholder="Titre en français..." className="rounded-xl h-12 border-slate-200 focus:ring-orange-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="content_fr" className="text-sm font-bold text-slate-700">{t('admin_content_label', 'Contenu')}</label>
                                            <Textarea id="content_fr" name="content_fr" defaultValue={editingItem?.content_fr || editingItem?.content} required placeholder="Contenu en français..." className="rounded-xl min-h-[150px] border-slate-200 focus:ring-orange-500 p-4 leading-relaxed font-body" />
                                        </div>
                                    </div>

                                    {/* Langue Anglaise */}
                                    <div className="space-y-5 p-6 bg-orange-50/30 rounded-2xl border border-orange-100">
                                        <Badge variant="outline" className="bg-white text-orange-700 font-bold px-3 py-1">🇬🇧 {t('lang_en', 'ENGLISH')}</Badge>
                                        <div className="space-y-2">
                                            <label htmlFor="title_en" className="text-sm font-bold text-slate-700">{t('admin_title_label_en', 'Title (EN)')}</label>
                                            <Input id="title_en" name="title_en" defaultValue={editingItem?.title_en} placeholder="English title..." className="rounded-xl h-12 border-slate-200 focus:ring-orange-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="content_en" className="text-sm font-bold text-slate-700">{t('admin_content_label_en', 'Content (EN)')}</label>
                                            <Textarea id="content_en" name="content_en" defaultValue={editingItem?.content_en} placeholder="English content..." className="rounded-xl min-h-[150px] border-slate-200 focus:ring-orange-500 p-4 leading-relaxed font-body" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="category" className="text-sm font-bold text-slate-700">{t('admin_category_label', 'Catégorie')}</label>
                                            <select id="category" name="category" defaultValue={editingItem?.category || "nouvelles"} className="flex h-12 w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm focus:ring-orange-500">
                                                <option value="temoignages">{t('cat_temoignages', 'Témoignages')}</option>
                                                <option value="evenements">{t('cat_evenements', 'Événements')}</option>
                                                <option value="nouvelles">{t('cat_nouvelles', 'Nouvelles')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="event_date" className="text-sm font-bold text-slate-700">{t('admin_date_label', 'Date de l\'événement')}</label>
                                            <Input id="event_date" name="event_date" type="date" defaultValue={editingItem?.event_date} className="rounded-xl h-12 border-slate-200 focus:ring-orange-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-orange-500" /> {t('admin_cover_image_label', 'Image à la Une (Couverture)')}
                                        </h4>
                                        <div className="flex flex-col gap-4">
                                            {editingItem?.image_display && (
                                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                                    <img src={editingItem.image_display} alt={t('admin_current_cover', "Couverture actuelle")} className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                            <Input id="image" name="image" type="file" accept="image/*" className="rounded-xl h-11 border-dashed border-2 hover:border-orange-300 transition-colors" />
                                        </div>
                                    </div>

                                    {/* 🖼️ Gestion de la Galerie (Multi-upload) */}
                                    <div className="space-y-4 p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <PlusCircle className="h-4 w-4 text-indigo-500" /> {t('admin_gallery_label', 'Galerie d\'images (Plusieurs photos)')}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{editingItem?.gallery?.length || 0} {t('admin_photos_count', 'photos')}</span>
                                        </div>

                                        {editingItem?.gallery && editingItem.gallery.length > 0 && (
                                            <div className="grid grid-cols-4 gap-3 mb-4">
                                                {editingItem.gallery.map((img: any) => (
                                                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => { if (window.confirm(t('admin_confirm_photo_delete', "Supprimer cette photo ?"))) removeImageMutation.mutate({ announcementId: editingItem.id, imageId: img.id }); }}
                                                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-5 w-5 text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="space-y-2">
                                            <label htmlFor="gallery_images" className="text-xs font-bold text-slate-500">{t('admin_add_more_photos', 'Ajouter des photos à la galerie')}</label>
                                            <Input id="gallery_images" name="gallery_images" type="file" accept="image/*" multiple className="rounded-xl h-11 border-dashed border-2 hover:border-indigo-300 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-orange-900">{t('admin_visibility_label', 'Visibilité')}</p>
                                            <p className="text-xs text-orange-700/70">{t('admin_visibility_tip', "L'article sera visible dès la publication.")}</p>
                                        </div>
                                        <label htmlFor="is_active" className="relative inline-flex items-center cursor-pointer ml-auto">
                                            <input id="is_active" type="checkbox" name="is_active" defaultChecked={editingItem?.is_active ?? true} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                        </label>
                                    </div>

                                    <div className="sticky bottom-4 bg-white/90 backdrop-blur-sm p-4 rounded-3xl border border-slate-100 shadow-2xl z-50 mt-10">
                                        <Button 
                                            type="submit" 
                                            id="btn-publish-announcement"
                                            name="publish_announcement"
                                            disabled={saveMutation.isPending} 
                                            className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-[1.25rem] text-white font-bold text-lg shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98]"
                                        >
                                            {saveMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle className="h-6 w-6 mr-3" />}
                                            {editingItem ? t('admin_update_article', "Mettre à jour l'article") : t('admin_publish_article', "Publier l'article maintenant")}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <CardTitle className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                                <Megaphone className="h-5 w-5 text-orange-500" /> {t('admin_news_list', "Liste des Annonces")}
                            </CardTitle>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="search-announcements"
                                    name="search_announcements"
                                    placeholder={t('admin_search_placeholder', "Rechercher une annonce...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                            {isLoading ? (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                                    <p className="text-slate-400 font-medium">{t('admin_loading_content', "Chargement des annonces...")}</p>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                    <Bell className="h-8 w-8 text-slate-300" />
                                    <p className="text-slate-500 font-bold text-lg">{t('admin_no_announcement', "Aucune annonce trouvée")}</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {filteredItems.map((item: any) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group relative bg-white rounded-[2.5rem] border border-slate-200/60 shadow-lg hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden flex flex-col"
                                        >
                                            {/* Action Buttons Overlay */}
                                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    id={`btn-edit-announcement-${item.id}`}
                                                    name={`edit_announcement_${item.id}`}
                                                    onClick={() => setEditingItem(item)}
                                                    className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-600 hover:text-orange-600 hover:bg-white"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    id={`btn-delete-announcement-${item.id}`}
                                                    name={`delete_announcement_${item.id}`}
                                                    onClick={() => { if (window.confirm(t('admin_confirm_delete_article', "Supprimer cet article ?"))) deleteMutation.mutate(item.id); }}
                                                    className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-400 hover:text-red-600 hover:bg-white"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Image Section */}
                                            <div className="relative aspect-video overflow-hidden bg-slate-100">
                                                {item.image_display ? (
                                                    <img src={item.image_display} alt={item.title_fr} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-orange-200">
                                                        <Megaphone className="h-12 w-12" />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-4 left-4 flex gap-2">
                                                    <Badge className="bg-orange-500/90 backdrop-blur-md text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                                        {item.category_display || item.category}
                                                    </Badge>
                                                    <div className="flex gap-1 overflow-hidden rounded-full border border-white/20">
                                                        {item.title_fr && <div className="h-5 w-5 flex items-center justify-center text-[10px] bg-white text-slate-800 font-bold border-r border-slate-200">FR</div>}
                                                        {item.title_en && <div className="h-5 w-5 flex items-center justify-center text-[10px] bg-orange-100 text-orange-800 font-bold">EN</div>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-8 flex-grow flex flex-col">
                                                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    <div className="ml-auto flex items-center gap-1.5">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                        <span className={item.is_active ? 'text-emerald-600' : 'text-slate-400'}>
                                                            {item.is_active ? t('admin_status_visible', 'Visible') : t('admin_status_hidden', 'Masqué')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-heading font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                                                    {item.title_fr || item.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 leading-relaxed font-body line-clamp-2 mb-4">
                                                    {item.content_fr || item.content}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex -space-x-1.5">
                                                        {item.gallery?.map((img: any, i: number) => i < 3 && (
                                                            <div key={img.id} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                                                <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                        ))}
                                                        {item.gallery?.length > 3 && (
                                                            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 shadow-sm">
                                                                +{item.gallery.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleStatusMutation.mutate({ id: item.id, is_active: !item.is_active })}
                                                        className={`h-7 px-3 text-[9px] font-bold uppercase tracking-widest rounded-full ${item.is_active ? 'text-slate-400 hover:text-orange-600 hover:bg-slate-50' : 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'}`}
                                                    >
                                                        {item.is_active ? t('admin_deactivate', 'Désactiver') : t('admin_activate', 'Activer')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminAnnouncements;
