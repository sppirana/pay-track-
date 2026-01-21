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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Validation rules
const registerValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('shopName').trim().notEmpty().withMessage('Shop Name is required'),
    (0, express_validator_1.body)('phoneNumber').trim().notEmpty().withMessage('Phone Number is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
// Register new user (creates with pending status)
router.post('/register', registerValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, shopName, phoneNumber, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Create new user with pending status
        const user = new User_1.User({
            name,
            shopName,
            phoneNumber,
            email,
            password,
            status: User_1.UserStatus.PENDING
        });
        yield user.save();
        res.status(201).json({
            message: 'Registration successful! Please wait for admin approval.',
            user: {
                id: user._id,
                name: user.name,
                shopName: user.shopName,
                email: user.email,
                status: user.status
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}));
// Login
router.post('/login', loginValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Check user status
        if (user.status === User_1.UserStatus.PENDING) {
            return res.status(403).json({
                error: 'Your account is pending approval. Please wait for admin to approve your account.',
                status: 'pending'
            });
        }
        if (user.status === User_1.UserStatus.REJECTED) {
            return res.status(403).json({
                error: 'Your account has been rejected. Please contact admin.',
                status: 'rejected'
            });
        }
        // Generate JWT token (only for approved users)
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        const jwtExpiration = process.env.JWT_EXPIRES_IN || '24h';
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            role: user.role
        }, jwtSecret, { expiresIn: jwtExpiration });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}));
// Verify token
router.get('/verify', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
}));
// Change password
router.post('/change-password', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { currentPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Verify current password
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }
        // Update password (hashing handled by pre-save hook)
        user.password = newPassword;
        yield user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
}));
exports.default = router;
