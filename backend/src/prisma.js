import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of the Prisma Client.
 */
export const prisma = new PrismaClient();
