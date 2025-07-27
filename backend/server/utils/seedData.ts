import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

// Sample data for seeding
const sampleUsers = [
  {
    name: 'John Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    companyName: 'ABC Restaurant',
    phone: '+91-9876543210',
    address: '123 Restaurant St, Chennai',
    role: 'buyer',
    location: {
      type: 'Point',
      coordinates: [80.2707, 13.0827] // Chennai
    }
  },
  {
    name: 'Sarah Supplier',
    email: 'supplier@example.com',
    password: 'password123',
    companyName: 'Fresh Produce Co.',
    phone: '+91-9876543211',
    address: '456 Market St, Chennai',
    role: 'supplier',
    location: {
      type: 'Point',
      coordinates: [80.2807, 13.0927] // Chennai
    }
  },
  {
    name: 'Mike Merchant',
    email: 'merchant@example.com',
    password: 'password123',
    companyName: 'Organic Foods Ltd.',
    phone: '+91-9876543212',
    address: '789 Organic St, Chennai',
    role: 'supplier',
    location: {
      type: 'Point',
      coordinates: [80.2607, 13.0727] // Chennai
    }
  }
];

const sampleSuppliers = [
  {
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
    website: 'https://freshproduce.com',
    rating: 4.5,
    reviewCount: 25,
    isVerified: true,
    businessHours: {
      open: '06:00',
      close: '20:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    minimumOrder: 500,
    deliveryRadius: 15,
    paymentMethods: ['Cash', 'Bank Transfer', 'UPI'],
    certifications: ['FSSAI', 'Organic Certified']
  },
  {
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
    website: 'https://organicfoods.com',
    rating: 4.8,
    reviewCount: 18,
    isVerified: true,
    businessHours: {
      open: '07:00',
      close: '19:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    minimumOrder: 1000,
    deliveryRadius: 20,
    paymentMethods: ['Cash', 'Bank Transfer', 'Credit Card', 'UPI'],
    certifications: ['USDA Organic', 'India Organic', 'FSSAI']
  },
  {
    name: 'Dairy Delights',
    description: 'Fresh dairy products and eggs from local farms',
    category: 'Dairy & Eggs',
    location: {
      type: 'Point',
      coordinates: [80.2507, 13.0627]
    },
    address: '321 Dairy St, Mylapore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91-9876543213',
    email: 'sales@dairydelights.com',
    rating: 4.2,
    reviewCount: 12,
    isVerified: true,
    businessHours: {
      open: '05:00',
      close: '18:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    minimumOrder: 300,
    deliveryRadius: 10,
    paymentMethods: ['Cash', 'UPI'],
    certifications: ['FSSAI']
  }
];

const sampleProducts = [
  {
    name: 'Fresh Tomatoes',
    description: 'Red, ripe tomatoes perfect for salads and cooking',
    category: 'Vegetables',
    price: 80,
    unit: 'kg',
    currency: 'INR',
    isAvailable: true,
    minimumOrderQuantity: 1,
    stockQuantity: 200,
    images: ['tomato1.jpg', 'tomato2.jpg'],
    specifications: {
      'Variety': 'Hybrid',
      'Shelf Life': '7 days',
      'Origin': 'Local Farm'
    },
    tags: ['fresh', 'organic', 'local']
  },
  {
    name: 'Organic Carrots',
    description: 'Sweet and crunchy organic carrots',
    category: 'Vegetables',
    price: 120,
    unit: 'kg',
    currency: 'INR',
    isAvailable: true,
    minimumOrderQuantity: 2,
    stockQuantity: 150,
    images: ['carrot1.jpg'],
    specifications: {
      'Variety': 'Organic',
      'Shelf Life': '10 days',
      'Origin': 'Organic Farm'
    },
    tags: ['organic', 'fresh', 'healthy']
  },
  {
    name: 'Fresh Milk',
    description: 'Pure cow milk delivered fresh daily',
    category: 'Dairy',
    price: 60,
    unit: 'l',
    currency: 'INR',
    isAvailable: true,
    minimumOrderQuantity: 1,
    stockQuantity: 100,
    images: ['milk1.jpg'],
    specifications: {
      'Type': 'Cow Milk',
      'Fat Content': '3.5%',
      'Shelf Life': '2 days'
    },
    tags: ['fresh', 'daily', 'pure']
  },
  {
    name: 'Farm Eggs',
    description: 'Fresh farm eggs from free-range chickens',
    category: 'Eggs',
    price: 120,
    unit: 'dozen',
    currency: 'INR',
    isAvailable: true,
    minimumOrderQuantity: 1,
    stockQuantity: 50,
    images: ['eggs1.jpg'],
    specifications: {
      'Type': 'Farm Fresh',
      'Size': 'Large',
      'Shelf Life': '15 days'
    },
    tags: ['farm-fresh', 'free-range', 'organic']
  }
];

const sampleReviews = [
  {
    rating: 5,
    comment: 'Excellent quality vegetables! Very fresh and delivered on time.',
    isVerified: true,
    helpfulCount: 3
  },
  {
    rating: 4,
    comment: 'Good service and reasonable prices. Will order again.',
    isVerified: true,
    helpfulCount: 1
  },
  {
    rating: 5,
    comment: 'Best organic products in the area. Highly recommended!',
    isVerified: true,
    helpfulCount: 5
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create suppliers
    const createdSuppliers = [];
    for (let i = 0; i < sampleSuppliers.length; i++) {
      const supplierData = {
        ...sampleSuppliers[i],
        owner: createdUsers[i + 1]._id // Skip first user (buyer)
      };
      const supplier = await Supplier.create(supplierData);
      createdSuppliers.push(supplier);
      console.log(`🏪 Created supplier: ${supplier.name}`);
    }

    // Create products
    const createdProducts = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = {
        ...sampleProducts[i],
        supplier: createdSuppliers[i % createdSuppliers.length]._id
      };
      const product = await Product.create(productData);
      createdProducts.push(product);
      console.log(`📦 Created product: ${product.name}`);
    }

    // Create reviews
    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = {
        ...sampleReviews[i],
        user: createdUsers[0]._id, // Buyer user
        supplier: createdSuppliers[i % createdSuppliers.length]._id
      };
      const review = await Review.create(reviewData);
      console.log(`⭐ Created review for ${createdSuppliers[i % createdSuppliers.length].name}`);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Suppliers: ${createdSuppliers.length}`);
    console.log(`- Products: ${createdProducts.length}`);
    console.log(`- Reviews: ${sampleReviews.length}`);

    return {
      users: createdUsers,
      suppliers: createdSuppliers,
      products: createdProducts
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/b2b-supplier-platform')
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return seedDatabase();
    })
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
} 