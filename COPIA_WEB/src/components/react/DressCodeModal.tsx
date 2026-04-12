import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

const content = {
  es: {
    trigger: 'Casual Elegante',
    triggerHint: '(ver guia)',
    title: 'Casual Elegante',
    subtitle: 'Guia de Vestimenta',
    description:
      'Queremos que te sientas comodo y a la vez elegante. Piensa en un look sofisticado pero relajado: no tan formal como un traje completo, pero mas cuidado que ropa del dia a dia.',
    women: {
      label: 'Ella',
      tips: [
        'Vestido midi o largo en telas fluidas',
        'Conjunto de pantalon y blusa elegante',
        'Jumpsuit sofisticado',
        'Tacones medianos o flats elegantes',
        'Colores pasteles, tierra o joyas',
      ],
    },
    men: {
      label: 'El',
      tips: [
        'Pantalon de vestir o chino bien cortado',
        'Camisa de cuello (con o sin corbata)',
        'Blazer o saco sport (opcional)',
        'Zapatos de cuero o mocasines',
        'Colores neutros: azul, gris, beige, blanco',
      ],
    },
    note: 'Evitar: jeans, zapatillas deportivas, shorts o camisetas informales.',
    close: 'Entendido',
  },
  en: {
    trigger: 'Smart Casual',
    triggerHint: '(see guide)',
    title: 'Smart Casual',
    subtitle: 'Dress Code Guide',
    description:
      "We want you to feel comfortable yet elegant. Think sophisticated but relaxed: not as formal as a full suit, but more polished than everyday wear.",
    women: {
      label: 'Her',
      tips: [
        'Midi or maxi dress in flowing fabrics',
        'Elegant pants and blouse combo',
        'Sophisticated jumpsuit',
        'Mid-heels or elegant flats',
        'Pastels, earth tones, or jewel tones',
      ],
    },
    men: {
      label: 'Him',
      tips: [
        'Dress pants or well-fitted chinos',
        'Collared shirt (tie optional)',
        'Blazer or sport coat (optional)',
        'Leather shoes or loafers',
        'Neutral colors: navy, grey, beige, white',
      ],
    },
    note: 'Please avoid: jeans, sneakers, shorts, or casual t-shirts.',
    close: 'Got it',
  },
} as const;

export default function DressCodeModal() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const t = content[lang];

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-ivory p-6 shadow-2xl sm:p-8 md:p-10"
          >
              {/* Close button */}
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-charcoal-muted transition-colors hover:text-gold"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-8 text-center">
                <p className="font-body mb-2 text-xs font-light uppercase tracking-[0.3em] text-gold">
                  {t.subtitle}
                </p>
                <h3 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
                  {t.title}
                </h3>
                <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
              </div>

              {/* Description */}
              <p className="font-body mx-auto mb-8 max-w-lg text-center text-sm font-light leading-relaxed text-charcoal-muted">
                {t.description}
              </p>

              {/* Image + Tips Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Women */}
                <div className="text-center">
                  <div className="mx-auto mb-4 aspect-[4/5] max-w-[200px] overflow-hidden rounded-lg">
                    <img
                      src="/images/dresscode-women.svg"
                      alt={t.women.label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-display mb-3 text-lg font-bold text-charcoal">{t.women.label}</h4>
                  <ul className="space-y-1.5 text-left">
                    {t.women.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 font-body text-xs font-light leading-relaxed text-charcoal-muted">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Men */}
                <div className="text-center">
                  <div className="mx-auto mb-4 aspect-[4/5] max-w-[200px] overflow-hidden rounded-lg">
                    <img
                      src="/images/dresscode-men.svg"
                      alt={t.men.label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-display mb-3 text-lg font-bold text-charcoal">{t.men.label}</h4>
                  <ul className="space-y-1.5 text-left">
                    {t.men.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 font-body text-xs font-light leading-relaxed text-charcoal-muted">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Note */}
              <div className="mt-8 rounded-lg border border-gold/20 bg-gold/5 px-5 py-3 text-center">
                <p className="font-body text-xs font-light italic text-charcoal-muted">
                  {t.note}
                </p>
              </div>

              {/* Close CTA */}
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={close}
                  className="inline-block rounded-sm border border-gold/40 px-10 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:border-gold hover:bg-gold/5 hover:text-gold"
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
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-1.5 text-gold transition-colors hover:text-gold-dark"
      >
        <span className="ml-1 underline decoration-gold/30 underline-offset-4 transition-all group-hover:decoration-gold">
          {t.trigger}
        </span>
        <span className="text-[10px] font-light text-charcoal-muted/60 transition-colors group-hover:text-gold-dark">
          {t.triggerHint}
        </span>
      </button>

      {/* Portal: render modal at document.body to escape stacking contexts */}
      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}
