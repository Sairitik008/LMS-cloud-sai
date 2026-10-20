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

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getUserProfile);
router.put('/me', protect, uploadImage.single('avatar'), updateUserProfile);

// Admin Student Management
router.get('/students', protect, admin, getStudents);
router.delete('/students/:id', protect, admin, deleteStudent);

module.exports = router;
