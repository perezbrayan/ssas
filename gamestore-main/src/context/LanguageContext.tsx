import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'tw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    const hasSelected = localStorage.getItem('hasSelectedLanguage');
    
    if (savedLanguage as Language) {
      setLanguage(savedLanguage as Language);
    }
    
    if (hasSelected) {
      setHasSelectedLanguage(true);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleSetHasSelected = (value: boolean) => {
    setHasSelectedLanguage(value);
    localStorage.setItem('hasSelectedLanguage', 'true');
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage,
        hasSelectedLanguage,
        setHasSelectedLanguage: handleSetHasSelected
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 