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
const User_1 = require("../models/User");
const Customer_1 = require("../models/Customer");
const Transaction_1 = require("../models/Transaction");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
// Apply authentication and admin middleware to all routes
router.use(authMiddleware_1.authMiddleware);
router.use(adminMiddleware_1.adminMiddleware);
// Get all users with optional status filter
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        let filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        const users = yield User_1.User.find(filter).select('-password').sort({ createdAt: -1 });
        res.json({
            users,
            count: users.length
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}));
// Get user statistics
router.get('/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield User_1.User.countDocuments();
        const pending = yield User_1.User.countDocuments({ status: User_1.UserStatus.PENDING });
        const approved = yield User_1.User.countDocuments({ status: User_1.UserStatus.APPROVED });
        const rejected = yield User_1.User.countDocuments({ status: User_1.UserStatus.REJECTED });
        res.json({
            total,
            pending,
            approved,
            rejected
        });
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
}));
// Approve user
router.put('/users/:id/approve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.status === User_1.UserStatus.APPROVED) {
            return res.status(400).json({ error: 'User is already approved' });
        }
        user.status = User_1.UserStatus.APPROVED;
        yield user.save();
        res.json({
            message: 'User approved successfully',
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
        console.error('Approve user error:', error);
        res.status(500).json({ error: 'Failed to approve user' });
    }
}));
// Reject user
router.put('/users/:id/reject', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.status = User_1.UserStatus.REJECTED;
        yield user.save();
        res.json({
            message: 'User rejected successfully',
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
        console.error('Reject user error:', error);
        res.status(500).json({ error: 'Failed to reject user' });
    }
}));
// Delete user and their data
router.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Prevent deleting admin users
        if (user.role === User_1.UserRole.ADMIN) {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }
        // Delete user's customers and transactions
        yield Customer_1.Customer.deleteMany({ userId: id });
        yield Transaction_1.Transaction.deleteMany({ userId: id });
        // Delete user
        yield User_1.User.findByIdAndDelete(id);
        res.json({ message: 'User and associated data deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}));
exports.default = router;
