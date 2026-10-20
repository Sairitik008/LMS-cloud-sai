const asyncHandler = require('express-async-handler');
const Result = require('../models/Result');
const MockTest = require('../models/MockTest');
const User = require('../models/User');

// @desc    Submit mock test result
// @route   POST /api/results
// @access  Private
const submitResult = asyncHandler(async (req, res) => {
  const { mockTestId, answers, timeTaken } = req.body;

  const test = await MockTest.findById(mockTestId);
  if (!test) {
    res.status(404);
    throw new Error('Mock test not found');
  }

  if (!test.questions || test.questions.length === 0) {
    res.status(400);
    throw new Error('This mock test has no questions');
  }

  const safeAnswers = Array.isArray(answers) ? answers : [];
  let correctAnswers = 0;

  const processedAnswers = safeAnswers.map((ans) => {
    const question = test.questions[ans.questionIndex];
    if (!question) {
      return {
        ...ans,
        isCorrect: false,
      };
    }

    const correctStr = String(question.correctAnswer ?? '').trim().toLowerCase();
    const selectedStr = String(ans.selectedOption ?? '').trim().toLowerCase();

    // Check direct equality
    let isCorrect = (correctStr === selectedStr && correctStr !== '');

    // Check index equality if correctAnswer was stored as an option index
    if (!isCorrect && Array.isArray(question.options)) {
      const optionIndex = question.options.findIndex(
        (opt) => String(opt).trim().toLowerCase() === selectedStr
      );
      if (optionIndex !== -1 && String(optionIndex) === correctStr) {
        isCorrect = true;
      }
    }

    if (isCorrect) correctAnswers++;
    return {
      ...ans,
      isCorrect,
    };
  });

  const totalQuestions = test.questions.length;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const result = new Result({
    student: req.user._id,
    mockTest: mockTestId,
    score,
    totalQuestions,
    correctAnswers,
    timeTaken: Number(timeTaken) || 0,
    answers: processedAnswers,
  });

  const savedResult = await result.save();
  res.status(201).json(savedResult);
});

// @desc    Get logged in user's results
// @route   GET /api/results/me
// @access  Private
const getMyResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ student: req.user._id })
    .populate('mockTest', 'title category')
    .sort({ createdAt: -1 });
  res.json(results);
});

// @desc    Get all results (Admin)
// @route   GET /api/results/admin
// @access  Private/Admin
const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find({})
    .populate('student', 'name email')
    .populate('mockTest', 'title category')
    .sort({ createdAt: -1 });
  res.json(results);
});

// @desc    Get leaderboard
// @route   GET /api/results/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res) => {
  // Aggregate to get top students based on average score
  const leaderboard = await Result.aggregate([
    {
      $group: {
        _id: '$student',
        avgScore: { $avg: '$score' },
        testsTaken: { $sum: 1 },
      },
    },
    { $sort: { avgScore: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'studentInfo',
      },
    },
    { $unwind: '$studentInfo' },
    {
      $project: {
        _id: 1,
        avgScore: { $round: ['$avgScore', 0] },
        testsTaken: 1,
        'studentInfo.name': 1,
        'studentInfo.avatar': 1,
      },
    },
  ]);

  res.json(leaderboard);
});

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
const getResultById = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id)
    .populate('mockTest', 'title category questions')
    .populate('student', 'name email');

  if (!result) {
    res.status(404);
    throw new Error('Result not found');
  }

  // IDOR Protection: Students may only inspect their own test results; Admins may inspect all
  const studentId = result.student?._id ? result.student._id.toString() : result.student?.toString();
  if (req.user && req.user.role !== 'admin' && studentId && studentId !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this test result');
  }

  res.json(result);
});

module.exports = {
  submitResult,
  getMyResults,
  getAllResults,
  getLeaderboard,
  getResultById,
};
