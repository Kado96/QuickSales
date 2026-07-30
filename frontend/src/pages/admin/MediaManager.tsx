import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { 
    Image as ImageIcon, 
    Upload, 
    Trash2, 
    Copy, 
    Check, 
    Folder, 
    HardDrive, 
    FileText, 
    Volume2, 
    Loader2, 
    RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface MediaFile {
    name: string;
    path: string;
    category: string;
    size: number;
    url: string;
    mime_type: string;
}

interface MediaResponse {
    files_count: number;
    total_size_bytes: number;
    total_size_mb: number;
    categories_count: number;
    categories: string[];
    storage_provider: string;
    files: MediaFile[];
}

const MediaManager = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [mediaData, setMediaData] = useState<MediaResponse | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
    const [copiedPath, setCopiedPath] = useState<string | null>(null);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/settings/media-manager/");
            setMediaData(res.data);
        } catch (error: any) {
            console.error("Fetch media error:", error);
            toast.error(t("admin_media_fetch_error", "Erreur lors du chargement des médias"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        // Utiliser la catégorie sélectionnée, ou 'settings' par défaut
        const category = selectedCategory === "Tous" ? "settings" : selectedCategory;
        formData.append("category", category);

        try {
            await api.post("/api/settings/media-manager/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(t("admin_media_upload_success", "Fichier téléversé avec succès"));
            fetchMedia();
        } catch (error) {
            toast.error(t("admin_media_upload_error", "Erreur lors du téléversement"));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (filePath: string) => {
        if (!window.confirm(t("admin_media_delete_confirm", "Voulez-vous vraiment supprimer ce fichier ?"))) {
            return;
        }

        try {
            await api.delete("/api/settings/media-manager/", {
                data: { path: filePath }
            });
            toast.success(t("admin_media_delete_success", "Fichier supprimé avec succès"));
            fetchMedia();
        } catch (error) {
            toast.error(t("admin_media_delete_error", "Erreur lors de la suppression"));
        }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedPath(url);
        toast.success(t("admin_media_copied", "URL copiée dans le presse-papier !"));
        setTimeout(() => setCopiedPath(null), 2000);
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!bytes) return '0 Octets';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const isImage = (mime: string) => mime.startsWith("image/");
    const isAudio = (mime: string) => mime.startsWith("audio/");

    // Filtrer la liste des fichiers
    const filteredFiles = mediaData?.files.filter(f => 
        selectedCategory === "Tous" || f.category === selectedCategory
    ) || [];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t("admin_media_library", "Médiathèque")} <ImageIcon className="h-8 w-8 text-rose-500" />
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            {t("admin_media_desc", "Gérez l'ensemble des images, audios et ressources de votre plateforme.")}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={fetchMedia} 
                            disabled={loading}
                            className="rounded-xl border-slate-200"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            {t("admin_refresh", "Rafraîchir")}
                        </Button>
                        <div className="relative">
                            <input 
                                type="file" 
                                id="direct-upload-file" 
                                className="hidden" 
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                            <Button 
                                asChild
                                disabled={uploading}
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                            >
                                <label htmlFor="direct-upload-file" className="flex items-center gap-2 cursor-pointer">
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    {t("admin_add_media", "Ajouter des médias")}
                                </label>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-2xl border-slate-100 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500">{t("admin_total_files", "Fichiers totaux")}</CardTitle>
                            <ImageIcon className="h-5 w-5 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mediaData?.files_count || 0}</div>
                            <p className="text-xs text-slate-400 mt-1">{t("admin_total_files_tip", "Médias enregistrés")}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-slate-100 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500">{t("admin_storage_used", "Stockage utilisé")}</CardTitle>
                            <HardDrive className="h-5 w-5 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mediaData ? formatBytes(mediaData.total_size_bytes) : "0 Mo"}</div>
                            <p className="text-xs text-slate-400 mt-1">{t("admin_storage_used_tip", "Taille physique cumulée")}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-slate-100 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500">{t("admin_categories", "Catégories")}</CardTitle>
                            <Folder className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mediaData?.categories_count || 0}</div>
                            <p className="text-xs text-slate-400 mt-1">{t("admin_categories_tip", "Dossiers organisés")}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-slate-100 shadow-md bg-rose-50/20 border-rose-100/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-rose-700">{t("admin_storage_provider", "Provider actif")}</CardTitle>
                            <HardDrive className="h-5 w-5 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-900">{mediaData?.storage_provider || "Local"}</div>
                            <p className="text-xs text-rose-600/70 mt-1">{t("admin_storage_provider_tip", "Stockage configuré")}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-100/60 p-2 rounded-2xl border border-slate-200/50">
                    <Button 
                        variant={selectedCategory === "Tous" ? "default" : "ghost"}
                        onClick={() => setSelectedCategory("Tous")}
                        className="rounded-xl font-bold text-xs"
                    >
                        Tous
                    </Button>
                    {mediaData?.categories.map(cat => (
                        <Button 
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "ghost"}
                            onClick={() => setSelectedCategory(cat)}
                            className="rounded-xl font-bold text-xs capitalize"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="h-[40vh] flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <p className="text-slate-500 font-medium">{t("admin_loading_media", "Chargement des fichiers...")}</p>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold text-lg">{t("admin_no_files_title", "Aucun média trouvé")}</p>
                        <p className="text-slate-400 text-sm mt-1">{t("admin_no_files_desc", "Commencez à téléverser des images ou des fichiers.")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredFiles.map((file, idx) => (
                            <Card key={idx} className="group overflow-hidden rounded-[2rem] border-slate-200/60 hover:shadow-xl hover:border-slate-300 transition-all flex flex-col h-full bg-white relative">
                                {/* Thumbnail */}
                                <div className="aspect-square bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden relative">
                                    {isImage(file.mime_type) ? (
                                        <img 
                                            src={file.url} 
                                            alt={file.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : isAudio(file.mime_type) ? (
                                        <div className="flex flex-col items-center justify-center p-4 text-primary bg-primary/5 rounded-2xl w-2/3 h-2/3">
                                            <Volume2 className="h-12 w-12" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 text-slate-400">
                                            <FileText className="h-12 w-12" />
                                        </div>
                                    )}
                                    
                                    {/* Action Hover overlay */}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            onClick={() => handleCopyUrl(file.url)}
                                            className="rounded-xl h-10 w-10 shadow-lg shadow-black/20"
                                            title={t("admin_copy_url", "Copier l'URL")}
                                        >
                                            {copiedPath === file.url ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => handleDelete(file.path)}
                                            className="rounded-xl h-10 w-10 shadow-lg shadow-black/20"
                                            title={t("admin_delete", "Supprimer")}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Category pill */}
                                    <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full capitalize">
                                        {file.category}
                                    </span>
                                </div>

                                {/* Content Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-800 line-clamp-1 break-all" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase">
                                            {file.mime_type.split('/')[1] || "INCONNU"}
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 font-bold">
                                            {formatBytes(file.size)}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default MediaManager;
