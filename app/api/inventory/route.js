// app/api/inventory/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
  try {
    // รับ userId จาก body
    const { id: userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ดึงข้อมูล inventory ที่เชื่อมโยงกับ userId
    const inventory = await prisma.inventory.findMany({
      where: { userId: userId.toString() }, // ตรวจสอบให้แน่ใจว่า userId ตรงกับ Prisma schema
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
