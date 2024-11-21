const { PrismaClient } = require('@prisma/client');

let globalForPrisma = global;

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
