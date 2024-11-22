// app/api/inventory/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function GET(req) {
  try {
    const userId = req.headers.get('userId'); // ใช้ User ID จาก Header

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ดึงรายการไอเทมจาก Inventory
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

module.exports = { GET };
