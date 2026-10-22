const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody, validateParams } = require('../middleware/validateMiddleware');
const { createAnnouncementSchema, paramIdSchema } = require('../validators/schemas');

router
  .route('/')
  .get(getAnnouncements)
  .post(protect, admin, validateBody(createAnnouncementSchema), createAnnouncement);

router
  .route('/:id')
  .delete(protect, admin, validateParams(paramIdSchema), deleteAnnouncement);

module.exports = router;
