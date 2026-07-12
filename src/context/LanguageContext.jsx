import { createContext, useContext, useState, useEffect } from 'react';
import ar from '../i18n/ar.js';
import en from '../i18n/en.js';

const TRANSLATIONS = { ar, en };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('akwab-lang') || 'ar');

  useEffect(() => {
    localStorage.setItem('akwab-lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    const keys = key.split('.');
    let val = TRANSLATIONS[lang];
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) return key;
    }
    return val;
  };

  const toggle = () => setLang(l => (l === 'ar' ? 'en' : 'ar'));

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
