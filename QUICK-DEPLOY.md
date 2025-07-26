# 🚀 Quick Deployment Guide

## 🎯 **Easiest Way: Deploy to Vercel (FREE)**

### Step 1: Prepare Your Code
```bash
# Make sure your code is committed to Git
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure these environment variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/b2b-supplier-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   ```
6. **Click "Deploy"**

### Step 3: Get Your API URL
- Your API will be live at: `https://your-project.vercel.app`
- Test it: `https://your-project.vercel.app/health`

---

## 🗄️ **MongoDB Setup (Required)**

### Option 1: MongoDB Atlas (FREE)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Add to Vercel environment variables

### Option 2: Use Demo Server (No Database Needed)
```bash
# Run demo server without MongoDB
npm run demo:server
```

---

## 🧪 **Test Your Deployment**

### Test Health Endpoint
```bash
curl https://your-app-url.com/health
```

### Test API Endpoints
```bash
# Test suppliers
curl https://your-app-url.com/api/suppliers

# Test products
curl https://your-app-url.com/api/products

# Test AI recommendations
curl -X POST https://your-app-url.com/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"location":"Chennai","requirements":"Fresh vegetables"}'
```

---

## 🔧 **Alternative Platforms**

### Railway (FREE)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add environment variables
4. Deploy automatically

### Render (FREE)
1. Go to [render.com](https://render.com)
2. Connect GitHub repo
3. Configure build settings
4. Deploy

---

## 📞 **Need Help?**

1. **Check the full guide**: `DEPLOYMENT.md`
2. **Test locally first**: `npm run demo:server`
3. **Check environment variables**
4. **Verify MongoDB connection**

---

## ✅ **Deployment Checklist**

- [ ] Code committed to Git
- [ ] MongoDB Atlas account created
- [ ] Environment variables set
- [ ] Health endpoint working
- [ ] API endpoints responding
- [ ] CORS configured for frontend

**Your backend is ready to deploy! 🚀** 