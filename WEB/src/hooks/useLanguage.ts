import { useState, useEffect, useCallback } from 'react';
import { defaultLang, LANG_CHANGE_EVENT, LANG_STORAGE_KEY, type Lang } from '../i18n/ui';
import { es } from '../i18n/translations/es';
import { en } from '../i18n/translations/en';
import type { TranslationKey } from '../i18n/translations/es';

const translations: Record<Lang, Record<TranslationKey, string>> = { es, en };

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return defaultLang;
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;
  const browser = navigator.language.slice(0, 2);
  return browser === 'en' ? 'en' : defaultLang;
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(getStoredLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: newLang }));
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es');
  }, [lang, setLang]);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations[defaultLang][key] ?? key,
    [lang],
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const newLang = (e as CustomEvent<Lang>).detail;
      if (newLang !== lang) setLangState(newLang);
    };
    window.addEventListener(LANG_CHANGE_EVENT, handler);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, handler);
  }, [lang]);

  return { lang, setLang, toggleLang, t };
}
