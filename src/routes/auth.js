const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const { protect } = require('../middleware/auth');

// Generate JWT Token - Long-lived (100 years), session controls access
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '100y' // Token doesn't expire, session management controls access
    });
};

// Validate email format
const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    // Simple but effective validation: has @, has . after @, and proper structure
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    return local.length > 0 && domain.includes('.') && domain.split('.').pop().length >= 2;
};

// Validate password strength
const isValidPassword = (password) => {
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
};

// @route   POST /auth/signup
// @desc    Register a new user
// @access  Public
// @route   POST /auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Validate username
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters with uppercase, lowercase, and number'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(409).json({ error: 'Email already registered' });
            }
            return res.status(409).json({ error: 'Username already taken' });
        }

        // Generate verification token
        const crypto = require('crypto');
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const verificationTokenHash = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        // Create user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            role: 'user',
            verificationToken: verificationTokenHash,
            verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isVerified: false
        });

        // Create verification URL
        const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;

        // Send email
        const sendEmail = require('../utils/sendEmail');
        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification',
                message: `Please verify your email by clicking the following link: ${verifyUrl}`,
                html: `<h1>Email Verification</h1>
                       <p>Please verify your email by clicking the following link:</p>
                       <a href="${verifyUrl}">${verifyUrl}</a>`
            });

            res.status(201).json({
                message: 'User created successfully. Please check your email to verify your account.'
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Optionally delete the user if email email fails, or just let them retry
            // await User.findByIdAndDelete(user._id); 
            return res.status(500).json({ error: 'User created, but email could not be sent. Please contact support.' });
        }

    } catch (error) {
        console.error('Signup error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ error: `${field} already exists` });
        }

        res.status(500).json({ error: 'Server error during registration' });
    }
});

// @route   GET /auth/verify/:token
// @desc    Verify email address
// @access  Public
router.get('/verify/:token', async (req, res) => {
    try {
        const crypto = require('crypto');
        const verificationTokenHash = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken: verificationTokenHash,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Server error during verification' });
    }
});

// @route   POST /auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }

        // Find user with security fields
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+password +loginAttempts +lockUntil +isActive');

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(401).json({ error: 'Please verify your email address before logging in' });
        }

        // Check if account is active
        if (user.isActive === false) {
            return res.status(403).json({ error: 'Account has been deactivated. Contact support.' });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({
                error: `Account locked due to too many failed attempts. Try again in ${remainingTime} minutes.`
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            // Increment failed login attempts
            await user.incLoginAttempts();
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();

        const token = generateToken(user._id);

        // Create session in MongoDB
        const session = await Session.createSession(user._id, token, req, 365); // 1 year session

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token,
            sessionId: session._id
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// @route   POST /auth/logout
// @desc    Logout user (invalidate session)
// @access  Private
router.post('/logout', protect, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        await Session.invalidateSession(token);

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error during logout' });
    }
});

// @route   POST /auth/logout-all
// @desc    Logout from all devices (invalidate all sessions)
// @access  Private
router.post('/logout-all', protect, async (req, res) => {
    try {
        await Session.invalidateAllUserSessions(req.user._id);

        res.json({ message: 'Logged out from all devices successfully' });
    } catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /auth/sessions
// @desc    Get all active sessions for current user
// @access  Private
router.get('/sessions', protect, async (req, res) => {
    try {
        const sessions = await Session.getActiveSessions(req.user._id);

        const sessionList = sessions.map(session => ({
            id: session._id,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            lastActivity: session.lastActivity,
            createdAt: session.createdAt,
            isCurrent: session.token === req.headers.authorization.split(' ')[1]
        }));

        res.json({ sessions: sessionList });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /auth/sessions/:id
// @desc    Revoke a specific session
// @access  Private
router.delete('/sessions/:id', protect, async (req, res) => {
    try {
        const session = await Session.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        session.isActive = false;
        await session.save();

        res.json({ message: 'Session revoked successfully' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid session ID' });
        }
        console.error('Delete session error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /auth/password
// @desc    Change password
// @access  Private
router.put('/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        if (!isValidPassword(newPassword)) {
            return res.status(400).json({
                error: 'New password must be at least 6 characters with uppercase, lowercase, and number'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        // Invalidate all other sessions after password change
        const currentToken = req.headers.authorization.split(' ')[1];
        await Session.updateMany(
            { userId: req.user._id, token: { $ne: currentToken } },
            { $set: { isActive: false } }
        );

        res.json({
            message: 'Password updated successfully. Other sessions have been logged out.'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
