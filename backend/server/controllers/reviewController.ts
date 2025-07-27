import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Supplier from '../models/Supplier.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get reviews for a supplier
// @route   GET /api/reviews/:supplierId
// @access  Public
export const getSupplierReviews = asyncHandler(async (req: Request, res: Response) => {
  const { supplierId } = req.params;
  const { page = 1, limit = 10, rating } = req.query;

  // Check if supplier exists
  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Build query
  const query: any = { supplier: supplierId };
  if (rating) {
    query.rating = Number(rating);
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const reviews = await Review.find(query)
    .populate('user', 'name companyName')
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments(query);

  // Calculate rating statistics
  const ratingStats = await Review.aggregate([
    { $match: { supplier: supplier._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  // Calculate rating distribution
  const distribution = await Review.aggregate([
    { $match: { supplier: supplier._id } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  const stats = ratingStats[0] || { averageRating: 0, totalReviews: 0 };

  res.json({
    success: true,
    data: {
      supplier: {
        _id: supplier._id,
        name: supplier.name,
        rating: supplier.rating,
        reviewCount: supplier.reviewCount
      },
      statistics: {
        averageRating: Math.round(stats.averageRating * 10) / 10,
        totalReviews: stats.totalReviews,
        distribution: distribution
      },
      reviews: {
        count: reviews.length,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        data: reviews
      }
    }
  });
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { supplierId, rating, comment } = req.body;

  // Check if supplier exists
  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Check if user already reviewed this supplier
  const existingReview = await Review.findOne({
    user: req.user.id,
    supplier: supplierId
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this supplier');
  }

  // Create review
  const review = await Review.create({
    user: req.user.id,
    supplier: supplierId,
    rating,
    comment
  });

  // Populate user info
  await review.populate('user', 'name companyName');

  // Update supplier rating
  await updateSupplierRating(supplierId);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Make sure user owns the review
  if (review.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('user', 'name companyName');

  // Update supplier rating
  await updateSupplierRating(review!.supplier.toString());

  res.json({
    success: true,
    data: review
  });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Make sure user owns the review
  if (review.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  const supplierId = review.supplier.toString();
  await review.deleteOne();

  // Update supplier rating
  await updateSupplierRating(supplierId);

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get user's reviews
// @route   GET /api/reviews/user/me
// @access  Private
export const getUserReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const reviews = await Review.find({ user: req.user.id })
    .populate('supplier', 'name category city state')
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ user: req.user.id });

  res.json({
    success: true,
    count: reviews.length,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    },
    data: reviews
  });
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Increment helpful count
  review.helpfulCount += 1;
  await review.save();

  res.json({
    success: true,
    data: review
  });
});

// Helper function to update supplier rating
const updateSupplierRating = async (supplierId: string) => {
  const stats = await Review.aggregate([
    { $match: { supplier: supplierId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Supplier.findByIdAndUpdate(supplierId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].totalReviews
    });
  } else {
    // No reviews, reset to default
    await Supplier.findByIdAndUpdate(supplierId, {
      rating: 0,
      reviewCount: 0
    });
  }
}; 