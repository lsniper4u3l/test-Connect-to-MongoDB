const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

const validSlots = [
  'weaponL',
  'weaponR',
  'helmet',
  'armor',
  'pants',
  'boots',
  'character',
];

async function POST(req) {
  const debugLog = []; // เก็บ Debug Log
  try {
    const { userId } = await req.json();
    debugLog.push(`🟢 รับค่าจาก Client: userId=${userId}`);

    if (!userId) {
      debugLog.push('❌ Missing User ID.');
      return NextResponse.json({ error: 'User ID is required', debugLog }, { status: 400 });
    }

    debugLog.push('🔍 ตรวจสอบ User...');
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      debugLog.push('❌ User not found.');
      return NextResponse.json({ error: 'User not found', debugLog }, { status: 404 });
    }
    debugLog.push('✅ User found.');

    // ดึงข้อมูลอุปกรณ์แต่ละ slot
    const equipment = {};
    for (const slot of validSlots) {
      equipment[slot] = user[slot]
        ? await prisma.inventory.findUnique({ where: { id: user[slot] } })
        : null;
    }

    debugLog.push('✅ Equipment fetched successfully.');
    return NextResponse.json({ equipment, debugLog });
  } catch (error) {
    debugLog.push(`❌ Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error', debugLog }, { status: 500 });
  }
}

module.exports = { POST };
