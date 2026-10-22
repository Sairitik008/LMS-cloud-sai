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
const { validateBody, validateQuery, validateParams } = require('../middleware/validateMiddleware');
const {
  materialQuerySchema,
  createMaterialSchema,
  updateMaterialSchema,
  paramIdSchema,
} = require('../validators/schemas');

router
  .route('/')
  .get(validateQuery(materialQuerySchema), getMaterials)
  .post(protect, admin, validateBody(createMaterialSchema), createMaterial);

router
  .route('/:id')
  .get(validateParams(paramIdSchema), getMaterialById)
  .put(
    protect,
    admin,
    validateParams(paramIdSchema),
    validateBody(updateMaterialSchema),
    updateMaterial
  )
  .delete(protect, admin, validateParams(paramIdSchema), deleteMaterial);

module.exports = router;
