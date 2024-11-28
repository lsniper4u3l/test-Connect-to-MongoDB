'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { toggleLanguage, language } = useLanguage();

  const languages = [
    { code: 'en', label: '🇺🇸 English' },
    { code: 'zh', label: '🇨🇳 中文' },
    { code: 'th', label: '🇹🇭 ไทย' },
  ];

  return (
    <div className="flex justify-center items-center gap-4">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => toggleLanguage(lang.code)}
          className={`px-4 py-2 rounded-lg ${
            language === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
