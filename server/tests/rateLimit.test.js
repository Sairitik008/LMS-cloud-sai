const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const {
  getRateLimitConfig,
  backoffTracker,
  authBackoffMiddleware,
  tieredApiLimiter,
} = require('../middleware/rateLimitMiddleware');

describe('Rate Limiting & Exponential Backoff Architecture', () => {
  beforeEach(() => {
    backoffTracker.reset();
  });

  test('1. getRateLimitConfig parses environment variables with valid fallbacks', () => {
    const config = getRateLimitConfig();

    assert.ok(config.authWindowMs > 0, 'authWindowMs should be positive');
    assert.ok(config.authIpMax > 0, 'authIpMax should be positive');
    assert.ok(config.authAccountThreshold > 0, 'authAccountThreshold should be positive');
    assert.ok(config.authBaseBackoff > 0, 'authBaseBackoff should be positive');
    assert.ok(config.authMaxBackoff >= config.authBaseBackoff, 'authMaxBackoff should exceed base backoff');
    assert.ok(config.publicMax > 0, 'publicMax should be positive');
    assert.ok(config.userMax > config.publicMax, 'userMax should be looser than publicMax');
  });

  test('2. Exponential backoff escalates penalty after threshold consecutive failures', () => {
    const key = 'acc:test_student@example.com';
    const threshold = 3;
    const baseBackoff = 2;
    const maxBackoff = 60;

    // First 2 failures: below threshold -> 0s backoff
    assert.strictEqual(backoffTracker.recordFailure(key, threshold, baseBackoff, maxBackoff), 0);
    assert.strictEqual(backoffTracker.recordFailure(key, threshold, baseBackoff, maxBackoff), 0);

    let status = backoffTracker.isBlocked(key);
    assert.strictEqual(status.blocked, false, 'Should not be blocked before threshold');

    // 3rd failure (attempt == threshold): 2 * 2^0 = 2 seconds
    const backoff1 = backoffTracker.recordFailure(key, threshold, baseBackoff, maxBackoff);
    assert.strictEqual(backoff1, 2, 'First penalty should be 2 seconds');
    status = backoffTracker.isBlocked(key);
    assert.strictEqual(status.blocked, true, 'Should now be blocked');
    assert.ok(status.retryAfter >= 1 && status.retryAfter <= 2);

    // 4th failure (attempt == threshold + 1): 2 * 2^1 = 4 seconds
    const backoff2 = backoffTracker.recordFailure(key, threshold, baseBackoff, maxBackoff);
    assert.strictEqual(backoff2, 4, 'Second penalty should be 4 seconds');

    // 5th failure: 2 * 2^2 = 8 seconds
    const backoff3 = backoffTracker.recordFailure(key, threshold, baseBackoff, maxBackoff);
    assert.strictEqual(backoff3, 8, 'Third penalty should be 8 seconds');

    // 6th failure: 2 * 2^3 = 16 seconds
    const backoff4 = backoffTracker.recordFailure(key, threshold, baseBackoff, maxBackoff);
    assert.strictEqual(backoff4, 16, 'Fourth penalty should be 16 seconds');
  });

  test('3. Successful authentication immediately clears backoff penalty', () => {
    const key = 'acc:victim@example.com';
    const threshold = 2;

    backoffTracker.recordFailure(key, threshold, 5, 100);
    backoffTracker.recordFailure(key, threshold, 5, 100);
    assert.strictEqual(backoffTracker.isBlocked(key).blocked, true, 'Account should be blocked');

    // Student logs in with correct password
    backoffTracker.recordSuccess(key);

    const statusAfter = backoffTracker.isBlocked(key);
    assert.strictEqual(statusAfter.blocked, false, 'Account penalty must be immediately cleared on success');
  });

  test('4. Dual tracking isolates attacker target without locking out other accounts', () => {
    const targetAccountKey = 'acc:student_a@example.com';
    const innocentAccountKey = 'acc:student_b@example.com';
    const threshold = 1;

    // Attacker brute-forces student A
    backoffTracker.recordFailure(targetAccountKey, threshold, 10, 100);

    assert.strictEqual(backoffTracker.isBlocked(targetAccountKey).blocked, true, 'Target account must be protected with backoff');
    assert.strictEqual(backoffTracker.isBlocked(innocentAccountKey).blocked, false, 'Innocent student account must not be blocked');
  });

  test('5. authBackoffMiddleware blocks requests with 429 and Retry-After header when account is under backoff', () => {
    const accountKey = backoffTracker.getKey('acc', 'victim@example.com');
    // Pre-seed an active block
    backoffTracker.recordFailure(accountKey, 1, 10, 60);

    const req = {
      ip: '192.168.1.100',
      body: { email: 'victim@example.com', password: 'wrong' },
    };

    let statusCode = null;
    let jsonPayload = null;
    let headers = {};

    const res = {
      setHeader: (k, v) => { headers[k] = v; },
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => { jsonPayload = data; },
        };
      },
      on: () => {},
    };

    // Force rate limiting check by setting flag
    process.env.ENABLE_RATE_LIMIT_IN_TEST = 'true';
    try {
      let nextCalled = false;
      authBackoffMiddleware(req, res, () => { nextCalled = true; });

      assert.strictEqual(nextCalled, false, 'next() must NOT be called when request is rate limited');
      assert.strictEqual(statusCode, 429, 'HTTP status must be 429 Too Many Requests');
      assert.ok(headers['Retry-After'] > 0, 'Retry-After header must be set');
      assert.strictEqual(jsonPayload.scope, 'account', 'Error scope should identify account');
    } finally {
      delete process.env.ENABLE_RATE_LIMIT_IN_TEST;
    }
  });

  test('6. tieredApiLimiter unthrottles healthcheck and routes based on authorization', () => {
    let nextCalled = false;
    const reqHealth = { path: '/api/health' };
    tieredApiLimiter(reqHealth, {}, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true, '/api/health must bypass rate limiting for pingers/uptime monitors');

    nextCalled = false;
    const reqAuthSkip = { path: '/api/auth/login' };
    tieredApiLimiter(reqAuthSkip, {}, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true, 'Auth routes must skip tiered limiter to use dedicated authLimiter');
  });
});
