// Components/DebugLog.js

import React from 'react';

export default function DebugLog({ logs }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Debug Log</h2>
      <div className="bg-gray-100 border border-gray-300 rounded p-4 max-h-64 overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <p key={index} className="text-sm text-gray-700">
              {log}
            </p>
          ))
        ) : (
          <p className="text-center text-gray-500">ไม่มีข้อมูล Debug</p>
        )}
      </div>
    </div>
  );
}
