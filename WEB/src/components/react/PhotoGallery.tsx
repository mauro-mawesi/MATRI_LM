import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface GalleryPhoto {
  id: string;
  name: string;
  src: string;
}

/* ─── Gallery Header ─── */
function GalleryHeader({ t }: { t: (key: string) => string }) {
  return (
    <div className="w-full text-center pb-6 pt-4 md:pb-8 md:pt-10">
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="font-body mb-3 text-xs font-light uppercase text-gold"
      >
        {t('gallery.subtitle')}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className="font-display text-4xl font-bold md:text-6xl text-charcoal"
      >
        {t('gallery.title')}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mx-auto mt-4 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </div>
  );
}

/* ─── Photo Card ─── */
function PhotoCard({ photo, index, onClick, isMobile }: {
  photo: GalleryPhoto;
  index: number;
  onClick: () => void;
  isMobile: boolean;
}) {
  const offset = isMobile || index === 0
    ? ''
    : index % 2 === 0 ? '-translate-y-16' : 'translate-y-16';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all duration-700 ${offset}`}
      style={isMobile
        ? { width: '100%', height: '45vh' }
        : { height: '50vh' }
      }
      whileHover={isMobile ? undefined : { scale: 1.03 }}
    >
      <img
        src={photo.src}
        alt={photo.name}
        className={isMobile
          ? 'h-full w-full object-cover'
          : 'h-full w-auto object-cover transition-transform duration-700 group-hover:scale-110'
        }
        style={isMobile ? undefined : { maxWidth: '45vw', minWidth: '25vw' }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-charcoal/15 transition-opacity duration-500 group-hover:opacity-0" />
    </motion.button>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="h-full w-full object-contain" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/60 text-white/90 backdrop-blur-sm transition-colors hover:bg-gold border border-white/10"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Mobile Gallery: horizontal swipe with scroll-snap ─── */
function MobileGallery({ photos, t, onSelect }: {
  photos: GalleryPhoto[];
  t: (key: string) => string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="py-12">
      <GalleryHeader t={t} />

      <div
        className="flex gap-4 overflow-x-auto px-6 pb-6 pt-2"
        data-lenis-prevent
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="flex-shrink-0 w-[80vw]"
            style={{ scrollSnapAlign: 'center' }}
          >
            <PhotoCard
              photo={photo}
              index={index}
              onClick={() => onSelect(photo.id)}
              isMobile
            />
          </div>
        ))}
        {/* End padding */}
        <div className="flex-shrink-0 w-6" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {photos.map((photo) => (
          <div key={photo.id} className="h-1.5 w-1.5 rounded-full bg-gold/30" />
        ))}
      </div>
    </div>
  );
}

/* ─── Desktop Gallery: sticky vertical-to-horizontal scroll ─── */
function DesktopGallery({ photos, t, onSelect }: {
  photos: GalleryPhoto[];
  t: (key: string) => string;
  onSelect: (id: string) => void;
}) {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, mass: 0.5, stiffness: 100 });
  const scrollRange = Math.min(85, photos.length * 25);
  const containerHeight = `${100 + photos.length * 50}vh`; // 1 screen + 50vh per photo
  const x = useTransform(smoothProgress, [0, 1], ['0%', `-${scrollRange}%`]);

  return (
    <div ref={targetRef} className="relative" style={{ height: containerHeight }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="pt-16 pb-4">
          <GalleryHeader t={t} />
        </div>

        <motion.div style={{ x }} className="flex flex-1 items-center gap-8 pl-[10vw] pr-[50vw]">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              onClick={() => onSelect(photo.id)}
              isMobile={false}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function PhotoGallery() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPhoto = photos.find((p) => p.id === selected);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => setPhotos(data.photos ?? []))
      .catch(() => {});
  }, []);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold md:text-5xl text-charcoal"
          >
            {t('gallery.title')}
          </motion.h2>
          <p className="font-body mt-4 text-sm font-light text-charcoal-muted/50 italic">
            {t('gallery.subtitle')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <MobileGallery photos={photos} t={t} onSelect={setSelected} />
      ) : (
        <DesktopGallery photos={photos} t={t} onSelect={setSelected} />
      )}

      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            src={selectedPhoto.src}
            alt={selectedPhoto.name}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
