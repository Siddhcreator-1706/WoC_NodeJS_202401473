const app = require('../src/server.js');

// For Vercel Serverless, we need to ensure the DB connects on every request if not cached
const connectDB = require('../src/config/db');

// This wraps the app in a function that awaits the DB connection before handling the request
module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};
