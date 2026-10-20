const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication routes (login / register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 attempts per window per IP
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: () => process.env.NODE_ENV === 'test', // Bypass during automated tests
  message: {
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

// General rate limiter for all other API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Max 500 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    message: 'Too many requests. Please slow down and try again later.',
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
