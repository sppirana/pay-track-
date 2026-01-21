"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const User_1 = require("../models/User");
const adminMiddleware = (req, res, next) => {
    // Check if user is authenticated (should be called after authMiddleware)
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    // Check if user is admin
    if (req.user.role !== User_1.UserRole.ADMIN) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
