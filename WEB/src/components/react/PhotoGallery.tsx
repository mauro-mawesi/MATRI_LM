import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

const placeholderPhotos = Array.from({ length: 8 }, (_, i) => ({
  id: `photo-${i + 1}`,
  src: '/images/placeholder.svg',
  alt: `Photo ${i + 1}`,
}));

export default function PhotoGallery() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPhoto = placeholderPhotos.find((p) => p.id === selected);
  
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Smooth out the scroll progress for horizontal translation
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, mass: 0.5, stiffness: 100 });
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-80%"]); // Adjust max translation based on number of items

  return (
    // Tall container to enable vertical scrolling (determines duration of sticky scroll)
    <div ref={targetRef} className="relative h-[300vh] bg-ivory">
      {/* Sticky wrapper that stays on screen while vertical scroll happens */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        <div className="absolute top-10 w-full text-center z-10 pointer-events-none drop-shadow-md pb-4 pt-10">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-body mb-3 text-xs font-light uppercase text-gold bg-ivory/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm"
          >
            {t('gallery.subtitle') || "Nuestros Recuerdos"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="font-display text-4xl font-bold md:text-6xl text-charcoal"
          >
            {t('gallery.title') || "Galería"}
          </motion.h2>
        </div>

        {/* Horizontal moving track */}
        <motion.div style={{ x }} className="flex gap-8 pl-[10vw] pr-[50vw]">
          {placeholderPhotos.map((photo, index) => {
            // Give different cards different Y offsets and sizes for visual rhythm
            const isEven = index % 2 === 0;
            const extraOffset = isEven ? 'mt-40' : 'mb-40';
            
            return (
              <motion.button
                type="button"
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className={`group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-xl w-[70vw] md:w-[35vw] h-[55vh] transition-all duration-700 ${extraOffset}`}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay that dims the image until hover */}
                <div className="absolute inset-0 bg-charcoal/20 transition-opacity duration-500 group-hover:opacity-0" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Lightbox with smooth entrance */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-6 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-xl shadow-2xl"
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
                className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/60 text-white/90 backdrop-blur-sm transition-colors hover:bg-gold hover:text-white border border-white/10"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
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
