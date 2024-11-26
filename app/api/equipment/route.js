// app/api/equipment/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { items: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const equipment = {
      leftHand: user.leftHand ? await prisma.inventory.findUnique({ where: { id: user.leftHand } }) : null,
      rightHand: user.rightHand ? await prisma.inventory.findUnique({ where: { id: user.rightHand } }) : null,
      head: user.head ? await prisma.inventory.findUnique({ where: { id: user.head } }) : null,
      body: user.body ? await prisma.inventory.findUnique({ where: { id: user.body } }) : null,
      legs: user.legs ? await prisma.inventory.findUnique({ where: { id: user.legs } }) : null,
      feet: user.feet ? await prisma.inventory.findUnique({ where: { id: user.feet } }) : null,
    };

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { POST };
