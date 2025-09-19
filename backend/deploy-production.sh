#!/bin/bash

# Production Deployment Script
# This script safely deploys database changes and starts the application

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the backend directory"
    exit 1
fi

# Check if database exists (don't create if it doesn't)
if [ ! -f "database.sqlite" ]; then
    echo "⚠️  Warning: No existing database found"
    echo "   This appears to be a fresh deployment"
    echo "   Database will be created with initial seed data"
fi

echo "📋 Applying database schema changes..."
npx prisma db push

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "🌱 Checking database seeding..."
# The application will handle seeding safely on startup

echo "🎯 Starting application..."
node server.js

echo "✅ Deployment complete!"