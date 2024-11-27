// hooks/useEquipment.js

import { useState, useEffect } from 'react';

export function useEquipment(userId, setDebugLog) {
  const [equipment, setEquipment] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ดึงข้อมูล equipment และ inventory
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDebugLog((prev) => [...prev, 'กำลังโหลดข้อมูลอุปกรณ์และช่องเก็บของ...']);

        const equipmentResponse = await fetch('/api/equipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const equipmentData = await equipmentResponse.json();

        const inventoryResponse = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIdInv: userId }),
        });
        const inventoryData = await inventoryResponse.json();

        if (equipmentData.error || inventoryData.error) {
          setDebugLog((prev) => [
            ...prev,
            '❌ Error loading equipment or inventory.',
          ]);
        } else {
          setDebugLog((prev) => [...prev, '✅ โหลดข้อมูลสำเร็จ!']);
          setEquipment(equipmentData.equipment || {});
          setInventory(inventoryData || []);
          setFilteredInventory(inventoryData || []); // เริ่มต้นแสดง Inventory ทั้งหมด
        }
      } catch (error) {
        setDebugLog((prev) => [
          ...prev,
          `❌ Error fetching data: ${error.message}`,
        ]);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // กรอง Inventory ตามหมวดหมู่
  const filterInventory = (category) => {
    setDebugLog((prev) => [
      ...prev,
      `🔍 กำลังกรองประเภท: ${category === 'all' ? 'ทั้งหมด' : category}`,
    ]);
    if (category === 'all') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter((item) => item.category === category)
      );
    }
    setSelectedCategory(category);
  };

  // ฟังก์ชันสำหรับสวมใส่อุปกรณ์
  const handleEquip = async (itemId, slot) => {
    try {
      setDebugLog((prev) => [...prev, `🛠️ กำลังจัดการไอเทมในช่อง: ${slot}`]);
  
      // เรียก API สำหรับสวมใส่/ถอดไอเทม
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
  
      // รีเฟรช `equipment` เพื่อดึงข้อมูลล่าสุด
      const updatedEquipmentResponse = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
  
      const updatedEquipment = await updatedEquipmentResponse.json();
      if (!updatedEquipment.error) {
        setEquipment(updatedEquipment.equipment); // อัปเดต `equipment`
      } else {
        setDebugLog((prev) => [...prev, `❌ Error loading equipment: ${updatedEquipment.error}`]);
      }
  
      // อัปเดต `inventory` เพื่อสะท้อนสถานะการสวมใส่
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            // กำลังสวมใส่ไอเท็มใหม่
            return { ...item, isEquipped: true };
          } else if (item.category === slot) {
            // ถอดไอเท็มเดิมใน `slot`
            return { ...item, isEquipped: false };
          }
          return item;
        })
      );
    } catch (error) {
      setDebugLog((prev) => [...prev, `❌ Error: ${error.message}`]);
    }
  };
  

  return {
    equipment,
    inventory: filteredInventory,
    filterInventory,
    selectedCategory,
    handleEquip,
  };
}
