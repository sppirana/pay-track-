import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/api';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cms';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// Database Connection Pattern for Serverless
let cachedDb: mongoose.Connection | null = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI);
        cachedDb = conn.connection;
        console.log('Connected to MongoDB');
        return cachedDb;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

// Initialize DB connection for serverless (doesn't wait for connection to define routes)
connectToDatabase();

// Only start the server if we're running locally (not in Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
