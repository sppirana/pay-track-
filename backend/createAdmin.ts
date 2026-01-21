import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, UserRole, UserStatus } from './src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cms';

async function createAdminUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@cms.local' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            name: 'Admin',
            email: 'admin@cms.local',
            password: 'admin123', // Will be hashed automatically
            role: UserRole.ADMIN,
            status: UserStatus.APPROVED
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@cms.local');
        console.log('Password: admin123');
        console.log('Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
