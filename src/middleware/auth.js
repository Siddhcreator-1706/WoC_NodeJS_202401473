const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Validate token format
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ error: 'Invalid token format' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if token has required fields
            if (!decoded.id) {
                return res.status(401).json({ error: 'Invalid token payload' });
            }

            // Get user from token (exclude password)
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            // Check if user changed password after token was issued
            if (user.passwordChangedAt) {
                const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
                if (decoded.iat < changedTimestamp) {
                    return res.status(401).json({ error: 'Password recently changed. Please log in again.' });
                }
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth error:', error.message);

            // Handle specific JWT errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired. Please log in again.' });
            }

            return res.status(401).json({ error: 'Not authorized' });
        }
    } else {
        return res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

// Admin only middleware
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next();
};

// Optional auth - doesn't fail if no token, but attaches user if valid
const optionalAuth = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (token && token !== 'null' && token !== 'undefined') {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id);
            }
        } catch (error) {
            // Token invalid, but we don't fail - just no user attached
            req.user = null;
        }
    }
    next();
};

module.exports = { protect, isAdmin, optionalAuth };
