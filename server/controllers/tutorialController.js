const asyncHandler = require('express-async-handler');
const Tutorial = require('../models/Tutorial');

// @desc    Get all tutorials
// @route   GET /api/tutorials
// @access  Public
const getTutorials = asyncHandler(async (req, res) => {
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

  const category = req.query.category ? { category: req.query.category } : {};

  const count = await Tutorial.countDocuments({ ...keyword, ...category });
  const tutorials = await Tutorial.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ tutorials, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get tutorial by ID
// @route   GET /api/tutorials/:id
// @access  Public
const getTutorialById = asyncHandler(async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);

  if (tutorial) {
    res.json(tutorial);
  } else {
    res.status(404);
    throw new Error('Tutorial not found');
  }
});

// @desc    Create tutorial
// @route   POST /api/tutorials
// @access  Private/Admin
const createTutorial = asyncHandler(async (req, res) => {
  const { title, description, category, content, tags } = req.body;

  // Handle Cloudinary Uploads (from Multer fields)
  let thumbnail = req.body.thumbnail;
  let videoUrl = req.body.videoUrl;

  if (req.files) {
    if (req.files.thumbnail) thumbnail = req.files.thumbnail[0].path;
    if (req.files.video) videoUrl = req.files.video[0].path;
  }

  const tutorial = new Tutorial({
    title,
    description,
    category,
    content,
    tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
    thumbnail,
    videoUrl,
    createdBy: req.user._id,
  });

  const createdTutorial = await tutorial.save();
  res.status(201).json(createdTutorial);
});

// @desc    Update tutorial
// @route   PUT /api/tutorials/:id
// @access  Private/Admin
const updateTutorial = asyncHandler(async (req, res) => {
  const { title, description, category, content, tags } = req.body;

  const tutorial = await Tutorial.findById(req.params.id);

  if (tutorial) {
    tutorial.title = title || tutorial.title;
    tutorial.description = description || tutorial.description;
    tutorial.category = category || tutorial.category;
    tutorial.content = content || tutorial.content;
    
    if (tags) {
      tutorial.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    // Handle Cloudinary Uploads
    if (req.files) {
      if (req.files.thumbnail) tutorial.thumbnail = req.files.thumbnail[0].path;
      if (req.files.video) tutorial.videoUrl = req.files.video[0].path;
    }

    // Manual URL updates
    if (req.body.thumbnail) tutorial.thumbnail = req.body.thumbnail;
    if (req.body.videoUrl) tutorial.videoUrl = req.body.videoUrl;

    const updatedTutorial = await tutorial.save();
    res.json(updatedTutorial);
  } else {
    res.status(404);
    throw new Error('Tutorial not found');
  }
});

// @desc    Delete tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private/Admin
const deleteTutorial = asyncHandler(async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);

  if (tutorial) {
    await tutorial.deleteOne();
    res.json({ message: 'Tutorial removed' });
  } else {
    res.status(404);
    throw new Error('Tutorial not found');
  }
});

module.exports = {
  getTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
};
