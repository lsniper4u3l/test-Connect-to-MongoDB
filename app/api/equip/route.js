// app/api/equip/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
  try {
    const { userId, itemId, slot } = await req.json();

    if (!userId || !itemId || !slot) {
      return NextResponse.json({ error: 'User ID, Item ID, and Slot are required' }, { status: 400 });
    }

    const validSlots = ['leftHand', 'rightHand', 'head', 'body', 'legs', 'feet'];
    if (!validSlots.includes(slot)) {
      return NextResponse.json({ error: 'Invalid slot' }, { status: 400 });
    }

    // ถ้ามีไอเทมใน slot นี้แล้ว ให้ถอดออกก่อน
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const currentItemId = user[slot];

    if (currentItemId) {
      await prisma.inventory.update({
        where: { id: currentItemId },
        data: { isEquipped: false },
      });
    }

    // สวมใส่ไอเทมใหม่
    await prisma.inventory.update({
      where: { id: itemId },
      data: { isEquipped: true },
    });

    // อัปเดตฟิลด์ใน User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { [slot]: itemId },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error equipping item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { POST };
