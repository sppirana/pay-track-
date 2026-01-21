import express, { Response } from 'express';
import { User, UserStatus, UserRole } from '../models/User';
import { Customer } from '../models/Customer';
import { Transaction } from '../models/Transaction';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all users with optional status filter
router.get('/users', async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.query;

        let filter: any = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

        res.json({
            users,
            count: users.length
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
    try {
        const total = await User.countDocuments();
        const pending = await User.countDocuments({ status: UserStatus.PENDING });
        const approved = await User.countDocuments({ status: UserStatus.APPROVED });
        const rejected = await User.countDocuments({ status: UserStatus.REJECTED });

        res.json({
            total,
            pending,
            approved,
            rejected
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Approve user
router.put('/users/:id/approve', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.status === UserStatus.APPROVED) {
            return res.status(400).json({ error: 'User is already approved' });
        }

        user.status = UserStatus.APPROVED;
        await user.save();

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
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({ error: 'Failed to approve user' });
    }
});

// Reject user
router.put('/users/:id/reject', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.status = UserStatus.REJECTED;
        await user.save();

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
    } catch (error) {
        console.error('Reject user error:', error);
        res.status(500).json({ error: 'Failed to reject user' });
    }
});

// Delete user and their data
router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting admin users
        if (user.role === UserRole.ADMIN) {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }

        // Delete user's customers and transactions
        await Customer.deleteMany({ userId: id });
        await Transaction.deleteMany({ userId: id });

        // Delete user
        await User.findByIdAndDelete(id);

        res.json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
