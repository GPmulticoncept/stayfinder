import { createContext, useContext, useState, useEffect } from 'react';
import { detectLanguage, getT, LANGUAGE_META } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    // 1. User's saved preference
    const saved = localStorage.getItem('sf_lang');
    if (saved && LANGUAGE_META[saved]) return saved;
    // 2. Browser/device language
    return detectLanguage();
  });

  const setLang = (code) => {
    if (!LANGUAGE_META[code]) return;
    setLangState(code);
    localStorage.setItem('sf_lang', code);
  };

  // Apply RTL and lang attribute to document
  useEffect(() => {
    const meta = LANGUAGE_META[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir  = meta?.rtl ? 'rtl' : 'ltr';
  }, [lang]);

  const t = getT(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, meta: LANGUAGE_META }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
