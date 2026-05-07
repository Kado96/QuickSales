import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cross, Facebook, Youtube, Mail, Phone, MapPin, Instagram, Twitter } from "lucide-react";
import { useSiteSettings } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const description = settings?.[`footer_description_${lang}`] || settings?.footer_description_fr || t('footer_description_default');

  return (
    <footer className="relative bg-[#020617] text-white pt-32 pb-12 overflow-hidden">
      {/* ✨ Premium Background Architecture */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">

          {/* 🏛️ Majesty & Identity */}
          <div className="space-y-10">
            <Link to="/" className="flex items-center gap-5 group">
              <motion.div
                whileHover={{ rotate: -15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative p-3.5 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-2xl group-hover:border-primary/50 transition-all duration-500 overflow-hidden min-w-[65px] min-h-[65px] flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                {settings?.logo_url_display ? (
                  <img src={settings.logo_url_display} alt={settings.site_name} className="relative h-10 w-10 object-contain" />
                ) : (
                  <Cross className="relative h-9 w-9 text-accent group-hover:text-white" strokeWidth={1.2} />
                )}
              </motion.div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl xl:text-3xl font-black tracking-tighter leading-[0.9] text-white/90">
                  {settings?.footer_brand_name?.split(' ')[0] || settings?.site_name?.split(' ')[0] || "Diocese"}
                  <br />
                  <span className="text-primary">{settings?.footer_brand_name?.split(' ').slice(1).join(' ') || settings?.site_name?.split(' ').slice(1).join(' ') || "Makamba"}</span>
                </span>
              </div>
            </Link>

            <div className="relative">
              <p className="font-body text-slate-400 text-[16px] leading-relaxed italic max-w-sm border-l-2 border-primary/20 pl-6 py-1">
                « {description} »
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-4">
                {t('footer_socials', 'REJOIGNEZ-NOUS')}
                <div className="h-px w-12 bg-slate-800" />
              </span>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, url: settings?.facebook_url },
                  { icon: Youtube, url: settings?.youtube_url },
                  { icon: Instagram, url: settings?.instagram_url },
                  { icon: Twitter, url: settings?.twitter_url }
                ].filter(s => s.url).map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -8, scale: 1.1, backgroundColor: "var(--primary)" }}
                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:text-white transition-all duration-500 border border-white/5 shadow-lg group/icon"
                  >
                    <social.icon className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* 🔗 Curated Navigation */}
          <div className="lg:pt-4">
            <h4 className="font-heading text-[13px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 flex items-center gap-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              {t('footer_quick_links', 'EXPLORER')}
            </h4>
            <ul className="space-y-5">
              {[
                { label: 'nav_home', h: '/' },
                { label: 'nav_diocese', h: '/a-propos' },
                { label: 'nav_news', h: '/actualites' },
                { label: 'nav_contact', h: '/contact' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.h} className="group flex items-center text-slate-400 hover:text-white transition-all duration-300">
                    <motion.span
                      whileHover={{ x: 8 }}
                      className="text-[17px] font-bold tracking-tight group-hover:text-primary"
                    >
                      {t(link.label)}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🌟 Impact & Resources */}
          <div className="lg:pt-4">
            <h4 className="font-heading text-[13px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 flex items-center gap-4">
              <div className="w-2 h-2 bg-accent rounded-full" />
              {t('nav_news', 'ACTUALITÉS')}
            </h4>
            <ul className="space-y-5">
              {[
                { label: 'nav_news', h: '/actualites' },
                { label: 'nav_contact', h: '/contact' },
                { label: 'nav_diocese', h: '/a-propos' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.h} className="group flex items-center text-slate-400 hover:text-white transition-all duration-300">
                    <motion.span
                      whileHover={{ x: 8 }}
                      className="text-[17px] font-bold tracking-tight group-hover:text-accent"
                    >
                      {t(link.label)}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📍 Direct Embassy */}
          <div className="lg:pt-4">
            <h4 className="font-heading text-[13px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 flex items-center gap-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              {t('footer_contact', 'CONTACT')}
            </h4>
            <div className="space-y-4">
              <motion.div
                whileHover={{ y: -3 }}
                className="flex flex-col items-center text-center gap-2 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group backdrop-blur-sm"
              >
                <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{t('footer_address_label', 'ADRESSE')}</span>
                <span className="text-[15px] font-bold leading-tight text-slate-300">
                  {settings?.contact_address || "Makamba, Burundi"}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="flex flex-col items-center text-center gap-2 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-all group backdrop-blur-sm"
              >
                <div className="p-3 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{t('footer_email_label', 'EMAIL')}</span>
                <a
                  href={`mailto:${settings?.contact_email}`}
                  className="text-[13px] sm:text-[15px] font-bold text-slate-300 hover:text-primary transition-colors"
                >
                  {settings?.contact_email || "contact@makamba-diocese.org"}
                </a>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="flex flex-col items-center text-center gap-2 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group backdrop-blur-sm"
              >
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">{t('footer_phone_label', 'TÉLÉPHONE')}</span>
                <span className="text-[15px] font-bold text-slate-300">
                  {settings?.contact_phone || "+257 XX XX XX XX"}
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 📜 Signature Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-body text-[13px] text-slate-600 font-medium">
              {t('footer_copyright', '© 2026 Diocèse Makamba. Tous droits réservés.')}
            </p>
          </div>


        </div>

      </div>
    </footer>
  );
};

export default Footer;
