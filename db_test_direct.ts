import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function test() {
  console.log('Testing DIRECT DB connection...');
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Direct Connection successful:', result);
  } catch (e) {
    console.error('Direct Connection failed:');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
