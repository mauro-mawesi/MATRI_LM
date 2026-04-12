import { useLanguage } from '../../hooks/useLanguage';
import { motion } from 'motion/react';

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <motion.button
      type="button"
      onClick={toggleLang}
      className="font-body flex items-center gap-1.5 px-3 py-1.5 text-xs font-light uppercase tracking-[0.2em] text-charcoal-muted transition-colors hover:text-gold"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={t('a11y.langToggle')}
    >
      <span className={lang === 'es' ? 'text-gold' : ''}>ES</span>
      <span className="text-gold/30">|</span>
      <span className={lang === 'en' ? 'text-gold' : ''}>EN</span>
    </motion.button>
  );
}
