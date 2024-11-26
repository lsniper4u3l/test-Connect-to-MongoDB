// app/gacha/page.js

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import Loading from '@/Components/Loading';
import ErrorMessage from '@/Components/ErrorMessage';
import GachaButton from '@/Components/GachaButton';
import Inventory from '@/Components/Inventory';
import DebugLog from '@/Components/DebugLog';
import GachaResult from '@/Components/GachaResult';

export default function Gacha() {
  const [result, setResult] = useState(null); // ไอเทมที่สุ่มได้
  const [inventory, setInventory] = useState([]); // ช่องเก็บของ
  const [debugLog, setDebugLog] = useState([]); // Debug Log
  const { user, error } = useTelegramAuth();

  // ดึงข้อมูล inventory ของผู้ใช้
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        if (!user?.telegramId) return;

        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIdInv: user.id }), // ส่ง userId ผ่าน body
        });

        const data = await response.json();

        if (data.error) {  // เช็ค eror 
          setDebugLog((prev) => [...prev, `Error fetching inventory: ${data.error}`]);
          return;
        }

        setInventory(data); // ตั้งค่า inventory
        setDebugLog((prev) => [...prev, 'Inventory loaded successfully']);
      } catch (error) {
        setDebugLog((prev) => [...prev, `Fetch error: ${error.message}`]);
      }
    };

    fetchInventory();
  }, [user?.telegramId]);

  // ฟังก์ชันสำหรับสุ่มไอเทม
  const handleGacha = async (category) => {
    try {
      setDebugLog((prev) => [...prev, `เริ่มสุ่มไอเทมประเภท: ${category}`]);

      const response = await fetch('/api/gacha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.telegramId, category }),
      });

      const responseData = await response.json();

      if (responseData.error) {
        setDebugLog((prev) => [...prev, ...responseData.debugLog]);
        return;
      }

      const newItem = responseData.item;
      setDebugLog((prev) => [...prev, ...responseData.debugLog]);
      setInventory((prev) => [...prev, newItem]); // เพิ่มไอเทมเข้าสู่ช่องเก็บของ
      setResult(newItem); // แสดงไอเทมที่สุ่มได้
    } catch (error) {
      setDebugLog((prev) => [...prev, `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`]);
    }
  };

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!user) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">เกมกาชา</h1>

      <GachaButton
        categories={['weaponL', 'weaponR', 'helmet', 'armor', 'pants', 'boots', 'character']}
        onClick={handleGacha}
      />

      <GachaResult result={result} />

      <Inventory items={inventory} />

      <DebugLog logs={debugLog} />

      <div className="mt-8 text-center">
        <Link href="/">
          <a className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">
            ย้อนกลับไปหน้าหลัก
          </a>
        </Link>
      </div>
    </div>
  );
}
