const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('FATAL: MONGODB_URI environment variable is missing');
        throw new Error('MONGODB_URI environment variable is missing');
    }

    // If connection is already established, reuse it
    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    // If no connection promise, create one
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable Mongoose buffering to fail fast if not connected
        };

        console.log('Creating new MongoDB connection...');
        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB Connection Error:', e);
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
