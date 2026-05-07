import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Radio,
    Play,
    CheckCircle,
    XCircle,
    Loader2
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";

const AdminSermons = () => {
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const { data: categories } = useQuery({
        queryKey: ["admin-sermon-categories"],
        queryFn: async () => {
            const response = await api.get("/api/sermons/categories/");
            return response.data.results || response.data;
        }
    });

    const { data: sermons, isLoading } = useQuery({
        queryKey: ["admin-sermons"],
        queryFn: async () => {
            const response = await api.get("/api/sermons/admin/");
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
                await api.patch(`/api/sermons/admin/${id}/`, data, config);
            } else {
                await api.post("/api/sermons/admin/", data, config);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-sermons"] });
            queryClient.invalidateQueries({ queryKey: ["sermons"] });
            toast.success(t('admin_save_success', "Ressource enregistrée !"));
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
        onError: () => toast.error(t('admin_save_error', "Erreur d'enregistrement"))
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/sermons/admin/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-sermons"] });
            queryClient.invalidateQueries({ queryKey: ["sermons"] });
            toast.success(t('admin_delete_success', "Ressource supprimée"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const cleanedFormData = new FormData();
        formData.forEach((value, key) => {
            if (value instanceof File && value.size === 0) return;
            if (value === "" || value === "null" || value === "undefined") return;
            cleanedFormData.append(key, value);
        });
        saveMutation.mutate({ data: cleanedFormData, id: editingItem?.id });
    };

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
            await api.patch(`/api/sermons/admin/${id}/`, { is_active });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-sermons"] });
            toast.success(t('admin_save_success', "Statut mis à jour"));
        },
        onError: () => {
            toast.error(t('admin_save_error', "Erreur lors de la mise à jour du statut"));
        }
    });

    const filteredSermons = (Array.isArray(sermons) ? sermons : []).filter((sermon: any) =>
        sermon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.preacher_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_resources_title', "Gestion des Ressources")} <Play className="h-8 w-8 text-indigo-500" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-1">{t('admin_resources_subtitle', "Gérez les sermons audio, vidéo et les documents d'étude.")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dialog open={isAddDialogOpen || !!editingItem} onOpenChange={(open) => {
                            if (!open) {
                                setIsAddDialogOpen(false);
                                setEditingItem(null);
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingItem(null); setIsAddDialogOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                                    <Plus className="h-5 w-5" /> {t('admin_add_item', "Ajouter")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] rounded-3xl bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-heading font-bold text-slate-900">
                                        {editingItem ? t('admin_edit_item', "Modifier la Ressource") : t('admin_new_item', "Nouvelle Ressource")}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        {t('admin_fill_info', "Remplissez les informations ci-dessous pour publier ce contenu.")}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 pt-4">
                                    <div className="space-y-2 col-span-2">
                                        <label htmlFor="sermon-title" className="text-sm font-bold text-slate-700">{t('admin_title_label', 'Titre')}</label>
                                        <Input id="sermon-title" name="title" defaultValue={editingItem?.title} required placeholder={t('admin_title_placeholder', "Ex: Le Pardon de Dieu")} className="rounded-xl h-11" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label htmlFor="sermon-preacher" className="text-sm font-bold text-slate-700">{t('sermons_preacher_label', 'Prédicateur')}</label>
                                        <Input id="sermon-preacher" name="preacher_name" defaultValue={editingItem?.preacher_name} required placeholder={t('admin_pastor_name_placeholder', "Ex: Rév. Jean Dupont")} className="rounded-xl h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="sermon-category" className="text-sm font-bold text-slate-700">{t('admin_category_label', 'Catégorie')}</label>
                                        <select id="sermon-category" name="category" defaultValue={editingItem?.category} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                                            <option value="">{t('admin_select_placeholder', 'Sélectionner...')}</option>
                                            {(Array.isArray(categories) ? categories : (categories?.results || [])).map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="sermon-lang" className="text-sm font-bold text-slate-700">{t('admin_lang_label', 'Langue')}</label>
                                        <select id="sermon-lang" name="language" defaultValue={editingItem?.language || "fr"} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                                            <option value="fr">{t('lang_fr', 'Français')}</option>
                                            <option value="en">{t('lang_en', 'Anglais')}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="sermon-type" className="text-sm font-bold text-slate-700">{t('admin_content_type_label', 'Type de contenu')}</label>
                                        <select id="sermon-type" name="content_type" defaultValue={editingItem?.content_type || "video"} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                                            <option value="video">{t('type_video', 'Vidéo')}</option>
                                            <option value="audio">{t('type_audio', 'Audio')}</option>
                                            <option value="youtube">{t('type_youtube', 'YouTube')}</option>
                                            <option value="document">{t('type_document', 'Document')}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="sermon-date" className="text-sm font-bold text-slate-700">{t('admin_date_label', 'Date')}</label>
                                        <Input id="sermon-date" name="sermon_date" type="date" defaultValue={editingItem?.sermon_date} className="rounded-xl h-11" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label htmlFor="sermon-desc" className="text-sm font-bold text-slate-700">{t('admin_desc_label', 'Description')}</label>
                                        <Textarea id="sermon-desc" name="description" defaultValue={editingItem?.description} required placeholder={t('admin_desc_placeholder', "Résumé ...")} className="rounded-xl min-h-[80px]" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label htmlFor="sermon-video-url" className="text-sm font-bold text-slate-700">{t('admin_media_link_label', 'Lien Média (YouTube / MP3)')}</label>
                                        <Input id="sermon-video-url" name="video_url" defaultValue={editingItem?.video_url} placeholder={t('admin_media_link_placeholder', "Ex: https://youtube.com/...")} className="rounded-xl h-11" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 border-t pt-4 mt-2">
                                        <div className="space-y-2">
                                            <label htmlFor="sermon-video-file" className="text-xs font-bold text-slate-500">{t('admin_upload_video_label', 'Ou Télécharger Vidéo')}</label>
                                            <Input id="sermon-video-file" name="video_file" type="file" accept="video/*" className="rounded-xl h-10 text-xs" />
                                            {editingItem?.video_file && <p className="text-[10px] text-slate-400 truncate">{t('admin_current_file', 'Fichier actuel')}: {editingItem.video_file.split('/').pop()}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="sermon-audio-file" className="text-xs font-bold text-slate-500">{t('admin_upload_audio_label', 'Ou Télécharger Audio (MP3)')}</label>
                                            <Input id="sermon-audio-file" name="audio_file" type="file" accept="audio/*" className="rounded-xl h-10 text-xs" />
                                            {editingItem?.audio_file && <p className="text-[10px] text-slate-400 truncate">{t('admin_current_file', 'Fichier actuel')}: {editingItem.audio_file.split('/').pop()}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="sermon-doc-file" className="text-xs font-bold text-slate-500">{t('admin_upload_doc_label', 'Ou Télécharger Document (PDF, Word)')}</label>
                                            <Input id="sermon-doc-file" name="document_file" type="file" accept=".pdf,.doc,.docx" className="rounded-xl h-10 text-xs" />
                                            {editingItem?.document_file && <p className="text-[10px] text-slate-400 truncate">{t('admin_current_file', 'Fichier actuel')}: {editingItem.document_file.split('/').pop()}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="sermon-image" className="text-xs font-bold text-slate-500">{t('admin_thumbnail_label', "Image d'aperçu (Thumbnail)")}</label>
                                            <Input id="sermon-image" name="image" type="file" accept="image/*" className="rounded-xl h-10 text-xs" />
                                            {editingItem?.image && <p className="text-[10px] text-slate-400 truncate">{t('admin_current_file', 'Fichier actuel')}: {editingItem.image.split('/').pop()}</p>}
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={saveMutation.isPending} className="col-span-2 mt-2 bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-bold">
                                        {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                        {editingItem ? t('admin_save', "Enregistrer") : t('admin_confirm_publish', "Publier")}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <CardTitle className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                                <Eye className="h-5 w-5 text-indigo-500" /> {t('admin_resources_list', "Liste des Média")}
                            </CardTitle>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="search-sermons"
                                    name="search_sermons"
                                    placeholder={t('admin_search_placeholder', "Rechercher une ressource...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="rounded-xl gap-2 h-11 border-slate-200">
                                    <Filter className="h-4 w-4" /> {t('admin_filters', 'Filtres')}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="pl-8 py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_title_label', "Ressource")}</TableHead>
                                        <TableHead className="py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('sermons_preacher_label', "Prédicateur")}</TableHead>
                                        <TableHead className="py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px] text-center">{t('admin_lang_label', "Langue")}</TableHead>
                                        <TableHead className="py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px] text-center">{t('admin_status_label', "Statut")}</TableHead>
                                        <TableHead className="py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px] text-center">{t('admin_views_label', "Vues")}</TableHead>
                                        <TableHead className="py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px] text-center">{t('admin_date_label', "Date")}</TableHead>
                                        <TableHead className="w-20 text-right pr-8 py-4"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                                                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                                    <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement des ressources...")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredSermons.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="bg-slate-100 p-4 rounded-full">
                                                        <Radio className="h-8 w-8 text-slate-300" />
                                                    </div>
                                                    <p className="text-slate-500 font-bold text-lg">{t('admin_no_sermon', "Aucun sermon trouvé")}</p>
                                                    <p className="text-slate-400 text-sm">{t('admin_no_sermon_desc', "Commencez par ajouter votre première prédication.")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSermons.map((sermon: any) => (
                                            <TableRow key={sermon.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                            {sermon.thumbnail ? (
                                                                <img src={sermon.thumbnail} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <Play className="h-5 w-5 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-900 truncate max-w-[200px] group-hover:text-primary transition-colors">{sermon.title}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{sermon.category_name || t('admin_no_category', "Sans catégorie")}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <p className="text-sm font-semibold text-slate-700">{sermon.preacher_name}</p>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <Badge variant="outline" className="uppercase font-bold text-[10px]">
                                                        {sermon.language}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <Badge className={`rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider border-none ${sermon.is_active
                                                        ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-100"
                                                        : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                                                        }`}>
                                                        {sermon.is_active ? t('admin_status_active', "Actif") : t('admin_status_inactive', "Inactif")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <p className="text-sm font-bold text-slate-600 flex items-center justify-center gap-1.5">
                                                        <Eye className="h-3.5 w-3.5 text-slate-300" /> {sermon.views_count}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <p className="text-xs font-bold text-slate-500">
                                                        {new Date(sermon.sermon_date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="py-5 text-right px-8">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-lg">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl border-slate-100">
                                                            <DropdownMenuItem className="gap-2 py-2.5 rounded-lg font-medium cursor-pointer" onClick={() => setEditingItem(sermon)}>
                                                                <Edit className="h-4 w-4" /> {t('admin_edit', 'Modifier')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 py-2.5 rounded-lg font-medium cursor-pointer"
                                                                onClick={() => toggleStatusMutation.mutate({ id: sermon.id, is_active: !sermon.is_active })}
                                                            >
                                                                {sermon.is_active ? <XCircle className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                                                {sermon.is_active ? t('admin_deactivate', "Désactiver") : t('admin_activate', "Activer")}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 py-2.5 rounded-lg font-medium text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                                                onClick={() => {
                                                                    if (window.confirm(t('admin_confirm_delete_sermon', "Êtes-vous sûr de vouloir supprimer ce sermon ?"))) {
                                                                        deleteMutation.mutate(sermon.id);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" /> {t('admin_delete', 'Supprimer')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminSermons;
