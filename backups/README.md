# Firebase Database Backup Export

This directory contains the Firebase database exports for Shah Sultan's IELTS Academy.

## Backup Contents

### Database Export (JSON Format)
- **File:** `firestore-export.json`
- **Date:** January 15, 2024
- **Type:** Complete Firestore database export
- **Collections Included:**
  - users
  - exams
  - examAttempts
  - audioTracks
  - readingPassages
  - writingPrompts
  - admins
  - settings
  - results

### Sample Data Structure
```json
{
  "users": [
    {
      "id": "user123",
      "data": {
        "name": "Sample Student",
        "email": "student@example.com",
        "createdAt": "2024-01-01T00:00:00Z",
        "lastLogin": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "exams": [
    {
      "id": "exam456",
      "data": {
        "title": "IELTS Academic Practice Test 1",
        "type": "academic",
        "duration": 180,
        "sections": ["listening", "reading", "writing"],
        "active": true
      }
    }
  ]
}
```

## Restore Instructions

### Using Firebase CLI:
```bash
firebase firestore:import firestore-export.json
```

### Using Node.js Script:
```javascript
const admin = require('firebase-admin');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('firestore-export.json', 'utf8'));

async function restoreData() {
    const db = admin.firestore();
    
    for (const [collection, documents] of Object.entries(data)) {
        const collectionRef = db.collection(collection);
        
        for (const doc of documents) {
            await collectionRef.doc(doc.id).set(doc.data);
        }
    }
}
```

## Important Notes

1. **Authentication Required:** Ensure you have proper Firebase admin credentials
2. **Project Setup:** Configure the correct Firebase project before restore
3. **Data Validation:** Verify data integrity after restore
4. **Backup Verification:** Test restore process in development environment first

## Contact Information

For assistance with backup restoration:
- Email: technical-admin@shahsultansielts.com
- Phone: Available for emergency support