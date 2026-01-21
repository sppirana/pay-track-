import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { UserRole } from '../models/User';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if user is authenticated (should be called after authMiddleware)
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
};
