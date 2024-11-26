export function useEquipment(userId, setDebugLog) {
  const [equipment, setEquipment] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDebugLog((prev) => [...prev, 'กำลังโหลดข้อมูลอุปกรณ์...']);
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
            'Error loading equipment or inventory.',
          ]);
        } else {
          setDebugLog((prev) => [...prev, 'โหลดข้อมูลสำเร็จ!']);
          setEquipment(equipmentData.equipment);
          setInventory(inventoryData);
          setFilteredInventory(inventoryData);
        }
      } catch (error) {
        setDebugLog((prev) => [...prev, `Error: ${error.message}`]);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const filterInventory = (category) => {
    setDebugLog((prev) => [
      ...prev,
      `กำลังกรองประเภท: ${category === 'all' ? 'ทั้งหมด' : category}`,
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
