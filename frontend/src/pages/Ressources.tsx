import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Image, Video, ExternalLink, Loader2, PlayCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import MediaPlayer from "@/components/MediaPlayer";
import { useSermons } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Ressources = () => {
  const { t, i18n } = useTranslation();
  const { data: sermons, isLoading } = useSermons();
  const [activeMedia, setActiveMedia] = useState<{
    url: string;
    title: string;
    type: 'video' | 'audio' | 'youtube';
  } | null>(null);

  // Filtrage intelligent selon les types de l'admin
  const sermonList = (Array.isArray(sermons) ? sermons : (sermons?.results || []));

  const videoResources = sermonList.filter(s =>
    s.content_type === 'youtube' || s.content_type === 'video'
  ) || [];

  const audioResources = sermonList.filter(s =>
    s.content_type === 'audio'
  ) || [];

  const documentResources = sermonList.filter(s =>
    s.content_type === 'document'
  ) || [];

  const handleDownload = (doc: any) => {
    const url = doc.document_display_url || doc.audio_display_url || doc.video_display_url;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* --- HERO SECTION PREMIUM (IMAGE FIXE) --- */}
      <section className="relative h-[60vh] min-h-[450px] w-full overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop"
            alt="Ressources Diocésaines"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        </div>

        <div className="container relative h-full flex flex-col px-6 lg:px-12 z-20">
          <div className="h-32 md:h-40 shrink-0" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col justify-center space-y-4 md:space-y-6 pb-12"
          >
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Makamba
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-[1.1] tracking-tight drop-shadow-xl max-w-3xl">
              {t('nav_resources', "Ressources")}
            </h1>
            <p className="text-base md:text-lg text-white/80 font-light leading-relaxed max-w-2xl drop-shadow-md">
              {t('nav_resources_desc', "Découvrez nos enseignements, prédications et documents utiles mis à jour par le diocèse.")}
            </p>
          </motion.div>
        </div>
      </section>
      <main className="pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium italic">{t('loading_resources', 'Synchronisation des ressources...')}</p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* 🎥 SECTION VIDEOS (YOUTUBE OU LOCAL) */}
            {videoResources.length > 0 && (
              <section className="section-padding bg-background">
                <div className="container mx-auto max-w-6xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Video className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('resources_videos_title', 'Vidéos & Enseignements')}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoResources.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-xl transition-all group flex flex-col"
                      >
                        <div className="relative aspect-video bg-slate-100">
                          {video.image_url ? (
                            <img src={video.image_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                              <Video className="h-12 w-12 text-slate-700" />
                            </div>
                          )}
                          <button
                            onClick={() => video.video_display_url && setActiveMedia({
                              url: video.video_display_url,
                              title: video.title,
                              type: video.content_type as any
                            })}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
                          >
                            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <PlayCircle className="h-8 w-8 text-white ml-0.5" />
                            </div>
                          </button>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {video.content_type === 'youtube' ? 'YouTube' : t('diocese_tv', 'Diocèse TV')}
                            </span>
                            <span className="text-xs text-muted-foreground">{video.duration_minutes ? `${video.duration_minutes} min` : ''}</span>
                          </div>
                          <h3 className="font-heading text-lg font-bold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{video.description}</p>
                          <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
                            <span>{video.preacher_name}</span>
                            <span>{new Date(video.sermon_date).toLocaleDateString(i18n.language)}</span>

                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 🎙️ SECTION AUDIOS */}
            {audioResources.length > 0 && (
              <section className="section-padding section-alt">
                <div className="container mx-auto max-w-5xl">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Download className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('resources_audios_title', 'Émissions & Prédications Audio')}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {audioResources.map((audio, index) => (
                      <motion.div
                        key={audio.id}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => audio.audio_display_url && setActiveMedia({
                          url: audio.audio_display_url,
                          title: audio.title,
                          type: 'audio'
                        })}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <PlayCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{audio.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>MP3</span>
                              <span>•</span>
                              <span>{audio.preacher_name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 📄 SECTION DOCUMENTS (PDF/DOC) */}
            {documentResources.length > 0 && (
              <section className="section-padding bg-background border-t border-border">
                <div className="container mx-auto max-w-5xl">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('resources_docs_title', 'Documents & Publications')}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentResources.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group flex flex-col items-center text-center cursor-pointer"
                        onClick={() => handleDownload(doc)}
                      >
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FileText className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="font-heading font-bold text-slate-800 mb-2">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{doc.description}</p>
                        <Button
                          variant="outline"
                          className="mt-auto rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" /> {t('download', 'Télécharger')}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Si aucune ressource du tout */}
            {!isLoading && videoResources.length === 0 && audioResources.length === 0 && documentResources.length === 0 && (
              <section className="section-padding py-32 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">{t('resources_empty_title', 'Espace ressources vide')}</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  {t('resources_empty_desc', "Le diocèse n'a pas encore publié de documents ou de médias. Veuillez revenir plus tard pour accéder aux partages.")}
                </p>
              </section>
            )}

            {/* Gallery placeholder */}
            <section className="section-padding bg-background opacity-60">
              <div className="container mx-auto max-w-5xl text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Image className="h-6 w-6 text-slate-400" />
                  <h2 className="font-heading text-2xl font-bold text-slate-500">{t('gallery_title', 'Galerie photos')}</h2>
                </div>
                <p className="font-body text-slate-400 text-sm max-w-md mx-auto border-t border-slate-100 pt-6">
                  {t('gallery_placeholder', "Le module galerie sera bientôt actif pour visualiser nos événements en images. En attendant, suivez-nous sur les réseaux sociaux.")}
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Lecteur Multimédia Professionnel */}
      {activeMedia && (
        <MediaPlayer
          url={activeMedia.url}
          title={activeMedia.title}
          type={activeMedia.type}
          onClose={() => setActiveMedia(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Ressources;
