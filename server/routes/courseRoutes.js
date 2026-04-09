const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getCourses)
  .post(protect, admin, uploadImage.single('thumbnail'), createCourse);

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, admin, uploadImage.single('thumbnail'), updateCourse)
  .delete(protect, admin, deleteCourse);

module.exports = router;
