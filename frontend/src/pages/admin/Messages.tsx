import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Messages() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const response = await api.get("/api/pages/messages/");
            // Gérer à la fois les listes directes et les réponses paginées (results)
            const data = response.data.results || response.data;
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            toast.error("Erreur lors du chargement des messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await api.patch(`/api/pages/messages/${id}/`, { is_read: true });
            setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
        } catch (error) {
            console.error(error);
            toast.error("Erreur de mise à jour");
        }
    };

    const deleteMessage = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
        try {
            await api.delete(`/api/pages/messages/${id}/`);
            setMessages(messages.filter(m => m.id !== id));
            toast.success("Message supprimé");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression");
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-slate-900 flex items-center gap-3">
                            <Mail className="h-8 w-8 text-indigo-500" />
                            Messages de Contact
                        </h1>
                        <p className="text-slate-500 mt-1">Consultez et gérez les messages envoyés depuis le site.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-500">Chargement...</div>
                ) : messages.length === 0 ? (
                    <Card className="text-center py-20 border-dashed border-2 bg-slate-50/50">
                        <MailOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Aucun message</h3>
                        <p className="text-slate-500">Vous n'avez reçu aucun message pour le moment.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {messages.map((message) => (
                            <Card key={message.id} className={`overflow-hidden transition-all ${!message.is_read ? 'border-l-4 border-l-indigo-500 shadow-md' : 'opacity-80'}`}>
                                <CardHeader className="bg-slate-50/50 pb-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            {!message.is_read ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0 animate-pulse" />
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0" />
                                            )}
                                            <div>
                                                <CardTitle className="text-lg font-bold">{message.subject}</CardTitle>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                                                    <span className="font-medium text-slate-900">{message.name}</span>
                                                    <span>•</span>
                                                    <a href={`mailto:${message.email}`} className="text-indigo-600 hover:underline">{message.email}</a>
                                                    <span>•</span>
                                                    <span>{format(new Date(message.created_at), 'dd MMM yyyy, HH:mm', { locale: fr })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!message.is_read && (
                                                <Button variant="outline" size="sm" onClick={() => markAsRead(message.id)}>
                                                    Marquer lu
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => deleteMessage(message.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 text-slate-700 whitespace-pre-wrap">
                                    {message.message}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
