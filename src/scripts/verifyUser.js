const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const connectDB = require('../config/db');

const verifyByEmail = async (email) => {
    if (!email) {
        console.error('Please provide an email address.');
        process.exit(1);
    }

    try {
        await connectDB();

        // Check if user exists in the main specific User collection
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            if (user.isVerified) {
                console.log(`User ${email} is already verified.`);
            } else {
                user.isVerified = true;
                await user.save();
                console.log(`Successfully verified existing user: ${email}`);
            }
            process.exit(0);
        }

        // Check PendingUser
        const pendingUser = await PendingUser.findOne({ email: email.toLowerCase() });

        if (pendingUser) {
            console.log(`Found pending user: ${email}. Moving to main User collection...`);

            const newUser = {
                username: pendingUser.username,
                email: pendingUser.email,
                password: pendingUser.password, // Already hashed
                role: 'user',
                isVerified: true,
                createdAt: Date.now()
            };

            await User.create(newUser);
            await PendingUser.deleteOne({ _id: pendingUser._id });

            console.log(`Successfully moved and verified pending user: ${email}`);
            process.exit(0);
        }

        console.error(`User with email ${email} not found in User or PendingUser collections.`);
        process.exit(1);

    } catch (error) {
        console.error('Error verifying user:', error);
        process.exit(1);
    }
};

const email = process.argv[2];
verifyByEmail(email);
