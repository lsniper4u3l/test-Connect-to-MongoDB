'use client';

import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useEffect, useState } from 'react';

export default function Character() {
  const { user, error } = useTelegramAuth();
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!user?.telegramId) return;

      try {
        const response = await fetch('/api/equipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        if (!data.error) setEquipment(data);
      } catch (err) {
        console.error('Error fetching equipment:', err);
      }
    };

    fetchEquipment();
  }, [user?.telegramId]);

  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!user) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">ตัวละครของคุณ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment ? (
          <>
            <div className="text-center">
              <h2 className="text-lg font-semibold">มือซ้าย</h2>
              {equipment.leftHand ? (
                <img src={equipment.leftHand.image} alt="มือซ้าย" className="mx-auto w-16 h-16" />
              ) : (
                <p>ไม่มี</p>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">มือขวา</h2>
              {equipment.rightHand ? (
                <img src={equipment.rightHand.image} alt="มือขวา" className="mx-auto w-16 h-16" />
              ) : (
                <p>ไม่มี</p>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">หัว</h2>
              {equipment.head ? (
                <img src={equipment.head.image} alt="หัว" className="mx-auto w-16 h-16" />
              ) : (
                <p>ไม่มี</p>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">ลำตัว</h2>
              {equipment.body ? (
                <img src={equipment.body.image} alt="ลำตัว" className="mx-auto w-16 h-16" />
              ) : (
                <p>ไม่มี</p>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">กางเกง</h2>
              {equipment.legs ? (
                <img src={equipment.legs.image} alt="กางเกง" className="mx-auto w-16 h-16" />
              ) : (
                <p>ไม่มี</p>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">รองเท้า</h2>
              {equipment.feet ? (
                <img src={equipment.feet.image} alt="รองเท้า" className="mx-auto w-16 h-16" />
              ) : (
                <p>ไม่มี</p>
              )}
            </div>
          </>
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </div>
    </div>
  );
}
