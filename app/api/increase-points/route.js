// app/api/increase-points/route.js

const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
    try {
        // Parse the request body to extract telegramId
        const { telegramId } = await req.json();

        // Validate that telegramId exists
        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
        }

        // Update user points by incrementing them
        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { points: { increment: 1 } }, // Increment points by 1
        });

        // Respond with the updated points
        return NextResponse.json({ success: true, points: updatedUser.points });
    } catch (error) {
        console.error('Error increasing points:', error);
        // Handle errors gracefully with a 500 status code
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

module.exports = { POST };
