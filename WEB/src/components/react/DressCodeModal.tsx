import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

const content = {
  es: {
    triggerLabel: 'Dress code',
    trigger: 'Colorful, elegant & garden-inspired',
    triggerHint: 'Toca para ver referencias',
    triggerAction: 'Ver guía visual',
    title: 'Colorful, elegant & garden-inspired',
    subtitle: 'Guía de Vestimenta',
    description:
      'Queremos que te sientas cómodo, elegante y con un toque fresco de jardín. Piensa en colores con vida, siluetas cuidadas y un look sofisticado pero relajado.',
    tabs: { women: 'Ella', men: 'Él' },
    note: 'Evitar: jeans, zapatillas deportivas, shorts o camisetas informales.',
    close: 'Entendido',
    scrollHint: 'Desliza para ver más',
  },
  en: {
    triggerLabel: 'Dress code',
    trigger: 'Colorful, elegant & garden-inspired',
    triggerHint: 'Tap to see outfit references',
    triggerAction: 'Open visual guide',
    title: 'Colorful, elegant & garden-inspired',
    subtitle: 'Dress Code Guide',
    description:
      'We want you to feel comfortable, elegant, and fresh with a garden-inspired touch. Think lively colors, polished silhouettes, and a sophisticated but relaxed look.',
    tabs: { women: 'Her', men: 'Him' },
    note: 'Please avoid: jeans, sneakers, shorts, or casual t-shirts.',
    close: 'Got it',
    scrollHint: 'Swipe to see more',
  },
} as const;

const images = {
  women: '/images/dresscode-mujeres.webp',
  men: '/images/dresscode-hombres.webp',
};

/* ─── Panoramic Image Carousel ─── */
function PanoramicCarousel({ src, alt }: { src: string; alt: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollLeft > 20) setShowHint(false);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-x-auto rounded-lg"
        data-lenis-prevent
        style={{
          scrollSnapType: 'x proximity',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="h-[220px] sm:h-[280px] md:h-[340px] w-auto max-w-none object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Scroll hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-y-0 right-0 flex items-center pointer-events-none"
          >
            <div className="bg-gradient-to-l from-ivory via-ivory/80 to-transparent h-full w-16 flex items-center justify-end pr-2">
              <motion.svg
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="h-5 w-5 text-gold/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </motion.svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Component ─── */
export default function DressCodeModal() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'women' | 'men'>('women');
  const t = content[lang];

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-ivory p-5 shadow-2xl sm:p-8"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full text-charcoal-muted transition-colors hover:text-gold"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <p className="font-body mb-2 text-xs font-light uppercase tracking-[0.3em] text-gold">
                {t.subtitle}
              </p>
              <h3 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
                {t.title}
              </h3>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
              <p className="font-body mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-charcoal-muted">
                {t.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex justify-center">
              <div className="flex rounded-full border border-gold/20 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('women')}
                  className={`rounded-full px-6 py-2 font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                    activeTab === 'women'
                      ? 'bg-gold/10 text-gold'
                      : 'text-charcoal-muted/50 hover:text-charcoal-muted'
                  }`}
                >
                  {t.tabs.women}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('men')}
                  className={`rounded-full px-6 py-2 font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                    activeTab === 'men'
                      ? 'bg-gold/10 text-gold'
                      : 'text-charcoal-muted/50 hover:text-charcoal-muted'
                  }`}
                >
                  {t.tabs.men}
                </button>
              </div>
            </div>

            {/* Panoramic carousel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'women' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'women' ? 20 : -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <PanoramicCarousel
                  src={images[activeTab]}
                  alt={activeTab === 'women' ? t.tabs.women : t.tabs.men}
                />
              </motion.div>
            </AnimatePresence>

            {/* Scroll hint text */}
            <p className="mt-3 text-center font-body text-[0.6rem] tracking-wider text-charcoal-muted/40">
              {t.scrollHint}
            </p>

            {/* Note */}
            <div className="mt-5 rounded-lg border border-gold/20 bg-gold/5 px-5 py-3 text-center">
              <p className="font-body text-xs font-light italic text-charcoal-muted">
                {t.note}
              </p>
            </div>

            {/* Close CTA */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={close}
                className="inline-block rounded-sm border border-gold/40 px-10 py-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:border-gold hover:bg-gold/5 hover:text-gold"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex min-w-[320px] max-w-[92vw] flex-col items-start justify-center overflow-hidden rounded-2xl border border-gold/20 bg-[linear-gradient(135deg,rgba(255,253,249,0.96),rgba(242,219,217,0.75)_55%,rgba(252,250,247,0.98))] px-6 py-5 text-left shadow-[0_18px_50px_-35px_rgba(30,30,30,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_26px_70px_-35px_rgba(212,175,55,0.35)] md:min-w-[420px] md:px-7 md:py-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(156,175,136,0.16),transparent_38%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute right-4 top-4 hidden h-16 w-16 rounded-full border border-white/40 bg-white/35 blur-[0.5px] md:block" />

        <div className="relative z-10 flex w-full items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-white/55 text-gold shadow-sm backdrop-blur-sm">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21v-8m0 0V3m0 10h9m-9 0H3m2 3h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="min-w-0">
              <span className="font-body text-[0.68rem] uppercase tracking-[0.28em] text-charcoal-muted/75">
                {t.triggerLabel}
              </span>
              <p className="font-display mt-2 text-lg leading-tight text-charcoal md:text-[1.65rem]">
                {t.trigger}
              </p>
              <p className="font-body mt-2 max-w-xl text-xs font-light leading-relaxed text-charcoal-muted/75 md:text-sm">
                {t.triggerHint}
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 md:flex">
            <span className="rounded-full border border-gold/30 bg-white/55 px-4 py-2 font-body text-[0.62rem] uppercase tracking-[0.22em] text-charcoal transition-colors duration-300 group-hover:border-gold group-hover:text-gold-dark">
              {t.triggerAction}
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex w-full items-center justify-between border-t border-charcoal/8 pt-4 md:hidden">
          <span className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-charcoal-muted/75">
            {t.triggerAction}
          </span>
          <svg className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </button>

      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}
