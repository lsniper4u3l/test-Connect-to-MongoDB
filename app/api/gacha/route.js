const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
    try {
        const { userId, item } = await req.json();

        // ตรวจสอบว่า userId และ item ถูกต้อง
        if (!userId || !item || !item.name || !item.category) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // เพิ่มไอเทมในช่องเก็บของ
        const newItem = await prisma.inventory.create({
            data: {
                name: item.name,
                image: item.image,
                category: item.category,
                grade: item.grade,
                upgrade: item.upgrade || 0,
                power: item.power,
                userId,
            },
        });

        return NextResponse.json(newItem);
    } catch (error) {
        console.error('Error adding item to inventory:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

module.exports = { POST };
