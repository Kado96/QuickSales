import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cross, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useApi";

const Login = () => {
    const { t } = useTranslation();
    const { data: siteSettings } = useSiteSettings();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/api/login/", { username, password });
            localStorage.setItem("token", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            const userData = {
                username: response.data.username || username,
                role: response.data.role || 'admin',
                is_superuser: response.data.is_superuser || false,
                is_staff: response.data.is_staff || false,
                email: response.data.email || '',
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || '',
            };
            localStorage.setItem("user", JSON.stringify(userData));

            toast({
                title: t('admin_login_success', "Connexion réussie"),
                description: `${t('admin_welcome', "Bienvenue")}, ${username} !`,
            });

            navigate("/admin", { replace: true });
        } catch (error: any) {
            let errorMessage = t('admin_login_error_desc', "Identifiants invalides.");

            if (!error.response) {
                // Erreur réseau (ex: serveur injoignable, CORS bloqué, ou localhost dans .env)
                errorMessage = t('admin_login_error_network', "Impossible de contacter le serveur. Vérifiez votre connexion internet.");
            } else if (error.response.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            toast({
                variant: "destructive",
                title: t('admin_login_error_title', "Erreur de connexion"),
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0e1a] relative overflow-hidden font-body">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />

            <div className="z-10 w-full max-w-md px-4">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 mb-4 shadow-xl shadow-primary/10 min-w-[64px] min-h-[64px] overflow-hidden">
                        {siteSettings?.logo_url_display ? (
                            <img src={siteSettings.logo_url_display} alt={siteSettings.site_name} className="h-10 w-10 object-contain" />
                        ) : (
                            <Cross className="h-10 w-10 text-primary" strokeWidth={2.5} />
                        )}
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-1 tracking-tight">{siteSettings?.site_name || "Anglicane Makamba"}</h1>
                    <p className="text-slate-400 text-sm font-medium">{t('admin_subtitle', "Administration")}</p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-slate-900/40 backdrop-blur-2xl border-white/10 shadow-2xl elevation-24">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-xl font-heading font-semibold text-white">{t('admin_login_title', "Connexion")}</CardTitle>
                            <CardDescription className="text-slate-400">
                                {t('admin_login_desc', "Entrez vos identifiants pour accéder au tableau de bord")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="login-username" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{t('admin_username_label', "Nom d'utilisateur")}</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="login-username"
                                            name="username"
                                            type="text"
                                            placeholder={t('admin_username_placeholder', "Votre nom d'utilisateur")}
                                            autoComplete="username"
                                            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:ring-primary/50 focus:border-primary/50 h-11"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{t('admin_password_label', "Mot de passe")}</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="login-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            className="pl-10 pr-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:ring-primary/50 focus:border-primary/50 h-11"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mt-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Lock className="h-4 w-4" /> {t('admin_login_button', "Se connecter")}
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Footer Text */}
                <p className="text-center mt-8 text-slate-500 text-xs">
                    © {new Date().getFullYear()} {siteSettings?.site_name || "Anglicane Makamba"}. {t('footer_rights', "Tous droits réservés.")}
                </p>
            </div>
        </div>
    );
};

export default Login;
