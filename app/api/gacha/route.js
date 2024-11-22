// app/api/gacha/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
    try {
        const { userId, item } = await req.json();

        // ตรวจสอบข้อมูลที่ส่งมา
        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
        }
        if (!item || !item.name || !item.category || !item.grade || !item.power) {
            return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
        }

        // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // เพิ่มไอเทมลงใน Inventory
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
        console.error('Error in /api/gacha:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

module.exports = { POST };
