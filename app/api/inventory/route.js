// app/api/inventory/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // ดึงข้อมูลไอเทมทั้งหมดของผู้ใช้
        const inventory = await prisma.inventory.findMany({
            where: { userId },
        });

        return NextResponse.json(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

module.exports = { GET };

