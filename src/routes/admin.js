const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// @route   GET /admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error fetching users' });
    }
});

// @route   PUT /admin/users/:id/role
// @desc    Update user role
// @access  Admin only
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Valid role (user/admin) is required' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent admin from demoting themselves
        if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
            return res.status(400).json({ error: 'Cannot change your own admin role' });
        }

        user.role = role;
        await user.save();

        res.json({
            message: 'User role updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Server error updating role' });
    }
});

// @route   DELETE /admin/users/:id
// @desc    Delete a user
// @access  Admin only
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error deleting user' });
    }
});

module.exports = router;
