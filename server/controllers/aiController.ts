import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getSupplierRecommendations, predictDemand } from '../utils/aiUtils.js';
import Order from '../models/Order.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get AI recommendations
// @route   POST /api/ai/recommendations
// @access  Private
export const getRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { location, requirements, budget, pastOrders } = req.body;

  if (!location || !requirements) {
    res.status(400);
    throw new Error('Location and requirements are required');
  }

  // Get user's past orders if not provided
  let userPastOrders = pastOrders;
  if (!userPastOrders) {
    const orders = await Order.find({ user: req.user.id })
      .populate('supplier', 'name category')
      .populate('items.product', 'name category')
      .limit(10)
      .sort({ createdAt: -1 })
      .lean();

    userPastOrders = orders.map(order => ({
      supplier: order.supplier,
      products: order.items.map((item: any) => item.product),
      totalAmount: order.totalAmount,
      date: order.createdAt
    }));
  }

  const userPreferences = {
    userId: req.user.id,
    location,
    requirements,
    budget,
    pastOrders: userPastOrders
  };

  try {
    const recommendations = await getSupplierRecommendations(userPreferences);
    
    // Try to parse JSON response
    let parsedRecommendations;
    try {
      parsedRecommendations = JSON.parse(recommendations);
    } catch (parseError) {
      // If parsing fails, return the raw response
      parsedRecommendations = {
        suppliers: [
          {
            name: "AI Recommendation",
            category: "General",
            reasoning: recommendations,
            estimatedDistance: "N/A",
            priceRange: "N/A"
          }
        ]
      };
    }

    res.json({
      success: true,
      data: {
        userPreferences,
        recommendations: parsedRecommendations,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500);
    throw new Error('Failed to generate recommendations');
  }
});

// @desc    Predict demand
// @route   POST /api/ai/predict-demand
// @access  Public
export const predictProductDemand = asyncHandler(async (req: Request, res: Response) => {
  const { product, location, month, season } = req.body;

  if (!product || !location) {
    res.status(400);
    throw new Error('Product name and location are required');
  }

  // Use provided month or season
  const timePeriod = month || season || 'General';

  try {
    const prediction = await predictDemand(product, location, timePeriod);

    res.json({
      success: true,
      data: {
        prediction,
        timestamp: new Date().toISOString(),
        confidence: prediction.confidence || 'Medium'
      }
    });
  } catch (error) {
    console.error('Demand prediction error:', error);
    res.status(500);
    throw new Error('Failed to predict demand');
  }
});

// @desc    Get market insights
// @route   GET /api/ai/market-insights
// @access  Private
export const getMarketInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { location, category } = req.query;

  if (!location) {
    res.status(400);
    throw new Error('Location is required');
  }

  try {
    // Get recent orders in the area
    const recentOrders = await Order.aggregate([
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      {
        $unwind: '$supplier'
      },
      {
        $match: {
          'supplier.city': { $regex: location, $options: 'i' },
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$supplier.category',
          orderCount: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { orderCount: -1 } }
    ]);

    // Generate insights based on data
    const insights = {
      topCategories: recentOrders.slice(0, 5),
      marketTrends: {
        totalOrders: recentOrders.reduce((sum, cat) => sum + cat.orderCount, 0),
        totalValue: recentOrders.reduce((sum, cat) => sum + cat.totalValue, 0),
        avgOrderValue: recentOrders.length > 0 
          ? recentOrders.reduce((sum, cat) => sum + cat.avgOrderValue, 0) / recentOrders.length 
          : 0
      },
      recommendations: [
        "Consider seasonal demand patterns for better inventory planning",
        "Focus on high-demand categories for maximum profitability",
        "Monitor competitor pricing in popular categories"
      ]
    };

    res.json({
      success: true,
      data: {
        location,
        insights,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Market insights error:', error);
    res.status(500);
    throw new Error('Failed to generate market insights');
  }
});

// @desc    Get personalized suggestions
// @route   GET /api/ai/suggestions
// @access  Private
export const getPersonalizedSuggestions = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Get user's order history
    const orderHistory = await Order.find({ user: req.user.id })
      .populate('supplier', 'name category city')
      .populate('items.product', 'name category price')
      .limit(20)
      .sort({ createdAt: -1 })
      .lean();

    // Analyze user preferences
    const preferences = {
      favoriteCategories: {},
      averageOrderValue: 0,
      preferredSuppliers: {},
      orderFrequency: orderHistory.length
    };

    let totalValue = 0;
    orderHistory.forEach(order => {
      totalValue += order.totalAmount;
      
      // Count categories
      order.items.forEach((item: any) => {
        const category = item.product.category;
        preferences.favoriteCategories[category] = (preferences.favoriteCategories[category] || 0) + 1;
      });

      // Count suppliers
      const supplierId = order.supplier._id.toString();
      preferences.preferredSuppliers[supplierId] = (preferences.preferredSuppliers[supplierId] || 0) + 1;
    });

    preferences.averageOrderValue = orderHistory.length > 0 ? totalValue / orderHistory.length : 0;

    // Generate suggestions
    const suggestions = {
      basedOnHistory: [
        "Consider reordering from your favorite suppliers",
        "Explore similar products in your preferred categories",
        "Try new suppliers in your trusted categories"
      ],
      recommendations: [
        "Set up automatic reorders for frequently purchased items",
        "Explore bulk purchasing options for better pricing",
        "Consider seasonal products based on your location"
      ],
      insights: {
        topCategory: Object.keys(preferences.favoriteCategories).sort((a, b) => 
          preferences.favoriteCategories[b] - preferences.favoriteCategories[a]
        )[0] || 'None',
        averageSpend: Math.round(preferences.averageOrderValue),
        orderFrequency: preferences.orderFrequency > 10 ? 'High' : preferences.orderFrequency > 5 ? 'Medium' : 'Low'
      }
    };

    res.json({
      success: true,
      data: {
        preferences,
        suggestions,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Personalized suggestions error:', error);
    res.status(500);
    throw new Error('Failed to generate personalized suggestions');
  }
}); 