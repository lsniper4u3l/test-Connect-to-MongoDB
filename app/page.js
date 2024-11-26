// app/page.js

'use client';

import Link from 'next/link';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import Loading from '@/Components/Loading';
import ErrorMessage from '@/Components/ErrorMessage';

export default function Home() {
  const { user, error } = useTelegramAuth();

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!user) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
          👋 ยินดีต้อนรับ, <span className="text-blue-700">{user.firstName}</span>!
        </h1>
        <p className="text-center text-gray-700 mb-6">
          🌟 เลือกเมนูเพื่อเริ่มการผจญภัยของคุณ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/gacha">
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-md text-center transform hover:scale-105 transition-all duration-200">
              🎲 เล่นเกมกาชา
            </a>
          </Link>
          <Link href="/character">
            <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded shadow-md text-center transform hover:scale-105 transition-all duration-200">
              👤 ดูตัวละครของคุณ
            </a>
          </Link>
        </div>
      </div>

    </div>
  );
}
