// app/api/equipment/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const equipment = {
      leftHand: await prisma.inventory.findFirst({ where: { userId, category: 'weaponL' } }),
      rightHand: await prisma.inventory.findFirst({ where: { userId, category: 'weaponR' } }),
      head: await prisma.inventory.findFirst({ where: { userId, category: 'helmet' } }),
      body: await prisma.inventory.findFirst({ where: { userId, category: 'armor' } }),
      legs: await prisma.inventory.findFirst({ where: { userId, category: 'pants' } }),
      feet: await prisma.inventory.findFirst({ where: { userId, category: 'boots' } }),
    };

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { POST };
