// hooks/useInventory.js

import { useState, useEffect } from 'react';

export function useInventory(userId, setDebugLog) {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setDebugLog((prev) => [...prev, 'กำลังโหลดข้อมูลช่องเก็บของ...']);

        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIdInv: userId }),
        });

        const data = await response.json();

        if (data.error) {
          setDebugLog((prev) => [...prev, `❌ Error loading inventory: ${data.error}`]);
        } else {
          setDebugLog((prev) => [...prev, '✅ โหลดข้อมูลช่องเก็บของสำเร็จ!']);
          setInventory(data || []);
          setFilteredInventory(data || []);
        }
      } catch (error) {
        setDebugLog((prev) => [...prev, `❌ Error fetching inventory: ${error.message}`]);
      }
    };

    if (userId) fetchInventory();
  }, [userId]);

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

  return { inventory, filteredInventory, selectedCategory, filterInventory };
}
