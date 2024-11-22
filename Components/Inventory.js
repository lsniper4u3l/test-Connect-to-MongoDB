import React from 'react';

export default function Inventory({ items }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">ช่องเก็บของ</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
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
  );
}
