// app/api/inventory/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
  try {
    // รับข้อมูล userId จาก body
    const userData = await req.json();
    const userId = userData.id; // รับ userId จาก body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ดึงข้อมูล inventory ที่เชื่อมโยงกับ userId
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

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { POST };
