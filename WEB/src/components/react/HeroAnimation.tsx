import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { siteConfig } from '../../config/site';
import FloralDecorations from './FloralDecorations';
import SignatureSVG from './SignatureSVG';

/* ─── Structured Date Block (matching the invitation reference) ─── */

function DateBlock({ day, dateShort, year, time }: {
  day: string;
  dateShort: string;
  year: string;
  time: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.6, ease: [0.19, 1, 0.22, 1] }}
      className="inline-flex items-stretch border border-charcoal/20"
    >
      {/* Day of week */}
      <div className="flex items-center px-5 py-3 sm:px-7 sm:py-4">
        <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.25em] text-charcoal sm:text-xs">
          {day}
        </span>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-charcoal/20" />

      {/* Date + Year */}
      <div className="flex flex-col items-center justify-center px-5 py-3 sm:px-7 sm:py-4">
        <span className="font-display text-lg font-bold leading-tight text-charcoal sm:text-xl">
          {dateShort}
        </span>
        <span className="font-body text-[0.65rem] font-light tracking-[0.2em] text-charcoal-muted sm:text-xs">
          {year}
        </span>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-charcoal/20" />

      {/* Time */}
      <div className="flex items-center px-5 py-3 sm:px-7 sm:py-4">
        <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.25em] text-charcoal sm:text-xs">
          {time}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Main Hero Component ─── */

export default function HeroAnimation() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  // Scroll parallax (reduced range for elegance)
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="bg-gradient-hero relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Botanical corners + gold glitter */}
      <FloralDecorations variant="hero-corners" intensity="medium" />

      {/* Content */}
      <motion.div style={{ y: y1, opacity }} className="relative z-10 text-center">
        {/* Top Ornament */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mb-6 h-16 w-px bg-gradient-to-b from-transparent via-gold to-transparent sm:mb-10 sm:h-20"
        />

        {/* "YOU ARE INVITED" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="mb-2"
        >
          <span className="font-body text-[0.7rem] font-bold uppercase tracking-[0.25em] text-charcoal sm:text-xs">
            {t('hero.invited')}
          </span>
        </motion.div>

        {/* "TO CELEBRATE OUR WEDDING" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
          className="mb-8"
        >
          <span className="font-body text-[0.6rem] font-light uppercase tracking-[0.3em] text-charcoal-muted sm:text-[0.7rem]">
            {t('hero.toWedding')}
          </span>
        </motion.div>

        {/* Names - Calligraphy SVG (Allison font, matching invitation) */}
        <div className="my-4 px-2 sm:px-6">
          <SignatureSVG />
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
          className="font-body mx-auto mt-6 max-w-md text-[0.85rem] font-light italic text-charcoal-muted sm:text-sm"
        >
          {t('hero.description')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1.3, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-8 mb-8 h-px w-20 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        {/* Structured Date Block */}
        <div className="mb-8 flex justify-center">
          <DateBlock
            day={t('hero.day')}
            dateShort={t('hero.dateShort')}
            year={t('hero.year')}
            time={t('hero.time')}
          />
        </div>

        {/* Venue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: 'easeOut' }}
          className="mb-2"
        >
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-charcoal sm:text-sm">
            {t('hero.venue')}
          </p>
          <p className="font-body mt-1 text-[0.7rem] font-light text-charcoal-muted sm:text-xs">
            {t('hero.address')}
          </p>
        </motion.div>

        {/* Closing + Hashtag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2, ease: 'easeOut' }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <p className="font-body text-[0.8rem] font-light italic text-charcoal-muted sm:text-sm">
            {t('hero.closing')}
          </p>
          <p className="font-body text-[0.75rem] font-medium text-charcoal sm:text-sm">
            {siteConfig.hashtag}
          </p>
        </motion.div>

        {/* Bottom Ornament */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-10 h-20 w-px bg-gradient-to-b from-transparent via-gold to-transparent sm:h-24"
        />

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: 'easeOut' }}
          className="mt-8"
        >
          <a
            href="#rsvp"
            className="group relative inline-block overflow-hidden rounded-sm border border-gold/40 px-10 py-4 transition-all duration-500 hover:border-gold"
          >
            <span className="relative z-10 font-body text-xs font-medium uppercase tracking-[0.25em] text-charcoal-light transition-colors group-hover:text-gold">
              {t('hero.cta')}
            </span>
            <div className="absolute inset-0 z-0 bg-gold/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="hero-cta-shimmer absolute inset-0 z-[1]" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-charcoal-muted/60">
            Scroll
          </span>
          <motion.div
            className="mx-auto mt-2 h-10 w-px bg-charcoal-muted/20"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 3, duration: 1 }}
            style={{ originY: 0 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
