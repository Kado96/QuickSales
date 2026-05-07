import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Users, Plus, Trash2, Edit, Check, Loader2, Sprout, Search, ChevronRight, Activity, Save
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import MinistryIntroManager from "./components/MinistryIntroManager";
import ImageFieldWithPreview from "./components/ImageFieldWithPreview";

const AdminMinistries = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [activeLang, setActiveLang] = useState("fr");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const langs = [
        { code: "fr", label: "🇫🇷 FR" },
        { code: "en", label: "🇬🇧 EN" },
    ];

    const { data: ministries, isLoading } = useQuery({
        queryKey: ["admin-ministries"],
        queryFn: async () => {
            const res = await api.get(`/api/ministries/`);
            return res.data.results || res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => { await api.delete(`/api/ministries/${id}/`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-ministries"] });
            queryClient.invalidateQueries({ queryKey: ["ministries"] });
            toast.success("Ministère supprimé avec succès");
        },
    });

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: FormData, id?: number }) => {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (id) await api.patch(`/api/ministries/${id}/`, data, config);
            else await api.post("/api/ministries/", data, config);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-ministries"] });
            queryClient.invalidateQueries({ queryKey: ["ministries"] });
            toast.success("Enregistré avec succès");
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
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
            const isImageField = key.endsWith('_image') || key.endsWith('_photo') || key === 'image';
            if (isImageField && value === "") return;

            cleanedFormData.append(key, value);
        });
        
        saveMutation.mutate({ data: cleanedFormData, id: editingItem?.id });
    };

    const displayMinistries = Array.isArray(ministries) ? ministries : (ministries?.results || []);
    const filteredMinistries = displayMinistries.filter((m: any) =>
        (m[`title_${activeLang}`] || m.title_fr || "")?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <AdminLayout><div className="h-[60vh] flex flex-col items-center justify-center gap-3"><Loader2 className="h-10 w-10 text-primary animate-spin" /><p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement des ministères...")}</p></div></AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                            Gestion des <span className="text-blue-600">Ministères</span> <Activity className="h-10 w-10 text-blue-500" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-2">Gérez les départements, les missions et les témoignages du diocèse.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
                            {langs.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setActiveLang(l.code)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeLang === l.code ? "bg-white text-blue-600 shadow-md scale-105" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>

                        <Dialog open={isAddDialogOpen || !!editingItem} onOpenChange={(open) => {
                            if (!open) { setIsAddDialogOpen(false); setEditingItem(null); }
                        }}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-14 px-8 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 leading-none">
                                    <Plus className="h-6 w-6" /> Nouveau Ministère
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px] rounded-[2rem] bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-0 border-none shadow-2xl">
                                <form onSubmit={handleSubmit} className="space-y-0">
                                    <div className="p-8 pb-4">
                                        <DialogHeader>
                                            <DialogTitle className="text-3xl font-heading font-bold text-slate-900">
                                                {editingItem ? "Modifier le Ministère" : "Nouveau Ministère"}
                                            </DialogTitle>
                                            <DialogDescription className="text-slate-500 font-body text-base">
                                                Configurez les informations pour toutes les langues.
                                            </DialogDescription>
                                        </DialogHeader>
                                    </div>
                                    
                                    <div className="px-8 space-y-6 pb-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label htmlFor={`title_${activeLang}`} className="text-sm font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Nom du Ministère ({activeLang})
                                                    </label>
                                                    <Input id={`title_${activeLang}`} name={`title_${activeLang}`} defaultValue={editingItem?.[`title_${activeLang}`]} required className="rounded-xl h-12 bg-slate-50 border-slate-200" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor={`mission_${activeLang}`} className="text-sm font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                                                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Mission & Description ({activeLang})
                                                    </label>
                                                    <Textarea id={`mission_${activeLang}`} name={`mission_${activeLang}`} defaultValue={editingItem?.[`mission_${activeLang}`]} required className="rounded-xl min-h-[120px] bg-slate-50 border-slate-200" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="icon" className="text-sm font-bold text-slate-700 cursor-pointer">Icône (Lucide)</label>
                                                        <Input id="icon" name="icon" defaultValue={editingItem?.icon || "Users"} required className="rounded-xl h-11 bg-slate-50 border-slate-200" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="order" className="text-sm font-bold text-slate-700 cursor-pointer">Ordre d'affichage</label>
                                                        <Input id="order" name="order" type="number" defaultValue={editingItem?.order || 0} className="rounded-xl h-11 bg-slate-50 border-slate-200" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <label htmlFor="image" className="text-sm font-bold text-slate-700 cursor-pointer">Image illustrative</label>
                                                <ImageFieldWithPreview fieldName="image" currentImageUrl={editingItem?.image_display} label="Miniature" />
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Témoignage ({activeLang})</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label htmlFor={`testimony_quote_${activeLang}`} className="text-xs font-bold text-slate-500 tracking-wider uppercase cursor-pointer">Citation</label>
                                                    <Textarea id={`testimony_quote_${activeLang}`} name={`testimony_quote_${activeLang}`} defaultValue={editingItem?.[`testimony_quote_${activeLang}`]} className="rounded-xl bg-white border-slate-200 italic" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="testimony_author" className="text-xs font-bold text-slate-500 tracking-wider uppercase cursor-pointer">Auteur</label>
                                                    <Input id="testimony_author" name="testimony_author" defaultValue={editingItem?.testimony_author} className="rounded-xl h-11 bg-white border-slate-200" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hidden fields for other language to prevent data loss during tab switching */}
                                        {['fr', 'en'].filter(l => l !== activeLang).map(l => (
                                            <div key={l} className="hidden">
                                                <Input name={`title_${l}`} defaultValue={editingItem?.[`title_${l}`] || ""} />
                                                <Textarea name={`mission_${l}`} defaultValue={editingItem?.[`mission_${l}`] || ""} />
                                                <Textarea name={`testimony_quote_${l}`} defaultValue={editingItem?.[`testimony_quote_${l}`] || ""} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-8 bg-slate-50 border-t border-slate-100">
                                        <DialogFooter>
                                            <Button type="submit" disabled={saveMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-white font-bold text-lg shadow-xl shadow-blue-200">
                                                {saveMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5 mr-3" />}
                                                {editingItem ? "Enregistrer les modifications" : "Créer le ministère"}
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <MinistryIntroManager activeLang={activeLang} />

                {filteredMinistries.length === 0 ? (
                    <Card className="rounded-[2rem] border-dashed border-2 border-slate-200 p-20 text-center bg-slate-50/50">
                        <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-heading font-bold text-slate-400">Aucun ministère trouvé</h3>
                        <p className="text-slate-400 mt-2 font-body">Ajoutez votre premier ministère pour le voir apparaître ici.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence>
                            {filteredMinistries?.map((ministry: any) => {
                                const mTitle = ministry[`title_${activeLang}`] || ministry.title_fr || "Sans titre";
                                const mMission = ministry[`mission_${activeLang}`] || ministry.mission_fr || "Aucune description";
                                return (
                                    <motion.div key={ministry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Card className="group h-full rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 overflow-hidden bg-white flex flex-col border-none ring-1 ring-slate-200/40 hover:ring-blue-200">
                                            <div className="h-32 bg-gradient-to-br from-slate-100 to-white relative p-8 pb-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-5">
                                                        {ministry.image_display ? (
                                                            <img src={ministry.image_display} alt="thumb" className="h-20 w-20 rounded-[1.5rem] object-cover border-4 border-white shadow-xl bg-blue-50 transform group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="bg-blue-600 p-6 rounded-[1.5rem] text-white shadow-xl shadow-blue-200 group-hover:rotate-12 transition-transform duration-500">
                                                                <Sprout className="h-8 w-8" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <CardTitle className="text-2xl font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{mTitle}</CardTitle>
                                                            <CardDescription className="flex items-center gap-2 mt-1 text-slate-400 font-bold bg-slate-100 rounded-full px-3 py-1 w-fit">
                                                                <Activity className="h-3.5 w-3.5 text-blue-500" /> {ministry.activities?.length || 0} activités
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 translate-y-[-10px]">
                                                        <Button variant="outline" size="icon" onClick={() => setEditingItem(ministry)} className="h-10 w-10 rounded-full bg-white border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all">
                                                            <Edit className="h-4.5 w-4.5" />
                                                        </Button>
                                                        <Button variant="outline" size="icon" onClick={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(ministry.id); }} className="h-10 w-10 rounded-full bg-white border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:shadow-md transition-all">
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <CardContent className="p-8 pt-10 flex-grow space-y-6">
                                                <p className="text-slate-500 font-medium font-body leading-relaxed line-clamp-3 text-lg">
                                                    {mMission}
                                                </p>

                                                <div className="pt-6 border-t border-slate-100">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-sm font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                                                            <Activity className="h-4 w-4 text-blue-500" /> Activités ({activeLang})
                                                        </h4>
                                                        <Button
                                                            variant="ghost" size="sm" className="h-8 rounded-lg text-blue-600 hover:bg-blue-50 text-xs font-bold"
                                                            onClick={() => {
                                                                const title = prompt(`Titre de l'activité (${activeLang}) :`);
                                                                if (title) {
                                                                    const payload: any = {};
                                                                    payload[`title_${activeLang}`] = title;
                                                                    api.post(`/api/ministries/${ministry.id}/activities/`, payload).then(() => {
                                                                        queryClient.invalidateQueries({ queryKey: ["admin-ministries"] });
                                                                        toast.success("Activité ajoutée");
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ministry.activities?.map((act: any) => (
                                                            <div key={act.id} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl group/item pr-2 hover:bg-white hover:border-blue-200 transition-all">
                                                                <span className="text-slate-600 text-sm font-bold">{act[`title_${activeLang}`] || act.title_fr}</span>
                                                                <button 
                                                                    onClick={async () => { if (confirm("Supprimer ?")) { await api.delete(`/api/ministries/activities/${act.id}/`); queryClient.invalidateQueries({ queryKey: ["admin-ministries"] }); } }}
                                                                    className="h-6 w-6 rounded-md hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-colors flex items-center justify-center"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminMinistries;
