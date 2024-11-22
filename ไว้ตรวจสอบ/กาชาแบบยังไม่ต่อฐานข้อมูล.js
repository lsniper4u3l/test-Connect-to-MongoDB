// app/gacha/page.js

'use client';

import { useState } from 'react';
import Link from 'next/link';
import items from '@/Data/DataItemGame'; // นำเข้าข้อมูลจาก DataItemGame.js

function getRandomGrade() {
  const random = Math.random() * 100;
  if (random <= 0.0001) return 'S';
  if (random <= 0.0099) return 'A';
  if (random <= 0.0900) return 'B';
  if (random <= 0.9000) return 'C';
  if (random <= 4.0000) return 'D';
  if (random <= 25.0000) return 'E';
  return 'F';
}

function getRandomItem(category) {
  const grade = getRandomGrade();
  const filteredItems = items[category].filter((item) => item.grade === grade);
  return filteredItems.length > 0
    ? filteredItems[Math.floor(Math.random() * filteredItems.length)]
    : null;
}

export default function Gacha() {
  const [result, setResult] = useState(null);
  const [inventory, setInventory] = useState([]); // ช่องเก็บของ

  const handleGacha = (category) => {
    const item = getRandomItem(category);
    if (item) {
      setInventory((prev) => [...prev, item]); // เพิ่มไอเทมที่สุ่มได้ไปยังช่องเก็บของ
    }
    setResult(item || { name: 'ไม่มีไอเทมที่ตรงเกรด', image: '', grade: 'N/A', power: 0 });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Gacha Game</h1>

      {/* ปุ่มสุ่ม */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.keys(items).map((category) => (
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
