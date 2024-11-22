// app/api/gacha/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
    try {
        const { userId, item } = await req.json();

        if (!userId || !item) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        // เพิ่มไอเทมลงในฐานข้อมูลของผู้ใช้
        const newItem = await prisma.userItem.create({
            data: {
                userId,
                name: item.name,
                image: item.image,
                category: item.category,
                grade: item.grade,
                power: item.power,
            },
        });

        return NextResponse.json(newItem);
    } catch (error) {
        console.error('Error saving gacha item:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

module.exports = { POST };
