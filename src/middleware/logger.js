// Middleware to log request details
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware/route handler
};

module.exports = logger;
