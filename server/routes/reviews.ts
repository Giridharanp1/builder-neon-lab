import express from 'express';
import {
  getSupplierReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  markReviewHelpful
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:supplierId', getSupplierReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/user/me', protect, getUserReviews);
router.put('/:id/helpful', protect, markReviewHelpful);

export default router; 