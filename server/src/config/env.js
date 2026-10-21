import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopagent',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_fallback',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001',
  AI_SERVICE_SECRET: process.env.AI_SERVICE_SECRET || 'internal_shared_secret_token',
  NODE_ENV: process.env.NODE_ENV || 'development'
};