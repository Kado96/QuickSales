import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cross, Heart, Users, Shield, BookOpen, Loader2, Target } from "lucide-react";
import { useMissionAxes, useVisionValues, useSiteSettings, useDiocesePresentation } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import visionBg from "@/assets/story-education.jpg";

import missionImg from "@/assets/story-women.jpg";

const iconMap: Record<string, any> = {
  Cross,
  Heart,
  Users,
  Shield,
  BookOpen,
  Target
};

const VisionMission = () => {
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const { data: apiAxes, isLoading: loadingAxes } = useMissionAxes();
  const { data: apiValues, isLoading: loadingValues } = useVisionValues();
  const { data: settings, isLoading: loadingSettings } = useSiteSettings();
  const { data: presentationData, isLoading: loadingPresentation } = useDiocesePresentation();
  const presentation = presentationData?.[0];


  const displayAxes = apiAxes && apiAxes.length > 0
    ? apiAxes.map(a => a.text)
    : [
      t('axe_1', "Proclamer l'Évangile de Jésus-Christ dans tout le diocèse"),
      t('axe_2', "Formation de disciples engagés et de leaders serviteurs"),
      t('axe_3', "Promouvoir l'éducation et la santé pour tous"),
      t('axe_4', "Accompagner les plus vulnérables et renforcer la solidarité"),
      t('axe_5', "Œuvrer pour la paix, la réconciliation et la justice sociale"),
      t('axe_6', "Développer des paroisses autonomes et dynamiques"),
    ];

  const displayValues = apiValues && apiValues.length > 0
    ? apiValues.map(v => ({
      icon: iconMap[v.icon] || Heart,
      title: v.title,
      description: v.description
    }))
    : [
      { icon: Cross, title: t('value_faith', "Foi"), description: t('value_faith_desc', "Enracinés dans les Écritures et la tradition anglicane, nous vivons une foi authentique et transformatrice.") },
      { icon: Heart, title: t('value_love', "Amour"), description: t('value_love_desc', "L'amour du prochain est au centre de toutes nos actions, dans la lignée du commandement de Christ.") },
      { icon: Users, title: t('value_community', "Communauté"), description: t('value_community_desc', "Nous croyons en la force de la communauté pour porter ensemble les défis et les joies de la vie.") },
      { icon: Shield, title: t('value_integrity', "Intégrité"), description: t('value_integrity_desc', "Transparence, honnêteté et responsabilité guident notre gouvernance et nos relations.") },
    ];

  const isLoading = loadingAxes || loadingValues || loadingSettings || loadingPresentation;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {isLoading ? (
          <div className="flex justify-center pt-32 pb-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="pb-24">
            {/* Section Vision (Hero Photo Background) */}
            <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 overflow-hidden mb-16">
              <div className="absolute inset-0">
                <img src={visionBg} alt="Vision" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-violet-950/80 mix-blend-multiply"></div>
              </div>
              <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-5xl mx-auto"
                >
                  <BookOpen className="h-16 w-16 text-white/40 mx-auto mb-8" />
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight uppercase">
                    {t('vision_title', 'Notre Vision')}
                  </h2>
                  <p className="font-heading text-2xl md:text-4xl lg:text-5xl text-white leading-tight md:leading-snug italic font-medium drop-shadow-xl">
                    « {presentation?.[`vision_description_${lang}`] || presentation?.vision_description_fr || settings?.[`vision_text_${lang}`] || settings?.vision_text_fr || t('vision_text_default')}»
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Section Mission avec Photo latérale */}
            <section className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                  {/* Photo latérale */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-5"
                  >
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 aspect-[4/5]">
                      <img src={missionImg} alt="Mission" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <Target className="h-10 w-10 text-white mb-4 opacity-80" />
                        <h3 className="text-3xl font-heading font-bold text-white mb-2">
                          {t('act_concretely', 'Agir concrètement')}
                        </h3>
                        <p className="text-slate-200 font-body">
                          {t('mission_center', 'Notre mission au centre du développement communautaire.')}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Axes Missionnels */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-7"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-1.5 bg-violet-600 rounded-full"></div>
                      <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        {t('mission_title', 'Notre Mission')}
                      </h2>
                    </div>
                    <p className="font-body text-slate-500 text-lg mb-10">
                      {presentation?.[`mission_description_${lang}`] || presentation?.mission_description_fr || settings?.[`mission_intro_${lang}`] || settings?.mission_intro_fr || t('mission_intro_default')}
                    </p>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {displayAxes.map((axe, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-violet-100 transition-all group"
                        >
                          <div className="text-4xl font-heading font-black text-violet-200 mb-4 group-hover:text-violet-300 transition-colors">
                            0{index + 1}
                          </div>
                          <p className="font-body text-slate-700 text-[15px] leading-relaxed font-medium">
                            {axe}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Section Valeurs */}
            <section className="py-24 bg-slate-50 border-t border-slate-200/50">
              <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                    {t('our_core_values', 'Nos Valeurs Fondamentales')}
                  </h2>
                  <p className="text-lg text-slate-500 font-body max-w-2xl mx-auto">
                    {t('values_description_mission', 'Les principes bibliques qui guident chacune de nos actions et unissent notre communauté.')}
                  </p>

                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {displayValues.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                        <value.icon className="h-8 w-8" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-slate-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="font-body text-slate-500 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VisionMission;
