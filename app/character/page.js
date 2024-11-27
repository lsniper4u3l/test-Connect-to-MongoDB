// app/character/page.js

'use client';

import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useEquipment } from '@/hooks/useEquipment';
import { useInventory } from '@/hooks/useInventory'; // Import ใหม่
import Loading from '@/Components/Loading';
import ErrorMessage from '@/Components/ErrorMessage';
import DebugLog from '@/Components/DebugLog';
import CharacterDisplay from '@/Components/CharacterDisplay';
import InventoryDisplay from '@/Components/InventoryDisplay';
import Link from 'next/link';
import { useState } from 'react';

export default function Character() {
  const { user, error } = useTelegramAuth();
  const [debugLog, setDebugLog] = useState([]);

  const { equipment, handleEquip } = useEquipment(user?.id, setDebugLog);
  const {
    inventory,
    filteredInventory,
    selectedCategory,
    filterInventory,
  } = useInventory(user?.id, setDebugLog);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!user) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        👤 ตัวละครของคุณ
      </h1>

      {/* แสดงอุปกรณ์ที่สวมใส่ */}
      <CharacterDisplay equipment={equipment} />

      {/* แสดงช่องเก็บของ */}
      <InventoryDisplay
        inventory={filteredInventory}
        handleEquip={handleEquip}
        filterInventory={filterInventory}
        selectedCategory={selectedCategory}
        setDebugLog={setDebugLog}
      />

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
