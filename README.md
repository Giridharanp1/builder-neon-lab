# Builder Neon Lab

A fullstack application with separated frontend and backend for better organization and scalability.

## 📁 Project Structure

```
builder-neon-lab/
├── frontend/           # React + TypeScript frontend
│   ├── client/        # React components and pages
│   ├── package.json   # Frontend dependencies
│   ├── vite.config.ts # Vite configuration
│   └── ...
├── backend/           # Express.js + TypeScript backend
│   ├── server/        # Server code and routes
│   ├── package.json   # Backend dependencies
│   └── ...
├── package.json       # Root orchestration
└── render.yaml        # Render deployment config
```

## 🚀 Quick Start

### Development
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend in development
npm run dev

# Or start them separately
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

### Production Build
```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Modern ES6+** features

### Backend
- **Express.js** with TypeScript
- **Node.js** runtime
- **CORS** enabled for frontend communication
- **Rate limiting** and security middleware

## 📱 Features

- ✅ **Separated Concerns**: Frontend and backend in different folders
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Modern Build**: Vite for fast development
- ✅ **Production Ready**: Optimized for deployment
- ✅ **API Integration**: Backend serves frontend and API endpoints

## 🌐 Deployment

The application is configured for deployment on Render with:
- **Frontend**: Built and served by backend
- **Backend**: Express.js server with API endpoints
- **Health Check**: `/health` endpoint for monitoring

## 🔗 API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/test` - Test API endpoint
- `GET /*` - Serves the React frontend

## 📦 Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both frontend and backend
- `npm start` - Start production server
- `npm run install:all` - Install all dependencies

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run typecheck` - TypeScript type checking

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run typecheck` - TypeScript type checking

## 🎯 Benefits of Separation

1. **Clear Organization**: Frontend and backend code are clearly separated
2. **Independent Development**: Teams can work on frontend/backend independently
3. **Scalability**: Easy to scale frontend and backend separately
4. **Deployment Flexibility**: Can deploy frontend and backend to different platforms
5. **Dependency Management**: Each part has its own dependencies

## 🚀 Ready for Production

Your application is ready for deployment with:
- ✅ Clean separation of concerns
- ✅ Production-optimized builds
- ✅ Type safety throughout
- ✅ Modern development experience 