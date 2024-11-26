// Components/Loading.js

import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        <ArrowPathIcon className="w-20 h-20 text-blue-600 animate-spin" />
        <div className="absolute w-24 h-24 bg-blue-100 rounded-full opacity-50 animate-ping"></div>
      </div>
      <p className="text-xl text-gray-800 font-semibold">
        🔄 กำลังโหลดข้อมูล... โปรดรอสักครู่
      </p>
      <p className="text-sm text-gray-600 mt-2">
        ระบบกำลังเตรียมข้อมูลให้คุณ โปรดอย่าปิดหน้านี้
      </p>
    </div>
  );
}
