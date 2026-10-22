const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getStudents,
  deleteStudent,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');
const { validateBody, validateParams } = require('../middleware/validateMiddleware');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  paramIdSchema,
} = require('../validators/schemas');

router.post('/register', authLimiter, validateBody(registerSchema), registerUser);
router.post('/login', authLimiter, validateBody(loginSchema), loginUser);
router.get('/me', protect, getUserProfile);
router.put(
  '/me',
  protect,
  uploadImage.single('avatar'),
  validateBody(updateProfileSchema),
  updateUserProfile
);

// Admin Student Management
router.get('/students', protect, admin, getStudents);
router.delete('/students/:id', protect, admin, validateParams(paramIdSchema), deleteStudent);

module.exports = router;
