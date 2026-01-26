const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.log('Server will continue running, but database features will not work.');
        console.log('Please ensure MongoDB is running or update MONGODB_URI in .env');
        return false;
    }
};

module.exports = connectDB;
