# 📦 Shah Sultan's IELTS Academy - Installation Guide

## 🔧 Prerequisites

Before installing, ensure you have:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Firebase Account** - [Create account](https://firebase.google.com/)
- **Code Editor** - VS Code recommended

## 🚀 Local Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/abira1/shahsultansbackup.git
cd shahsultansbackup

# Switch to the release branch
git checkout release/v1.0.0
```

### 2. Install Dependencies

```bash
# Install all required packages
npm install
```

### 3. Firebase Configuration

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `shahsultans-ielts-academy`
4. Enable Google Analytics (optional)

#### B. Enable Required Services
1. **Authentication**: Enable Email/Password provider
2. **Realtime Database**: Create database in test mode
3. **Storage**: Enable storage

#### C. Get Configuration Keys
1. Go to Project Settings → General
2. Scroll to "Your apps" → Click Web app icon
3. Register app name: "Shah Sultan's IELTS Academy"
4. Copy the configuration object

### 4. Environment Configuration

Create `.env.local` file in project root:

```env
# Firebase Configuration (Replace with your actual values)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Development Configuration
VITE_DEPLOY_ENV=development
```

### 5. Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at: `http://localhost:5173`

## 🎯 Initial Setup

After the server starts:

### 1. Initialize Demo Data (Optional)
1. Open browser console (F12)
2. Run: `initDemo()`
3. This creates sample teachers, courses, and hero content

### 2. Create Admin User
1. Register a new account at `/register`
2. Go to Firebase Console → Realtime Database
3. Navigate to `/users/[user_id]/`
4. Add field: `role: "admin"`

### 3. Test System Health
1. Go to `/admin/system` 
2. Click "Refresh" to run system health checks
3. Verify all components show "Healthy" status

## 🧪 Verification

### Test Student Flow:
- ✅ Visit homepage - dynamic content loads
- ✅ View teachers page - teachers from database
- ✅ View courses page - courses from database
- ✅ Register/login functionality works

### Test Admin Flow:
- ✅ Access admin panel at `/admin`
- ✅ Upload tracks functionality
- ✅ Manage exams interface
- ✅ Results management
- ✅ Customization panel works

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Build and deploy to Vercel
npm run deploy:vercel

# Build and deploy to Netlify  
npm run deploy:netlify

# Build and deploy to Firebase Hosting
npm run deploy:firebase
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin panel components
│   ├── auth/           # Authentication components
│   ├── exam/           # Exam interface components
│   └── ui/             # Basic UI components
├── pages/              # Page components
│   ├── Admin/          # Admin pages
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Student dashboard
│   └── Exam/           # Exam pages
├── services/           # Firebase services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── config/             # Configuration files
```

## 🛠️ Troubleshooting

### Common Issues:

#### 1. Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Firebase Connection Issues
- Verify environment variables are correct
- Check Firebase project status
- Ensure services are enabled

#### 3. Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

#### 4. Hot Reload Not Working
- Restart development server
- Clear browser cache
- Check file permissions

### Getting Help:
- Check browser console for errors
- Review Firebase Console for backend issues
- Verify environment variables are loaded correctly
- Test with `systemTest.run()` in browser console

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Application loads without errors
- ✅ Firebase connection established
- ✅ Admin panel accessible
- ✅ Student features functional
- ✅ Real-time updates working

The system is now ready for development and testing!