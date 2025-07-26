# 🚀 B2B Supplier Platform Deployment Script (PowerShell)
# This script helps you deploy your backend to various platforms

Write-Host "🚀 B2B Supplier Platform Deployment Helper" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to check Git status
function Test-GitStatus {
    if (-not (Test-Command "git")) {
        Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
        exit 1
    }
    
    if (-not (Test-Path ".git")) {
        Write-Host "❌ This is not a Git repository. Please initialize Git first:" -ForegroundColor Red
        Write-Host "   git init" -ForegroundColor Yellow
        Write-Host "   git add ." -ForegroundColor Yellow
        Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Git repository found" -ForegroundColor Green
}

# Function to check environment file
function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
        Copy-Item "env.example" ".env"
        Write-Host "📝 Please edit .env file with your configuration" -ForegroundColor Cyan
        Write-Host "   Required: MONGO_URI, JWT_SECRET" -ForegroundColor Cyan
        Write-Host "   Optional: OPENAI_API_KEY, STRIPE_SECRET_KEY" -ForegroundColor Cyan
    } else {
        Write-Host "✅ .env file found" -ForegroundColor Green
    }
}

# Function to deploy to Vercel
function Deploy-Vercel {
    Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Blue
    
    if (-not (Test-Command "vercel")) {
        Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
    Write-Host "🚀 Starting Vercel deployment..." -ForegroundColor Green
    vercel --prod
}

# Function to deploy to Railway
function Deploy-Railway {
    Write-Host "🚂 Deploying to Railway..." -ForegroundColor Blue
    
    if (-not (Test-Command "railway")) {
        Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
        npm install -g @railway/cli
    }
    
    Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
    railway login
    
    Write-Host "🚀 Starting Railway deployment..." -ForegroundColor Green
    railway up
}

# Function to deploy with Docker
function Deploy-Docker {
    Write-Host "🐳 Deploying with Docker..." -ForegroundColor Blue
    
    if (-not (Test-Command "docker")) {
        Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "🏗️  Building Docker image..." -ForegroundColor Yellow
    docker build -t b2b-supplier-platform .
    
    Write-Host "🚀 Starting with Docker Compose..." -ForegroundColor Yellow
    docker-compose up -d
    
    Write-Host "✅ Docker deployment complete!" -ForegroundColor Green
    Write-Host "🌐 Your app should be running at: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "📊 MongoDB should be running at: localhost:27017" -ForegroundColor Cyan
}

# Function to test deployment
function Test-Deployment {
    Write-Host "🧪 Testing deployment..." -ForegroundColor Blue
    
    # Wait a moment for the server to start
    Start-Sleep -Seconds 3
    
    # Test health endpoint
    try {
        Write-Host "🔍 Testing health endpoint..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
        Write-Host "✅ Health check successful: $($response.status)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Health check failed. Is the server running?" -ForegroundColor Red
    }
}

# Function to show deployment options
function Show-Menu {
    Write-Host ""
    Write-Host "📋 Choose deployment option:" -ForegroundColor Cyan
    Write-Host "1) Deploy to Vercel (Recommended - Free and Easy)" -ForegroundColor White
    Write-Host "2) Deploy to Railway (Free tier available)" -ForegroundColor White
    Write-Host "3) Deploy with Docker (Local/Server)" -ForegroundColor White
    Write-Host "4) Test current deployment" -ForegroundColor White
    Write-Host "5) Show deployment guide" -ForegroundColor White
    Write-Host "6) Exit" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Enter your choice (1-6)"
    return $choice
}

# Function to show deployment guide
function Show-DeploymentGuide {
    Write-Host "📚 Opening deployment guide..." -ForegroundColor Yellow
    if (Test-Path "DEPLOYMENT.md") {
        Start-Process "DEPLOYMENT.md"
    } else {
        Write-Host "📖 DEPLOYMENT.md not found" -ForegroundColor Red
    }
}

# Main script
function Main {
    Test-GitStatus
    Test-EnvFile
    
    while ($true) {
        $choice = Show-Menu
        
        switch ($choice) {
            "1" { Deploy-Vercel }
            "2" { Deploy-Railway }
            "3" { Deploy-Docker }
            "4" { Test-Deployment }
            "5" { Show-DeploymentGuide }
            "6" { 
                Write-Host "Goodbye!" -ForegroundColor Green
                exit 0 
            }
            default { 
                Write-Host "❌ Invalid choice. Please try again." -ForegroundColor Red 
            }
        }
        
        Write-Host ""
        Read-Host "Press Enter to continue"
    }
}

# Run main function
Main 