'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Gacha() {
  const [result, setResult] = useState(null); // ไอเทมที่สุ่มได้
  const [inventory, setInventory] = useState([]); // ช่องเก็บของ
  const [debugLog, setDebugLog] = useState([]); // เก็บ debug log

  // ฟังก์ชันสุ่มไอเทมและบันทึกไปที่ฐานข้อมูล
  const handleGacha = async (category) => {
    try {
      // เรียก API สำหรับสุ่มกาชา
      const response = await fetch('/api/gacha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'user-id-placeholder', category }), // ใส่ userId ของผู้ใช้งาน
      });

      const newItem = await response.json();

      if (newItem.error) {
        setDebugLog((prev) => [...prev, `Error: ${newItem.error}`]);
        console.error('Error:', newItem.error);
        return;
      }

      // เพิ่มไอเทมเข้าสู่ inventory และแสดงผลไอเทมที่สุ่มได้
      setInventory((prev) => [...prev, newItem]);
      setResult(newItem);
      setDebugLog((prev) => [...prev, `Gacha Success: ${JSON.stringify(newItem)}`]);
    } catch (error) {
      setDebugLog((prev) => [...prev, `Fetch Error: ${error.message}`]);
      console.error('Failed to gacha:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Gacha Game</h1>

      {/* ปุ่มสุ่มกาชา */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {['weaponL', 'weaponR', 'helmet', 'armor', 'pants', 'boots', 'character'].map((category) => (
          <button
            key={category}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleGacha(category)}
          >
            สุ่ม {category}
          </button>
        ))}
      </div>

      {/* ผลการสุ่ม */}
      {result && (
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4">ผลการสุ่ม:</h2>
          {result.image && (
            <img
              src={result.image}
              alt={result.name}
              className="w-32 h-32 mx-auto mb-4"
            />
          )}
          <p className="text-xl font-bold">{result.name}</p>
          <p>เกรด: {result.grade}</p>
          <p>พลัง: {result.power}</p>
        </div>
      )}

      {/* ช่องเก็บของ */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">ช่องเก็บของ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {inventory.length > 0 ? (
            inventory.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded p-2 flex flex-col items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 mb-2"
                />
                <p className="text-sm font-semibold text-center">{item.name}</p>
                <p className="text-xs text-gray-500">เกรด: {item.grade}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              ยังไม่มีไอเทมในช่องเก็บของ
            </p>
          )}
        </div>
      </div>

      {/* Debug Log */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">Debug Log</h2>
        <div className="bg-gray-100 border border-gray-300 rounded p-4 max-h-64 overflow-y-auto">
          {debugLog.length > 0 ? (
            debugLog.map((log, index) => (
              <p key={index} className="text-sm text-gray-700">
                {log}
              </p>
            ))
          ) : (
            <p className="text-center text-gray-500">ไม่มีข้อมูล Debug</p>
          )}
        </div>
      </div>

      {/* ปุ่มกลับหน้าหลัก */}
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
