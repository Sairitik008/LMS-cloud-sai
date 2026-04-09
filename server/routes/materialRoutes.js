const express = require('express');
const router = express.Router();
const {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getMaterials).post(protect, admin, createMaterial);
router
  .route('/:id')
  .get(getMaterialById)
  .put(protect, admin, updateMaterial)
  .delete(protect, admin, deleteMaterial);

module.exports = router;
