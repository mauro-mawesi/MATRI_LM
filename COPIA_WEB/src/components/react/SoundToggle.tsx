import { motion } from 'motion/react';
import { useSound } from '../../hooks/useSound';
import { useLanguage } from '../../hooks/useLanguage';

export default function SoundToggle() {
  const { enabled, toggle } = useSound();
  const { t } = useLanguage();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      className="flex items-center px-2 py-1.5 text-charcoal-muted transition-colors hover:text-gold"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={t('a11y.soundToggle')}
    >
      {enabled ? (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </motion.button>
  );
}
