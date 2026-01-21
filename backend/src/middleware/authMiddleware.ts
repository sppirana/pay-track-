import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStatus } from '../models/User';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        status: string;
    };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Check if user is approved
        if (user.status !== UserStatus.APPROVED) {
            return res.status(403).json({
                error: 'Account not approved',
                status: user.status
            });
        }

        // Attach user to request
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            status: user.status
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
