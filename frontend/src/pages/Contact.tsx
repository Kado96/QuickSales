import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useApi";
import { api } from "@/lib/api";

const Contact = () => {
  const { t } = useTranslation();
  const { data: settings, isLoading } = useSiteSettings();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/pages/messages/", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de l'envoi de votre message.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHero
        title={t("nav_contact")}
        subtitle={t("contact_hero_subtitle")}
      />
      <main>
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-6xl">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t("contact_form_title")}</h2>

                  {submitted ? (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Send className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t("contact_form_success_title")}</h3>
                      <p className="font-body text-muted-foreground">{t("contact_form_success_desc")}</p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-4 px-5 py-2 rounded-md bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        {t("contact_form_send_another")}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-name" className="block font-body text-sm font-medium text-foreground mb-1.5">{t("contact_label_name")}</label>
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            placeholder={t("contact_placeholder_name")}
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block font-body text-sm font-medium text-foreground mb-1.5">{t("contact_label_email")}</label>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            placeholder={t("contact_placeholder_email")}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="block font-body text-sm font-medium text-foreground mb-1.5">{t("contact_label_subject")}</label>
                        <input
                          id="contact-subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          placeholder={t("contact_placeholder_subject")}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-message" className="block font-body text-sm font-medium text-foreground mb-1.5">{t("contact_label_message")}</label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                          placeholder={t("contact_placeholder_message")}
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-md bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        <Send className="h-4 w-4" /> {t("contact_btn_send")}
                      </button>
                    </form>
                  )}
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t("contact_info_title")}</h2>

                  <div className="space-y-6 mb-10">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-body font-semibold text-foreground text-sm mb-1">{t("contact_info_address")}</h3>
                        <p className="font-body text-muted-foreground text-sm">
                          {settings?.address || "Bureau diocésain, Centre-ville, Makamba, Burundi"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-body font-semibold text-foreground text-sm mb-1">{t("contact_info_phone")}</h3>
                        <p className="font-body text-muted-foreground text-sm">
                          {settings?.contact_phone || "+257 XX XX XX XX"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-body font-semibold text-foreground text-sm mb-1">{t("contact_info_email")}</h3>
                        <p className="font-body text-muted-foreground text-sm">
                          {settings?.contact_email || "contact@diocese-makamba.org"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-body font-semibold text-foreground text-sm mb-1">{t("contact_info_hours")}</h3>
                        <p className="font-body text-muted-foreground text-sm">{t("contact_hours_week")}<br />{t("contact_hours_sat")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="rounded-xl overflow-hidden border border-border">
                    <iframe
                      title={t("contact_map_title")}
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63704.24!2d29.57!3d-4.13!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c14f3b3b3b3b3b%3A0x0!2sMakamba%2C%20Burundi!5e0!3m2!1sfr!2s!4v1"
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
