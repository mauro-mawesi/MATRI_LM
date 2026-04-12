import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';
import { milestones } from '../../config/timeline';

export default function LoveTimeline() {
  const { lang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the vertical line growth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl px-4">
      {/* Section header with staggered entrance */}
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
          {t('story.subtitle')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="font-display text-4xl font-bold text-charcoal md:text-5xl"
        >
          {t('story.title')}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </motion.div>

      {/* Vertical line that grows with scroll progress */}
      <motion.div
        style={{ scaleY: lineScaleY }}
        className="absolute left-1/2 top-48 hidden h-[calc(100%-14rem)] w-px origin-top -translate-x-1/2 bg-gradient-to-b from-gold/40 via-gold/20 to-gold/5 md:block"
      />

      <div className="space-y-8 md:space-y-0">
        {milestones.map((milestone, index) => {
          const isLeft = index % 2 === 0;
          const title = lang === 'es' ? milestone.titleEs : milestone.titleEn;
          const description = lang === 'es' ? milestone.descriptionEs : milestone.descriptionEn;

          return (
            <motion.div
              key={milestone.id}
              initial={{
                opacity: 0,
                x: isLeft ? -60 : 60,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.19, 1, 0.22, 1],
              }}
              className={`relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center md:gap-12 md:py-8`}
            >
              <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  className="border border-gold/10 bg-white/70 p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/25 hover:bg-white/90 hover:shadow-lg hover:shadow-gold/5 md:p-8"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="font-body text-xs font-light uppercase tracking-[0.3em] text-gold"
                  >
                    {milestone.date}
                  </motion.span>
                  <h3 className="font-display mt-2 text-xl font-bold text-charcoal md:text-2xl">
                    {title}
                  </h3>
                  <p className="font-body mt-3 text-sm font-light leading-relaxed text-charcoal-muted">
                    {description}
                  </p>
                </motion.div>
              </div>

              {/* Center dot (desktop) - pops in with spring */}
              <div className="hidden md:flex md:shrink-0 md:items-center md:justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: 45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                    delay: 0.3,
                  }}
                  className="relative z-10"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gold shadow-md shadow-gold/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                </motion.div>
              </div>

              {/* Spacer */}
              <div className="hidden flex-1 md:block" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
