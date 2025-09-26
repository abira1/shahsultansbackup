# Firebase Setup for Track Management

## Database Rules for Development

Replace your Firebase Realtime Database rules with:

```json
{
  "rules": {
    "tracks": {
      ".read": true,
      ".write": true,
      "$trackType": {
        "$trackId": {
          ".validate": "newData.hasChildren(['id', 'title', 'type', 'examType', 'sections', 'status', 'createdAt'])"
        }
      }
    },
    "exams": {
      ".read": true,
      ".write": true,
      "$examId": {
        ".validate": "newData.hasChildren(['id', 'title', 'tracks', 'status', 'createdAt'])"
      }
    }
  }
}
```

## Storage Rules for Development

Replace your Firebase Storage rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow admin uploads for audio, images, and passages
    match /audio/{fileName} {
      allow read, write: if true; // Development only
    }
    match /images/{fileName} {
      allow read, write: if true; // Development only
    }
    match /passages/{fileName} {
      allow read, write: if true; // Development only
    }
  }
}
```

## Production Rules (Use Later)

### Database Rules for Production:
```json
{
  "rules": {
    "tracks": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.admin == true",
      "$trackType": {
        "$trackId": {
          ".validate": "newData.hasChildren(['id', 'title', 'type', 'examType', 'sections', 'status', 'createdAt'])"
        }
      }
    },
    "exams": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.admin == true",
      "$examId": {
        ".validate": "newData.hasChildren(['id', 'title', 'tracks', 'status', 'createdAt'])"
      }
    }
  }
}
```

### Storage Rules for Production:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /audio/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /images/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /passages/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Setup Steps

1. **Go to Firebase Console** → Your project
2. **Realtime Database** → Rules tab → Replace with development rules above
3. **Storage** → Rules tab → Replace with development rules above
4. **Publish** the rules
5. **Test** the admin panel upload functionality

## Environment Variables

Ensure your `.env.local` file has all Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

After setting up these rules, the admin panel will be able to:
- ✅ Upload tracks with audio/image files
- ✅ Save track data to database  
- ✅ Create and manage exams
- ✅ Real-time data synchronization