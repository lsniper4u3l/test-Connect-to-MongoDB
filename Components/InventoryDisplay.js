// components/InventoryDisplay.js

export default function InventoryDisplay({
    inventory,
    handleEquip,
    filterInventory,
    selectedCategory,
    setDebugLog,
  }) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-700 text-center mb-4">
          🧳 ช่องเก็บของ
        </h2>
  
        {/* ฟิลเตอร์สำหรับ Inventory */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => filterInventory('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ทั้งหมด
          </button>
          {['weaponL', 'weaponR', 'helmet', 'armor', 'pants', 'boots'].map(
            (category) => (
              <button
                key={category}
                onClick={() => filterInventory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-black'
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>
  
        {/* แสดงไอเท็มใน Inventory */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className={`border p-4 rounded-lg shadow text-center ${
                item.isEquipped
                  ? 'bg-green-100 border-green-500'
                  : 'bg-gray-50'
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 mx-auto mb-2"
              />
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">เกรด: {item.grade}</p>
              <button
                onClick={() => {
                  if (item.isEquipped) {
                    handleEquip(null, item.category); // ถอดอุปกรณ์
                    setDebugLog((prev) => [
                      ...prev,
                      `ถอด: ${item.name} ออกจาก ${item.category}`,
                    ]);
                  } else {
                    handleEquip(item.id, item.category); // สวมใส่
                    setDebugLog((prev) => [
                      ...prev,
                      `สวมใส่: ${item.name} ในช่อง ${item.category}`,
                    ]);
                  }
                }}
                className={`mt-2 px-4 py-2 rounded-lg text-white ${
                  item.isEquipped
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {item.isEquipped ? 'ถอดออก' : 'สวมใส่'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  