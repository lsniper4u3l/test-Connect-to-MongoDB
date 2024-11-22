// app/api/user-items/route.js

import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get('telegramId');

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: { items: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, items: user.items }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error occurred' }), {
      status: 500,
    });
  }
}
