const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

/**
 * Parse configurable rate limiting options from process.env with robust defaults
 */
const getRateLimitConfig = () => {
  const parseIntSafe = (val, fallback) => {
    const parsed = parseInt(val, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  return {
    // Auth Routes - Volumetric Limit per IP
    authWindowMs: parseIntSafe(process.env.RATE_LIMIT_AUTH_WINDOW_MINUTES, 15) * 60 * 1000,
    authIpMax: parseIntSafe(process.env.RATE_LIMIT_AUTH_IP_MAX, 30),

    // Auth Routes - Exponential Backoff
    authAccountThreshold: parseIntSafe(process.env.RATE_LIMIT_AUTH_ACCOUNT_MAX_ATTEMPTS, 5),
    authIpThreshold: parseIntSafe(process.env.RATE_LIMIT_AUTH_IP_MAX_ATTEMPTS, 8),
    authBaseBackoff: parseIntSafe(process.env.RATE_LIMIT_AUTH_BASE_BACKOFF_SECONDS, 2),
    authMaxBackoff: parseIntSafe(process.env.RATE_LIMIT_AUTH_MAX_BACKOFF_SECONDS, 900), // 15 mins max

    // Public Routes (Moderate limits)
    publicWindowMs: parseIntSafe(process.env.RATE_LIMIT_PUBLIC_WINDOW_MINUTES, 15) * 60 * 1000,
    publicMax: parseIntSafe(process.env.RATE_LIMIT_PUBLIC_MAX, 200),

    // Authenticated User Routes (Looser limits)
    userWindowMs: parseIntSafe(process.env.RATE_LIMIT_USER_WINDOW_MINUTES, 15) * 60 * 1000,
    userMax: parseIntSafe(process.env.RATE_LIMIT_USER_MAX, 1200),
  };
};

/**
 * In-Memory Exponential Backoff Tracker
 * Tracks failed authentication attempts per IP and per Account Identifier (e.g. Email).
 * Instead of hard-locking accounts (which enables Denial of Service attacks against legitimate users),
 * consecutive failures incur an exponentially escalating delay penalty.
 */
class ExponentialBackoffTracker {
  constructor() {
    this.records = new Map();
    // Sweep expired records every 10 minutes to prevent memory growth
    this.sweepInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
    if (this.sweepInterval.unref) this.sweepInterval.unref();
  }

  getKey(type, id) {
    return `${type}:${id}`;
  }

  getRecord(key) {
    let rec = this.records.get(key);
    if (!rec) {
      rec = {
        failedAttempts: 0,
        lastAttempt: Date.now(),
        blockedUntil: 0,
      };
      this.records.set(key, rec);
    }
    return rec;
  }

  isBlocked(key) {
    const rec = this.records.get(key);
    if (!rec) return { blocked: false, retryAfter: 0, failedAttempts: 0 };
    const now = Date.now();
    if (rec.blockedUntil > now) {
      const remainingSeconds = Math.ceil((rec.blockedUntil - now) / 1000);
      return { blocked: true, retryAfter: remainingSeconds, failedAttempts: rec.failedAttempts };
    }
    return { blocked: false, retryAfter: 0, failedAttempts: rec.failedAttempts };
  }

  recordFailure(key, threshold, baseBackoffSeconds, maxBackoffSeconds) {
    const rec = this.getRecord(key);
    rec.failedAttempts += 1;
    rec.lastAttempt = Date.now();

    if (rec.failedAttempts >= threshold) {
      // Exponential penalty: baseBackoff * 2^(failedAttempts - threshold)
      const exponent = rec.failedAttempts - threshold;
      const backoffSec = Math.min(
        baseBackoffSeconds * Math.pow(2, exponent),
        maxBackoffSeconds
      );
      rec.blockedUntil = Date.now() + backoffSec * 1000;
      return Math.round(backoffSec);
    }
    return 0;
  }

  recordSuccess(key) {
    this.records.delete(key);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, rec] of this.records.entries()) {
      if (rec.blockedUntil <= now && now - rec.lastAttempt > 60 * 60 * 1000) {
        this.records.delete(key);
      }
    }
  }

  reset() {
    this.records.clear();
  }
}

const backoffTracker = new ExponentialBackoffTracker();

/**
 * Middleware: Per-Account & Per-IP Exponential Backoff for Auth Routes
 */
