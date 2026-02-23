import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Search, Globe, DollarSign } from 'lucide-react';

const Settings: React.FC = () => {
  const { language, setLanguage, fiat, setFiat } = useStore();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'PT', name: 'Português' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
  ];

  const fiats = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
  ];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline">{language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('language')}
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    language === lang.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 font-medium' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {lang.code}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('fiat')}
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {fiats.map((f) => (
                <button
                  key={f.code}
                  onClick={() => {
                    setFiat(f.code);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    fiat === f.code ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-200 font-medium' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {f.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
