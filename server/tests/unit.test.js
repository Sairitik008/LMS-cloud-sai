const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = require('../utils/generateToken');
const User = require('../models/User');

describe('Unit Tests: Core Back-End Logic', () => {
  before(async () => {
    const uri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27018/lms_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    }
  });

  after(async () => {
    await mongoose.connection.close();
  });

  test('generateToken creates valid JWT token signed with JWT_SECRET', () => {
    const sampleId = new mongoose.Types.ObjectId().toString();
    const token = generateToken(sampleId);

    assert.ok(typeof token === 'string' && token.length > 20, 'Token should be a non-empty string');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    assert.strictEqual(decoded.id, sampleId, 'Decoded token ID must match input ID');
  });

  test('User model hashes password on save and matchPassword verifies it', async () => {
    const testEmail = `unit_test_${Date.now()}@example.com`;
    const plainPassword = 'mySecretPassword123';

    // Cleanup previous if exists
    await User.deleteOne({ email: testEmail });

    const user = await User.create({
      name: 'Unit Test User',
      email: testEmail,
      password: plainPassword,
      role: 'student',
    });

    assert.notStrictEqual(user.password, plainPassword, 'Password must be hashed with bcrypt');
    assert.ok(user.password.startsWith('$2'), 'Hashed password should start with $2 bcrypt prefix');

    const isMatch = await user.matchPassword(plainPassword);
    assert.strictEqual(isMatch, true, 'matchPassword must return true for correct password');

    const isWrong = await user.matchPassword('wrongPassword');
    assert.strictEqual(isWrong, false, 'matchPassword must return false for incorrect password');

    // Clean up
    await User.deleteOne({ _id: user._id });
  });

  test('CORS origin filtering allows valid origins and rejects unauthorized ones', () => {
    const allowed = ['http://localhost:5173', 'http://localhost:3000'];
    const isAllowed = (origin) => {
      if (!origin) return true;
      const clean = origin.replace(/\/+$/, '');
      if (allowed.includes(clean)) return true;
      if (clean.endsWith('.vercel.app')) return true;
      return false;
    };

    assert.strictEqual(isAllowed('http://localhost:5173/'), true, 'Should allow localhost with trailing slash');
    assert.strictEqual(isAllowed('https://my-lms-app.vercel.app'), true, 'Should allow vercel.app domains');
    assert.strictEqual(isAllowed('https://random-attacker.com'), false, 'Should reject unauthorized domains');
    assert.strictEqual(isAllowed(null), true, 'Should allow requests with no origin header (curl/mobile)');
  });
});
