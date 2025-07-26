# 🚀 Deployment Guide - B2B Supplier Platform

This guide provides step-by-step instructions to deploy your B2B Supplier Platform backend to various cloud platforms.

## 📋 Prerequisites

1. **GitHub Account** - For code hosting
2. **MongoDB Atlas Account** - For cloud database (recommended)
3. **API Keys** (optional):
   - OpenAI API Key for AI features
   - Stripe API Keys for payments

## 🌐 Deployment Options

### 1. **Vercel (Recommended - Free & Easy)**

**Step 1: Prepare Your Code**
```bash
# Make sure your code is in a GitHub repository
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `OPENAI_API_KEY` - (Optional) Your OpenAI API key
   - `STRIPE_SECRET_KEY` - (Optional) Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY` - (Optional) Your Stripe publishable key
6. Click "Deploy"

**Step 3: Get Your API URL**
- Your API will be available at: `https://your-project.vercel.app`
- Health check: `https://your-project.vercel.app/health`

---

### 2. **Railway (Free Tier Available)**

**Step 1: Deploy to Railway**
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in the Railway dashboard
6. Railway will automatically detect and deploy your Node.js app

**Step 2: Add MongoDB**
1. In your Railway project, click "New"
2. Select "Database" → "MongoDB"
3. Copy the connection string to your environment variables

---

### 3. **Render (Free Tier Available)**

**Step 1: Deploy to Render**
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `b2b-supplier-platform`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables
7. Click "Create Web Service"

**Step 2: Add MongoDB**
1. Click "New" → "PostgreSQL" (or use external MongoDB Atlas)
2. Configure the database connection

---

### 4. **Heroku (Paid)**

**Step 1: Install Heroku CLI**
```bash
# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Or use npm
npm install -g heroku
```

**Step 2: Deploy to Heroku**
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-b2b-supplier-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set NODE_ENV=production
heroku config:set OPENAI_API_KEY=your-openai-api-key
heroku config:set STRIPE_SECRET_KEY=your-stripe-secret-key

# Deploy
git push heroku main

# Open your app
heroku open
```

---

### 5. **Docker Deployment**

**Step 1: Build and Run with Docker Compose**
```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Step 2: Deploy to Docker Hub**
```bash
# Build image
docker build -t yourusername/b2b-supplier-platform .

# Push to Docker Hub
docker push yourusername/b2b-supplier-platform

# Run on any server
docker run -p 5000:5000 -e MONGO_URI=your-mongo-uri yourusername/b2b-supplier-platform
```

---

## 🔧 Environment Variables Setup

### Required Variables:
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/b2b-supplier-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Server
NODE_ENV=production
PORT=5000
```

### Optional Variables:
```env
# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Add to environment variables

### Option 2: Local MongoDB
```bash
# Install MongoDB locally
# Then use connection string: mongodb://localhost:27017/b2b-supplier-platform
```

---

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-url.com/health
```

### 2. Test API Endpoints
```bash
# Test nearby suppliers
curl https://your-app-url.com/api/suppliers/nearby

# Test products
curl https://your-app-url.com/api/products

# Test AI recommendations
curl -X POST https://your-app-url.com/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"location":"Chennai","requirements":"Fresh vegetables"}'
```

### 3. Use the Test Script
```bash
# Update the base URL in server/test-api.js
# Then run:
node server/test-api.js
```

---

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Set up HTTPS (automatic on most platforms)
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set up proper logging

---

## 📊 Monitoring & Maintenance

### Health Monitoring
- Use the `/health` endpoint for uptime monitoring
- Set up alerts for downtime
- Monitor API response times

### Database Maintenance
- Regular backups
- Monitor database size
- Optimize queries

### Performance
- Monitor memory usage
- Check API response times
- Optimize images and assets

---

## 🆘 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check connection string
   - Verify network access
   - Check credentials

2. **Environment Variables Not Loading**
   - Restart the application
   - Check variable names
   - Verify platform-specific setup

3. **CORS Errors**
   - Update CORS_ORIGIN
   - Check frontend domain
   - Verify HTTPS setup

4. **Build Failures**
   - Check Node.js version
   - Verify all dependencies
   - Check build logs

---

## 🎯 Quick Deploy Commands

### Vercel (Fastest)
```bash
npm i -g vercel
vercel
```

### Railway
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Render
```bash
# Just push to GitHub and connect to Render dashboard
git push origin main
```

---

## 📞 Support

If you encounter issues:
1. Check the platform's documentation
2. Review error logs
3. Test locally first
4. Verify environment variables

Your backend is production-ready! 🚀 