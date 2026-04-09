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

router.route('/').get(getTests).post(protect, admin, createTest);
router
  .route('/:id')
  .get(getTestById)
  .put(protect, admin, updateTest)
  .delete(protect, admin, deleteTest);

module.exports = router;
