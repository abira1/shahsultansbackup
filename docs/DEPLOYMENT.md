# 🚀 Shah Sultan's IELTS Academy - Deployment Guide

## 🎯 Overview

This guide covers deploying Shah Sultan's IELTS Academy to production with secure Firebase backend.

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] Latest code on `release/v1.0.0` branch
- [ ] Production build successful (`npm run build`)
- [ ] No console errors in production build
- [ ] Environment variables prepared

### ✅ Firebase Preparation
- [ ] Firebase project created and configured
- [ ] Database rules updated to production
- [ ] Storage rules updated to production
- [ ] Admin user created with proper role

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Why Vercel?
- ✅ Zero configuration deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variable management
- ✅ Easy rollbacks

#### Steps:
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

4. **Set Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all Firebase configuration variables:
     ```
     VITE_FIREBASE_API_KEY = your_api_key
     VITE_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
     VITE_FIREBASE_DATABASE_URL = https://your_project-default-rtdb.firebaseio.com
     VITE_FIREBASE_PROJECT_ID = your_project_id
     VITE_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
     VITE_FIREBASE_APP_ID = your_app_id
     VITE_FIREBASE_MEASUREMENT_ID = your_measurement_id
     ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

#### Steps:
1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all Firebase configuration variables

### Option 3: Firebase Hosting

#### Steps:
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Hosting:**
   ```bash
   firebase init hosting
   # Choose existing project
   # Public directory: dist
   # Single-page app: Yes
   # Automatic builds: No
   ```

3. **Build and Deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## 🔒 Firebase Security Configuration

### 1. Database Rules (Production)

Go to Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "tracks": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "exams": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "results": {
      "$examId": {
        "$uid": {
          ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
          ".write": "auth != null && auth.uid === $uid"
        }
      }
    },
    "customization": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

Click **"Publish"** to apply.

### 2. Storage Rules (Production)

Go to Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /customization/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.contentType.matches('image/.*') &&
        request.resource.size < 5 * 1024 * 1024;
    }
    
    match /tracks/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"** to apply.

## 🧪 Post-Deployment Testing

### 1. Basic Functionality Test
- [ ] Site loads at public URL
- [ ] No console errors
- [ ] Firebase connection working
- [ ] Environment variables loaded

### 2. Student Flow Test
- [ ] Register new account
- [ ] Login functionality
- [ ] View available exams
- [ ] Take a complete exam (Listening → Reading → Writing)
- [ ] Submit exam successfully
- [ ] Results save to database

### 3. Admin Flow Test
- [ ] Login as admin
- [ ] Access admin panel
- [ ] Upload tracks → Files save to Storage
- [ ] Create new exam → Data saves to Database
- [ ] View student results
- [ ] Edit and publish results
- [ ] Test customization → Real-time updates work

### 4. Security Test
- [ ] Non-admin users cannot access admin functions
- [ ] Students cannot see other students' results
- [ ] Database rules prevent unauthorized writes
- [ ] Storage rules enforce file restrictions

## 🔧 Automated Deployment Scripts

### Using Provided Scripts:

#### Unix/Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Windows:
```bash
deploy.bat
```

### Custom npm Scripts:
```bash
# Vercel deployment
npm run deploy:vercel

# Netlify deployment
npm run deploy:netlify

# Firebase Hosting deployment
npm run deploy:firebase
```

## 🛡️ Domain & SSL Configuration

### Custom Domain Setup:

#### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Automatic HTTPS certificate

#### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records
4. Force HTTPS in settings

#### Firebase Hosting:
1. Go to Hosting → Add custom domain
2. Follow verification steps
3. Configure DNS records
4. Automatic SSL certificate

## 📊 Performance Optimization

### Build Optimization:
```bash
# Analyze bundle size
npm run build -- --report

# Preview production build locally
npm run preview
```

### Performance Checklist:
- [ ] Gzip compression enabled (automatic with hosting providers)
- [ ] Images optimized and compressed
- [ ] Firebase indexes created for efficient queries
- [ ] CDN serving static assets
- [ ] HTTPS enabled

## 🚨 Rollback Procedure

### Quick Rollback (if needed):
1. **Via Hosting Platform:**
   - Vercel: Dashboard → Deployments → Promote previous deployment
   - Netlify: Dashboard → Deploys → Restore deploy
   - Firebase: `firebase hosting:rollback`

2. **Via Git:**
   ```bash
   # Rollback to previous tag
   git checkout v0.9.0
   npm run build
   # Redeploy using your chosen method
   ```

## 🔍 Monitoring & Maintenance

### Health Monitoring:
- Use System Monitor at `/admin/system`
- Monitor Firebase Console for errors
- Check hosting platform analytics

### Regular Maintenance:
- Weekly: Check Firebase usage and billing
- Monthly: Review and optimize database rules
- Quarterly: Update dependencies and security patches

## 🎯 Success Criteria

### ✅ Deployment Complete When:
- [ ] Site accessible at public URL with HTTPS
- [ ] All Firebase services connected and secured
- [ ] Admin functions working in production
- [ ] Student exam flow functional
- [ ] Customization system working
- [ ] Performance acceptable (< 3s load time)
- [ ] Mobile responsive
- [ ] No critical console errors

## 🆘 Troubleshooting

### Common Issues:

#### Build Failures:
```bash
# Clear cache and rebuild
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues:
- Verify all variables are set in hosting dashboard
- Check variable names match exactly (case-sensitive)
- Ensure no extra spaces in values

#### Firebase Connection Issues:
- Verify project ID matches
- Check service account permissions
- Review Firebase Console for error logs

#### Performance Issues:
- Enable gzip compression
- Optimize images and assets
- Review network tab in browser dev tools

### Getting Help:
1. Check hosting platform logs
2. Review Firebase Console error logs
3. Test locally with production build
4. Verify environment variables
5. Check database and storage rules

## 🎉 Deployment Success!

Your Shah Sultan's IELTS Academy platform is now live and ready for students and administrators to use!

**Next Steps:**
- Set up monitoring and alerts
- Create admin user accounts
- Upload initial content and exams
- Test with real users
- Monitor performance and usage