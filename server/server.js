const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const helmet = require('helmet');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Trust reverse proxy (Render, Vercel, Cloudflare, AWS ALB) for correct IP rate-limiting & SSL offloading
app.set('trust proxy', 1);

// Body parser
app.use(express.json());

// Express 5 compatible NoSQL Query Injection protection
const { sanitizeNoSql } = require('./middleware/sanitizeMiddleware');
app.use(sanitizeNoSql);

// CORS
const configuredFrontend = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
const allowedOrigins = [
  configuredFrontend,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');

    // Allow explicitly whitelisted origins
    if (allowedOrigins.indexOf(cleanOrigin) !== -1) {
      return callback(null, true);
    }

    // Allow any vercel.app deployment (including branch previews)
    if (cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // In non-production, allow any localhost/127.0.0.1 port
    if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    // Safely reject disallowed origins without crashing Express
    return callback(null, false);
  },
  credentials: true,
}));

// Security Headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes - Health Check with active MongoDB Atlas ping
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbLatency = null;

  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const start = Date.now();
      await mongoose.connection.db.command({ ping: 1 });
      dbLatency = `${Date.now() - start}ms`;
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    database: dbStatus,
    dbLatency,
    timestamp: new Date().toISOString(),
  });
});

// Periodic keep-alive ping to MongoDB Atlas (prevents cluster dormancy & idle connection drops)
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // Every 10 minutes
setInterval(async () => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.command({ ping: 1 });
    }
  } catch (err) {
    console.warn('⚠️ MongoDB keep-alive ping warning:', err.message);
  }
}, KEEP_ALIVE_INTERVAL);

// Apply rate limiter to all API routes (except unthrottled /api/health above)
app.use('/api', apiLimiter);

// Import route files
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');
const materialRoutes = require('./routes/materialRoutes');
const mockTestRoutes = require('./routes/mockTestRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const resultRoutes = require('./routes/resultRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/mocktests', mockTestRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Graceful shutdown handling for container restarts & zero-downtime deployments
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Closing server gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err.message);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
