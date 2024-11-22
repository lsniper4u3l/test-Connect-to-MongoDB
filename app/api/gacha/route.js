// app/api/gacha/route.js

import { prisma } from '@/lib/prisma';

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

const items = {
  F: { name: 'Wooden Shield', image: '/Weapon/F-Weapon-L.png', power: 75 },
  E: { name: 'Iron Shield', image: '/Weapon/E-Weapon-L.png', power: 94 },
  D: { name: 'Bronze Shield', image: '/Weapon/D-Weapon-L.png', power: 117 },
  C: { name: 'Steel Shield', image: '/Weapon/C-Weapon-L.png', power: 146 },
  B: { name: 'Golden Shield', image: '/Weapon/B-Weapon-L.png', power: 182 },
  A: { name: 'Dragon Shield', image: '/Weapon/A-Weapon-L.png', power: 227 },
  S: { name: 'Divine Shield', image: '/Weapon/S-Weapon-L.png', power: 284 },
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { telegramId } = body;

    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404 }
      );
    }

    const grade = getRandomGrade();
    const item = items[grade];

    const newItem = await prisma.userItem.create({
      data: {
        name: item.name,
        image: item.image,
        category: 'weaponL',
        grade,
        power: item.power,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify({ success: true, item: newItem }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error occurred' }), {
      status: 500,
    });
  }
}
