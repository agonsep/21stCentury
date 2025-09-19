#!/bin/bash

# Deployment script for production
echo "🚀 Starting production deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install all dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
cd backend && npx prisma generate && cd ..

# Build the frontend
echo "🏗️ Building React frontend..."
cd frontend && npm run build && cd ..

# Check if build was successful
if [ ! -d "frontend/build" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend build completed successfully"

# Copy environment files if they exist
if [ -f "backend/.env.production" ]; then
    echo "📄 Using production environment configuration"
    cp backend/.env.production backend/.env
fi

# Test the production build locally
echo "🧪 Testing production build locally..."
echo "You can test your production build by running:"
echo "NODE_ENV=production npm start"
echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "Next steps for deployment:"
echo "1. Railway: Push to GitHub and deploy via Railway dashboard"
echo "2. Vercel: Run 'npx vercel' in the project directory"
echo "3. Heroku: Run 'git push heroku main'"
echo "4. DigitalOcean: Upload files to your droplet and run 'npm start'"