const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getMyResults,
  submitResult,
  getResultById,
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody, validateParams } = require('../middleware/validateMiddleware');
const { submitResultSchema, paramIdSchema } = require('../validators/schemas');

router.route('/leaderboard').get(getLeaderboard);
router.route('/me').get(protect, getMyResults);
router.route('/').post(protect, validateBody(submitResultSchema), submitResult);
router.route('/:id').get(protect, validateParams(paramIdSchema), getResultById);

module.exports = router;
