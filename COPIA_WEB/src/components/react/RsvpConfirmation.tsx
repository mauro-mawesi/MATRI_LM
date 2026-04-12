import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

interface Props {
  onClose: () => void;
}

export default function RsvpConfirmation({ onClose }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('trigger-confetti'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-lg py-12 text-center"
    >
      <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <h3 className="font-display text-3xl font-bold text-charcoal">
        {t('rsvp.success.title')}
      </h3>
      <p className="font-body mt-4 text-sm font-light leading-relaxed text-charcoal-muted">
        {t('rsvp.success.message')}
      </p>
      <div className="mx-auto mt-6 mb-8 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <motion.button
        type="button"
        onClick={onClose}
        className="border border-gold/30 px-8 py-3 font-body text-xs font-light uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        &larr;
      </motion.button>
    </motion.div>
  );
}
