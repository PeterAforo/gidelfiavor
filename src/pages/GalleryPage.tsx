import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { albumsApi } from "@/lib/api";
import { usePageSections } from "@/hooks/useCms";
import SectionRenderer from "@/components/SectionRenderer";
import PageHeader from "@/components/PageHeader";
import { FolderOpen, X, ChevronLeft, ChevronRight } from "lucide-react";

const GalleryPage = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; index: number } | null>(null);

  // Try to load sections from backend Page Builder
  const { data: pageSections = [] } = usePageSections("gallery");

  // Fetch all albums
  const { data: albums = [], isLoading } = useQuery({
    queryKey: ["albums"],
    queryFn: albumsApi.getAll,
  });

  // Fetch selected album details with media
  const { data: albumDetail } = useQuery({
    queryKey: ["album", selectedAlbum?.id],
    queryFn: () => albumsApi.getById(selectedAlbum.id),
    enabled: !!selectedAlbum,
  });

  // If sections exist in backend, render them instead of hardcoded content
  if (pageSections.length > 0) {
    return (
      <main className="pt-20">
        <SectionRenderer sections={pageSections} />
      </main>
    );
  }

  const openLightbox = (url: string, index: number) => {
    setLightboxImage({ url, index });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightboxImage || !albumDetail?.media) return;
    const media = albumDetail.media;
    let newIndex = direction === 'next' 
      ? (lightboxImage.index + 1) % media.length
      : (lightboxImage.index - 1 + media.length) % media.length;
    setLightboxImage({
      url: media[newIndex].media_url,
      index: newIndex,
    });
  };

  return (
    <main className="pt-20">
      <PageHeader
        title="Gallery"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Gallery" }
        ]}
      />
      
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading gallery...</p>
          ) : albums.length === 0 ? (
            <p className="text-center text-muted-foreground">No albums available yet.</p>
          ) : !selectedAlbum ? (
            /* Albums Grid */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {albums.map((album: any, index: number) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedAlbum(album)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    {album.cover_url ? (
                      <img
                        src={album.cover_url}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderOpen size={48} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white font-display font-bold text-lg">{album.title}</h3>
                      {album.description && (
                        <p className="text-white/70 text-sm font-body line-clamp-2 mt-1">{album.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Album Detail View */
            <div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="font-body">Back to Albums</span>
              </button>

              <div className="mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground">{selectedAlbum.title}</h2>
                {selectedAlbum.description && (
                  <p className="text-muted-foreground font-body mt-2">{selectedAlbum.description}</p>
                )}
              </div>

              {albumDetail?.media && albumDetail.media.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
                >
                  {albumDetail.media.map((media: any, index: number) => (
                    <div
                      key={media.id}
                      onClick={() => openLightbox(media.media_url, index)}
                      className="break-inside-avoid overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={media.media_url}
                        alt=""
                        className="w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-2xl"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <p className="text-center text-muted-foreground py-12">No images in this album yet.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            className="absolute left-4 text-white/70 hover:text-white p-2"
          >
            <ChevronLeft size={40} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            className="absolute right-4 text-white/70 hover:text-white p-2"
          >
            <ChevronRight size={40} />
          </button>

          <div className="max-w-5xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.url}
              alt=""
              className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
