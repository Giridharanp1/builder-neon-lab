import express from 'express';
import {
  getNearbySuppliers,
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
} from '../controllers/supplierController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/nearby', getNearbySuppliers);
router.get('/', getSuppliers);
router.get('/:id', getSupplier);

// Protected routes
router.post('/', protect, createSupplier);
router.put('/:id', protect, updateSupplier);
router.delete('/:id', protect, deleteSupplier);
router.get('/stats/overview', protect, getSupplierStats);

export default router; 