import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'B2B Supplier Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// Demo data
const demoSuppliers = [
  {
    _id: '1',
    name: 'Fresh Produce Co.',
    description: 'Premium quality vegetables and fruits sourced directly from local farmers',
    category: 'Vegetables & Fruits',
    location: {
      type: 'Point',
      coordinates: [80.2807, 13.0927]
    },
    address: '456 Market St, T Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91-9876543211',
    email: 'contact@freshproduce.com',
    rating: 4.5,
    reviewCount: 25,
    isVerified: true,
    distance: 2.3
  },
  {
    _id: '2',
    name: 'Organic Foods Ltd.',
    description: 'Certified organic products with focus on sustainability and quality',
    category: 'Organic Products',
    location: {
      type: 'Point',
      coordinates: [80.2607, 13.0727]
    },
    address: '789 Organic St, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91-9876543212',
    email: 'info@organicfoods.com',
    rating: 4.8,
    reviewCount: 18,
    isVerified: true,
    distance: 4.1
  }
];

const demoProducts = [
  {
    _id: '1',
    name: 'Fresh Tomatoes',
    description: 'Red, ripe tomatoes perfect for salads and cooking',
    category: 'Vegetables',
    price: 80,
    unit: 'kg',
    supplier: {
      _id: '1',
      name: 'Fresh Produce Co.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      rating: 4.5,
      isVerified: true
    }
  },
  {
    _id: '2',
    name: 'Organic Carrots',
    description: 'Sweet and crunchy organic carrots',
    category: 'Vegetables',
    price: 120,
    unit: 'kg',
    supplier: {
      _id: '2',
      name: 'Organic Foods Ltd.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      rating: 4.8,
      isVerified: true
    }
  }
];

// API Routes

// Get nearby suppliers
app.get('/api/suppliers/nearby', (req, res) => {
  const { lat, lon, radius = 50, category } = req.query;
  
  let suppliers = demoSuppliers;
  
  if (category) {
    suppliers = suppliers.filter(s => s.category === category);
  }
  
  res.json({
    success: true,
    count: suppliers.length,
    data: suppliers
  });
});

// Get all suppliers
app.get('/api/suppliers', (req, res) => {
  res.json({
    success: true,
    count: demoSuppliers.length,
    data: demoSuppliers
  });
});

// Get single supplier
app.get('/api/suppliers/:id', (req, res) => {
  const supplier = demoSuppliers.find(s => s._id === req.params.id);
  
  if (!supplier) {
    return res.status(404).json({
      success: false,
      message: 'Supplier not found'
    });
  }
  
  res.json({
    success: true,
    data: supplier
  });
});

// Compare product prices
app.get('/api/products/compare', (req, res) => {
  const { name, category } = req.query;
  
  let products = demoProducts;
  
  if (name) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(name.toString().toLowerCase())
    );
  }
  
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  // Group by product name for comparison
  const productGroups = {};
  products.forEach(product => {
    const key = product.name.toLowerCase().trim();
    if (!productGroups[key]) {
      productGroups[key] = [];
    }
    productGroups[key].push(product);
  });
  
  const comparison = Object.entries(productGroups).map(([productName, variants]: [string, any]) => {
    const prices = variants.map((v: any) => v.price);
    const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return {
      productName: variants[0].name,
      category: variants[0].category,
      unit: variants[0].unit,
      variants: variants.length,
      priceRange: {
        min: minPrice,
        max: maxPrice,
        average: Math.round(avgPrice * 100) / 100
      },
      suppliers: variants.map((variant: any) => ({
        supplierId: variant.supplier._id,
        supplierName: variant.supplier.name,
        price: variant.price,
        rating: variant.supplier.rating,
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

// Get all products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    count: demoProducts.length,
    data: demoProducts
  });
});

// Get product categories
app.get('/api/products/categories/list', (req, res) => {
  const categories = [...new Set(demoProducts.map(p => p.category))];
  res.json({
    success: true,
    data: categories
  });
});

// Get supplier reviews
app.get('/api/reviews/:supplierId', (req, res) => {
  const { supplierId } = req.params;
  
  const supplier = demoSuppliers.find(s => s._id === supplierId);
  if (!supplier) {
    return res.status(404).json({
      success: false,
      message: 'Supplier not found'
    });
  }
  
  const reviews = [
    {
      _id: '1',
      user: { name: 'John Buyer', companyName: 'ABC Restaurant' },
      rating: 5,
      comment: 'Excellent quality vegetables! Very fresh and delivered on time.',
      isVerified: true,
      helpfulCount: 3,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      user: { name: 'Sarah Manager', companyName: 'XYZ Hotel' },
      rating: 4,
      comment: 'Good service and reasonable prices. Will order again.',
      isVerified: true,
      helpfulCount: 1,
      createdAt: new Date().toISOString()
    }
  ];
  
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
        averageRating: supplier.rating,
        totalReviews: supplier.reviewCount,
        distribution: [
          { _id: 5, count: 15 },
          { _id: 4, count: 8 },
          { _id: 3, count: 2 }
        ]
      },
      reviews: {
        count: reviews.length,
        data: reviews
      }
    }
  });
});

// AI Recommendations (mock)
app.post('/api/ai/recommendations', (req, res) => {
  const { location, requirements, budget } = req.body;
  
  res.json({
    success: true,
    data: {
      userPreferences: { location, requirements, budget },
      recommendations: {
        suppliers: [
          {
            name: "Local Fresh Produce Co.",
            category: "Vegetables & Fruits",
            reasoning: "Recommended based on location proximity and positive reviews",
            estimatedDistance: "2-5 km",
            priceRange: "Budget-friendly"
          },
          {
            name: "Premium Suppliers Ltd.",
            category: "Organic Products",
            reasoning: "High-quality organic products with verified certifications",
            estimatedDistance: "5-10 km",
            priceRange: "Premium"
          }
        ]
      },
      timestamp: new Date().toISOString()
    }
  });
});

// Demand Prediction (mock)
app.post('/api/ai/predict-demand', (req, res) => {
  const { product, location, month } = req.body;
  
  res.json({
    success: true,
    data: {
      prediction: {
        product,
        location,
        month,
        predictedDemand: "Medium",
        demandVolume: "500-1000 kg",
        confidence: "Medium",
        factors: ["Seasonal demand", "Market trends"],
        recommendations: "Monitor local market conditions and adjust inventory accordingly"
      },
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Demo Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: Check the README.md file`);
});

export default app; 