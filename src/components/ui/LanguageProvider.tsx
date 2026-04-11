'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getDictionary } from '@/lib/dictionaries';

type Language = 'zh' | 'ru' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dict: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLang = 'en' }: { children: ReactNode, initialLang?: Language }) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [dict, setDict] = useState(getDictionary(initialLang));

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    setDict(getDictionary(newLang));
    localStorage.setItem('preferred_lang', newLang);
  };

  useEffect(() => {
    const stored = localStorage.getItem('preferred_lang') as Language;
    if (stored && (stored === 'zh' || stored === 'ru' || stored === 'en')) {
      setLang(stored);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
