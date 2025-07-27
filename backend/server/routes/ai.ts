import express from 'express';
import {
  getRecommendations,
  predictProductDemand,
  getMarketInsights,
  getPersonalizedSuggestions
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/predict-demand', predictProductDemand);

// Protected routes
router.post('/recommendations', protect, getRecommendations);
router.get('/market-insights', protect, getMarketInsights);
router.get('/suggestions', protect, getPersonalizedSuggestions);

export default router; 