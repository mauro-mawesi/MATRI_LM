import { useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useCountdown } from '../../hooks/useCountdown';
import { useLanguage } from '../../hooks/useLanguage';
import { siteConfig } from '../../config/site';

function TimeUnit({ value, label, index }: { value: number; label: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: 0.2 + index * 0.15,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: -12, rotateX: -45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 12, rotateX: 45 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="flex h-16 w-16 items-center justify-center border border-gold/20 bg-white/60 backdrop-blur-sm sm:h-20 sm:w-20 md:h-24 md:w-24"
            style={{ perspective: 600 }}
          >
            <span className="font-display text-2xl font-bold text-charcoal sm:text-3xl md:text-4xl">
              {String(value).padStart(2, '0')}
            </span>
          </motion.div>
        </AnimatePresence>
        {/* Subtle glow behind the unit */}
        <div className="absolute inset-0 -z-10 bg-gold/5 blur-xl" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + index * 0.15 }}
        className="font-body mt-3 text-[0.55rem] font-light uppercase tracking-[0.2em] text-charcoal-muted sm:mt-4 sm:text-[0.65rem] sm:tracking-[0.3em]"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export default function CountdownTimer() {
  const { days, hours, minutes, seconds, isComplete } = useCountdown(siteConfig.date);
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="py-12 text-center"
      >
        <span className="font-display text-gradient-gold text-4xl font-bold italic md:text-5xl">
          {t('countdown.passed')}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y, scale }} className="py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20, letterSpacing: '0.15em' }}
        whileInView={{ opacity: 1, y: 0, letterSpacing: '0.05em' }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="font-accent mb-12 text-center text-2xl text-gold md:text-3xl"
      >
        {t('countdown.title')}
      </motion.h2>

      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8">
        <TimeUnit value={days} label={t('countdown.days')} index={0} />
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          className="font-display -mt-8 hidden text-xl text-gold/40 sm:block"
        >
          :
        </motion.span>
        <TimeUnit value={hours} label={t('countdown.hours')} index={1} />
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.75, type: 'spring', stiffness: 200 }}
          className="font-display -mt-8 hidden text-xl text-gold/40 sm:block"
        >
          :
        </motion.span>
        <TimeUnit value={minutes} label={t('countdown.minutes')} index={2} />
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
          className="font-display -mt-8 hidden text-xl text-gold/40 sm:block"
        >
          :
        </motion.span>
        <TimeUnit value={seconds} label={t('countdown.seconds')} index={3} />
      </div>
    </motion.div>
  );
}
