"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./src/models/User");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cms';
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
            // Check if admin already exists
            const existingAdmin = yield User_1.User.findOne({ email: 'admin@cms.local' });
            if (existingAdmin) {
                console.log('Admin user already exists');
                process.exit(0);
            }
            // Create admin user
            const admin = new User_1.User({
                name: 'Admin',
                email: 'admin@cms.local',
                password: 'admin123', // Will be hashed automatically
                role: User_1.UserRole.ADMIN,
                status: User_1.UserStatus.APPROVED
            });
            yield admin.save();
            console.log('Admin user created successfully!');
            console.log('Email: admin@cms.local');
            console.log('Password: admin123');
            console.log('Please change the password after first login!');
            process.exit(0);
        }
        catch (error) {
            console.error('Error creating admin user:', error);
            process.exit(1);
        }
    });
}
createAdminUser();
