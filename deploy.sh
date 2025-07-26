#!/bin/bash

# 🚀 B2B Supplier Platform Deployment Script
# This script helps you deploy your backend to various platforms

echo "🚀 B2B Supplier Platform Deployment Helper"
echo "=========================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Git status
check_git_status() {
    if ! command_exists git; then
        echo "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    
    if [ ! -d ".git" ]; then
        echo "❌ This is not a Git repository. Please initialize Git first:"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        exit 1
    fi
    
    echo "✅ Git repository found"
}

# Function to check environment file
check_env_file() {
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found. Creating from template..."
        cp env.example .env
        echo "📝 Please edit .env file with your configuration"
        echo "   Required: MONGO_URI, JWT_SECRET"
        echo "   Optional: OPENAI_API_KEY, STRIPE_SECRET_KEY"
    else
        echo "✅ .env file found"
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "🌐 Deploying to Vercel..."
    
    if ! command_exists vercel; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "🚀 Starting Vercel deployment..."
    vercel --prod
}

# Function to deploy to Railway
deploy_railway() {
    echo "🚂 Deploying to Railway..."
    
    if ! command_exists railway; then
        echo "📦 Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    echo "🔐 Logging into Railway..."
    railway login
    
    echo "🚀 Starting Railway deployment..."
    railway up
}

# Function to deploy with Docker
deploy_docker() {
    echo "🐳 Deploying with Docker..."
    
    if ! command_exists docker; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    echo "🏗️  Building Docker image..."
    docker build -t b2b-supplier-platform .
    
    echo "🚀 Starting with Docker Compose..."
    docker-compose up -d
    
    echo "✅ Docker deployment complete!"
    echo "🌐 Your app should be running at: http://localhost:5000"
    echo "📊 MongoDB should be running at: localhost:27017"
}

# Function to test deployment
test_deployment() {
    echo "🧪 Testing deployment..."
    
    # Wait a moment for the server to start
    sleep 3
    
    # Test health endpoint
    if command_exists curl; then
        echo "🔍 Testing health endpoint..."
        curl -s http://localhost:5000/health | head -c 100
        echo "..."
    else
        echo "⚠️  curl not found. Please test manually:"
        echo "   http://localhost:5000/health"
    fi
}

# Function to show deployment options
show_menu() {
    echo ""
    echo "📋 Choose deployment option:"
    echo "1) Deploy to Vercel (Recommended - Free & Easy)"
    echo "2) Deploy to Railway (Free tier available)"
    echo "3) Deploy with Docker (Local/Server)"
    echo "4) Test current deployment"
    echo "5) Show deployment guide"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
}

# Main script
main() {
    check_git_status
    check_env_file
    
    while true; do
        show_menu
        
        case $choice in
            1)
                deploy_vercel
                ;;
            2)
                deploy_railway
                ;;
            3)
                deploy_docker
                ;;
            4)
                test_deployment
                ;;
            5)
                echo "📚 Opening deployment guide..."
                if command_exists start; then
                    start DEPLOYMENT.md
                elif command_exists open; then
                    open DEPLOYMENT.md
                else
                    echo "📖 Please open DEPLOYMENT.md manually"
                fi
                ;;
            6)
                echo "👋 Goodbye!"
                exit 0
                ;;
            *)
                echo "❌ Invalid choice. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main 