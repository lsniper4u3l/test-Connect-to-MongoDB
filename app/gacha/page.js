// app/gacha/page.js

'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import ItemFilter from "@/components/market/ItemFilter"; // Import ItemFilter
import { useTelegramAuth } from "@/hooks/useTelegramAuth"; // ใช้ Telegram Auth

export default function Inventory() {
  const { user, error } = useTelegramAuth(); // รับข้อมูลผู้ใช้จาก Telegram
  const [inventory, setInventory] = useState([]); // เก็บข้อมูล inventory
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [debugLog, setDebugLog] = useState([]); // สำหรับเก็บ Debug Log

  // ดึงข้อมูล inventory จาก API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        if (!user?.telegramId) return;

        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIdInv: user.telegramId }), // ส่ง userId ผ่าน body
        });

        const data = await response.json();

        if (data.error) {
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

  // ฟิลเตอร์ไอเทมตาม Category และ Grade
  const filteredItems = inventory.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const gradeMatch = selectedGrade === "all" || item.grade === selectedGrade;
    return categoryMatch && gradeMatch;
  });

  return (
    <div className="min-h-screen ">
      <NavBar />
      <div className="text-white flex justify-center items-center">
        <div className="w-11/12 bg-gray-800 bg-opacity-80 p-2 md:p-3">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-4">
            Inventory
          </h1>

          {/* ใช้ ItemFilter สำหรับฟิลเตอร์ */}
          <ItemFilter
            category={selectedCategory}
            setCategory={setSelectedCategory}
            grade={selectedGrade}
            setGrade={setSelectedGrade}
          />

          {/* Display items */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 rounded-lg shadow-md p-2 md:p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
              >
                <div className="relative w-20 h-20 mb-4 mt-2 flex justify-center items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={75}
                    height={75}
                    className="rounded-lg bg-white p-1"
                  />
                </div>
                <h2 className="text-sm md:text-lg font-bold text-yellow-400 mb-1">
                  {item.name}
                </h2>
                <p className="text-xs md:text-sm text-gray-400 capitalize">
                  {item.category}
                </p>
                {item.power && (
                  <p className="text-xs md:text-sm text-red-500 font-semibold mt-1">
                    Power: {item.power}⚡
                  </p>
                )}
                <p className="text-xs md:text-sm text-yellow-300 font-semibold mb-1 md:mb-2">
                  Grade: {item.grade}
                </p>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <p className="text-center col-span-full text-gray-500">
                No items found in this category.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Debug Log */}
      <div className="text-xs text-gray-300 mt-4 p-2">
        {debugLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}
