import React from "react";
import { Fingerprint, Link as LinkIcon, FileText, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import ImageFieldWithPreview from "./ImageFieldWithPreview";

interface IdentityTabContentProps {
    settings: any;
}

const IdentityTabContent = React.memo(({ settings }: IdentityTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Infos Générales */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-heading font-bold text-indigo-600 flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" /> {t('admin_site_identity_title', "Identité du Site")}
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="site_name" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <FileText className="h-3 w-3" /> {t('admin_site_name_label', "Nom du Site")}
                        </label>
                        <Input
                            id="site_name"
                            name="site_name"
                            defaultValue={settings?.site_name}
                            placeholder="Diocèse Anglicane de Makamba"
                            className="rounded-xl border-slate-200 h-11 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <FileText className="h-3 w-3" /> {t('admin_description_seo_label', "Description (SEO)")}
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={settings?.description}
                            placeholder="Site officiel du Diocèse..."
                            className="rounded-xl border-slate-200 min-h-[100px] focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <label htmlFor="default_language" className="text-xs font-bold text-indigo-600 flex items-center gap-2">
                            <Globe className="h-3 w-3" /> {t('admin_default_lang_label', "Langue par Défaut du Site")}
                        </label>
                        <select
                            id="default_language"
                            name="default_language"
                            defaultValue={settings?.default_language || 'fr'}
                            className="w-full rounded-xl border-slate-200 h-11 bg-white px-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                        >
                            <option value="fr">🇫🇷 {t('lang_fr_full', 'Français (Par défaut)')}</option>
                            <option value="en">🇬🇧 {t('lang_en_full', 'English')}</option>
                            <option value="rn">🇧🇮 Kirundi</option>
                            <option value="sw">🇹🇿 Swahili</option>
                        </select>
                        <p className="text-[10px] text-slate-400 font-medium italic mt-1">
                            {t('admin_default_lang_tip', "Cette langue sera utilisée pour les nouveaux visiteurs si leur navigateur ne permet pas la détection automatique.")}
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                            <label htmlFor="footer_brand_name" className="text-xs font-bold text-slate-400">{t('admin_brand_name_label', "Nom de Marque (Footer)")}</label>
                            <Input
                                id="footer_brand_name"
                                name="footer_brand_name"
                                defaultValue={settings?.footer_brand_name}
                                placeholder="Diocèse de Makamba"
                                className="rounded-xl border-slate-200 h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="footer_brand_subtitle" className="text-xs font-bold text-slate-400">{t('admin_brand_subtitle_label', "Slogan / Sous-titre (Footer)")}</label>
                            <Input
                                id="footer_brand_subtitle"
                                name="footer_brand_subtitle"
                                defaultValue={settings?.footer_brand_subtitle}
                                placeholder="Église Anglicane du Burundi"
                                className="rounded-xl border-slate-200 h-10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo Management */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-heading font-bold text-blue-600 flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" /> {t('admin_logo_branding_title', "Logo & Branding")}
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200">
                        <ImageFieldWithPreview
                            fieldName="logo"
                            label={t('admin_official_logo_label', "Logo Officiel")}
                            currentImageUrl={settings?.logo_url_display}
                            hint={t('admin_upload_recommended', "Upload direct (recommandé). Format PNG ou SVG transparent.")}
                            aspectRatio="auto"
                            maxPreviewHeight="120px"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="logo_url" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <LinkIcon className="h-3 w-3" /> {t('admin_or_logo_url_label', "OU URL du Logo")}
                        </label>
                        <Input
                            id="logo_url"
                            name="logo_url"
                            defaultValue={settings?.logo_url}
                            placeholder="https://..."
                            className="rounded-xl border-slate-200 h-11 focus:bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

IdentityTabContent.displayName = "IdentityTabContent";

export default IdentityTabContent;
