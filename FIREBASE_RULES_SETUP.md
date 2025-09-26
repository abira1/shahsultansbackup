# Firebase Database Rules Setup

## ⚠️ IMPORTANT: Database Rules Required

The Firebase Realtime Database needs proper rules configured for the application to work correctly.

## Current Status
- **Database Rules**: ❌ **NOT CONFIGURED** 
- **Access**: Currently DENIED (default Firebase security)

## Required Action

### 1. Open Firebase Console
Go to: https://console.firebase.google.com/project/shahsultansieltsacademy/database

### 2. Navigate to Rules Tab
- Click on "Realtime Database" in the left sidebar
- Click on the "Rules" tab
- You'll see the current rules (likely restrictive)

### 3. Replace Rules with Development Configuration

**REPLACE** the existing rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 4. Publish the Rules
- Click **"Publish"** button
- Confirm the changes

## ⚠️ Security Notice

**Development Rules**: The rules above allow **unrestricted read/write access** to your database.

**For Production**, you should use more secure rules like:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "tracks": {
      ".read": true,
      ".write": "auth != null && auth.token.role === 'admin'"
    },
    "exams": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.role === 'admin'"
    },
    "results": {
      "$uid": {
        ".read": "$uid === auth.uid || (auth != null && auth.token.role === 'admin')",
        ".write": "$uid === auth.uid || (auth != null && auth.token.role === 'admin')"
      }
    }
  }
}
```

## Verification

After updating the rules:

1. **Restart the dev server**: `npm run dev`
2. **Check browser console** for Firebase test results
3. **Look for**: "✅ Firebase Realtime Database test PASSED"

## Common Issues

- **Permission Denied**: Rules not updated or published
- **Network Error**: Check internet connection and Firebase project access
- **Invalid Rules**: JSON syntax error in rules configuration

---

**Next Steps**: Update the database rules in Firebase Console, then restart the development server to test the connection.