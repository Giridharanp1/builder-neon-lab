# B2B Supplier Platform Backend

A complete Node.js backend for a B2B supplier discovery and ordering platform with AI-powered recommendations and demand prediction.

## 🚀 Features

- **🔍 Find Nearby Suppliers**: Geospatial queries to find suppliers by location
- **💰 Compare Prices**: Product price comparison across multiple suppliers
- **⭐ Verified Reviews**: User reviews and ratings system
- **🤖 AI Recommendations**: OpenAI-powered supplier recommendations
- **🛒 Seamless Ordering**: Complete order management with Stripe payments
- **📈 Demand Prediction**: AI-powered demand forecasting

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **AI Integration**: OpenAI GPT API
- **Payments**: Stripe
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
server/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── supplierController.ts # Supplier management
│   ├── productController.ts # Product & price comparison
│   ├── reviewController.ts  # Reviews & ratings
│   ├── orderController.ts   # Order management
│   └── aiController.ts      # AI recommendations
├── middleware/
│   ├── auth.ts             # JWT authentication
│   └── errorHandler.ts     # Error handling
├── models/
│   ├── User.ts             # User schema
│   ├── Supplier.ts         # Supplier schema
│   ├── Product.ts          # Product schema
│   ├── Review.ts           # Review schema
│   └── Order.ts            # Order schema
├── routes/
│   ├── auth.ts             # Auth routes
│   ├── suppliers.ts        # Supplier routes
│   ├── products.ts         # Product routes
│   ├── reviews.ts          # Review routes
│   ├── orders.ts           # Order routes
│   └── ai.ts               # AI routes
├── utils/
│   ├── locationUtils.ts    # Geospatial calculations
│   └── aiUtils.ts          # AI helper functions
├── index.ts                # Server entry point
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Update `.env` with your configuration:

```env
# Database
MONGO_URI=mongodb://localhost:27017/b2b-supplier-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Server
PORT=5000
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run server:dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "companyName": "ABC Company",
  "role": "buyer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Suppliers

#### Find Nearby Suppliers
```http
GET /api/suppliers/nearby?lat=13.0827&lon=80.2707&radius=50&category=Vegetables
```

#### Get All Suppliers
```http
GET /api/suppliers?category=Vegetables&city=Chennai&verified=true
```

#### Create Supplier Profile
```http
POST /api/suppliers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fresh Produce Co.",
  "description": "Premium vegetables and fruits",
  "category": "Vegetables & Fruits",
  "location": {
    "type": "Point",
    "coordinates": [80.2707, 13.0827]
  },
  "address": "123 Main St, Chennai",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "phone": "+91-9876543210",
  "email": "contact@freshproduce.com"
}
```

### Products

#### Compare Product Prices
```http
GET /api/products/compare?name=Tomato&category=Vegetables&location=13.0827,80.2707
```

#### Get Products
```http
GET /api/products?supplier=supplier_id&category=Vegetables&minPrice=50&maxPrice=200
```

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "description": "Organic red tomatoes",
  "category": "Vegetables",
  "price": 80,
  "unit": "kg",
  "stockQuantity": 100,
  "supplier": "supplier_id"
}
```

### Reviews

#### Get Supplier Reviews
```http
GET /api/reviews/supplier_id?rating=4&page=1&limit=10
```

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "supplierId": "supplier_id",
  "rating": 5,
  "comment": "Excellent quality and service!"
}
```

### Orders

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "supplierId": "supplier_id",
  "items": [
    {
      "product": "product_id",
      "quantity": 5
    }
  ],
  "deliveryAddress": {
    "street": "123 Delivery St",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "zipCode": "600001",
    "phone": "+91-9876543210"
  },
  "paymentMethod": "Credit Card",
  "deliveryInstructions": "Leave at reception"
}
```

#### Track Order
```http
GET /api/orders/track/order_id
```

### AI Features

#### Get Recommendations
```http
POST /api/ai/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": "Chennai",
  "requirements": "Fresh vegetables for restaurant",
  "budget": "5000-10000"
}
```

#### Predict Demand
```http
POST /api/ai/predict-demand
Content-Type: application/json

{
  "product": "Ice Cream",
  "location": "Mumbai",
  "month": "April"
}
```

#### Market Insights
```http
GET /api/ai/market-insights?location=Chennai&category=Vegetables
Authorization: Bearer <token>
```

## 🔧 Development

### Available Scripts

- `npm run server:dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `b2b-supplier-platform`
3. Update `MONGO_URI` in your `.env` file

### Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- curl

Example health check:
```bash
curl http://localhost:5000/health
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Error handling

## 🤖 AI Integration

The platform uses OpenAI's GPT API for:
- Supplier recommendations based on user preferences
- Demand prediction for products
- Market insights and analysis

Make sure to set your `OPENAI_API_KEY` in the environment variables.

## 💳 Payment Integration

Stripe integration for:
- Credit card payments
- Payment intent creation
- Refund processing

Configure your Stripe keys in the environment variables.

## 📊 Geospatial Features

- Haversine formula for distance calculations
- MongoDB geospatial queries
- Location-based supplier search
- Delivery radius calculations

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up environment variables
5. Use a process manager like PM2

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CORS_ORIGIN=https://yourdomain.com
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository. 