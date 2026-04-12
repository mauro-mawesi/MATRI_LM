import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

interface GalleryPhoto {
  id: string;
  name: string;
  src: string;
}

function GalleryHeader({ t }: { t: (key: string) => string }) {
  return (
    <div className="w-full pb-8 text-center pt-4 md:pb-10 md:pt-8">
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.15 }}
        className="font-body mb-3 text-xs font-light uppercase text-gold"
      >
        {t('gallery.subtitle')}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
        className="font-display text-4xl font-bold text-charcoal md:text-6xl"
      >
        {t('gallery.title')}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="mx-auto mt-4 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </div>
  );
}

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
        className="relative flex max-h-[88vh] w-full max-w-5xl items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-charcoal/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[88vh] w-full object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-charcoal/60 text-white/90 backdrop-blur-sm transition-colors hover:bg-gold hover:text-white"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-ivory/90 text-charcoal shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-35"
      aria-label={direction === 'prev' ? 'Previous photo' : 'Next photo'}
    >
      <svg
        className={`h-5 w-5 ${direction === 'prev' ? '' : 'rotate-180'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </button>
  );
}

export default function PhotoGallery() {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => setPhotos(data.photos ?? []))
      .catch(() => {});
  }, []);

  const goTo = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const clamped = Math.max(0, Math.min(index, photos.length - 1));
    const slide = scroller.children.item(clamped) as HTMLElement | null;
    if (!slide) return;

    scroller.scrollTo({
      left: slide.offsetLeft - scroller.offsetLeft,
      behavior,
    });
    setActiveIndex(clamped);
  }, [photos.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || photos.length === 0) return;

    const handleScroll = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;

      Array.from(scroller.children).forEach((child, index) => {
        const el = child as HTMLElement;
        const childCenter = el.offsetLeft + el.offsetWidth / 2 - scroller.offsetLeft;
        const currentDistance = Math.abs(center - childCenter);
        if (currentDistance < distance) {
          distance = currentDistance;
          nearest = index;
        }
      });

      setActiveIndex(nearest);
    };

    handleScroll();
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null);
      if (event.key === 'ArrowRight') {
        setSelectedIndex((prev) => prev === null ? prev : Math.min(prev + 1, photos.length - 1));
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((prev) => prev === null ? prev : Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex];
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < photos.length - 1;

  const previewPhotos = useMemo(() => photos.slice(0, 8), [photos]);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold text-charcoal md:text-5xl"
          >
            {t('gallery.title')}
          </motion.h2>
          <p className="font-body mt-4 text-sm font-light italic text-charcoal-muted/50">
            {t('gallery.subtitle')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative px-4 py-12 md:px-8 md:py-16">
        <GalleryHeader t={t} />

        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/10 bg-white/55 p-3 shadow-[0_20px_80px_-40px_rgba(30,30,30,0.28)] backdrop-blur-sm md:p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/45 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ivory via-ivory/55 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ivory via-ivory/55 to-transparent" />

            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-2 md:gap-6 md:px-4 [&::-webkit-scrollbar]:hidden"
              data-lenis-prevent
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {photos.map((photo, index) => {
                const isActive = index === activeIndex;

                return (
                  <motion.button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`group relative shrink-0 snap-center overflow-hidden rounded-[1.6rem] border text-left transition-all duration-500 ${
                      isActive
                        ? 'border-gold/35 shadow-[0_18px_50px_-30px_rgba(212,175,55,0.45)]'
                        : 'border-gold/10 shadow-[0_14px_40px_-32px_rgba(30,30,30,0.24)]'
                    }`}
                    style={{
                      width: 'min(82vw, 760px)',
                    }}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: Math.min(index * 0.08, 0.4), ease: [0.19, 1, 0.22, 1] }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-ivory md:aspect-[16/10]">
                      <img
                        src={photo.src}
                        alt={photo.name}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/22 via-transparent to-white/10" />

                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 md:p-6">
                        <div>
                          <p className="font-body text-[0.65rem] uppercase tracking-[0.28em] text-white/70">
                            {String(index + 1).padStart(2, '0')}
                          </p>
                          <p className="font-display mt-1 text-lg text-white md:text-2xl">
                            Laura & Mauro
                          </p>
                        </div>

                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-body text-[0.62rem] uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
                          Ver foto
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="relative z-10 mt-5 flex items-center justify-between gap-4 px-2 md:mt-6 md:px-4">
              <div className="flex items-center gap-3">
                <ArrowButton direction="prev" onClick={() => goTo(activeIndex - 1)} disabled={!canGoPrev} />
                <ArrowButton direction="next" onClick={() => goTo(activeIndex + 1)} disabled={!canGoNext} />
              </div>

              <div className="hidden items-center gap-2 md:flex">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'w-8 bg-gold' : 'w-2 bg-gold/25 hover:bg-gold/45'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="font-body text-[0.68rem] uppercase tracking-[0.28em] text-charcoal-muted/55">
                {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </div>
            </div>
          </div>

          {previewPhotos.length > 1 && (
            <div className="mt-6 md:mt-8">
              <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {previewPhotos.map((photo, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => goTo(index)}
                      className={`group relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 md:h-24 md:w-20 ${
                        isActive ? 'border-gold shadow-md' : 'border-gold/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-transparent' : 'bg-charcoal/20'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            src={selectedPhoto.src}
            alt={selectedPhoto.name}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
