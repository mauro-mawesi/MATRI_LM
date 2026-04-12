import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

const placeholderPhotos = Array.from({ length: 9 }, (_, i) => ({
  id: `photo-${i + 1}`,
  src: '/images/placeholder.svg',
  alt: `Photo ${i + 1}`,
  span: i === 0 || i === 4 ? 'col-span-2 row-span-2' : '',
}));

export default function PhotoGallery() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPhoto = placeholderPhotos.find((p) => p.id === selected);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax on the whole grid
  const gridY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div ref={containerRef}>
      {/* Header with animated entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="mb-16 text-center"
      >
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
          className="font-display text-4xl font-bold text-charcoal md:text-5xl"
        >
          {t('gallery.title')}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </motion.div>

      {/* Grid with staggered reveals from alternating directions */}
      <motion.div style={{ y: gridY }} className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {placeholderPhotos.map((photo, index) => {
          // Alternate animation directions
          const directions = [
            { x: -30, y: 20, rotate: -2 },
            { x: 0, y: 40, rotate: 0 },
            { x: 30, y: 20, rotate: 2 },
            { x: 0, y: 30, rotate: -1 },
          ];
          const dir = directions[index % directions.length];

          return (
            <motion.button
              type="button"
              key={photo.id}
              initial={{ opacity: 0, x: dir.x, y: dir.y, rotate: dir.rotate }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: index * 0.06,
                duration: 0.8,
                ease: [0.19, 1, 0.22, 1],
              }}
              whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.3 } }}
              onClick={() => setSelected(photo.id)}
              className={`group relative cursor-pointer overflow-hidden bg-ivory-warm ${photo.span}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Lightbox with smooth entrance */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-6 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="h-full w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/40 text-white/80 transition-colors hover:text-white"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
