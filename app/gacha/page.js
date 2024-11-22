// app/gacha/page.js

'use client';

import Link from 'next/link';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useState, useEffect } from 'react';

export default function Gacha() {
  const { user, error } = useTelegramAuth();
  const [result, setResult] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/user-items?telegramId=${user.telegramId}`)
        .then((res) => res.json())
        .then((data) => setInventory(data.items))
        .catch(() => console.error('Failed to fetch inventory'));
    }
  }, [user]);

  const handleGacha = async () => {
    try {
      const res = await fetch('/api/gacha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.telegramId }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.item);
        setInventory((prev) => [...prev, data.item]);
      } else {
        console.error(data.error);
      }
    } catch {
      console.error('Error occurred while performing gacha');
    }
  };

  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!user) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href="/">
        <a className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          ย้อนกลับหน้าแรก
        </a>
      </Link>
      <button
        onClick={handleGacha}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
      >
        สุ่มกาชา
      </button>
      {result && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          คุณได้รับ: {result.name} (Grade: {result.grade})
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold">กล่องเก็บของ</h2>
        <ul className="mt-2">
          {inventory.map((item) => (
            <li key={item.id} className="border p-2 rounded mb-2">
              <img src={item.image} alt={item.name} className="w-12 h-12 inline-block mr-4" />
              {item.name} (Grade: {item.grade}, Power: {item.power})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
