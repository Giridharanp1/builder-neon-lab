import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Supplier from '../models/Supplier.js';
import { createNearQuery, calculateDistance, isValidCoordinates } from '../utils/locationUtils.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get nearby suppliers
// @route   GET /api/suppliers/nearby
// @access  Public
export const getNearbySuppliers = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon, radius = 50, category, limit = 20 } = req.query;

  // Validate coordinates
  if (!lat || !lon || !isValidCoordinates(Number(lat), Number(lon))) {
    res.status(400);
    throw new Error('Valid latitude and longitude are required');
  }

  // Build query
  const query: any = {};
  
  // Add category filter if provided
  if (category) {
    query.category = category;
  }

  // Add geospatial query
  const nearQuery = createNearQuery(Number(lat), Number(lon), Number(radius));
  Object.assign(query, nearQuery);

  const suppliers = await Supplier.find(query)
    .populate('owner', 'name companyName')
    .limit(Number(limit))
    .lean();

  // Calculate distances and add to response
  const suppliersWithDistance = suppliers.map(supplier => {
    const distance = calculateDistance(
      Number(lat),
      Number(lon),
      supplier.location.coordinates[1], // latitude
      supplier.location.coordinates[0]  // longitude
    );

    return {
      ...supplier,
      distance: distance
    };
  });

  // Sort by distance
  suppliersWithDistance.sort((a, b) => a.distance - b.distance);

  res.json({
    success: true,
    count: suppliersWithDistance.length,
    data: suppliersWithDistance
  });
});

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
export const getSuppliers = asyncHandler(async (req: Request, res: Response) => {
  const { category, city, state, verified, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query: any = {};

  if (category) query.category = category;
  if (city) query.city = { $regex: city, $options: 'i' };
  if (state) query.state = { $regex: state, $options: 'i' };
  if (verified !== undefined) query.isVerified = verified === 'true';

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const suppliers = await Supplier.find(query)
    .populate('owner', 'name companyName')
    .skip(skip)
    .limit(limitNum)
    .sort({ rating: -1, reviewCount: -1 });

  const total = await Supplier.countDocuments(query);

  res.json({
    success: true,
    count: suppliers.length,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    },
    data: suppliers
  });
});

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Public
export const getSupplier = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await Supplier.findById(req.params.id)
    .populate('owner', 'name companyName email phone');

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  res.json({
    success: true,
    data: supplier
  });
});

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
export const createSupplier = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Ensure user is a supplier
  if (req.user.role !== 'supplier' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only suppliers can create supplier profiles');
  }

  const supplier = await Supplier.create({
    ...req.body,
    owner: req.user.id
  });

  res.status(201).json({
    success: true,
    data: supplier
  });
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
export const updateSupplier = asyncHandler(async (req: AuthRequest, res: Response) => {
  let supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Make sure user is supplier owner or admin
  if (supplier.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this supplier');
  }

  supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: supplier
  });
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
export const deleteSupplier = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Make sure user is supplier owner or admin
  if (supplier.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this supplier');
  }

  await supplier.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get supplier statistics
// @route   GET /api/suppliers/stats
// @access  Private (Admin)
export const getSupplierStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access statistics');
  }

  const stats = await Supplier.aggregate([
    {
      $group: {
        _id: null,
        totalSuppliers: { $sum: 1 },
        verifiedSuppliers: {
          $sum: { $cond: ['$isVerified', 1, 0] }
        },
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: '$reviewCount' }
      }
    }
  ]);

  const categoryStats = await Supplier.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      categories: categoryStats
    }
  });
}); 