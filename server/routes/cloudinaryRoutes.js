const express = require('express');
const router = express.Router();
const { getUploadSignature } = require('../controllers/cloudinaryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/signature', protect, admin, getUploadSignature);

module.exports = router;
