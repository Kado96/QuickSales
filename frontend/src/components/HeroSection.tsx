import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-diocese.jpg";
import { useSiteSettings } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const { t, i18n } = useTranslation();
  
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const title = settings?.[`hero_title_${lang}`] || t('nav_home', 'Diocèse de Makamba');
  const subtitle = settings?.[`hero_subtitle_${lang}`] || t('diocese_hero_desc');
  const badge = settings?.[`hero_badge_${lang}`] || 'ÉGLISE ANGLICANE DU BURUNDI';

  const btn1Text = settings?.[`hero_btn1_text_${lang}`] || t('hero_cta_learn');
  const btn2Text = settings?.[`hero_btn2_text_${lang}`] || t('hero_cta_visit');

  const btn1Link = settings?.[`hero_btn1_link_${lang}`] || "/diocese";
  const btn2Link = settings?.[`hero_btn2_link_${lang}`] || "/actualites";


  // Helper to render title with accent color on "Makamba"
  const renderTitle = (text: string) => {
    if (text.includes("Makamba")) {
      const parts = text.split("Makamba");
      return (
        <>
          {parts[0]}
          <span className="text-accent underline decoration-accent/30 underline-offset-8">Makamba</span>
          {parts.slice(1).join("Makamba")}
        </>
      );
    }
    return text;
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={settings?.hero_image_display || heroImage}
          alt="Communauté du Diocèse de Makamba"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-48 pb-24 md:pt-60 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-primary-foreground/90 font-body text-sm uppercase tracking-[0.3em] mb-4 drop-shadow-sm">
            {badge}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-8">
            {renderTitle(title)}
          </h1>
          <p className="font-body text-lg md:text-2xl text-primary-foreground/95 leading-relaxed mb-10 max-w-xl drop-shadow-sm">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to={btn1Link}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-body font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all"
            >
              {btn1Text}
            </Link>
            <Link
              to={btn2Link}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary-foreground/40 text-primary-foreground font-body font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              {btn2Text}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
