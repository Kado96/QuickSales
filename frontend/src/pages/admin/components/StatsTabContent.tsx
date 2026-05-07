import React from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface StatsTabContentProps {
    settings: any;
}

const StatsTabContent = React.memo(({ settings }: StatsTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Années de service */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">{t('admin_stat_years_title', "Années de Service")}</h3>
                <div className="space-y-2">
                    <label htmlFor="stat_years_value" className="text-xs font-bold text-slate-500 uppercase">{t('admin_value_hint', "Valeur (ex: 25+)")}</label>
                    <Input id="stat_years_value" name="stat_years_value" defaultValue={settings?.stat_years_value} className="rounded-xl h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="stat_years_label_fr" className="text-[10px] font-bold text-slate-400">Label (FR)</label>
                        <Input id="stat_years_label_fr" name="stat_years_label_fr" defaultValue={settings?.stat_years_label_fr} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_years_label_en" className="text-[10px] font-bold text-slate-400">Label (EN)</label>
                        <Input id="stat_years_label_en" name="stat_years_label_en" defaultValue={settings?.stat_years_label_en} className="h-9 text-sm" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="stat_years_desc_fr" className="text-[10px] font-bold text-slate-300">Desc (FR)</label>
                        <Input id="stat_years_desc_fr" name="stat_years_desc_fr" defaultValue={settings?.stat_years_desc_fr} className="h-8 text-[10px]" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_years_desc_en" className="text-[10px] font-bold text-slate-300">Desc (EN)</label>
                        <Input id="stat_years_desc_en" name="stat_years_desc_en" defaultValue={settings?.stat_years_desc_en} className="h-8 text-[10px]" />
                    </div>
                </div>
            </div>

            {/* Émissions */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">{t('admin_stat_emissions_title', "Émissions / Secteurs")}</h3>
                <div className="space-y-2">
                    <label htmlFor="stat_emissions_value" className="text-xs font-bold text-slate-500 uppercase">{t('admin_value_hint', "Valeur (ex: 120+)")}</label>
                    <Input id="stat_emissions_value" name="stat_emissions_value" defaultValue={settings?.stat_emissions_value} className="rounded-xl h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="stat_emissions_fr" className="text-[10px] font-bold text-slate-400">Label (FR)</label>
                        <Input id="stat_emissions_fr" name="stat_emissions_fr" defaultValue={settings?.stat_emissions_fr} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_emissions_en" className="text-[10px] font-bold text-slate-400">Label (EN)</label>
                        <Input id="stat_emissions_en" name="stat_emissions_en" defaultValue={settings?.stat_emissions_en} className="h-9 text-sm" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="stat_emissions_desc_fr" className="text-[10px] font-bold text-slate-300">Desc (FR)</label>
                        <Input id="stat_emissions_desc_fr" name="stat_emissions_desc_fr" defaultValue={settings?.stat_emissions_desc_fr} className="h-8 text-[10px]" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_emissions_desc_en" className="text-[10px] font-bold text-slate-300">Desc (EN)</label>
                        <Input id="stat_emissions_desc_en" name="stat_emissions_desc_en" defaultValue={settings?.stat_emissions_desc_en} className="h-8 text-[10px]" />
                    </div>
                </div>
            </div>

            {/* Audience */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">{t('admin_stat_audience_title', "Audience")}</h3>
                <div className="space-y-2">
                    <label htmlFor="stat_audience_value" className="text-xs font-bold text-slate-500 uppercase">{t('admin_value_hint', "Valeur (ex: 8K)")}</label>
                    <Input id="stat_audience_value" name="stat_audience_value" defaultValue={settings?.stat_audience_value} className="rounded-xl h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="stat_audience_fr" className="text-[10px] font-bold text-slate-400">Label (FR)</label>
                        <Input id="stat_audience_fr" name="stat_audience_fr" defaultValue={settings?.stat_audience_fr} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_audience_en" className="text-[10px] font-bold text-slate-400">Label (EN)</label>
                        <Input id="stat_audience_en" name="stat_audience_en" defaultValue={settings?.stat_audience_en} className="h-9 text-sm" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="stat_audience_desc_fr" className="text-[10px] font-bold text-slate-300">Desc (FR)</label>
                        <Input id="stat_audience_desc_fr" name="stat_audience_desc_fr" defaultValue={settings?.stat_audience_desc_fr} className="h-8 text-[10px]" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_audience_desc_en" className="text-[10px] font-bold text-slate-300">Desc (EN)</label>
                        <Input id="stat_audience_desc_en" name="stat_audience_desc_en" defaultValue={settings?.stat_audience_desc_en} className="h-8 text-[10px]" />
                    </div>
                </div>
            </div>

            {/* Thématiques */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">{t('admin_stat_languages_title', "Thématiques")}</h3>
                <div className="space-y-2">
                    <label htmlFor="stat_languages_value" className="text-xs font-bold text-slate-500 uppercase">{t('admin_value_hint', "Valeur (ex: 15)")}</label>
                    <Input id="stat_languages_value" name="stat_languages_value" defaultValue={settings?.stat_languages_value} className="rounded-xl h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="stat_languages_fr" className="text-[10px] font-bold text-slate-400">Label (FR)</label>
                        <Input id="stat_languages_fr" name="stat_languages_fr" defaultValue={settings?.stat_languages_fr} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_languages_en" className="text-[10px] font-bold text-slate-400">Label (EN)</label>
                        <Input id="stat_languages_en" name="stat_languages_en" defaultValue={settings?.stat_languages_en} className="h-9 text-sm" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="stat_languages_desc_fr" className="text-[10px] font-bold text-slate-300">Desc (FR)</label>
                        <Input id="stat_languages_desc_fr" name="stat_languages_desc_fr" defaultValue={settings?.stat_languages_desc_fr} className="h-8 text-[10px]" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="stat_languages_desc_en" className="text-[10px] font-bold text-slate-300">Desc (EN)</label>
                        <Input id="stat_languages_en" name="stat_languages_desc_en" defaultValue={settings?.stat_languages_desc_en} className="h-8 text-[10px]" />
                    </div>
                </div>
            </div>



        </div>
    );
});

StatsTabContent.displayName = "StatsTabContent";

export default StatsTabContent;
