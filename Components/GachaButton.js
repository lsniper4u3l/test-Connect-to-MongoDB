// Components/GachaButton.js

import React from 'react';

export default function GachaButton({ categories, onClick }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onClick(category)}
        >
          สุ่ม {category}
        </button>
      ))}
    </div>
  );
}
