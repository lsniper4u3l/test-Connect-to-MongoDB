// app/api/inventory/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
  try {
    // รับข้อมูล userId จาก body
    const userData = await req.json();
    const userId = userData.id; // ดึง userId จาก body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ค้นหาไอเทมใน inventory ที่เชื่อมโยงกับ userId
    const inventory = await prisma.inventory.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        image: true,
        category: true,
        grade: true,
        power: true,
        upgrade: true,
      },
    });

    if (!inventory || inventory.length === 0) {
      return NextResponse.json({ error: 'No items found for this user' }, { status: 404 });
    }

    // ส่งข้อมูล inventory กลับไปที่ frontend
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { POST };

