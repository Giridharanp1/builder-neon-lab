import express from 'express';
import {
  comparePrices,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getProductStats
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/compare', comparePrices);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/categories/list', getProductCategories);

// Protected routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/stats/overview', protect, getProductStats);

export default router; 