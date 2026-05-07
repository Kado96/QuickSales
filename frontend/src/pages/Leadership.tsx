import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import bishopImage from "@/assets/bishop-portrait.jpg";
import { Loader2 } from "lucide-react";
import { useSiteSettings, useTeamMembers } from "@/hooks/useApi";

const Leadership = () => {
  const { t, i18n } = useTranslation();
  // Normaliser la langue (ex: 'fr-FR' devient 'fr') pour correspondre aux clés de l'admin
  const lang = (i18n.language || "fr").split('-')[0].toLowerCase();

  const { data: settings, isLoading: loadingSettings } = useSiteSettings();
  const { data: apiTeam, isLoading: loadingTeam } = useTeamMembers();

  const displayTeam = apiTeam && apiTeam.length > 0
    ? [...apiTeam].sort((a, b) => a.order - b.order)
    : [];

  const isLoading = loadingSettings || loadingTeam;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHero
        title={t("nav_leadership", "Leadership")}
        subtitle={settings?.[`hero_subtitle_${lang}`] || t("leadership_hero_subtitle", "L'évêque et l'équipe diocésaine au service de la communauté anglicane de Makamba.")}
      />
      <main>
        {/* Bishop */}
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-5xl">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16"
              >
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={settings?.quote_author_image_display || bishopImage}
                    alt="Évêque du Diocèse de Makamba"
                    className="w-full h-auto object-cover aspect-square md:aspect-[3/4]"
                    loading="lazy"
                  />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-body text-xs font-bold uppercase tracking-wider mb-3">
                    {t("bishop_label", "Évêque diocésain")}
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {settings?.quote_author_name || "Rt. Rev. Samuel Nduwayo"}
                  </h2>
                  <p className="font-body text-muted-foreground text-sm mb-4">
                    {settings?.[`quote_author_subtitle_${lang}`] || settings?.quote_author_subtitle || t("bishop_subtitle_default", "Évêque du Diocèse de Makamba depuis 2009")}
                  </p>
                  <div className="space-y-4">
                    <p className="font-body text-foreground leading-relaxed">
                      {settings?.[`bishop_bio_p1_${lang}`] || settings?.bishop_bio_p1 || t("bishop_bio_p1_default", "Ordonné prêtre en 1995, Mgr Samuel Nduwayo a consacré sa vie au service de l'Église...")}
                    </p>
                    <p className="font-body text-foreground leading-relaxed">
                      {settings?.[`bishop_bio_p2_${lang}`] || settings?.bishop_bio_p2 || t("bishop_bio_p2_default", "Sa vision d'une Église engagée socialement...")}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="mt-6 p-5 bg-muted rounded-lg border-l-4 border-primary">
                    <p className="font-heading text-base italic text-foreground leading-relaxed">
                      « {settings?.[`quote_text_${lang}`] || settings?.quote_text || t("bishop_quote_default", "Notre appel est de servir avec amour et humilité...")} »
                    </p>
                    <p className="font-body text-muted-foreground text-sm mt-2">
                      — {settings?.quote_author_name || "Rt. Rev. Samuel Nduwayo"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Team */}
        {!isLoading && (
          <section className="section-padding section-alt">
            <div className="container mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {settings?.[`team_title_${lang}`] || settings?.team_title || t("team_title_default", "L'équipe diocésaine")}
                </h2>
                <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
                  {settings?.[`team_description_${lang}`] || settings?.team_description || t("team_desc_default", "Les responsables qui accompagnent la vie et la mission du diocèse au quotidien.")}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayTeam.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">{t("team_empty", "Aucun membre de l'équipe enregistré.")}</p>
                  </div>
                ) : displayTeam.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {member.image_display && (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={member.image_display}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold mb-3">
                        {member[`role_${lang}`] || member.role_fr || member.role}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2">{member.name}</h3>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed">
                        {member[`description_${lang}`] || member.description_fr || member.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Leadership;
