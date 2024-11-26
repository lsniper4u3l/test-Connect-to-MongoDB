// app/character/page.js

'use client';

import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useEquipment } from '@/hooks/useEquipment';
import Loading from '@/Components/Loading';
import ErrorMessage from '@/Components/ErrorMessage';

export default function Character() {
  const { user, error } = useTelegramAuth();
  const {
    equipment,
    inventory,
    filterInventory,
    selectedCategory,
    handleEquip,
  } = useEquipment(user?.id);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!user) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">ตัวละครของคุณ</h1>

      {/* อุปกรณ์ที่สวมใส่ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {equipment &&
          Object.keys(equipment).map((slot) => (
            <div key={slot} className="text-center">
              <h2 className="text-lg font-semibold capitalize">{slot}</h2>
              {equipment[slot] ? (
                <img
                  src={equipment[slot].image}
                  alt={equipment[slot].name}
                  className="w-20 h-20 mx-auto"
                />
              ) : (
                <p>ไม่มี</p>
              )}
            </div>
          ))}
      </div>

      {/* ฟิลเตอร์สำหรับ Inventory */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => filterInventory('all')}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          ทั้งหมด
        </button>
        {['weaponL', 'weaponR', 'helmet', 'armor', 'pants', 'boots'].map(
          (category) => (
            <button
              key={category}
              onClick={() => filterInventory(category)}
              className={`px-4 py-2 mx-2 rounded-lg ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Inventory */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {inventory.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg shadow text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 mx-auto mb-2"
            />
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">เกรด: {item.grade}</p>
            <button
              onClick={() => handleEquip(item.id, item.category)}
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
  );
}
