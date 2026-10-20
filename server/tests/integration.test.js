const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Ensure test database URI is used
const TEST_MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/lms_test';

const User = require('../models/User');
const Course = require('../models/Course');
const MockTest = require('../models/MockTest');
const Result = require('../models/Result');
const Announcement = require('../models/Announcement');

const authRoutes = require('../routes/authRoutes');
const courseRoutes = require('../routes/courseRoutes');
const tutorialRoutes = require('../routes/tutorialRoutes');
const materialRoutes = require('../routes/materialRoutes');
const mockTestRoutes = require('../routes/mockTestRoutes');
const announcementRoutes = require('../routes/announcementRoutes');
const resultRoutes = require('../routes/resultRoutes');
const adminRoutes = require('../routes/adminRoutes');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

describe('Integration Tests: LMS End-to-End API Pipeline', () => {
  let app;
  let server;
  let baseUrl;
  let adminToken;
  let studentToken;
  let studentId;
  let createdCourseId;
  let createdTestId;
  let createdAnnouncementId;

  // Helper function for making HTTP requests
  const request = async (path, options = {}) => {
    const url = `${baseUrl}${path}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
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
    // 1. Connect Mongoose to local test DB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    }

    // 2. Setup Express test app instance
    app = express();
    app.use(express.json());
    app.use(cors());
    app.use(helmet());

    app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/tutorials', tutorialRoutes);
    app.use('/api/materials', materialRoutes);
    app.use('/api/mocktests', mockTestRoutes);
    app.use('/api/announcements', announcementRoutes);
    app.use('/api/results', resultRoutes);
    app.use('/api/admin', adminRoutes);

    app.use(notFound);
    app.use(errorHandler);

    // 3. Start test HTTP server on ephemeral port
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });

    // 4. Seed clean Admin user for tests
    await User.deleteMany({ email: { $in: ['admin_it@example.com', 'student_it@example.com'] } });
    await User.create({
      name: 'Integration Admin',
      email: 'admin_it@example.com',
      password: 'password123',
      role: 'admin',
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.connection.close();
  });

  test('1. GET /api/health verifies system and database connectivity', async () => {
    const res = await request('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ok');
    assert.strictEqual(res.data.database, 'connected');
  });

  test('2. POST /api/auth/login logs in admin and yields JWT', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin_it@example.com', password: 'password123' },
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.data.token, 'Token should be returned');
    assert.strictEqual(res.data.role, 'admin');
    adminToken = res.data.token;
  });

  test('3. POST /api/auth/register creates new student account', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Integration Student',
        email: 'student_it@example.com',
        password: 'password123',
        bio: 'Automated test account',
        educationalBackground: 'NIT Tech',
        skills: ['JavaScript', 'React'],
      },
    });

    assert.strictEqual(res.status, 201);
    assert.ok(res.data.token);
    assert.strictEqual(res.data.role, 'student');
    studentToken = res.data.token;
    studentId = res.data._id;
  });

  test('4. GET /api/auth/me returns authenticated student profile', async () => {
    const res = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.email, 'student_it@example.com');
    assert.strictEqual(res.data.bio, 'Automated test account');
  });

  test('5. Admin student management: GET /api/auth/students returns registered students', async () => {
    const res = await request('/api/auth/students', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.students));
    const found = res.data.students.find((s) => s.email === 'student_it@example.com');
    assert.ok(found, 'Created student must be present in students list');
  });

  test('6. Non-admin access to /api/auth/students is blocked with 401', async () => {
    const res = await request('/api/auth/students', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    assert.strictEqual(res.status, 401, 'Student should be rejected with 401 Unauthorized');
  });

  test('7. POST /api/courses creates course with modules', async () => {
    const res = await request('/api/courses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Full Stack Integration Course',
        description: 'Complete hands-on curriculum',
        category: 'Software Engineering',
        modules: [
          { title: 'Module 1: Architecture', content: 'Design patterns and clean code', order: 1 },
          { title: 'Module 2: Cloud Deployments', content: 'Render, Vercel, and Atlas', order: 2 },
        ],
      },
    });

    assert.strictEqual(res.status, 201);
    assert.ok(res.data._id);
    assert.strictEqual(res.data.modules.length, 2);
    createdCourseId = res.data._id;
  });

  test('8. GET /api/courses returns paginated courses and total count', async () => {
    const res = await request('/api/courses');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.courses));
    assert.ok(res.data.total >= 1, 'Total count should be provided in response');
  });

  test('9. POST /api/mocktests creates assessment with question bank', async () => {
    const res = await request('/api/mocktests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Production Readiness Quiz',
        description: 'Verifies cloud architectures and resilience',
        category: 'Cloud Engineering',
        duration: 15,
        questions: [
          {
            questionText: 'What protocol does MongoDB Atlas use for SRV records?',
            options: ['DNS SRV', 'FTP', 'SMTP', 'SSH'],
            correctAnswer: 'DNS SRV',
            explanation: 'Atlas uses DNS SRV records for dynamic cluster seeds.',
          },
          {
            questionText: 'Which HTTP method is idempotent?',
            options: ['POST', 'PUT', 'CONNECT', 'PATCH'],
            correctAnswer: 'PUT',
            explanation: 'PUT replaces resource state and is idempotent.',
          },
        ],
      },
    });

    assert.strictEqual(res.status, 201);
    assert.ok(res.data._id);
    createdTestId = res.data._id;
  });

  test('10. GET /api/mocktests omits correctAnswer from question list for students', async () => {
    const res = await request('/api/mocktests');
    assert.strictEqual(res.status, 200);
    const testItem = res.data.tests.find((t) => t._id === createdTestId);
    assert.ok(testItem, 'Created test must be in mock tests list');
    assert.strictEqual(
      testItem.questions[0].correctAnswer,
      undefined,
      'correctAnswer must be hidden in public test listing'
    );
  });

  test('11. GET /api/mocktests/:id returns complete test details for test taking & editing', async () => {
    const res = await request(`/api/mocktests/${createdTestId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.questions[0].correctAnswer, 'DNS SRV');
  });

  test('12. POST /api/results evaluates student answers server-side with 100% score', async () => {
    const res = await request('/api/results', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        mockTestId: createdTestId,
        answers: [
          { questionIndex: 0, selectedOption: 'DNS SRV' },
          { questionIndex: 1, selectedOption: 'PUT' },
        ],
        timeTaken: 45,
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.score, 100, 'Score must be 100% when all answers match');
    assert.strictEqual(res.data.correctAnswers, 2);
    assert.strictEqual(res.data.totalQuestions, 2);
  });

  test('13. POST /api/results handles partial scores accurately (50%)', async () => {
    const res = await request('/api/results', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        mockTestId: createdTestId,
        answers: [
          { questionIndex: 0, selectedOption: 'DNS SRV' }, // Correct
          { questionIndex: 1, selectedOption: 'POST' },    // Incorrect
        ],
        timeTaken: 60,
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.score, 50, 'Score must be 50% when 1 of 2 questions is correct');
    assert.strictEqual(res.data.correctAnswers, 1);
  });

  test('14. GET /api/results/leaderboard calculates average score and joins student details', async () => {
    const res = await request('/api/results/leaderboard');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.data.length >= 1, 'Leaderboard must contain at least 1 record');
    const studentEntry = res.data.find((item) => String(item._id) === String(studentId));
    assert.ok(studentEntry, 'Student entry must be present in leaderboard');
    assert.ok(studentEntry.studentInfo, 'studentInfo must be joined');
    assert.strictEqual(studentEntry.studentInfo.name, 'Integration Student');
    assert.strictEqual(studentEntry.avgScore, 75, 'Average of 100% and 50% should be 75%');
  });

  test('15. POST /api/announcements creates platform announcement & GET retrieves it', async () => {
    const postRes = await request('/api/announcements', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'System Audit Completed',
        message: 'All unit, integration, and cloud deployment tests passed successfully.',
      },
    });

    assert.strictEqual(postRes.status, 201);
    createdAnnouncementId = postRes.data._id;

    const getRes = await request('/api/announcements');
    assert.strictEqual(getRes.status, 200);
    const found = getRes.data.find((a) => a._id === createdAnnouncementId);
    assert.ok(found, 'Created announcement must be retrieved');
  });

  test('16. Admin student deletion: DELETE /api/auth/students/:id removes student account', async () => {
    const delRes = await request(`/api/auth/students/${studentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.data.message, 'Student removed');

    // Confirm deletion
    const getRes = await request('/api/auth/students', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const exists = getRes.data.students.some((s) => s._id === studentId);
    assert.strictEqual(exists, false, 'Deleted student must not appear in students list');
  });

  test('17. CastError handling: Invalid MongoDB ObjectId in GET /api/courses/invalid-id yields 404', async () => {
    const res = await request('/api/courses/not-a-valid-object-id');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.message, 'Resource not found');
  });
});