const authBackoffMiddleware = (req, res, next) => {
  // Allow bypassing in automated test suite unless explicitly enabled
  if (process.env.NODE_ENV === 'test' && process.env.ENABLE_RATE_LIMIT_IN_TEST !== 'true') {
    return next();
  }

  const config = getRateLimitConfig();
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const ipKey = backoffTracker.getKey('ip', ip);

  // Normalize account identifier if present in request body
  const rawId = req.body?.email || req.body?.username || '';
  const accountId = typeof rawId === 'string' && rawId.trim() ? rawId.trim().toLowerCase() : null;
  const accountKey = accountId ? backoffTracker.getKey('acc', accountId) : null;

  // 1. Check if IP is currently under backoff delay
  const ipCheck = backoffTracker.isBlocked(ipKey);
  if (ipCheck.blocked) {
    res.setHeader('Retry-After', ipCheck.retryAfter);
    return res.status(429).json({
      status: 429,
      error: 'Too Many Requests',
      message: `Too many failed attempts from this IP address. Escalating security delay in effect. Please retry in ${ipCheck.retryAfter} seconds.`,
      retryAfter: ipCheck.retryAfter,
      scope: 'ip',
    });
  }

  // 2. Check if Account is currently under backoff delay (credential stuffing shield)
  if (accountKey) {
    const accCheck = backoffTracker.isBlocked(accountKey);
    if (accCheck.blocked) {
      res.setHeader('Retry-After', accCheck.retryAfter);
      return res.status(429).json({
        status: 429,
        error: 'Too Many Requests',
        message: `Too many failed login attempts for this account. Escalating security delay in effect. Please retry in ${accCheck.retryAfter} seconds.`,
        retryAfter: accCheck.retryAfter,
        scope: 'account',
      });
    }
  }

  // 3. Intercept response to record outcome
  res.on('finish', () => {
    const status = res.statusCode;
    if (status >= 200 && status < 300) {
      // Successful authentication: clear all penalties immediately
      backoffTracker.recordSuccess(ipKey);
      if (accountKey) backoffTracker.recordSuccess(accountKey);
    } else if (status === 400 || status === 401 || status === 403) {
      // Failed authentication: penalize with exponential escalating window if threshold reached
      backoffTracker.recordFailure(
        ipKey,
        config.authIpThreshold,
        config.authBaseBackoff,
        config.authMaxBackoff
      );
      if (accountKey) {
        backoffTracker.recordFailure(
          accountKey,
          config.authAccountThreshold,
          config.authBaseBackoff,
          config.authMaxBackoff
        );
      }
    }
  });

  next();
};

/**
 * 1. Strict Limiter for Auth Routes:
 * Combines IP volumetric limit with Account + IP exponential backoff
 */
const authLimiter = [
  rateLimit({
    windowMs: getRateLimitConfig().authWindowMs,
    max: () => getRateLimitConfig().authIpMax,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test' && process.env.ENABLE_RATE_LIMIT_IN_TEST !== 'true',
    message: {
      status: 429,
      error: 'Too Many Requests',
      message: 'Too many authentication attempts from this IP address. Please try again later.',
    },
  }),
  authBackoffMiddleware,
];

/**
 * 2. Moderate Limiter for Public Endpoints (browsing courses, tutorials, materials)
 */
const publicLimiter = rateLimit({
  windowMs: getRateLimitConfig().publicWindowMs,
  max: () => getRateLimitConfig().publicMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test' && process.env.ENABLE_RATE_LIMIT_IN_TEST !== 'true',
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Public endpoint request limit reached. Please wait a few moments before browsing again.',
  },
});

/**
 * 3. Looser Limiter for Authenticated User Actions (taking tests, learning, profile updates)
 * Keyed by authenticated User ID so one user's activity never penalizes another user.
 */
const userLimiter = rateLimit({
  windowMs: getRateLimitConfig().userWindowMs,
  max: () => getRateLimitConfig().userMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.user?.id?.toString() || ipKeyGenerator(req);
  },
  skip: () => process.env.NODE_ENV === 'test' && process.env.ENABLE_RATE_LIMIT_IN_TEST !== 'true',
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'User request rate limit reached. Please pace your requests.',
  },
});

/**
 * 4. Tiered API Limiter: Automatically routes requests to appropriate limiter
 * - Unthrottled: /health
 * - Strict authLimiter: /auth/login, /auth/register
 * - Authenticated userLimiter: requests with Bearer token
 * - Moderate publicLimiter: all other general requests
 */
const tieredApiLimiter = (req, res, next) => {
  // Always skip health check (used by monitoring/pingers)
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  // Auth routes have their own explicit authLimiter mounted in authRoutes.js
  if (req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
    return next();
  }

  // Authenticated user vs Public visitor
  const hasAuthToken = req.headers.authorization && req.headers.authorization.startsWith('Bearer ');
  if (hasAuthToken) {
    return userLimiter(req, res, next);
  }

  return publicLimiter(req, res, next);
};

// Aliased for backwards compatibility
const apiLimiter = tieredApiLimiter;

module.exports = {
  authLimiter,
  authBackoffMiddleware,
  publicLimiter,
  userLimiter,
  tieredApiLimiter,
  apiLimiter,
  getRateLimitConfig,
  backoffTracker,
};
