import { useState, useEffect } from 'react';

export function useEquipment(userId) {
  const [equipment, setEquipment] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ดึงข้อมูล equipment และ inventory
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลอุปกรณ์ที่สวมใส่
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
          console.error(equipmentData.error || inventoryData.error);
        } else {
          setEquipment(equipmentData.equipment);
          setInventory(inventoryData);
          setFilteredInventory(inventoryData); // เริ่มต้นแสดง Inventory ทั้งหมด
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // กรอง Inventory ตามหมวดหมู่
  const filterInventory = (category) => {
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
      const response = await fetch('/api/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, slot }),
      });

      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
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
      console.error('Error equipping item:', error);
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
