// app/character/page.js

'use client';

import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useEquipment } from '@/hooks/useEquipment';
import Loading from '@/Components/Loading';
import ErrorMessage from '@/Components/ErrorMessage';
import DebugLog from '@/Components/DebugLog';
import Link from 'next/link'; // Import Link สำหรับปุ่มกลับหน้าแรก
import { useEffect, useState } from 'react';

export default function Character() {
  const { user, error } = useTelegramAuth();
  const [debugLog, setDebugLog] = useState([]); // เพิ่ม state สำหรับ Debug Log
  const {
    equipment,
    inventory,
    filterInventory,
    selectedCategory,
    handleEquip,
  } = useEquipment(user?.id, setDebugLog); // ส่ง setDebugLog ให้ Hook เพื่อบันทึก Log

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!user) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        👤 ตัวละครของคุณ
      </h1>

      {/* อุปกรณ์ที่สวมใส่ */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-700 text-center mb-4">
          🛡️ อุปกรณ์ที่สวมใส่
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
  {equipment &&
    Object.keys(equipment).map((slot) => (
      <div key={slot} className="text-center border p-4 rounded-lg shadow bg-gray-100">
        <h3 className="text-md font-semibold capitalize mb-2">{slot}</h3>
        {equipment[slot] ? (
          <img
            src={equipment[slot].image}
            alt={equipment[slot].name}
            className="w-16 h-16 mx-auto mb-2"
          />
        ) : (
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded"></div>
        )}
        <p className="text-sm text-gray-500">
          {equipment[slot] ? equipment[slot].name : 'ไม่มี'}
        </p>
      </div>
    ))}
</div>

      </div>

      {/* ฟิลเตอร์สำหรับ Inventory */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-700 text-center mb-4">
          🎯 เลือกประเภทไอเทม
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => filterInventory('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ทั้งหมด
          </button>
          {['weaponL', 'weaponR', 'helmet', 'armor', 'pants', 'boots'].map(
            (category) => (
              <button
                key={category}
                onClick={() => filterInventory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-black'
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-700 text-center mb-4">
          🧳 ช่องเก็บของ
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg shadow text-center bg-gray-50"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 mx-auto mb-2"
              />
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">เกรด: {item.grade}</p>
              <button
                    onClick={() => {
                        handleEquip(item.id, item.category);
                        setDebugLog((prev) => [...prev, `สวมใส่: ${item.name} ในช่อง ${item.category}`]);
                    }}
                    disabled={item.isEquipped}
                    className={`mt-2 px-4 py-2 rounded-lg text-white ${
                        item.isEquipped ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    >
                    {item.isEquipped ? 'กำลังสวมใส่' : 'สวมใส่'}
                </button>

            </div>
          ))}
        </div>
      </div>

      {/* Debug Log */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-700 text-center mb-4">
          🔍 Debug Log
        </h2>
        <DebugLog logs={debugLog} />
      </div>

      {/* ปุ่มกลับหน้าแรก */}
      <div className="text-center mt-8">
        <Link href="/">
          <a className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded shadow-md transform hover:scale-105 transition-all duration-200">
            🏠 กลับหน้าแรก
          </a>
        </Link>
      </div>
    </div>
  );
}
