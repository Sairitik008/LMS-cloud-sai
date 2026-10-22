const { test, describe } = require('node:test');
const assert = require('node:assert');
const { errorHandler, notFound } = require('../middleware/errorMiddleware');

describe('Security & Error Handling Middleware Tests', () => {
  const createMockRes = () => {
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      },
    };
    return res;
  };

  const createMockReq = (overrides = {}) => ({
    method: 'GET',
    originalUrl: '/api/test',
    ip: '127.0.0.1',
    headers: {},
    ...overrides,
  });

  test('1. Stack traces are NEVER exposed in the JSON response under any NODE_ENV', () => {
    const originalEnv = process.env.NODE_ENV;
    
    // Test under both development, test, and production modes
    for (const env of ['development', 'test', 'production', undefined]) {
      process.env.NODE_ENV = env;
      const res = createMockRes();
      const req = createMockReq();
      const err = new Error('Database connection failed unexpectedly');
      err.stack = 'Error: Database connection failed unexpectedly\n    at Object.<anonymous> (E:\\project\\server\\secret.js:42:15)';

      errorHandler(err, req, res, () => {});

      assert.strictEqual(res.body.stack, undefined, `Stack trace must be undefined when NODE_ENV=${env}`);
      assert.strictEqual(JSON.stringify(res.body).includes('secret.js'), false, 'Internal file name must not leak into response');
    }

    process.env.NODE_ENV = originalEnv;
  });

  test('2. Internal Windows and POSIX file paths are suppressed and replaced with generic messages', () => {
    const resWindows = createMockRes();
    const reqWindows = createMockReq();
    const errWindows = new Error("ENOENT: no such file or directory, open 'C:\\Users\\Administrator\\server\\keys\\private.pem'");

    errorHandler(errWindows, reqWindows, resWindows, () => {});

    assert.strictEqual(resWindows.statusCode, 500);
    assert.strictEqual(resWindows.body.message, 'An unexpected server error occurred. Please try again later.');
    assert.strictEqual(JSON.stringify(resWindows.body).includes('C:\\Users'), false, 'Windows file path must not leak');

    const resUnix = createMockRes();
    const reqUnix = createMockReq();
    const errUnix = new Error("Cannot open /etc/secrets/ssl_cert.crt: Permission denied");

    errorHandler(errUnix, reqUnix, resUnix, () => {});

    assert.strictEqual(resUnix.statusCode, 500);
    assert.strictEqual(resUnix.body.message, 'An unexpected server error occurred. Please try again later.');
    assert.strictEqual(JSON.stringify(resUnix.body).includes('/etc/secrets'), false, 'POSIX file path must not leak');
  });

  test('3. Raw database network and driver errors return generic 503 without leaking cluster connection info', () => {
    const res = createMockRes();
    const req = createMockReq();
    const err = new Error('connect ECONNREFUSED 127.0.0.1:27017, mongodb+srv://admin:pass@cluster0.mongodb.net');
    err.name = 'MongoServerSelectionError';

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 503);
    assert.strictEqual(res.body.message, 'Service temporarily unavailable. Please try again later.');
    assert.strictEqual(JSON.stringify(res.body).includes('127.0.0.1'), false, 'Database IP must not be exposed');
    assert.strictEqual(JSON.stringify(res.body).includes('mongodb.net'), false, 'Database cluster URL must not be exposed');
    assert.strictEqual(JSON.stringify(res.body).includes('admin:pass'), false, 'Credentials must never be exposed');
  });

  test('4. MongoDB duplicate key (11000) error returns clean user message without leaking index or collection names', () => {
    const res = createMockRes();
    const req = createMockReq();
    const err = new Error('E11000 duplicate key error collection: lms_db.users index: email_1 dup key: { email: "user@test.com" }');
    err.code = 11000;
    err.keyValue = { email: 'user@test.com' };

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.message, 'Email already exists');
    assert.strictEqual(JSON.stringify(res.body).includes('lms_db.users'), false, 'Database collection name must not leak');
    assert.strictEqual(JSON.stringify(res.body).includes('email_1'), false, 'Database index name must not leak');
  });

  test('5. Mongoose CastError on invalid ObjectId returns 404 "Resource not found"', () => {
    const res = createMockRes();
    const req = createMockReq();
    const err = new Error('Cast to ObjectId failed for value "invalid-hex-id" (type string) at path "_id" for model "Course"');
    err.name = 'CastError';
    err.kind = 'ObjectId';
    err.path = '_id';

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.message, 'Resource not found');
    assert.strictEqual(JSON.stringify(res.body).includes('Cast to ObjectId failed'), false, 'Internal Cast message must not leak');
  });

  test('6. Mongoose ValidationError sanitizes internal path markers', () => {
    const res = createMockRes();
    const req = createMockReq();
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    err.errors = {
      title: { message: 'Path `title` is required.' },
      category: { message: 'Path `category` must be one of allowed values.' },
    };

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.message, 'title is required., category must be one of allowed values.');
    assert.strictEqual(res.body.message.includes('Path `title`'), false, 'Internal Mongoose path formatting should be cleaned');
  });

  test('7. Express Body-Parser SyntaxError returns clean 400 "Invalid JSON payload received"', () => {
    const res = createMockRes();
    const req = createMockReq();
    const err = new SyntaxError('Unexpected token } in JSON at position 42');
    err.status = 400;
    err.body = '{ "bad": }';

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.message, 'Invalid JSON payload received');
    assert.strictEqual(res.body.stack, undefined, 'No stack trace should be returned');
  });

  test('8. Multer upload errors return clean, generic file error messages', () => {
    const res = createMockRes();
    const req = createMockReq();
    const err = new Error('File too large');
    err.name = 'MulterError';
    err.code = 'LIMIT_FILE_SIZE';

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.message, 'Uploaded file exceeds the maximum allowed size');
  });

  test('9. Unhandled 500 exceptions return generic safe message', () => {
    const res = createMockRes();
    const req = createMockReq();
    const err = new Error('Unexpected internal fault in payment gateway module');
    err.statusCode = 500;

    errorHandler(err, req, res, () => {});

    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.body.message, 'An unexpected server error occurred. Please try again later.');
  });

  test('10. Full error details including stack trace are logged to server-side console.error', () => {
    const originalConsoleError = console.error;
    let loggedOutput = '';
    console.error = (...args) => {
      loggedOutput += args.join(' ');
    };

    try {
      const res = createMockRes();
      const req = createMockReq({ method: 'POST', originalUrl: '/api/courses' });
      const err = new Error('Critical unexpected crash');
      err.stack = 'Error: Critical unexpected crash\n    at runProcess (/server/app.js:99:12)';

      errorHandler(err, req, res, () => {});

      // Verify server-side logging captured the details
      assert.ok(loggedOutput.includes('[ERROR]'), 'Must log [ERROR] tag');
      assert.ok(loggedOutput.includes('POST /api/courses'), 'Must log HTTP method and URL');
      assert.ok(loggedOutput.includes('Critical unexpected crash'), 'Must log error message');
      assert.ok(loggedOutput.includes('runProcess'), 'Must log stack trace server-side');
    } finally {
      console.error = originalConsoleError;
    }
  });

  test('11. notFound middleware triggers 404 with standard message', () => {
    const req = createMockReq({ originalUrl: '/api/non-existent-route' });
    const res = createMockRes();
    let passedError = null;

    notFound(req, res, (err) => {
      passedError = err;
    });

    assert.strictEqual(res.statusCode, 404);
    assert.ok(passedError instanceof Error);
    assert.strictEqual(passedError.message, 'Not Found - /api/non-existent-route');
  });
});
