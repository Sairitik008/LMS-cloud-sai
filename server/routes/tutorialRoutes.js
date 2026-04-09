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

router
  .route('/')
  .get(getTutorials)
  .post(protect, admin, uploadTutorial.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), createTutorial);

router
  .route('/:id')
  .get(getTutorialById)
  .put(protect, admin, uploadTutorial.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), updateTutorial)
  .delete(protect, admin, deleteTutorial);

module.exports = router;
