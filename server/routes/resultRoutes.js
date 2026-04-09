const express = require('express');
const router = express.Router();
const { 
  getLeaderboard, 
  getMyResults, 
  submitResult,
  getResultById
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.route('/leaderboard').get(getLeaderboard);
router.route('/me').get(protect, getMyResults);
router.route('/').post(protect, submitResult);
router.route('/:id').get(protect, getResultById);

module.exports = router;
