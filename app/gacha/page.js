// app/gacha/page.js

'use client';

import { useState } from 'react';
import Link from 'next/link';

// ไอเทมทั้งหมด
const items = {
  weaponL: [
    { name: "Wooden Shield", image: "/Weapon/F-Weapon-L.png", grade: "F", power: 75 },
    { name: "Iron Shield", image: "/Weapon/E-Weapon-L.png", grade: "E", power: 94 },
    { name: "Bronze Shield", image: "/Weapon/D-Weapon-L.png", grade: "D", power: 117 },
    { name: "Steel Shield", image: "/Weapon/C-Weapon-L.png", grade: "C", power: 146 },
    { name: "Golden Shield", image: "/Weapon/B-Weapon-L.png", grade: "B", power: 182 },
    { name: "Dragon Shield", image: "/Weapon/A-Weapon-L.png", grade: "A", power: 227 },
    { name: "Divine Shield", image: "/Weapon/S-Weapon-L.png", grade: "S", power: 284 },
  ],
  weaponR: [
    { name: "Wooden Sword", image: "/Weapon/F-Weapon-R.png", grade: "F", power: 150 },
    { name: "Iron Dagger", image: "/Weapon/E-Weapon-R.png", grade: "E", power: 187 },
    { name: "Bronze Sword", image: "/Weapon/D-Weapon-R.png", grade: "D", power: 234 },
    { name: "Steel Blade", image: "/Weapon/C-Weapon-R.png", grade: "C", power: 293 },
    { name: "Golden Axe", image: "/Weapon/B-Weapon-R.png", grade: "B", power: 366 },
    { name: "Dragon Slayer", image: "/Weapon/A-Weapon-R.png", grade: "A", power: 458 },
    { name: "Arcane Blade", image: "/Weapon/S-Weapon-R.png", grade: "S", power: 573 },
  ],
  helmet: [
    { name: "Cloth Cap", image: "/armor/F-Head.png", grade: "F", power: 50 },
    { name: "Leather Hood", image: "/armor/E-Head.png", grade: "E", power: 63 },
    { name: "Bronze Helmet", image: "/armor/D-Head.png", grade: "D", power: 79 },
    { name: "Steel Helmet", image: "/armor/C-Head.png", grade: "C", power: 99 },
    { name: "Golden Helm", image: "/armor/B-Head.png", grade: "B", power: 124 },
    { name: "Dragon Helm", image: "/armor/A-Head.png", grade: "A", power: 155 },
    { name: "Mystic Crown", image: "/armor/S-Head.png", grade: "S", power: 194 },
  ],
  armor: [
    { name: "Worn Shirt", image: "/armor/F-Armor.png", grade: "F", power: 50 },
    { name: "Leather Vest", image: "/armor/E-Armor.png", grade: "E", power: 63 },
    { name: "Bronze Chestplate", image: "/armor/D-Armor.png", grade: "D", power: 79 },
    { name: "Steel Armor", image: "/armor/C-Armor.png", grade: "C", power: 99 },
    { name: "Golden Breastplate", image: "/armor/B-Armor.png", grade: "B", power: 124 },
    { name: "Dragon Scale Armor", image: "/armor/A-Armor.png", grade: "A", power: 155 },
    { name: "Divine Robes", image: "/armor/S-Armor.png", grade: "S", power: 194 },
  ],
  pants: [
    { name: "Worn Pants", image: "/armor/F-Pants.png", grade: "F", power: 50 },
    { name: "Leather Pants", image: "/armor/E-Pants.png", grade: "E", power: 63 },
    { name: "Bronze Leggings", image: "/armor/D-Pants.png", grade: "D", power: 79 },
    { name: "Steel Greaves", image: "/armor/C-Pants.png", grade: "C", power: 99 },
    { name: "Golden Legguards", image: "/armor/B-Pants.png", grade: "B", power: 124 },
    { name: "Dragon Scale Pants", image: "/armor/A-Pants.png", grade: "A", power: 155 },
    { name: "Mystic Trousers", image: "/armor/S-Pants.png", grade: "S", power: 194 },
  ],
  boots: [
    { name: "Worn Shoes", image: "/armor/F-Boots.png", grade: "F", power: 50 },
    { name: "Leather Boots", image: "/armor/E-Boots.png", grade: "E", power: 63 },
    { name: "Bronze Boots", image: "/armor/D-Boots.png", grade: "D", power: 79 },
    { name: "Steel Boots", image: "/armor/C-Boots.png", grade: "C", power: 99 },
    { name: "Golden Boots", image: "/armor/B-Boots.png", grade: "B", power: 124 },
    { name: "Dragon Boots", image: "/armor/A-Boots.png", grade: "A", power: 155 },
    { name: "Mystic Boots", image: "/armor/S-Boots.png", grade: "S", power: 194 },
  ],
  character: [
    { name: "Villager Finn", image: "/characters/F-Class.png", grade: "F", power: 100 },
    { name: "Scout Reed", image: "/characters/E-Class.png", grade: "E", power: 125 },
    { name: "Guard Rowan", image: "/characters/D-Class.png", grade: "D", power: 156 },
    { name: "Warrior Garen", image: "/characters/C-Class.png", grade: "C", power: 195 },
    { name: "Knight Thorne", image: "/characters/B-Class.png", grade: "B", power: 244 },
    { name: "Paladin Shade", image: "/characters/A-Class.png", grade: "A", power: 305 },
    { name: "Archmage Zephyr", image: "/characters/S-Class-1.png", grade: "S", power: 382 },
  ],
};

// สุ่มเกรด
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

// สุ่มไอเทมตามประเภท
function getRandomItem(category) {
  const grade = getRandomGrade();
  const filteredItems = items[category].filter((item) => item.grade === grade);
  return filteredItems.length > 0
    ? filteredItems[Math.floor(Math.random() * filteredItems.length)]
    : null;
}

export default function Gacha() {
  const [result, setResult] = useState(null);

  const handleGacha = (category) => {
    const item = getRandomItem(category);
    setResult(item || { name: 'ไม่มีไอเทมที่ตรงเกรด', image: '', grade: 'N/A', power: 0 });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Gacha Game</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.keys(items).map((category) => (
          <button
            key={category}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleGacha(category)}
          >
            สุ่ม {category}
          </button>
        ))}
      </div>

      {result && (
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4">ผลการสุ่ม:</h2>
          {result.image && (
            <img
              src={result.image}
              alt={result.name}
              className="w-32 h-32 mx-auto mb-4"
            />
          )}
          <p className="text-xl font-bold">{result.name}</p>
          <p>เกรด: {result.grade}</p>
          <p>พลัง: {result.power}</p>
        </div>
      )}

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
