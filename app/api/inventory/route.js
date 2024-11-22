// app/api/inventory/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // ดึงข้อมูลไอเทมของผู้ใช้จากฐานข้อมูล
        const inventory = await prisma.userItem.findMany({
            where: { userId },
        });

        return NextResponse.json(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

module.exports = { GET };
