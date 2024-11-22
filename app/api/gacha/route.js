// app/api/gacha/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');
const items = require('@/Data/DataItemGame'); // นำเข้าข้อมูลไอเทม

async function POST(req) {
  try {
    const userData = await req.json();

    if (!userData || !userData.id || !userData.category) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // ตรวจสอบผู้ใช้งานจากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // สุ่มไอเทมตามประเภท
    const category = userData.category;
    const grade = getRandomGrade(); // ฟังก์ชันสุ่มเกรด
    const filteredItems = items[category]?.filter((item) => item.grade === grade);

    if (!filteredItems || filteredItems.length === 0) {
      return NextResponse.json({ error: 'No item available for the grade' }, { status: 400 });
    }

    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];

    // บันทึกไอเทมเข้าสู่ Inventory
    const newItem = await prisma.inventory.create({
      data: {
        name: randomItem.name,
        image: randomItem.image,
        category: randomItem.category,
        grade: randomItem.grade,
        upgrade: randomItem.upgrade || 0,
        power: randomItem.power,
        userId: user.id,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error processing gacha:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getRandomGrade() {
  const random = Math.random() * 100;
  if (random <= 0.0001) return 'S';
  if (random <= 0.0099) return 'A';
  if (random <= 0.0900) return 'B';
  if (random <= 0.9000) return 'C';
  if (random <= 4.0000) return 'D';
  if (random <= 25.0000) return 'E';
  return 'F';
}

module.exports = { POST };
