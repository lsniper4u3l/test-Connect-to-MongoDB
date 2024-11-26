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
        // ดึงข้อมูลอุปกรณ์ที่สวมใส่
        setDebugLog((prev) => [...prev, 'กำลังโหลดข้อมูลอุปกรณ์...']);
        const equipmentResponse = await fetch('/api/equipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const equipmentData = await equipmentResponse.json();

        // ดึงข้อมูล Inventory
        const inventoryResponse = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIdInv: userId }),
        });
        const inventoryData = await inventoryResponse.json();

        if (equipmentData.error || inventoryData.error) {
          setDebugLog((prev) => [ ...prev, 'Error loading equipment or inventory.', ]);
          console.error(equipmentData.error || inventoryData.error);
        } else {
          setDebugLog((prev) => [...prev, 'โหลดข้อมูลสำเร็จ!']);
          setEquipment(equipmentData.equipment);
          setInventory(inventoryData);
          setFilteredInventory(inventoryData); // เริ่มต้นแสดง Inventory ทั้งหมด
        }
      } catch (error) {
        setDebugLog((prev) => [...prev, `Error fetching data: ${error.message}`]);
        console.error('Error fetching data:', error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // กรอง Inventory ตามหมวดหมู่
  const filterInventory = (category) => {
    setDebugLog((prev) => [ ...prev, `กำลังกรองประเภท: ${category === 'all' ? 'ทั้งหมด' : category}`, ]);
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
     setDebugLog((prev) => [...prev, `กำลังสวมใส่ไอเทม: ${slot}`]);
      const response = await fetch('/api/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, slot }),
      });

      const data = await response.json();
      if (data.error) {
        setDebugLog((prev) => [...prev, `Error: ${data.error}`]);
      } else {
        setDebugLog((prev) => [...prev, `สวมใส่สำเร็จ: ${slot}`]);
        setEquipment((prev) => ({
          ...prev,
          [slot]: inventory.find((item) => item.id === itemId),
        }));
        setInventory((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, isEquipped: true } : item
          )
        );
      }
    } catch (error) {
      setDebugLog((prev) => [...prev, `Error equipping item: ${error.message}`]);
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
