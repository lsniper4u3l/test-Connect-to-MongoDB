// app/page.js

'use client';

import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import LoadingPage from '@/Components/LoadingPage';
import ErrorMessage from '@/Components/ErrorMessage';
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language]; // ดึงข้อความตามภาษาที่เลือก

  const { user, error } = useTelegramAuth();

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!user) return <LoadingPage />;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
          {t.welcome}, <span className="text-blue-700">{user.firstName}</span>!
        </h1>
        <p className="text-center text-gray-700 mb-6">{t.menu}</p>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
