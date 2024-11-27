// hooks/useEquipment.js

import { useState, useEffect } from 'react';

export function useEquipment(userId, setDebugLog) {
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setDebugLog((prev) => [...prev, 'กำลังโหลดข้อมูลอุปกรณ์...']);

        const response = await fetch('/api/equipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data.error) {
          setDebugLog((prev) => [...prev, `❌ Error loading equipment: ${data.error}`]);
        } else {
          setDebugLog((prev) => [...prev, '✅ โหลดข้อมูลอุปกรณ์สำเร็จ!']);
          setEquipment(data.equipment || {});
        }
      } catch (error) {
        setDebugLog((prev) => [...prev, `❌ Error fetching equipment: ${error.message}`]);
      }
    };

    if (userId) fetchEquipment();
  }, [userId]);

  const handleEquip = async (itemId, slot) => {
    try {
      setDebugLog((prev) => [...prev, `🛠️ กำลังจัดการไอเทมในช่อง: ${slot}`]);

      const response = await fetch('/api/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, slot }),
      });

      const data = await response.json();
      if (data.error) {
        setDebugLog((prev) => [...prev, ...data.debugLog, `❌ Error: ${data.error}`]);
        return;
      }

      setDebugLog((prev) => [...prev, ...data.debugLog, `✅ สำเร็จในช่อง ${slot}`]);

      // อัปเดต `equipment` หลังการสวมใส่
      setEquipment((prev) => ({
        ...prev,
        [slot]: data.equipment ? data.equipment[slot] : null,
      }));
    } catch (error) {
      setDebugLog((prev) => [...prev, `❌ Error handling equipment: ${error.message}`]);
    }
  };

  return { equipment, handleEquip };
}
