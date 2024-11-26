// Components/ErrorMessage.js

import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function ErrorMessage({ error }) {
  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        <ExclamationCircleIcon className="w-20 h-20 text-red-600 animate-pulse" />
        <div className="absolute w-24 h-24 bg-red-100 rounded-full opacity-50 animate-ping"></div>
      </div>
      <h1 className="text-3xl font-bold text-red-700">
        ❗ เกิดข้อผิดพลาด ❗
      </h1>
      <p className="text-lg text-gray-700 mt-3 text-center max-w-lg">
        {error || 'ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง'}
      </p>
      <button
        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={() => window.location.reload()}
      >
        ลองอีกครั้ง
      </button>
    </div>
  );
}
