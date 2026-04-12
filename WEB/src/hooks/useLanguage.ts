import { useState, useEffect, useCallback, useRef } from 'react';
import { defaultLang, LANG_CHANGE_EVENT, LANG_STORAGE_KEY, type Lang } from '../i18n/ui';
import { es } from '../i18n/translations/es';
import { en } from '../i18n/translations/en';
import type { TranslationKey } from '../i18n/translations/es';

const translations: Record<Lang, Record<TranslationKey, string>> = { es, en };

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return defaultLang;
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;
  return defaultLang;
}

function applyLang(lang: Lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: lang }));
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  const langRef = useRef(lang);
  langRef.current = lang;

  // Hydrate from localStorage on client + dispatch event so Astro sections sync
  useEffect(() => {
    const stored = getStoredLang();
    setLangState(stored);
    if (stored !== defaultLang) {
      applyLang(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    applyLang(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    const next = langRef.current === 'es' ? 'en' : 'es';
    setLang(next);
  }, [setLang]);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations[defaultLang][key] ?? key,
    [lang],
  );

  // Listen for lang changes from other hook instances
  useEffect(() => {
    const handler = (e: Event) => {
      const newLang = (e as CustomEvent<Lang>).detail;
      setLangState(newLang);
    };
    window.addEventListener(LANG_CHANGE_EVENT, handler);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, handler);
  }, []);

  return { lang, setLang, toggleLang, t };
}
