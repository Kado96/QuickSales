import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Cross, Globe, ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "nav_home", href: "/" },
  { label: "nav_about", href: "/a-propos" },
  { label: "nav_news", href: "/actualites" },
  { label: "nav_contact", href: "/contact" },
];

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const { data: siteSettings } = useSiteSettings();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 📝 Mettre à jour le titre du navigateur dynamiquement
  useEffect(() => {
    if (siteSettings?.site_name) {
      document.title = siteSettings.site_name;
    }
  }, [siteSettings?.site_name]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
      ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-3"
      : "bg-transparent py-6"
      } border-b border-white/10`}>
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
        {/* 🏛️ Logo & Branding */}
        <Link to="/" className="flex items-center gap-6 group" style={{ perspective: "1200px" }}>
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              width: scrolled ? (window.innerWidth < 640 ? 56 : 72) : (window.innerWidth < 640 ? 80 : 100),
              height: scrolled ? (window.innerWidth < 640 ? 56 : 72) : (window.innerWidth < 640 ? 80 : 100),
            }}
            transition={{ 
              rotateY: { repeat: Infinity, duration: 0.8, repeatDelay: 5, ease: "easeInOut" },
              width: { duration: 0.5 },
              height: { duration: 0.5 }
            }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white rounded-full shadow-2xl flex items-center justify-center border-white shadow-primary/30 p-2 sm:p-4 ${
              scrolled ? "border-2" : "border-4"
            }`}
          >
            {siteSettings?.logo_url_display ? (
              <img 
                src={siteSettings.logo_url_display} 
                alt="" 
                className="h-full w-full object-contain" 
                style={{ imageRendering: "-webkit-optimize-contrast", backfaceVisibility: "hidden" }}
              />
            ) : (
              <Cross className="h-12 w-12 text-emerald-600 group-hover:text-white transition-colors" strokeWidth={1} />
            )}
          </motion.div>
          <div className="flex flex-col">
            <span className={`font-heading text-xl md:text-2xl font-black tracking-tight leading-none transition-colors duration-300 ${scrolled ? "text-slate-900" : "text-white"
              }`}>
              {siteSettings?.site_name || "Diocese Makamba"}
            </span>
            {siteSettings?.[`header_slogan_${lang}`] && (
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5 transition-opacity duration-500 ${scrolled ? "text-slate-500" : "text-white/60"}`}>
                {siteSettings[`header_slogan_${lang}`]}
              </span>
            )}
          </div>
        </Link>
        {/* 🧭 Premium Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
          {navItems.map((item) => {
            // Déterminer le libellé par défaut selon la langue courante
            const defaultLabels: Record<string, Record<string, string>> = {
              fr: { nav_home: "Accueil", nav_about: "À Propos", nav_news: "Actualités", nav_contact: "Contact" },
              en: { nav_home: "Home", nav_about: "About Us", nav_news: "News", nav_contact: "Contact" }
            };

            const currentLang = lang === 'en' ? 'en' : 'fr';
            let label = defaultLabels[currentLang][item.label] || t(item.label);
            
            if (siteSettings) {
              const dynamicLabel = siteSettings[`${item.label}_${lang}`];
              if (dynamicLabel) label = dynamicLabel;
            }

            return (
              <Link
                key={item.href}
                id={`nav-link-${item.label}`}
                name={`nav_${item.label}`}
                to={item.href}
                className="relative px-2 py-2 group/nav"
              >
                <motion.span
                  className={`relative z-10 text-[14px] xl:text-[15px] font-bold transition-all duration-300 flex items-center gap-1 ${location.pathname === item.href
                    ? "text-primary"
                    : scrolled
                      ? "text-slate-600 group-hover/nav:text-slate-900"
                      : "text-white/80 group-hover/nav:text-white"
                    }`}
                  whileHover={{ y: -1 }}
                >
                  {label}
                </motion.span>

                {/* Hover Gloss Effect & Shadow */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 -z-0 opacity-0 group-hover/nav:opacity-100 group-hover/nav:shadow-[0_10px_20px_rgba(0,0,0,0.03)] ${scrolled ? "bg-slate-100/50" : "bg-white/10"
                  }`} />

                {/* Active Underline */}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="navActive"
                    className="absolute bottom-0 left-5 right-5 h-1 bg-primary rounded-full shadow-[0_2px_10px_rgba(var(--primary),0.4)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 🛠️ Actions Area */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-11 px-4 rounded-2xl transition-all duration-500 border gap-3 group ${scrolled
                  ? "bg-slate-50/50 hover:bg-white border-slate-100"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  }`}
              >
                <Globe className={`h-5 w-5 group-hover:rotate-12 transition-transform ${scrolled ? "text-primary" : "text-white"}`} />
                <span className={`text-sm font-black uppercase tracking-widest ${scrolled ? "text-slate-700" : "text-white"}`}>{currentLanguage.code}</span>
                <ChevronDown className="h-4 w-4 text-slate-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-3 rounded-[1.5rem] shadow-2xl border-white/20 bg-white/95 backdrop-blur-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-300">
              <div className="px-3 py-2 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('choose_language', 'SÉLECTIONNER LA LANGUE')}</p>
              </div>
              {languages.map((lng) => (
                <DropdownMenuItem
                  key={lng.code}
                  onClick={() => changeLanguage(lng.code)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${i18n.language === lng.code
                    ? 'bg-primary/10 text-primary font-bold shadow-inner'
                    : 'text-slate-600 hover:bg-slate-50 hover:pl-5'
                    }`}
                >
                  <span className="text-2xl filter drop-shadow-sm">{lng.flag}</span>
                  <span className="font-heading text-[15px]">{lng.name}</span>
                  {i18n.language === lng.code && <motion.div layoutId="lngDot" className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Button */}
          {(siteSettings?.[`header_admin_btn_${lang}`] || siteSettings?.header_admin_btn_fr) && (
            <Link to="/admin/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className={`h-11 rounded-2xl px-6 font-bold transition-all gap-2 shadow-sm ${scrolled
                    ? "border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30"
                    : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                    }`}
                >
                  <Lock className="h-4 w-4" />
                  {siteSettings?.[`header_admin_btn_${lang}`] || siteSettings?.header_admin_btn_fr}
                </Button>
              </motion.div>
            </Link>
          )}
        </div>

        {/* 📱 Mobile Menu Interface */}
        <div className="lg:hidden flex items-center gap-3 sm:gap-4">
          {(siteSettings?.[`header_admin_btn_${lang}`] || siteSettings?.header_admin_btn_fr) && (
            <Link
              to="/admin/login"
              className={`transition-colors duration-300 ${scrolled ? "text-slate-400" : "text-white/60"}`}
            >
              <Lock className="h-5 w-5" />
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 ${isOpen
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : scrolled
                ? "bg-slate-100 text-slate-600"
                : "bg-white/10 text-white border border-white/20"
              }`}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* 🌪️ Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-[100dvh] w-[min(85%,400px)] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col"
            >
              {/* Header inside drawer to hold the X button space */}
              <div className="flex items-center justify-between p-6 border-b border-slate-50">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Navigation</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Links */}
              <div className="flex-1 overflow-y-auto py-4 px-4">
                <nav className="flex flex-col gap-2">
                    {navItems.map((item, idx) => {
                      const defaultLabels: Record<string, Record<string, string>> = {
                        fr: { nav_home: "Accueil", nav_about: "À Propos", nav_news: "Actualités", nav_contact: "Contact" },
                        en: { nav_home: "Home", nav_about: "About Us", nav_news: "News", nav_contact: "Contact" }
                      };
                      const currentLang = lang === 'en' ? 'en' : 'fr';
                      let label = defaultLabels[currentLang][item.label] || t(item.label);
                      
                      if (siteSettings) {
                        const dynamicLabel = siteSettings[`${item.label}_${lang}`];
                        if (dynamicLabel) label = dynamicLabel;
                      }
                      return (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={item.href}
                        >
                          <Link
                            id={`nav-mobile-link-${item.label}`}
                            name={`nav_mobile_${item.label}`}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between py-4 px-6 rounded-2xl text-lg font-heading font-black transition-all ${location.pathname === item.href
                              ? "bg-primary/10 text-primary translate-x-2"
                              : "text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            {label}
                            {location.pathname === item.href && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                </nav>
              </div>

              {/* Language Selector at bottom */}
              <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Changer de langue</span>
                  <div className="flex justify-center gap-3">
                    {languages.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { changeLanguage(l.code); setIsOpen(false); }}
                        className={`w-12 h-12 rounded-2xl text-xl flex items-center justify-center border transition-all shadow-sm ${i18n.language === l.code
                          ? "bg-primary border-primary text-white scale-110 shadow-primary/20"
                          : "bg-white border-slate-100 text-slate-400 hover:border-primary/30"
                          }`}
                      >
                        {l.flag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
