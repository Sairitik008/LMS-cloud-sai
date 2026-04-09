const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Course.countDocuments({ ...keyword });
  const courses = await Course.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ courses, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, modules } = req.body;

  // Handle Cloudinary Upload
  const thumbnail = req.file ? req.file.path : req.body.thumbnail;

  // Parse modules if they come as a JSON string (typical for FormData)
  let parsedModules = modules;
  if (typeof modules === 'string') {
    try {
      parsedModules = JSON.parse(modules);
    } catch (e) {
      parsedModules = [];
    }
  }

  const course = new Course({
    title,
    description,
    category,
    thumbnail,
    modules: parsedModules,
    createdBy: req.user._id,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, category, modules } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    
    // Update thumbnail if new file provided
    if (req.file) {
      course.thumbnail = req.file.path;
    } else if (req.body.thumbnail) {
      course.thumbnail = req.body.thumbnail;
    }

    if (modules) {
      try {
        course.modules = typeof modules === 'string' ? JSON.parse(modules) : modules;
      } catch (e) {
        // Keep existing if parse fails
      }
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
