'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

function getRandomItem(category, items) {
  const grade = getRandomGrade();
  const filteredItems = items[category].filter((item) => item.grade === grade);
  return filteredItems.length > 0
    ? filteredItems[Math.floor(Math.random() * filteredItems.length)]
    : null;
}

export default function Gacha({ userId }) {
  const [result, setResult] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null); // เก็บข้อความข้อผิดพลาด
  const [debugInfo, setDebugInfo] = useState(null); // เก็บข้อมูล Debug

  useEffect(() => {
    // ดึงข้อมูลไอเทมทั้งหมด
    import('@/Data/DataItemGame')
      .then((data) => {
        if (data && data.default) {
          setItems(data.default);
          setDebugInfo(`Loaded items: ${JSON.stringify(data.default, null, 2)}`);
        } else {
          setError('ไม่สามารถโหลดข้อมูลไอเทมได้');
        }
      })
      .catch(() => setError('เกิดข้อผิดพลาดในการโหลดข้อมูลไอเทม'));

    // ดึงข้อมูลช่องเก็บของ
    fetch(`/api/inventory?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
        setDebugInfo(`Loaded inventory: ${JSON.stringify(data, null, 2)}`);
      })
      .catch(() => setError('เกิดข้อผิดพลาดในการดึงข้อมูลช่องเก็บของ'));
  }, [userId]);

  const handleGacha = (category) => {
    setError(null); // ล้างข้อผิดพลาดก่อนเริ่มสุ่ม
    if (!items || !items[category]) {
      setError('ข้อมูลไอเทมหรือประเภทไอเทมไม่ถูกต้อง');
      return;
    }
  
    const item = getRandomItem(category, items);
  
    if (item) {
      setDebugInfo(`Sending Data: ${JSON.stringify({ userId, item }, null, 2)}`);
  
      fetch('/api/gacha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, item }),
      })
        .then((res) => {
          setDebugInfo(`API Response: ${res.status} ${res.statusText}`);
          if (!res.ok) {
            return res.json().then((data) => {
              setDebugInfo(`API Error Response: ${JSON.stringify(data, null, 2)}`);
              throw new Error(data.error || 'ไม่สามารถบันทึกไอเทมได้');
            });
          }
          return res.json();
        })
        .then((data) => {
          setResult(data); // แสดงผลลัพธ์การสุ่ม
          setInventory((prev) => [...prev, data]); // เพิ่มไอเทมในช่องเก็บของ
        })
        .catch((err) => setError('เกิดข้อผิดพลาดในการบันทึกไอเทม'));
    } else {
      setResult({ name: 'ไม่มีไอเทมที่ตรงเกรด', image: '', grade: 'N/A', power: 0 });
    }
  };
  
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Gacha Game</h1>

      {/* แสดงข้อผิดพลาด */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 rounded p-3 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* แสดง Debug Info */}
      {debugInfo && (
        <div className="bg-gray-100 text-gray-700 border border-gray-400 rounded p-3 mb-4">
          <h2 className="text-sm font-bold mb-2">Debug Information</h2>
          <pre className="text-xs overflow-auto">{debugInfo}</pre>
        </div>
      )}

      {/* ปุ่มสุ่ม */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {items &&
          Object.keys(items).map((category) => (
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
            <img src={result.image} alt={result.name} className="w-32 h-32 mx-auto mb-4" />
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
                <img src={item.image} alt={item.name} className="w-16 h-16 mb-2" />
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
