import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const LanguageSelector = () => {
  const { language, setLanguage, hasSelectedLanguage, setHasSelectedLanguage } = useLanguage();

  const handleLanguageSelect = (lang: 'es' | 'en' | 'tw') => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    setHasSelectedLanguage(true);
  };

  if (hasSelectedLanguage) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {t.selectLanguage}
        </h2>
        
        <div className="space-y-3 mb-8">
          {(['es', 'en', 'tw'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageSelect(lang)}
              className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 ${
                language === lang 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{t.languageNames[lang]}</span>
              {language === lang && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          {t.continue}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector; 