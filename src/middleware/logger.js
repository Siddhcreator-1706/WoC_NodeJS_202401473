/**
 * Request Logger Middleware
 * Logs request method, URL, and timestamp
 * Excludes sensitive information from logs
 */
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;

    // Don't log sensitive endpoints in production
    const sensitiveEndpoints = ['/auth/login', '/auth/signup', '/auth/password'];
    const isSensitive = sensitiveEndpoints.some(endpoint => url.includes(endpoint));

    if (process.env.NODE_ENV === 'production' && isSensitive) {
        console.log(`[${timestamp}] ${method} ${url.split('?')[0]} [REDACTED]`);
    } else {
        console.log(`[${timestamp}] ${method} ${url}`);
    }

    // Log response time
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (duration > 1000) {
            console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} (${duration}ms) [SLOW]`);
        }
    });

    next();
};

module.exports = logger;
