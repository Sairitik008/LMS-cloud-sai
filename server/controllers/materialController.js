const asyncHandler = require('express-async-handler');
const StudyMaterial = require('../models/StudyMaterial');

// @desc    Get all study materials
// @route   GET /api/materials
// @access  Public
const getMaterials = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const type = req.query.type ? { type: req.query.type } : {};
  
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await StudyMaterial.countDocuments({ ...keyword, ...type });
  const materials = await StudyMaterial.find({ ...keyword, ...type })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ materials, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get material by ID
// @route   GET /api/materials/:id
// @access  Public
const getMaterialById = asyncHandler(async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id);

  if (material) {
    res.json(material);
  } else {
    res.status(404);
    throw new Error('Study material not found');
  }
});

// @desc    Create study material
// @route   POST /api/materials
// @access  Private/Admin
const createMaterial = asyncHandler(async (req, res) => {
  const { title, description, category, fileUrl, type } = req.body;

  const material = new StudyMaterial({
    title,
    description,
    category,
    fileUrl,
    type,
    createdBy: req.user._id,
  });

  const createdMaterial = await material.save();
  res.status(201).json(createdMaterial);
});

// @desc    Update study material
// @route   PUT /api/materials/:id
// @access  Private/Admin
const updateMaterial = asyncHandler(async (req, res) => {
  const { title, description, category, fileUrl, type } = req.body;

  const material = await StudyMaterial.findById(req.params.id);

  if (material) {
    material.title = title || material.title;
    material.description = description || material.description;
    material.category = category || material.category;
    material.fileUrl = fileUrl || material.fileUrl;
    material.type = type || material.type;

    const updatedMaterial = await material.save();
    res.json(updatedMaterial);
  } else {
    res.status(404);
    throw new Error('Study material not found');
  }
});

// @desc    Delete study material
// @route   DELETE /api/materials/:id
// @access  Private/Admin
const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id);

  if (material) {
    await material.deleteOne();
    res.json({ message: 'Study material removed' });
  } else {
    res.status(404);
    throw new Error('Study material not found');
  }
});

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
