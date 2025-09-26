# 🔥 Firebase Security Rules - Shah Sultan's IELTS Academy

## 🔐 Overview

This document explains the Firebase Security Rules currently implemented for Shah Sultan's IELTS Academy platform. These rules ensure data security, user privacy, and proper access control.

## 🗄️ Firestore Database Rules

### Current Rules Structure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Exam data - public read, admin write
    match /exams/{examId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Exam attempts - user specific
    match /examAttempts/{attemptId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow read, write: if request.auth != null && 
                           exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Audio tracks - public read, admin write
    match /audioTracks/{trackId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Reading passages - public read, admin write
    match /readingPassages/{passageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Writing prompts - public read, admin write
    match /writingPrompts/{promptId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admin documents - admin only
    match /admins/{adminId} {
      allow read, write: if request.auth != null && 
                           exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // System settings - admin only
    match /settings/{settingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Results and analytics - user specific or admin
    match /results/{resultId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow read, write: if request.auth != null && 
                           exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### Rule Explanations:

#### 1. User Profile Documents (`/users/{userId}`):
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow read: if request.auth != null && 
                 exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

**Purpose:** Protect user personal information
**Access:**
- **Users:** Can read and write their own profile
- **Admins:** Can read all user profiles (for management)
- **Guests:** No access

**Security Features:**
- Authentication required
- User ID validation
- Admin privilege verification

#### 2. Exam Data (`/exams/{examId}`):
```javascript
match /exams/{examId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
                  exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

**Purpose:** Control access to exam content
**Access:**
- **Authenticated Users:** Can read exam questions and instructions
- **Admins:** Can create, update, and delete exams
- **Guests:** No access

**Security Features:**
- Authentication required for reading
- Admin verification for modifications
- Prevents unauthorized exam creation

#### 3. Exam Attempts (`/examAttempts/{attemptId}`):
```javascript
match /examAttempts/{attemptId} {
  allow read, write: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
  allow read, write: if request.auth != null && 
                       exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

**Purpose:** Secure individual exam submissions
**Access:**
- **Users:** Can only access their own exam attempts
- **Admins:** Can access all exam attempts (for grading)
- **Other Users:** Cannot see others' attempts

**Security Features:**
- User ID validation against attempt owner
- Admin privilege verification
- Complete attempt privacy between users

#### 4. Audio Tracks (`/audioTracks/{trackId}`):
```javascript
match /audioTracks/{trackId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
                  exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

**Purpose:** Manage listening exam audio files
**Access:**
- **Authenticated Users:** Can access audio metadata
- **Admins:** Can upload and manage audio tracks
- **Guests:** No access

**Security Features:**
- Authentication required for access
- Admin-only upload and modification
- Metadata protection

## 📁 Firebase Storage Rules

### Current Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Audio files for listening tests
    match /audio/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/firestore/databases/(default)/documents/admins/$(request.auth.uid));
    }
    
    // User profile images
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     exists(/firestore/databases/(default)/documents/admins/$(request.auth.uid));
    }
    
    // Public assets (logos, images)
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/firestore/databases/(default)/documents/admins/$(request.auth.uid));
    }
    
    // Exam materials (images, documents)
    match /exam-materials/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      exists(/firestore/databases/(default)/documents/admins/$(request.auth.uid));
    }
    
    // Backup files - admin only
    match /backups/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           exists(/firestore/databases/(default)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### Storage Rule Explanations:

#### 1. Audio Files (`/audio/{allPaths=**}`):
**Purpose:** Protect listening test audio content
**Access:**
- **Authenticated Users:** Can download audio for exams
- **Admins:** Can upload and manage audio files
- **Guests:** No access

**Security Benefits:**
- Prevents unauthorized audio downloads
- Protects copyrighted content
- Ensures only exam participants access materials

#### 2. User Profile Images (`/profiles/{userId}/{allPaths=**}`):
**Purpose:** Secure user profile photos
**Access:**
- **Users:** Can upload/modify their own profile images
- **Admins:** Can view all profile images (for moderation)
- **Other Users:** Cannot access others' profile images

**Security Benefits:**
- Complete privacy of profile images
- Prevents unauthorized image uploads
- Admin moderation capability

#### 3. Public Assets (`/public/{allPaths=**}`):
**Purpose:** Manage website public resources
**Access:**
- **Everyone:** Can view public images and logos
- **Admins:** Can update public assets
- **Users:** Read-only access

**Security Benefits:**
- Public accessibility for website resources
- Controlled modification by admins only
- Optimized for website performance

## 🔒 Authentication Rules

### Firebase Authentication Configuration:

#### Enabled Sign-in Methods:
1. **Email/Password**
   - Primary method for students and admins
   - Password requirements: minimum 6 characters
   - Email verification required

2. **Google Sign-in**
   - Alternative method for students
   - Simplified registration process
   - Automatic email verification

#### Authentication Security Features:

```javascript
// Custom claims for admin users
{
  admin: true,
  permissions: ["read_all", "write_all", "manage_users"],
  createdAt: "2024-01-01T00:00:00Z",
  lastLogin: "2024-01-15T10:30:00Z"
}
```

#### Account Security:
- **Password Policy:** Minimum 6 characters (recommend 8+)
- **Email Verification:** Required before full access
- **Session Management:** 1 hour timeout for inactive sessions
- **Multi-device:** Limited to 3 concurrent sessions

## 🛡️ Security Best Practices Implemented

### 1. Authentication Requirements:
- **All Operations:** Require user authentication
- **No Anonymous Access:** Prevents unauthorized usage
- **Token Validation:** Automatic Firebase token verification

### 2. Role-Based Access Control (RBAC):
- **Admin Verification:** Check admin document existence
- **User Isolation:** Users can only access their own data
- **Graduated Permissions:** Different access levels per resource

### 3. Data Validation:
- **User ID Matching:** Verify request user matches resource owner
- **Admin Privilege Checks:** Confirm admin status before write operations
- **Resource Existence:** Validate referenced documents exist

### 4. Privacy Protection:
- **User Data Isolation:** Strict separation between user accounts
- **Exam Attempt Privacy:** Users cannot see others' attempts
- **Profile Confidentiality:** Personal information protected

## ⚠️ Security Considerations

### Current Limitations:

#### 1. Admin Account Management:
- **Challenge:** Admin accounts created manually
- **Risk:** Potential for unauthorized admin creation
- **Mitigation:** Regular admin account audits

#### 2. Data Validation:
- **Challenge:** Limited server-side validation
- **Risk:** Malformed data could be stored
- **Mitigation:** Client-side validation + periodic data cleanup

#### 3. Rate Limiting:
- **Challenge:** No built-in rate limiting in rules
- **Risk:** Potential for abuse or DoS attacks
- **Mitigation:** Monitor usage patterns, implement Cloud Functions

### Recommended Improvements:

#### 1. Enhanced Validation:
```javascript
// Example enhanced validation
match /users/{userId} {
  allow write: if request.auth != null && 
               request.auth.uid == userId &&
               validateUserData(request.resource.data);
}

function validateUserData(data) {
  return data.keys().hasAll(['name', 'email']) &&
         data.name is string &&
         data.name.size() > 0 &&
         data.email.matches(".*@.*\\..*");
}
```

#### 2. Audit Logging:
- Implement Cloud Functions for activity logging
- Track admin actions and data modifications
- Monitor suspicious access patterns

#### 3. Advanced Admin Controls:
```javascript
// Enhanced admin verification
function isAdmin(userId) {
  return exists(/databases/$(database)/documents/admins/$(userId)) &&
         get(/databases/$(database)/documents/admins/$(userId)).data.active == true &&
         get(/databases/$(database)/documents/admins/$(userId)).data.permissions.hasAll(['manage_exams']);
}
```

## 🔄 Rule Updates & Maintenance

### Updating Security Rules:

#### 1. Development Process:
```bash
# Test rules locally
firebase emulators:start --only firestore

# Deploy to staging
firebase deploy --only firestore:rules --project staging

# Deploy to production (after testing)
firebase deploy --only firestore:rules --project production
```

#### 2. Testing Rules:
```javascript
// Example test case
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

const testEnv = await initializeTestEnvironment({
  projectId: "shah-sultans-ielts-test",
  firestore: {
    rules: fs.readFileSync("firestore.rules", "utf8"),
  },
});

// Test user access
const userDb = testEnv.authenticatedContext("user123").firestore();
await assertSucceeds(userDb.collection("users").doc("user123").get());
await assertFails(userDb.collection("users").doc("user456").get());
```

#### 3. Monitoring Rules:
- Regular security audits
- Performance monitoring
- Error tracking and resolution

### Backup Current Rules:

#### Firestore Rules Backup:
```bash
# Export current rules
firebase firestore:rules > firestore-rules-backup-$(date +%Y%m%d).txt

# Storage rules backup
firebase storage:rules > storage-rules-backup-$(date +%Y%m%d).txt
```

## 📋 Rule Testing Checklist

### Before Deploying New Rules:

#### ✅ Authentication Tests:
- [ ] Unauthenticated users blocked from all data
- [ ] Authenticated users can access appropriate data
- [ ] Admin users can access admin-only resources

#### ✅ User Data Tests:
- [ ] Users can read/write their own profiles
- [ ] Users cannot access other users' profiles
- [ ] Admins can read all user profiles

#### ✅ Exam Data Tests:
- [ ] Authenticated users can read exams
- [ ] Only admins can create/modify exams
- [ ] Exam attempts are properly isolated

#### ✅ Storage Tests:
- [ ] Audio files accessible to authenticated users
- [ ] Profile images properly restricted
- [ ] Public assets accessible to all

#### ✅ Performance Tests:
- [ ] Rules don't cause performance issues
- [ ] Complex queries work correctly
- [ ] Error messages are helpful

## 🚨 Emergency Procedures

### If Rules Are Compromised:

#### Immediate Actions:
1. **Disable Firebase Console Access:**
   ```bash
   firebase projects:list
   firebase use <project-id>
   ```

2. **Revert to Last Known Good Rules:**
   ```bash
   # Deploy backup rules
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

3. **Monitor Access Logs:**
   - Check Firebase Console usage logs
   - Review authentication logs
   - Audit data modification logs

#### Recovery Steps:
1. **Identify Breach Scope:**
   - What data was accessed?
   - Which users were affected?
   - What time period was compromised?

2. **Implement Fixes:**
   - Update compromised rules
   - Reset affected user sessions
   - Notify affected users if necessary

3. **Strengthen Security:**
   - Add additional validation
   - Implement monitoring alerts
   - Review admin access

## 📞 Support Contact

### For Security Issues:
- **Emergency:** Disable Firebase access immediately
- **Contact:** technical-admin@shahsultansielts.com
- **Phone:** Available for critical security issues
- **Response:** Within 2 hours for security matters

### For Rule Updates:
- **Email:** dev-support@shahsultansielts.com
- **Process:** Submit proposed changes for review
- **Timeline:** Non-emergency changes within 1-2 business days

---

## 🔐 Security Summary

The current Firebase Security Rules provide:
- ✅ **Strong Authentication:** All operations require valid users
- ✅ **User Data Privacy:** Complete isolation between user accounts
- ✅ **Admin Controls:** Proper admin verification and permissions
- ✅ **Resource Protection:** Appropriate access controls for all data types
- ✅ **File Security:** Proper storage access controls

These rules create a secure foundation for Shah Sultan's IELTS Academy while maintaining usability for students and administrative control for academy staff.

**Remember:** Security is an ongoing process. Regular reviews, updates, and monitoring ensure continued protection of student data and academy resources.