import React from 'react';

export default function GachaResult({ result }) {
  if (!result) return null;

  return (
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
  );
}
