// app/page.js

'use client';

import Link from 'next/link';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

export default function Home() {
  const { user, error } = useTelegramAuth();

  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!user) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      <Link href="/gacha">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Gacha
        </a>
      </Link>
    </div>
  );
}
