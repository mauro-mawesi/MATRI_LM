import { defaultLang, LANG_STORAGE_KEY, type Lang } from './ui';
import { es } from './translations/es';
import { en } from './translations/en';
import type { TranslationKey } from './translations/es';

const translations: Record<Lang, Record<TranslationKey, string>> = { es, en };

export function getLang(): Lang {
  if (typeof window === 'undefined') return defaultLang;
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;
  const browser = navigator.language.slice(0, 2);
  return browser === 'en' ? 'en' : defaultLang;
}

export function t(key: TranslationKey, lang?: Lang): string {
  const l = lang ?? getLang();
  return translations[l][key] ?? translations[defaultLang][key] ?? key;
}

export function useTranslations(lang: Lang) {
  return (key: TranslationKey) => translations[lang][key] ?? translations[defaultLang][key] ?? key;
}
