import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Translations } from '../locales/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  currentTranslations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('vivi-sews-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (lang === 'en' || lang === 'es') {
      setLanguageState(lang);
      localStorage.setItem('vivi-sews-language', lang);
    }
  };

  // Translation function that navigates nested object keys
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = keys.reduce((obj, k) => (obj as any)?.[k], translations.en);
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const currentTranslations = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      currentTranslations,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
