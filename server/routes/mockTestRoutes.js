const express = require('express');
const router = express.Router();
const {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
} = require('../controllers/mockTestController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody, validateQuery, validateParams } = require('../middleware/validateMiddleware');
const {
  paginationQuerySchema,
  createMockTestSchema,
  updateMockTestSchema,
  paramIdSchema,
} = require('../validators/schemas');

router
  .route('/')
  .get(validateQuery(paginationQuerySchema), getTests)
  .post(protect, admin, validateBody(createMockTestSchema), createTest);

router
  .route('/:id')
  .get(validateParams(paramIdSchema), getTestById)
  .put(
    protect,
    admin,
    validateParams(paramIdSchema),
    validateBody(updateMockTestSchema),
    updateTest
  )
  .delete(protect, admin, validateParams(paramIdSchema), deleteTest);

module.exports = router;
