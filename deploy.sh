#!/bin/bash

# Shah Sultan's IELTS Academy - Production Deployment Script
# This script automates the deployment process

echo "🚀 Starting production deployment for Shah Sultan's IELTS Academy..."

# Step 1: Clean and build
echo "📦 Building production bundle..."
rm -rf dist
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Production build successful!"

# Step 2: Verify environment variables
echo "🔍 Checking environment variables..."
if [ -z "$VITE_FIREBASE_API_KEY" ]; then
    echo "⚠️ Warning: VITE_FIREBASE_API_KEY not set in environment"
fi

if [ -z "$VITE_FIREBASE_PROJECT_ID" ]; then
    echo "⚠️ Warning: VITE_FIREBASE_PROJECT_ID not set in environment"
fi

# Step 3: Deploy to chosen platform
echo "🌐 Choose deployment platform:"
echo "1) Vercel"
echo "2) Netlify" 
echo "3) Firebase Hosting"
echo "4) Manual (just build)"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI not installed. Install with: npm install -g vercel"
            exit 1
        fi
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
        else
            echo "❌ Netlify CLI not installed. Install with: npm install -g netlify-cli"
            exit 1
        fi
        ;;
    3)
        echo "🚀 Deploying to Firebase Hosting..."
        if command -v firebase &> /dev/null; then
            firebase deploy --only hosting
        else
            echo "❌ Firebase CLI not installed. Install with: npm install -g firebase-tools"
            exit 1
        fi
        ;;
    4)
        echo "📦 Manual deployment - build complete!"
        echo "📁 Upload the 'dist' folder to your hosting provider"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Post-deployment checklist:"
echo "✓ Verify site is accessible at public URL"
echo "✓ Test Firebase connection"
echo "✓ Update Firebase Database rules to production"
echo "✓ Update Firebase Storage rules to production"
echo "✓ Test admin functions"
echo "✓ Test student exam flow"
echo "✓ Test customization features"
echo ""
echo "🔒 Don't forget to update Firebase rules for production security!"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"