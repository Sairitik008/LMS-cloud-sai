const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const TEST_MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/lms_test';

const authRoutes = require('../routes/authRoutes');
const courseRoutes = require('../routes/courseRoutes');
const tutorialRoutes = require('../routes/tutorialRoutes');
const materialRoutes = require('../routes/materialRoutes');
const mockTestRoutes = require('../routes/mockTestRoutes');
const announcementRoutes = require('../routes/announcementRoutes');
const resultRoutes = require('../routes/resultRoutes');
const adminRoutes = require('../routes/adminRoutes');
const cloudinaryRoutes = require('../routes/cloudinaryRoutes');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');
const { rejectProhibitedInput, sanitizeNoSql } = require('../middleware/sanitizeMiddleware');
const { backoffTracker } = require('../middleware/rateLimitMiddleware');
const User = require('../models/User');

describe('Strict Input Schema Validation & Rejection Suite', () => {
  let app;
  let server;
  let baseUrl;
  let adminToken;
  let studentToken;
  let ipCounter = 10;

  beforeEach(() => {
    backoffTracker.reset();
  });

  const request = async (path, options = {}) => {
    const url = `${baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Forwarded-For': `10.10.10.${++ipCounter}`,
      ...options.headers,
    };
    const body =
      typeof options.body === 'string'
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined;

    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body,
    });
    const status = res.status;
    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    return { status, data, headers: res.headers };
  };

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    }

    app = express();
    app.set('trust proxy', 1);
    app.use(
      express.json({
        verify: (req, res, buf) => {
          if (buf && buf.length) {
            const str = buf.toString();
            if (
              str.includes('"__proto__"') ||
              str.includes('"constructor"') ||
              str.includes('"prototype"')
            ) {
              const err = new Error('Prohibited prototype pollution key detected');
              err.statusCode = 400;
              throw err;
            }
          }
        },
      })
    );
    app.use(rejectProhibitedInput);
    app.use(sanitizeNoSql);
    app.use(cors());
    app.use(helmet());

    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/tutorials', tutorialRoutes);
    app.use('/api/materials', materialRoutes);
    app.use('/api/mocktests', mockTestRoutes);
    app.use('/api/announcements', announcementRoutes);
    app.use('/api/results', resultRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/cloudinary', cloudinaryRoutes);

    app.use(notFound);
    app.use(errorHandler);

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });

    // Ensure test admin exists and get token
    await User.deleteMany({ email: { $in: ['schema_admin@example.com', 'schema_student@example.com'] } });
    const adminUser = await User.create({
      name: 'Schema Admin',
      email: 'schema_admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const studentUser = await User.create({
      name: 'Schema Student',
      email: 'schema_student@example.com',
      password: 'password123',
      role: 'student',
    });

    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'schema_admin@example.com', password: 'password123' },
    });
    adminToken = adminLogin.data.token;

    const studentLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'schema_student@example.com', password: 'password123' },
    });
    studentToken = studentLogin.data.token;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.connection.close();
  });

  // --- TYPE VALIDATION TESTS ---
  describe('1. Data Type Validation', () => {
    test('Rejects non-string email with HTTP 400', async () => {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: { email: 12345, password: 'password123' },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.message.includes('Validation failed'));
      assert.ok(res.data.errors.some((e) => e.field === 'email'));
    });

    test('Rejects object passed in password field (NoSQL operator bypass attempt) with HTTP 400', async () => {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: { email: 'schema_admin@example.com', password: { $ne: '' } },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.message.includes('rejected') || res.data.message.includes('Validation failed'));
    });

    test('Rejects non-array for answers in result submission with HTTP 400', async () => {
      const res = await request('/api/results', {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: {
          mockTestId: '507f1f77bcf86cd799439011',
          answers: 'not-an-array',
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.message.includes('Validation failed'));
      assert.ok(res.data.errors.some((e) => e.field === 'answers'));
    });

    test('Rejects non-numeric duration in mock test creation with HTTP 400', async () => {
      const res = await request('/api/mocktests', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'Type Check Quiz',
          description: 'Testing numerical types',
          category: 'QA',
          duration: 'abc',
          questions: [
            {
              questionText: 'Is this valid?',
              options: ['Yes', 'No'],
              correctAnswer: 'Yes',
            },
          ],
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'duration'));
    });
  });

  // --- LENGTH VALIDATION TESTS ---
  describe('2. Length Validation (Min/Max Constraints)', () => {
    test('Rejects password shorter than 6 characters with HTTP 400', async () => {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Short Password User',
          email: 'shortpass@example.com',
          password: '123',
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.message.includes('at least 6 characters'));
      assert.ok(res.data.errors.some((e) => e.field === 'password'));
    });

    test('Rejects name shorter than 2 characters with HTTP 400', async () => {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'A',
          email: 'shortname@example.com',
          password: 'validpassword123',
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'name'));
    });

    test('Rejects course description shorter than 5 characters with HTTP 400', async () => {
      const res = await request('/api/courses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'Valid Course Title',
          description: 'tiny',
          category: 'Engineering',
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'description'));
    });

    test('Rejects mock test questions with fewer than 2 options with HTTP 400', async () => {
      const res = await request('/api/mocktests', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'Options Check Quiz',
          description: 'Valid description test',
          category: 'QA',
          duration: 30,
          questions: [
            {
              questionText: 'Single option question?',
              options: ['Only One'],
              correctAnswer: 'Only One',
            },
          ],
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field.includes('options')));
    });

    test('Rejects empty answers array on result submission with HTTP 400', async () => {
      const res = await request('/api/results', {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: {
          mockTestId: '507f1f77bcf86cd799439011',
          answers: [],
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'answers'));
    });
  });

  // --- FORMAT VALIDATION TESTS ---
  describe('3. Format Validation (Patterns, Enums & IDs)', () => {
    test('Rejects malformed email format with HTTP 400', async () => {
      const malformedEmails = ['invalid-email', 'missing@domain', '@no-local.com', 'spaces in@email.com'];
      for (const email of malformedEmails) {
        const res = await request('/api/auth/login', {
          method: 'POST',
          body: { email, password: 'password123' },
        });
        assert.strictEqual(res.status, 400, `Should reject malformed email: ${email}`);
        assert.ok(res.data.errors.some((e) => e.field === 'email'));
      }
    });

    test('Rejects invalid study material type enum with HTTP 400', async () => {
      const res = await request('/api/materials', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'Invalid Type Doc',
          description: 'Valid description goes here',
          category: 'Notes',
          fileUrl: 'https://example.com/file.exe',
          type: 'executable', // Only 'pdf', 'link', 'notes' allowed
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'type'));
    });

    test('Rejects invalid non-hex ObjectId in result submission mockTestId with HTTP 400', async () => {
      const res = await request('/api/results', {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: {
          mockTestId: 'invalid-non-hex-id-12345',
          answers: [{ questionIndex: 0, selectedOption: 'Option A' }],
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'mockTestId'));
    });

    test('Rejects negative or invalid pageNumber in query string with HTTP 400', async () => {
      const res = await request('/api/courses?pageNumber=-5');
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'pageNumber'));
    });

    test('Rejects alphabetic pageNumber in query string with HTTP 400', async () => {
      const res = await request('/api/courses?pageNumber=firstPage');
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'pageNumber'));
    });

    test('Rejects invalid folder path in Cloudinary signature with HTTP 400', async () => {
      const res = await request('/api/cloudinary/signature', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { folder: '../../etc/passwd' },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.errors.some((e) => e.field === 'folder'));
    });
  });

  // --- STRICT SCHEMA: REJECTION OF UNEXPECTED / FORBIDDEN FIELDS ---
  describe('4. Strict Schema Enforcement (Rejecting Unknown Fields & Mass Assignment)', () => {
    test('Rejects unknown extra fields on login with HTTP 400', async () => {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'schema_admin@example.com',
          password: 'password123',
          isAdmin: true, // Unknown / unallowed field
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.message.includes('Unrecognized key'));
    });

    test('Rejects unknown extra fields on announcement creation with HTTP 400', async () => {
      const res = await request('/api/announcements', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'Strict Announcement',
          message: 'Valid message body text',
          unauthorizedField: 'injectedValue',
        },
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.message.includes('Unrecognized key'));
    });

    test('Rejects prohibited MongoDB query operators in query params ($where) with HTTP 400', async () => {
      const res = await request('/api/courses?keyword[$where]=sleep(1000)');
      assert.strictEqual(res.status, 400);
    });

    test('Rejects prototype pollution keys (__proto__) with HTTP 400', async () => {
      const rawPayload = JSON.stringify({
        name: 'Hacker Name',
        email: 'hacker@example.com',
        password: 'password123',
      }).replace('}', ',"__proto__":{"admin":true}}');

      const res = await request('/api/auth/register', {
        method: 'POST',
        body: rawPayload,
      });
      assert.strictEqual(res.status, 400);
    });
  });

  // --- VALID PAYLOADS ADMISSION ---
  describe('5. Valid Payloads Pass Seamlessly', () => {
    test('Accepts compliant student registration payload with HTTP 201', async () => {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Perfect Student',
          email: `perfect_${Date.now()}@example.com`,
          password: 'strongPassword123',
          bio: 'Clean compliant input',
          educationalBackground: 'Indian Institute of Technology',
          skills: ['Node.js', 'Express', 'Zod'],
          hobbies: ['Chess', 'Coding'],
          socialLinks: {
            github: 'https://github.com/perfect',
            linkedin: 'https://linkedin.com/in/perfect',
          },
        },
      });
      assert.strictEqual(res.status, 201);
      assert.ok(res.data.token);
      assert.strictEqual(res.data.role, 'student');
    });

    test('Accepts compliant announcement payload with HTTP 201', async () => {
      const res = await request('/api/announcements', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'Schema Validation Complete',
          message: 'All inputs verified against strict type, length, and format constraints.',
        },
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.title, 'Schema Validation Complete');
    });

    test('Accepts compliant paginated courses query with HTTP 200', async () => {
      const res = await request('/api/courses?pageNumber=1&keyword=Integration');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data.courses));
    });
  });
});
