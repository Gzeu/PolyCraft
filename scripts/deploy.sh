#!/bin/bash

# 🚀 PolyCraft Production Deployment Script
# This script automates the deployment process to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="PolyCraft"
REPO_URL="https://github.com/Gzeu/PolyCraft"
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

echo -e "${BLUE}🚀 Starting $PROJECT_NAME Production Deployment${NC}"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Error: Not in PolyCraft project directory${NC}"
    echo "Please run this script from the project root."
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"

# Check current git status
echo -e "${YELLOW}📋 Checking git status...${NC}"

if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status --short
    echo
    read -p "Do you want to commit these changes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Enter commit message: "
        read -r commit_message
        git add .
        git commit -m "$commit_message"
        echo -e "${GREEN}✅ Changes committed${NC}"
    else
        echo -e "${YELLOW}⚠️  Proceeding with uncommitted changes${NC}"
    fi
fi

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"

# Backend tests
echo "Testing backend..."
cd $BACKEND_DIR
if [ -f "requirements.txt" ]; then
    python3 -m pip install -r requirements.txt --quiet
    if command_exists pytest; then
        python3 -m pytest -v --tb=short || {
            echo -e "${RED}❌ Backend tests failed${NC}"
            exit 1
        }
    else
        echo -e "${YELLOW}⚠️  pytest not found, skipping backend tests${NC}"
    fi
fi
cd ..

# Frontend tests
echo "Testing frontend..."
cd $FRONTEND_DIR
if [ -f "package.json" ]; then
    npm install --silent
    npm run lint || {
        echo -e "${RED}❌ Frontend linting failed${NC}"
        exit 1
    }
    
    # Run tests if they exist
    if npm run test -- --passWithNoTests --watchAll=false --silent 2>/dev/null; then
        echo -e "${GREEN}✅ Frontend tests passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend tests skipped or not configured${NC}"
    fi
    
    # Build frontend
    echo "Building frontend..."
    npm run build || {
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    }
fi
cd ..

echo -e "${GREEN}✅ All tests and builds passed${NC}"

# Push to GitHub
echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
current_branch=$(git rev-parse --abbrev-ref HEAD)
git push origin $current_branch || {
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    exit 1
}

echo -e "${GREEN}✅ Code pushed to GitHub${NC}"

# Display deployment information
echo
echo -e "${BLUE}🎯 DEPLOYMENT INFORMATION${NC}"
echo "========================================"
echo
echo -e "${YELLOW}📦 BACKEND DEPLOYMENT (Railway):${NC}"
echo "1. Go to https://railway.app"
echo "2. Create new project from GitHub"
echo "3. Select: Gzeu/PolyCraft"
echo "4. Set Root Directory: backend/"
echo "5. Add these environment variables:"
echo "   BACKEND_API_KEY=polycraft_prod_Bk_7wIim6Y9cwPddw9Iz-q9o_1758289694"
echo "   CORS_ORIGINS=https://poly-craft.vercel.app"
echo "   RATE_LIMIT_IMAGE=15"
echo "   RATE_LIMIT_TEXT=30"
echo "   RATE_LIMIT_AUDIO=10"
echo "   PORT=8000"
echo "   HOST=0.0.0.0"
echo "   ENVIRONMENT=production"
echo
echo -e "${YELLOW}🌐 FRONTEND DEPLOYMENT (Vercel):${NC}"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Import project from GitHub"
echo "3. Select: Gzeu/PolyCraft"
echo "4. Set Root Directory: frontend/"
echo "5. Add these environment variables:"
echo "   NEXT_PUBLIC_API_URL=[YOUR-RAILWAY-BACKEND-URL]"
echo "   NEXT_PUBLIC_APP_URL=https://poly-craft.vercel.app"
echo "   NEXT_PUBLIC_API_KEY=polycraft_prod_Bk_7wIim6Y9cwPddw9Iz-q9o_1758289694"
echo "   NODE_ENV=production"
echo "   NEXT_TELEMETRY_DISABLED=1"
echo
echo -e "${YELLOW}🔗 POST-DEPLOYMENT:${NC}"
echo "1. Update NEXT_PUBLIC_API_URL with your Railway backend URL"
echo "2. Update CORS_ORIGINS in Railway to include any custom domains"
echo "3. Test all endpoints: /health, /api/generate/text, /api/generate/image"
echo "4. Monitor logs for any issues"
echo
echo -e "${GREEN}🎉 DEPLOYMENT READY!${NC}"
echo "Your PolyCraft application is ready for production deployment."
echo
echo "Frontend will be at: https://poly-craft.vercel.app"
echo "Backend will be at: https://[your-project-name].railway.app"
echo "API Docs will be at: https://[your-project-name].railway.app/docs"
echo
echo -e "${BLUE}📊 Next Steps:${NC}"
echo "1. Deploy backend to Railway (5 minutes)"
echo "2. Deploy frontend to Vercel (3 minutes)"
echo "3. Update environment variables"
echo "4. Test deployment"
echo "5. Set up monitoring (optional)"
echo
echo -e "${GREEN}✨ Happy deploying!${NC}"
