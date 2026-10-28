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

// Body parser with raw prototype pollution verification
app.use(express.json({
  verify: (req, res, buf) => {
    if (buf && buf.length) {
      const str = buf.toString();
      if (str.includes('"__proto__"') || str.includes('"constructor"') || str.includes('"prototype"')) {
        const err = new Error('Prohibited prototype pollution key detected');
        err.statusCode = 400;
        throw err;
      }
    }
  },
}));

// Express 5 compatible NoSQL Query Injection protection & strict input rejection
const { rejectProhibitedInput, sanitizeNoSql } = require('./middleware/sanitizeMiddleware');
app.use(rejectProhibitedInput);
app.use(sanitizeNoSql);

// CORS
const configuredFrontends = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...configuredFrontends,
  'https://lms-cloud-sai.vercel.app',
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

    // Allow scoped project Vercel deployments & branch previews (e.g. lms-cloud-sai-git-main-sairitik008s-projects.vercel.app)
    if (
      /^https:\/\/(lms-cloud-sai|lms-frontend)(-[a-z0-9-]+)?-sairitik008s-projects\.vercel\.app$/i.test(cleanOrigin) ||
      /^https:\/\/lms-cloud-sai(-[a-z0-9-]+)?\.vercel\.app$/i.test(cleanOrigin)
    ) {
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
    } else if (mongoose.connection.readyState === 2) {
      dbStatus = 'connecting';
    }
  } catch (err) {
    console.error('Health check database ping failed:', err);
    dbStatus = 'unavailable';
  }

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    database: dbStatus,
    dbLatency,
    timestamp: new Date().toISOString(),
  });
});

// Periodic keep-alive ping to MongoDB Atlas (prevents cluster dormancy & idle connection drops by NAT firewalls)
// Reduced to 45 seconds to keep cloud firewall sockets warm and prevent dropped TCP connections
const KEEP_ALIVE_INTERVAL = 45 * 1000;
setInterval(async () => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.command({ ping: 1 });
    } else if (mongoose.connection.readyState === 0) {
      console.warn('⚠️ MongoDB connection is inactive in keep-alive check. Initiating reconnection...');
      connectDB().catch((err) => console.warn('Keep-alive reconnect attempt warning:', err.message));
    }
  } catch (err) {
    console.warn('⚠️ MongoDB keep-alive ping warning:', err.message);
  }
}, KEEP_ALIVE_INTERVAL);

// Automated Cloud Keep-Alive: Self-pings public Render web URL to reset 15-min idle spin-down counter
// Falls back to production URL 'https://lms-cloud-sai.onrender.com' if not explicitly defined
const publicUrl = process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'https://lms-cloud-sai.onrender.com' : null);
if (publicUrl && process.env.NODE_ENV !== 'test') {
  const cleanPublicUrl = publicUrl.replace(/\/+$/, '');
  const SELF_PING_INTERVAL = 9 * 60 * 1000; // Every 9 minutes (Render cooling-period threshold is 15 mins)
  setInterval(async () => {
    try {
      const pingRes = await fetch(`${cleanPublicUrl}/api/health`);
      if (pingRes.ok) {
        console.log(`[UPTIME] Keep-alive ping acknowledged by ${cleanPublicUrl} (status: ${pingRes.status})`);
      }
    } catch (err) {
      console.warn('[UPTIME] Automated keep-alive ping warning:', err.message);
    }
  }, SELF_PING_INTERVAL);
}

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

// Handle unhandled promise rejections & uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});
