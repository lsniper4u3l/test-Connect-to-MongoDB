'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GachaPage() {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user'); // สมมติว่ามี endpoint สำหรับดึงข้อมูลผู้ใช้
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data.user);
          fetchInventory(data.user.id); // ดึง inventory ของผู้ใช้
        }
      } catch (err) {
        setError('Failed to fetch user data');
      }
    }

    fetchUser();
  }, []);

  // ดึงข้อมูล inventory ของผู้ใช้
  async function fetchInventory(userId) {
    try {
      const res = await fetch(`/api/user-items?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setInventory(data.items);
      } else {
        setError(data.error || 'Failed to fetch inventory');
      }
    } catch {
      setError('Failed to fetch inventory');
    }
  }

  // ฟังก์ชันสำหรับสุ่มกาชา
  async function handleGacha() {
    try {
      const res = await fetch('/api/gacha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId }), // ใช้ Telegram ID
      });
      const data = await res.json();

      if (data.success) {
        setResult(data.item); // แสดงผลไอเท็มที่สุ่มได้
        setInventory((prev) => [...prev, data.item]); // อัปเดต inventory
      } else {
        setError(data.error || 'Failed to perform gacha');
      }
    } catch {
      setError('Error occurred while performing gacha');
    }
  }

  // ถ้ามีข้อผิดพลาด แสดงข้อความ
  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  // ถ้ายังไม่มีข้อมูลผู้ใช้ แสดงข้อความ Loading
  if (!user) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gacha Page</h1>
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
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold">คุณได้รับ:</h3>
          <p>ชื่อไอเท็ม: {result.name}</p>
          <p>ประเภท: {result.category}</p>
          <p>เกรด: {result.grade}</p>
          <p>พลัง: {result.power}</p>
        </div>
      )}
      
    </div>
  );
}
