const express = require('express');
const router = express.Router();
const { getUploadSignature } = require('../controllers/cloudinaryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateMiddleware');
const { cloudinarySignatureSchema } = require('../validators/schemas');

router.post(
  '/signature',
  protect,
  admin,
  validateBody(cloudinarySignatureSchema),
  getUploadSignature
);

module.exports = router;
