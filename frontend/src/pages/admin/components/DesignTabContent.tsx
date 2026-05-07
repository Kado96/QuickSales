import React from "react";
import { Palette, BellRing, Link as LinkIcon, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface DesignTabContentProps {
    settings: any;
}

const DesignTabContent = React.memo(({ settings }: DesignTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Design & Couleurs */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-heading font-bold text-indigo-600 flex items-center gap-2">
                    <Palette className="h-5 w-5" /> {t('admin_design_colors_title', "Design & Couleurs")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="primary_color" className="text-xs font-bold text-slate-400">{t('admin_primary_color', "Couleur Principale")}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="primary_color"
                                name="primary_color"
                                type="color"
                                defaultValue={settings?.primary_color || "#3B82F6"}
                                className="w-12 h-10 p-1 rounded-lg border-slate-200"
                            />
                            <Input
                                type="text"
                                defaultValue={settings?.primary_color || "#3B82F6"}
                                className="rounded-lg h-10 border-slate-200 font-mono text-xs uppercase"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="secondary_color" className="text-xs font-bold text-slate-400">{t('admin_secondary_color', "Couleur Secondaire")}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="secondary_color"
                                name="secondary_color"
                                type="color"
                                defaultValue={settings?.secondary_color || "#10B981"}
                                className="w-12 h-10 p-1 rounded-lg border-slate-200"
                            />
                            <Input
                                type="text"
                                defaultValue={settings?.secondary_color || "#10B981"}
                                className="rounded-lg h-10 border-slate-200 font-mono text-xs uppercase"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accent_color" className="text-xs font-bold text-slate-400">{t('admin_accent_color', "Couleur d'Accent")}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="accent_color"
                                name="accent_color"
                                type="color"
                                defaultValue={settings?.accent_color || "#8B5CF6"}
                                className="w-12 h-10 p-1 rounded-lg border-slate-200"
                            />
                            <Input
                                type="text"
                                defaultValue={settings?.accent_color || "#8B5CF6"}
                                className="rounded-lg h-10 border-slate-200 font-mono text-xs uppercase"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Message d'Information / Flash Info */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-heading font-bold text-red-600 flex items-center gap-2">
                        <BellRing className="h-5 w-5" /> {t('admin_info_message_title', "Message d'Information (Flash Info)")}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="info_message_active"
                            name="info_message_active"
                            defaultChecked={settings?.info_message_active}
                        />
                        <Label htmlFor="info_message_active" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {settings?.info_message_active ? t('active', 'Actif') : t('inactive', 'Inactif')}
                        </Label>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="info_badge_text_fr" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                🇫🇷 {t('admin_info_badge_fr', "Libellé Badge (FR)")}
                            </Label>
                            <Input
                                id="info_badge_text_fr"
                                name="info_badge_text_fr"
                                defaultValue={settings?.info_badge_text_fr}
                                placeholder="ex: INFO SHALOM"
                                className="rounded-xl border-slate-200 h-11 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="info_badge_text_en" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                🇬🇧 {t('admin_info_badge_en', "Libellé Badge (EN)")}
                            </Label>
                            <Input
                                id="info_badge_text_en"
                                name="info_badge_text_en"
                                defaultValue={settings?.info_badge_text_en}
                                placeholder="ex: INFO SHALOM"
                                className="rounded-xl border-slate-200 h-11 focus:bg-white"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="info_message_text_fr" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                             🇫🇷 {t('admin_info_msg_fr', "Message en Français")}
                        </Label>
                        <Textarea
                            id="info_message_text_fr"
                            name="info_message_text_fr"
                            defaultValue={settings?.info_message_text_fr}
                            placeholder="Entrez le message d'alerte..."
                            className="rounded-xl border-slate-200 min-h-[80px] focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="info_message_text_en" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                             🇬🇧 {t('admin_info_msg_en', "Message in English")}
                        </Label>
                        <Textarea
                            id="info_message_text_en"
                            name="info_message_text_en"
                            defaultValue={settings?.info_message_text_en}
                            placeholder="Enter the alert message..."
                            className="rounded-xl border-slate-200 min-h-[80px] focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="info_message_link" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <LinkIcon className="h-3 w-3" /> {t('admin_info_msg_link', "Lien de redirection (Optionnel)")}
                        </Label>
                        <Input
                            id="info_message_link"
                            name="info_message_link"
                            defaultValue={settings?.info_message_link}
                            placeholder="/actualites/..."
                            className="rounded-xl border-slate-200 h-11 focus:bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

DesignTabContent.displayName = "DesignTabContent";

export default DesignTabContent;
