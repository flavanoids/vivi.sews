import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthStore } from '../store/authStore';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, updateUserLanguage } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
    
    // Update user's language preference in the database
    if (currentUser) {
      updateUserLanguage(currentUser.id, newLanguage);
    }
    
    setShowDropdown(false);
  };

  const languages = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'es', name: t('language.spanish'), flag: '🇪🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as 'en' | 'es')}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {language === lang.code && (
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
