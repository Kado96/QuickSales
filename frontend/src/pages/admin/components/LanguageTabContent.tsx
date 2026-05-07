import React from "react";
import { Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import ImageFieldWithPreview from "./ImageFieldWithPreview";

interface LanguageTabContentProps {
    lang: string;
    settings: any;
}

const LanguageTabContent = React.memo(({ lang, settings }: LanguageTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    {t('admin_misc', "Divers & Présentation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-full">
                        <label htmlFor={`about_content_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_about_intro_label', "Texte d'introduction (À Propos)")}</label>
                        <Textarea
                            id={`about_content_${lang}`}
                            name={`about_content_${lang}`}
                            key={`about_content_${lang}`}
                            defaultValue={settings?.[`about_content_${lang}`]}
                            placeholder="Brève présentation du diocèse..."
                            className="rounded-xl min-h-[120px] border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`bible_verse_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_bible_verse_label', "Verset Biblique (Global)")}</label>
                        <Textarea
                            id={`bible_verse_${lang}`}
                            name={`bible_verse_${lang}`}
                            key={`bible_verse_${lang}`}
                            defaultValue={settings?.[`bible_verse_${lang}`]}
                            className="rounded-xl border-slate-200 focus:bg-white italic"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`bible_verse_ref_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_bible_verse_ref_label', "Référence")}</label>
                        <Input
                            id={`bible_verse_ref_${lang}`}
                            name={`bible_verse_ref_${lang}`}
                            key={`bible_verse_ref_${lang}`}
                            defaultValue={settings?.[`bible_verse_ref_${lang}`]}
                            placeholder="Romains 15:13"
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>
            {/* Section Header & Navigation */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-500" /> {t('admin_section_header', "Navigation & En-tête")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`nav_home_${lang}`} className="text-xs font-bold text-slate-500">{t('nav_home', "Accueil")}</label>
                        <Input
                            id={`nav_home_${lang}`}
                            name={`nav_home_${lang}`}
                            key={`nav_home_${lang}`}
                            defaultValue={settings?.[`nav_home_${lang}`]}
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`nav_about_${lang}`} className="text-xs font-bold text-slate-500">{t('nav_about', "À Propos")}</label>
                        <Input
                            id={`nav_about_${lang}`}
                            name={`nav_about_${lang}`}
                            key={`nav_about_${lang}`}
                            defaultValue={settings?.[`nav_about_${lang}`]}
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`nav_news_${lang}`} className="text-xs font-bold text-slate-500">{t('nav_news', "Actualités")}</label>
                        <Input
                            id={`nav_news_${lang}`}
                            name={`nav_news_${lang}`}
                            key={`nav_news_${lang}`}
                            defaultValue={settings?.[`nav_news_${lang}`]}
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`nav_contact_${lang}`} className="text-xs font-bold text-slate-500">{t('nav_contact', "Contact")}</label>
                        <Input
                            id={`nav_contact_${lang}`}
                            name={`nav_contact_${lang}`}
                            key={`nav_contact_${lang}`}
                            defaultValue={settings?.[`nav_contact_${lang}`]}
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`header_slogan_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_header_slogan_label', "Slogan du Logo")}</label>
                        <Input
                            id={`header_slogan_${lang}`}
                            name={`header_slogan_${lang}`}
                            key={`header_slogan_${lang}`}
                            defaultValue={settings?.[`header_slogan_${lang}`]}
                            placeholder="KANISA LA ANGLIKANA BURUNDI"
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`header_admin_btn_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_header_admin_btn_label', "Bouton Admin (Texte)")}</label>
                        <Input
                            id={`header_admin_btn_${lang}`}
                            name={`header_admin_btn_${lang}`}
                            key={`header_admin_btn_${lang}`}
                            defaultValue={settings?.[`header_admin_btn_${lang}`]}
                            placeholder="Connexion Admin"
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Section Footer */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-slate-500" /> {t('admin_section_footer', "Pied de page")}
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor={`footer_description_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_footer_desc_label', "Description du Footer")}</label>
                        <Textarea
                            id={`footer_description_${lang}`}
                            name={`footer_description_${lang}`}
                            key={`footer_description_${lang}`}
                            defaultValue={settings?.[`footer_description_${lang}`]}
                            placeholder="Église Anglicane du Burundi. Servir Dieu..."
                            className="rounded-xl min-h-[100px] border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`footer_copyright_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_footer_copyright_label', "Texte Copyright")}</label>
                        <Input
                            id={`footer_copyright_${lang}`}
                            name={`footer_copyright_${lang}`}
                            key={`footer_copyright_${lang}`}
                            defaultValue={settings?.[`footer_copyright_${lang}`]}
                            placeholder="© 2024 Diocese Makamba. Tous droits réservés."
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

LanguageTabContent.displayName = "LanguageTabContent";

export default LanguageTabContent;
