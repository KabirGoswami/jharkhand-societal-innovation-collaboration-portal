import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  BHASHINI_API_KEY: process.env.BHASHINI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET || 'hackathon-secret-key-2026',
} as const;

if (!ENV.DATABASE_URL) {
  console.warn('⚠️ WARNING: DATABASE_URL is not defined in .env');
}
