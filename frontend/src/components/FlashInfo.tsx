import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import { BellRing, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

const FlashInfo = () => {
    const { data: settings } = useSiteSettings();
    const { i18n, t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);
    const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

    const message = settings?.info_message_text || settings?.[`info_message_text_${lang}`];
    const badgeLabel = settings?.info_badge_text || settings?.[`info_badge_text_${lang}`] || "INFO SHALOM";
    const isActive = settings?.info_message_active;
    const link = settings?.info_message_link;

    if (!isActive || !message || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-0 left-0 right-0 z-[100] h-14 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-15px_50px_-15px_rgba(0,0,0,0.6)] flex items-center overflow-hidden px-4 md:px-8"
            >
                {/* Glow Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-transparent to-teal-600/5 pointer-events-none" />

                <div className="flex items-center w-full max-w-7xl mx-auto gap-4 md:gap-8 relative z-10">
                    {/* Premium Badge */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
                        <div className="relative flex items-center gap-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
                            <div className="relative">
                                <BellRing className="h-3.5 w-3.5 text-white animate-ring" />
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">
                                {badgeLabel}
                            </span>
                        </div>
                    </div>

                    {/* Ticker Content */}
                    <div className="flex-1 relative overflow-hidden h-full flex items-center border-l border-white/10 pl-4 md:pl-8">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-950/0 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-950/0 to-transparent z-10 pointer-events-none" />

                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 30,
                                ease: "linear"
                            }}
                            className="flex items-center gap-12 whitespace-nowrap"
                        >
                            <span className="text-sm md:text-base font-medium text-slate-100 tracking-wide flex items-center gap-4">
                                {message}
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                            </span>
                            <span className="text-sm md:text-base font-medium text-slate-100 tracking-wide flex items-center gap-4">
                                {message}
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                            </span>
                        </motion.div>
                    </div>

                    {/* Action & Close */}
                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                        {link && (
                            <Link 
                                to={link}
                                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5 hover:border-white/20"
                            >
                                <span>{t('details', 'Détails')}</span>
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        )}
                        
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="group relative p-2 transition-all"
                            aria-label="Fermer"
                        >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-full transition-all scale-75 group-hover:scale-100" />
                            <X className="h-4 w-4 text-slate-400 group-hover:text-white relative z-10" />
                        </button>
                    </div>
                </div>

                {/* Bottom Highlight Line */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-full opacity-50" />
            </motion.div>
        </AnimatePresence>
    );
};

export default FlashInfo;
