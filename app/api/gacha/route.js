// app/api/gacha/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');
const items = require('@/Data/DataItemGame');

async function POST(req) {
  const debugLog = []; // สร้าง Debug Log ที่เก็บข้อความ
  try {
    const userData = await req.json();

    debugLog.push(`Request Body: ${JSON.stringify(userData)}`); // Log ข้อมูล Request

    if (!userData || !userData.id || !userData.category) {
      debugLog.push('Invalid request data');
      return NextResponse.json({ error: 'Invalid request data', debugLog }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
    });

    debugLog.push(`User Found: ${JSON.stringify(user)}`); // Log ผู้ใช้

    if (!user) {
      debugLog.push('User not found');
      return NextResponse.json({ error: 'User not found', debugLog }, { status: 404 });
    }

    const category = userData.category;
    const grade = getRandomGrade();
    const filteredItems = items[category]?.filter((item) => item.grade === grade);

    debugLog.push(`Filtered Items: ${JSON.stringify(filteredItems)}`); // Log ไอเทมที่ค้นหา

    if (!filteredItems || filteredItems.length === 0) {
      debugLog.push('No item available for the grade');
      return NextResponse.json({ error: 'No item available for the grade', debugLog }, { status: 400 });
    }

    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];

    debugLog.push(`Random Item Selected: ${JSON.stringify(randomItem)}`); // Log ไอเทมที่สุ่มได้

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

    debugLog.push(`New Item Created: ${JSON.stringify(newItem)}`); // Log ไอเทมที่สร้าง

    return NextResponse.json({ item: newItem, debugLog }); // ส่ง Debug Log กลับไปด้วย
  } catch (error) {
    debugLog.push(`Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error', debugLog }, { status: 500 });
  }
}

function getRandomGrade() {
  const random = Math.random() * 100;
  if (random <= 0.00010) return 'S';
  if (random <= 0.00100) return 'A';
  if (random <= 0.10000) return 'B';
  if (random <= 1.00000) return 'C';
  if (random <= 5.00000) return 'D';
  if (random <= 30.00000) return 'E';
  return 'F';
}

module.exports = { POST };
