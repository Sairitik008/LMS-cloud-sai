const express = require('express');
const router = express.Router();
const {
  getTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} = require('../controllers/tutorialController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadTutorial } = require('../middleware/uploadMiddleware');
const { validateBody, validateQuery, validateParams } = require('../middleware/validateMiddleware');
const {
  paginationQuerySchema,
  createTutorialSchema,
  updateTutorialSchema,
  paramIdSchema,
} = require('../validators/schemas');

router
  .route('/')
  .get(validateQuery(paginationQuerySchema), getTutorials)
  .post(
    protect,
    admin,
    uploadTutorial.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
    validateBody(createTutorialSchema),
    createTutorial
  );

router
  .route('/:id')
  .get(validateParams(paramIdSchema), getTutorialById)
  .put(
    protect,
    admin,
    validateParams(paramIdSchema),
    uploadTutorial.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
    validateBody(updateTutorialSchema),
    updateTutorial
  )
  .delete(protect, admin, validateParams(paramIdSchema), deleteTutorial);

module.exports = router;
