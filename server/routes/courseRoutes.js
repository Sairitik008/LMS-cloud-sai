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
const { validateBody, validateQuery, validateParams } = require('../middleware/validateMiddleware');
const {
  paginationQuerySchema,
  createCourseSchema,
  updateCourseSchema,
  paramIdSchema,
} = require('../validators/schemas');

router
  .route('/')
  .get(validateQuery(paginationQuerySchema), getCourses)
  .post(
    protect,
    admin,
    uploadImage.single('thumbnail'),
    validateBody(createCourseSchema),
    createCourse
  );

router
  .route('/:id')
  .get(validateParams(paramIdSchema), getCourseById)
  .put(
    protect,
    admin,
    validateParams(paramIdSchema),
    uploadImage.single('thumbnail'),
    validateBody(updateCourseSchema),
    updateCourse
  )
  .delete(protect, admin, validateParams(paramIdSchema), deleteCourse);

module.exports = router;
