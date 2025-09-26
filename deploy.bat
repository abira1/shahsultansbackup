@echo off
REM Shah Sultan's IELTS Academy - Production Deployment Script (Windows)
REM This script automates the deployment process

echo 🚀 Starting production deployment for Shah Sultan's IELTS Academy...

REM Step 1: Clean and build
echo 📦 Building production bundle...
if exist dist rmdir /s /q dist
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors and try again.
    pause
    exit /b 1
)

echo ✅ Production build successful!

REM Step 2: Display environment variable warnings
echo 🔍 Checking environment variables...
if "%VITE_FIREBASE_API_KEY%"=="" (
    echo ⚠️ Warning: VITE_FIREBASE_API_KEY not set in environment
)

if "%VITE_FIREBASE_PROJECT_ID%"=="" (
    echo ⚠️ Warning: VITE_FIREBASE_PROJECT_ID not set in environment
)

REM Step 3: Deployment options
echo.
echo 🌐 Choose deployment platform:
echo 1) Vercel
echo 2) Netlify
echo 3) Firebase Hosting
echo 4) Manual (just build)
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Vercel...
    where vercel >nul 2>nul
    if %errorlevel% equ 0 (
        call vercel --prod
    ) else (
        echo ❌ Vercel CLI not installed. Install with: npm install -g vercel
        pause
        exit /b 1
    )
) else if "%choice%"=="2" (
    echo 🚀 Deploying to Netlify...
    where netlify >nul 2>nul
    if %errorlevel% equ 0 (
        call netlify deploy --prod --dir=dist
    ) else (
        echo ❌ Netlify CLI not installed. Install with: npm install -g netlify-cli
        pause
        exit /b 1
    )
) else if "%choice%"=="3" (
    echo 🚀 Deploying to Firebase Hosting...
    where firebase >nul 2>nul
    if %errorlevel% equ 0 (
        call firebase deploy --only hosting
    ) else (
        echo ❌ Firebase CLI not installed. Install with: npm install -g firebase-tools
        pause
        exit /b 1
    )
) else if "%choice%"=="4" (
    echo 📦 Manual deployment - build complete!
    echo 📁 Upload the 'dist' folder to your hosting provider
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo.
echo 📋 Post-deployment checklist:
echo ✓ Verify site is accessible at public URL
echo ✓ Test Firebase connection
echo ✓ Update Firebase Database rules to production
echo ✓ Update Firebase Storage rules to production
echo ✓ Test admin functions
echo ✓ Test student exam flow
echo ✓ Test customization features
echo.
echo 🔒 Don't forget to update Firebase rules for production security!
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause