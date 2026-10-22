const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const MockTest = require('../models/MockTest');
const User = require('../models/User');
const escapeRegex = require('../utils/escapeRegex');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Public
const getTests = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category ? { category: req.query.category } : {};
  
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: escapeRegex(req.query.keyword),
          $options: 'i',
        },
      }
    : {};

  const count = await MockTest.countDocuments({ ...keyword, ...category });
  const tests = await MockTest.find({ ...keyword, ...category })
    .select('-questions.correctAnswer') // Hide correct answers for list
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ tests, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get test by ID
// @route   GET /api/tests/:id
// @access  Public (Masks correctAnswer unless authenticated as admin)
const getTestById = asyncHandler(async (req, res) => {
  let isAdmin = false;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('role');
      if (user && user.role === 'admin') {
        isAdmin = true;
      }
    } catch (e) {
      // Ignore token failure, treat as student/public visitor
    }
  }

  const query = MockTest.findById(req.params.id);
  if (!isAdmin) {
    query.select('-questions.correctAnswer');
  }

  const test = await query;

  if (test) {
    res.json(test);
  } else {
    res.status(404);
    throw new Error('Mock test not found');
  }
});

// @desc    Create mock test
// @route   POST /api/tests
// @access  Private/Admin
const createTest = asyncHandler(async (req, res) => {
  const { title, description, category, duration, questions } = req.body;

  const test = new MockTest({
    title,
    description,
    category,
    duration,
    questions,
    createdBy: req.user._id,
  });

  const createdTest = await test.save();
  res.status(201).json(createdTest);
});

// @desc    Update mock test
// @route   PUT /api/tests/:id
// @access  Private/Admin
const updateTest = asyncHandler(async (req, res) => {
  const { title, description, category, duration, questions } = req.body;

  const test = await MockTest.findById(req.params.id);

  if (test) {
    test.title = title || test.title;
    test.description = description || test.description;
    test.category = category || test.category;
    test.duration = duration || test.duration;
    test.questions = questions || test.questions;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } else {
    res.status(404);
    throw new Error('Mock test not found');
  }
});

// @desc    Delete mock test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
const deleteTest = asyncHandler(async (req, res) => {
  const test = await MockTest.findById(req.params.id);

  if (test) {
    await test.deleteOne();
    res.json({ message: 'Mock test removed' });
  } else {
    res.status(404);
    throw new Error('Mock test not found');
  }
});

module.exports = {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
};
