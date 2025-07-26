import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Compare product prices
// @route   GET /api/products/compare
// @access  Public
export const comparePrices = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, location, radius = 50 } = req.query;

  if (!name) {
    res.status(400);
    throw new Error('Product name is required');
  }

  // Build query
  const query: any = {
    name: { $regex: name, $options: 'i' },
    isAvailable: true
  };

  if (category) {
    query.category = category;
  }

  // Get products with supplier info
  let products = await Product.find(query)
    .populate({
      path: 'supplier',
      select: 'name location city state rating reviewCount isVerified'
    })
    .sort({ price: 1 })
    .lean();

  // Filter by location if provided
  if (location && typeof location === 'string') {
    try {
      const [lat, lon] = location.split(',').map(Number);
      if (lat && lon) {
        products = products.filter(product => {
          const supplier = product.supplier as any;
          if (!supplier.location) return false;
          
          const distance = Math.sqrt(
            Math.pow(supplier.location.coordinates[1] - lat, 2) +
            Math.pow(supplier.location.coordinates[0] - lon, 2)
          ) * 111; // Rough conversion to km
          
          return distance <= Number(radius);
        });
      }
    } catch (error) {
      console.log('Location filtering failed:', error);
    }
  }

  // Group by product name for comparison
  const productGroups: { [key: string]: any[] } = {};
  products.forEach(product => {
    const key = product.name.toLowerCase().trim();
    if (!productGroups[key]) {
      productGroups[key] = [];
    }
    productGroups[key].push(product);
  });

  // Calculate statistics for each product
  const comparison = Object.entries(productGroups).map(([productName, variants]) => {
    const prices = variants.map(v => v.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    return {
      productName: variants[0].name,
      category: variants[0].category,
      unit: variants[0].unit,
      variants: variants.length,
      priceRange: {
        min: minPrice,
        max: maxPrice,
        average: Math.round(avgPrice * 100) / 100,
        range: priceRange
      },
      suppliers: variants.map(variant => ({
        supplierId: variant.supplier._id,
        supplierName: variant.supplier.name,
        price: variant.price,
        rating: variant.supplier.rating,
        reviewCount: variant.supplier.reviewCount,
        isVerified: variant.supplier.isVerified,
        location: variant.supplier.city + ', ' + variant.supplier.state
      }))
    };
  });

  res.json({
    success: true,
    count: comparison.length,
    data: comparison
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { 
    supplier, 
    category, 
    minPrice, 
    maxPrice, 
    available, 
    search, 
    page = 1, 
    limit = 10,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build query
  const query: any = {};

  if (supplier) query.supplier = supplier;
  if (category) query.category = category;
  if (available !== undefined) query.isAvailable = available === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sortObj: any = {};
  sortObj[sort as string] = order === 'desc' ? -1 : 1;

  const products = await Product.find(query)
    .populate('supplier', 'name city state rating isVerified')
    .skip(skip)
    .limit(limitNum)
    .sort(sortObj);

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    count: products.length,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    },
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate('supplier', 'name description city state phone email rating reviewCount');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Check if user is a supplier
  if (req.user.role !== 'supplier' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only suppliers can create products');
  }

  // If user is supplier, ensure they own the supplier
  if (req.user.role === 'supplier') {
    const supplier = await Supplier.findOne({ owner: req.user.id });
    if (!supplier) {
      res.status(403);
      throw new Error('You must create a supplier profile first');
    }
    req.body.supplier = supplier._id;
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  let product = await Product.findById(req.params.id).populate('supplier');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check authorization
  const supplier = product.supplier as any;
  if (supplier.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id).populate('supplier');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check authorization
  const supplier = product.supplier as any;
  if (supplier.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getProductCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Product.distinct('category');

  res.json({
    success: true,
    data: categories
  });
});

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private (Admin)
export const getProductStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access statistics');
  }

  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        availableProducts: {
          $sum: { $cond: ['$isAvailable', 1, 0] }
        },
        avgPrice: { $avg: '$price' },
        totalValue: { $sum: { $multiply: ['$price', '$stockQuantity'] } }
      }
    }
  ]);

  const categoryStats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        available: { $sum: { $cond: ['$isAvailable', 1, 0] } }
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