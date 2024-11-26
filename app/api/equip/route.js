// app/api/equip/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
  const debugLog = []; // เก็บ Debug Log
  try {
    const { userId, itemId, slot } = await req.json();

    if (!userId || !itemId || !slot) {
      debugLog.push('❌ Missing required parameters: User ID, Item ID, or Slot.');
      return NextResponse.json({ error: 'User ID, Item ID, and Slot are required', debugLog }, { status: 400 });
    }

    const validSlots = [
      'weaponL',
      'weaponR',
      'helmet',
      'armor',
      'pants',
      'boots',
      'character',
    ];
    if (!validSlots.includes(slot)) {
      debugLog.push(`❌ Invalid slot provided: ${slot}`);
      return NextResponse.json({ error: 'Invalid slot', debugLog }, { status: 400 });
    }

    // ตรวจสอบผู้ใช้งาน
    debugLog.push('🔍 Checking if user exists...');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      debugLog.push('❌ User not found.');
      return NextResponse.json({ error: 'User not found', debugLog }, { status: 404 });
    }
    debugLog.push('✅ User found.');

    // ตรวจสอบไอเทม
    debugLog.push('🔍 Checking if item exists...');
    const item = await prisma.inventory.findUnique({ where: { id: itemId } });
    if (!item) {
      debugLog.push('❌ Item not found.');
      return NextResponse.json({ error: 'Item not found', debugLog }, { status: 404 });
    }
    debugLog.push('✅ Item found.');

    // ถ้ามีไอเทมใน slot นี้แล้ว ให้ถอดออกก่อน
    debugLog.push(`🔄 Unequipping current item in slot: ${slot}`);
    const currentItemId = user[slot];
    if (currentItemId) {
      await prisma.inventory.update({
        where: { id: currentItemId },
        data: { isEquipped: false },
      });
      debugLog.push(`✅ Current item in slot "${slot}" unequipped.`);
    }

    // สวมใส่ไอเทมใหม่
    debugLog.push(`🔄 Equipping new item with ID: ${itemId}`);
    await prisma.inventory.update({
      where: { id: itemId },
      data: { isEquipped: true },
    });

    // อัปเดตฟิลด์ใน User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { [slot]: itemId },
    });
    debugLog.push(`✅ New item equipped in slot "${slot}".`);

    return NextResponse.json({ user: updatedUser, debugLog });
  } catch (error) {
    debugLog.push(`❌ Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error', debugLog }, { status: 500 });
  }
}

module.exports = { POST };
