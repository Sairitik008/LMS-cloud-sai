const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Tutorial = require('../models/Tutorial');
const Result = require('../models/Result');
const Announcement = require('../models/Announcement');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const [students, courses, tutorials, testResults, announcements] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Course.countDocuments(),
    Tutorial.countDocuments(),
    Result.countDocuments(),
    Announcement.countDocuments(),
  ]);

  res.json({
    students,
    courses,
    tutorials,
    testResults,
    announcements,
  });
});

module.exports = { getAdminStats };
