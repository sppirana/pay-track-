import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cms';

// Cache the connection across hot reloads/serverless invocations
let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
  if (cachedConnection) return cachedConnection;
  cachedConnection = await mongoose.connect(MONGODB_URI);
  return cachedConnection;
}

export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRoutes);
  return app;
}
