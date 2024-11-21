const { NextResponse } = require('next/server');
const { prisma } = require('@/lib/prisma');

async function POST(req) {
    try {
        // Parse the request body
        const userData = await req.json();

        // Validate input data
        if (!userData || !userData.id) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
        }

        // Check if the user already exists in the database
        let user = await prisma.user.findUnique({
            where: { telegramId: userData.id },
        });

        // If user does not exist, create a new user
        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: userData.id,
                    username: userData.username || '',
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || '',
                },
            });
        }

        // Return the user data as JSON response
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error processing user data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

module.exports = { POST };
