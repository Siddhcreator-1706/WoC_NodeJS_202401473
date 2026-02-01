const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

// Protect routes - verify JWT token and session
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header or Cookie
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            // Validate token format
            if (token === 'null' || token === 'undefined') {
                return res.status(401).json({ error: 'Invalid token format' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if token has required fields
            if (!decoded.id) {
                return res.status(401).json({ error: 'Invalid token payload' });
            }

            // Check if session exists and is active
            const session = await Session.findOne({
                token,
                isActive: true,
                expiresAt: { $gt: new Date() }
            });

            if (!session) {
                return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
            }

            // Update session activity
            await Session.updateActivity(token);

            // Get user from token (exclude password)
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            // Attach user and session to request
            req.user = user;
            req.session = session;
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
    let token;
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            if (token !== 'null' && token !== 'undefined') {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Check session validity
                const session = await Session.findOne({
                    token,
                    isActive: true,
                    expiresAt: { $gt: new Date() }
                });

                if (session) {
                    req.user = await User.findById(decoded.id);
                    req.session = session;
                }
            }
        } catch (error) {
            // Token invalid, but we don't fail - just no user attached
            req.user = null;
        }
    }
    next();
};

module.exports = { protect, isAdmin, optionalAuth };
