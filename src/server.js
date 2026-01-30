const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');
const logger = require('./middleware/logger');

const PORT = process.env.PORT || 3000;
const app = express();

// Trust Vercel Proxy (Required for Rate Limiting)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// ===================
// SECURITY MIDDLEWARE
// ===================

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - General API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting - Auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting
app.use(generalLimiter);

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Custom NoSQL injection prevention middleware (Express 5 compatible)
const sanitizeInput = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Remove keys starting with $ or containing .
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeInput(obj[key]);
        // Modify: Only remove $ from string values, allow . (dots)
        obj[key] = obj[key].replace(/\$/g, '');
      }
    }
  }
  return obj;
};

app.use((req, res, next) => {
  if (req.body) {
    sanitizeInput(req.body);
  }
  next();
});

// Custom XSS protection middleware
app.use((req, res, next) => {
  if (req.body) {
    const sanitizeObject = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key]
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };
    sanitizeObject(req.body);
  }
  next();
});

// Logger
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Express server is working!', status: 'success' });
});

// ===================
// ROUTES
// ===================

app.use('/auth', authLimiter, authRouter);
app.use('/notes', notesRouter);

// Serve frontend for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// ===================
// ERROR HANDLING
// ===================

app.use((err, req, res, next) => {
  console.error('Error:', err);

  const isDev = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Something went wrong',
    ...(isDev && { stack: err.stack })
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
