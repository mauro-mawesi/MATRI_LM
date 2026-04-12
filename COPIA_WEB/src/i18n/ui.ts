export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

export const LANG_CHANGE_EVENT = 'lang-change';
export const LANG_STORAGE_KEY = 'wedding-lang';
