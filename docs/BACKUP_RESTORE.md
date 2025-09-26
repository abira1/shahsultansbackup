# 💾 Backup & Restore Guide - Shah Sultan's IELTS Academy

## 🎯 Overview

This comprehensive guide covers all backup and restore procedures for Shah Sultan's IELTS Academy platform. Regular backups ensure data safety and enable quick disaster recovery.

## 🔥 Firebase Database Backup

### Automated Backup Strategy

#### Daily Automatic Backups:
```bash
# Set up Cloud Scheduler for daily backups
gcloud scheduler jobs create http daily-firestore-backup \
    --schedule "0 2 * * *" \
    --uri "https://us-central1-your-project.cloudfunctions.net/backupFirestore" \
    --http-method POST \
    --time-zone "Asia/Dhaka"
```

#### Weekly Full Backups:
```bash
# Weekly comprehensive backup
gcloud scheduler jobs create http weekly-full-backup \
    --schedule "0 1 * * 0" \
    --uri "https://us-central1-your-project.cloudfunctions.net/fullBackup" \
    --http-method POST \
    --time-zone "Asia/Dhaka"
```

### Manual Backup Procedures

#### 1. Firestore Database Backup:

##### Using Firebase CLI:
```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set project
firebase use <your-project-id>

# Export Firestore data
firebase firestore:export gs://your-backup-bucket/firestore-backups/$(date +%Y%m%d-%H%M%S)
```

##### Using gcloud CLI:
```bash
# Install Google Cloud SDK
# Windows: Download from https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project your-project-id

# Create backup
gcloud firestore export gs://your-backup-bucket/firestore-export-$(date +%Y%m%d-%H%M%S)
```

##### Node.js Backup Script:
```javascript
// backup-firestore.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function backupFirestore() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `firestore-backups/backup-${timestamp}`;
    
    try {
        // Export all collections
        const collections = await db.listCollections();
        const backupData = {};
        
        for (const collection of collections) {
            const snapshot = await collection.get();
            backupData[collection.id] = [];
            
            snapshot.forEach(doc => {
                backupData[collection.id].push({
                    id: doc.id,
                    data: doc.data()
                });
            });
        }
        
        // Save to Cloud Storage
        const file = bucket.file(`${backupPath}/firestore-data.json`);
        await file.save(JSON.stringify(backupData, null, 2));
        
        console.log(`Backup completed: ${backupPath}`);
        return backupPath;
    } catch (error) {
        console.error('Backup failed:', error);
        throw error;
    }
}

// Run backup if called directly
if (require.main === module) {
    backupFirestore()
        .then(path => console.log(`Backup saved to: ${path}`))
        .catch(error => console.error('Backup error:', error));
}

module.exports = { backupFirestore };
```

#### 2. Firebase Storage Backup:

```bash
# Using gsutil to sync storage
gsutil -m rsync -r gs://your-project.appspot.com gs://your-backup-bucket/storage-backup-$(date +%Y%m%d)
```

#### 3. Firebase Authentication Backup:

```javascript
// backup-auth.js
const admin = require('firebase-admin');

async function backupUsers() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const users = [];
    
    try {
        let listUsersResult = await admin.auth().listUsers(1000);
        
        while (listUsersResult.users.length > 0) {
            listUsersResult.users.forEach(user => {
                users.push({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified,
                    disabled: user.disabled,
                    metadata: user.metadata.toJSON(),
                    customClaims: user.customClaims || {},
                    providerData: user.providerData
                });
            });
            
            if (listUsersResult.pageToken) {
                listUsersResult = await admin.auth().listUsers(1000, listUsersResult.pageToken);
            } else {
                break;
            }
        }
        
        // Save users data
        const bucket = admin.storage().bucket();
        const file = bucket.file(`user-backups/users-backup-${timestamp}.json`);
        await file.save(JSON.stringify(users, null, 2));
        
        console.log(`Users backup completed: ${users.length} users saved`);
        return users.length;
    } catch (error) {
        console.error('User backup failed:', error);
        throw error;
    }
}
```

### Backup Verification

#### Verify Firestore Backup:
```javascript
// verify-backup.js
async function verifyBackup(backupPath) {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(`${backupPath}/firestore-data.json`);
        
        const [exists] = await file.exists();
        if (!exists) {
            throw new Error('Backup file not found');
        }
        
        const [contents] = await file.download();
        const data = JSON.parse(contents.toString());
        
        // Verify data structure
        const collections = Object.keys(data);
        console.log(`Backup verified: ${collections.length} collections found`);
        
        for (const collection of collections) {
            console.log(`  - ${collection}: ${data[collection].length} documents`);
        }
        
        return true;
    } catch (error) {
        console.error('Backup verification failed:', error);
        return false;
    }
}
```

## 🔄 Restore Procedures

### 1. Firestore Database Restore

#### Complete Database Restore:
```bash
# Restore from Firebase export
firebase firestore:import gs://your-backup-bucket/firestore-backups/20240115-143022

# Or using gcloud
gcloud firestore import gs://your-backup-bucket/firestore-export-20240115-143022
```

#### Selective Collection Restore:
```javascript
// restore-collection.js
async function restoreCollection(backupPath, collectionName) {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(`${backupPath}/firestore-data.json`);
        const [contents] = await file.download();
        const backupData = JSON.parse(contents.toString());
        
        if (!backupData[collectionName]) {
            throw new Error(`Collection ${collectionName} not found in backup`);
        }
        
        const db = admin.firestore();
        const batch = db.batch();
        const collection = db.collection(collectionName);
        
        // Clear existing collection (optional)
        const existing = await collection.get();
        existing.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // Restore documents
        backupData[collectionName].forEach(item => {
            const docRef = collection.doc(item.id);
            batch.set(docRef, item.data);
        });
        
        await batch.commit();
        console.log(`Collection ${collectionName} restored successfully`);
        
    } catch (error) {
        console.error('Restore failed:', error);
        throw error;
    }
}

// Usage
restoreCollection('firestore-backups/backup-2024-01-15T14-30-22-000Z', 'users');
```

### 2. Firebase Storage Restore

#### Complete Storage Restore:
```bash
# Restore all files
gsutil -m rsync -r gs://your-backup-bucket/storage-backup-20240115 gs://your-project.appspot.com

# Restore specific folder
gsutil -m rsync -r gs://your-backup-bucket/storage-backup-20240115/audio gs://your-project.appspot.com/audio
```

#### Selective File Restore:
```javascript
// restore-files.js
async function restoreFiles(backupPath, targetPath) {
    try {
        const bucket = admin.storage().bucket();
        const backupBucket = admin.storage().bucket('your-backup-bucket');
        
        const [files] = await backupBucket.getFiles({ prefix: backupPath });
        
        for (const file of files) {
            const newPath = file.name.replace(backupPath, targetPath);
            await file.copy(bucket.file(newPath));
            console.log(`Restored: ${file.name} -> ${newPath}`);
        }
        
        console.log(`Files restored from ${backupPath} to ${targetPath}`);
    } catch (error) {
        console.error('File restore failed:', error);
        throw error;
    }
}
```

### 3. Firebase Authentication Restore

#### User Account Restore:
```javascript
// restore-users.js
async function restoreUsers(backupFile) {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(backupFile);
        const [contents] = await file.download();
        const users = JSON.parse(contents.toString());
        
        const importUsers = users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            disabled: user.disabled,
            metadata: {
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime
            },
            customClaims: user.customClaims,
            providerData: user.providerData
        }));
        
        // Import users in batches of 1000
        const batchSize = 1000;
        for (let i = 0; i < importUsers.length; i += batchSize) {
            const batch = importUsers.slice(i, i + batchSize);
            const result = await admin.auth().importUsers(batch);
            
            console.log(`Imported ${result.successCount} users, ${result.failureCount} failures`);
            
            if (result.errors.length > 0) {
                console.log('Import errors:', result.errors);
            }
        }
        
        console.log(`User restoration completed: ${users.length} users processed`);
    } catch (error) {
        console.error('User restore failed:', error);
        throw error;
    }
}
```

## 📁 Local Backup Storage

### Creating Local Backups

#### Download Firebase Data Locally:
```javascript
// local-backup.js
const fs = require('fs');
const path = require('path');

async function createLocalBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join('./backups', `backup-${timestamp}`);
    
    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });
    
    try {
        // Backup Firestore
        const firestoreData = await backupFirestore();
        fs.writeFileSync(
            path.join(backupDir, 'firestore-data.json'),
            JSON.stringify(firestoreData, null, 2)
        );
        
        // Backup Users
        const userData = await backupUsers();
        fs.writeFileSync(
            path.join(backupDir, 'users-data.json'),
            JSON.stringify(userData, null, 2)
        );
        
        // Create backup manifest
        const manifest = {
            timestamp: new Date().toISOString(),
            firestoreCollections: Object.keys(firestoreData).length,
            userCount: userData.length,
            version: '1.0.0'
        };
        
        fs.writeFileSync(
            path.join(backupDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        console.log(`Local backup created: ${backupDir}`);
        return backupDir;
    } catch (error) {
        console.error('Local backup failed:', error);
        throw error;
    }
}
```

### Backup File Organization:
```
backups/
├── backup-2024-01-15T14-30-22-000Z/
│   ├── manifest.json
│   ├── firestore-data.json
│   ├── users-data.json
│   └── storage-files/
│       ├── audio/
│       ├── profiles/
│       └── public/
├── backup-2024-01-14T14-30-22-000Z/
└── backup-2024-01-13T14-30-22-000Z/
```

## 🚨 Disaster Recovery Procedures

### Emergency Response Plan

#### 1. Data Loss Assessment:
```javascript
// assess-data-loss.js
async function assessDataLoss() {
    const db = admin.firestore();
    const assessment = {
        timestamp: new Date().toISOString(),
        collections: {},
        totalDocuments: 0,
        issues: []
    };
    
    try {
        const collections = await db.listCollections();
        
        for (const collection of collections) {
            const snapshot = await collection.count().get();
            assessment.collections[collection.id] = snapshot.data().count;
            assessment.totalDocuments += snapshot.data().count;
        }
        
        // Check for critical collections
        const criticalCollections = ['users', 'exams', 'examAttempts', 'results'];
        for (const critical of criticalCollections) {
            if (!assessment.collections[critical] || assessment.collections[critical] === 0) {
                assessment.issues.push(`Critical collection missing or empty: ${critical}`);
            }
        }
        
        console.log('Data loss assessment:', assessment);
        return assessment;
    } catch (error) {
        assessment.issues.push(`Assessment failed: ${error.message}`);
        return assessment;
    }
}
```

#### 2. Recovery Priority Order:
1. **Critical Data** (users, admins, authentication)
2. **Exam Content** (exams, audioTracks, readingPassages)
3. **Student Data** (examAttempts, results)
4. **Media Files** (audio, images)
5. **Settings and Configuration**

#### 3. Step-by-Step Recovery:

##### Phase 1: Critical System Restore
```bash
# 1. Restore user authentication
node restore-users.js user-backups/users-backup-latest.json

# 2. Restore admin accounts
node restore-collection.js firestore-backups/backup-latest admins

# 3. Restore system settings
node restore-collection.js firestore-backups/backup-latest settings
```

##### Phase 2: Content Restore
```bash
# 4. Restore exam content
node restore-collection.js firestore-backups/backup-latest exams
node restore-collection.js firestore-backups/backup-latest audioTracks
node restore-collection.js firestore-backups/backup-latest readingPassages

# 5. Restore media files
gsutil -m rsync -r gs://backup-bucket/storage-backup-latest/audio gs://project.appspot.com/audio
```

##### Phase 3: Student Data Restore
```bash
# 6. Restore student progress
node restore-collection.js firestore-backups/backup-latest examAttempts
node restore-collection.js firestore-backups/backup-latest results
```

### Recovery Verification

#### System Health Check:
```javascript
// health-check.js
async function systemHealthCheck() {
    const checks = {
        firestore: false,
        storage: false,
        auth: false,
        collections: {},
        issues: []
    };
    
    try {
        // Check Firestore
        const db = admin.firestore();
        await db.collection('settings').limit(1).get();
        checks.firestore = true;
        
        // Check essential collections
        const essential = ['users', 'exams', 'examAttempts', 'admins'];
        for (const collection of essential) {
            const snapshot = await db.collection(collection).limit(1).get();
            checks.collections[collection] = !snapshot.empty;
            
            if (snapshot.empty) {
                checks.issues.push(`Collection ${collection} is empty`);
            }
        }
        
        // Check Authentication
        const userCount = await admin.auth().listUsers(1);
        checks.auth = userCount.users.length > 0;
        
        // Check Storage
        const bucket = admin.storage().bucket();
        const [files] = await bucket.getFiles({ maxResults: 1 });
        checks.storage = files.length > 0;
        
        console.log('System health check:', checks);
        return checks;
    } catch (error) {
        checks.issues.push(`Health check failed: ${error.message}`);
        console.error('Health check error:', error);
        return checks;
    }
}
```

## 📋 Backup Schedule & Retention

### Recommended Backup Schedule:

#### Production Environment:
- **Daily:** Incremental Firestore backup (7 days retention)
- **Weekly:** Full system backup (4 weeks retention)  
- **Monthly:** Complete archive backup (12 months retention)
- **Before Updates:** Pre-deployment backup (permanent retention)

#### Backup Retention Policy:
```javascript
// cleanup-old-backups.js
async function cleanupOldBackups() {
    const bucket = admin.storage().bucket('your-backup-bucket');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days retention
    
    const [files] = await bucket.getFiles({ prefix: 'firestore-backups/' });
    
    for (const file of files) {
        const [metadata] = await file.getMetadata();
        const createdDate = new Date(metadata.timeCreated);
        
        if (createdDate < cutoffDate) {
            await file.delete();
            console.log(`Deleted old backup: ${file.name}`);
        }
    }
}
```

### Automated Backup Scripts:

#### Daily Backup Script:
```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d-%H%M%S)
PROJECT_ID="your-project-id"
BACKUP_BUCKET="your-backup-bucket"

echo "Starting daily backup: $DATE"

# Firestore backup
firebase firestore:export gs://$BACKUP_BUCKET/daily-backups/$DATE/firestore

# Storage sync
gsutil -m rsync -r gs://$PROJECT_ID.appspot.com gs://$BACKUP_BUCKET/daily-backups/$DATE/storage

# User export
node backup-users.js > backup-logs/users-$DATE.log

echo "Daily backup completed: $DATE"
```

#### Windows PowerShell Backup:
```powershell
# daily-backup.ps1
$Date = Get-Date -Format "yyyyMMdd-HHmmss"
$ProjectId = "your-project-id"
$BackupBucket = "your-backup-bucket"

Write-Host "Starting daily backup: $Date"

# Firestore backup
firebase firestore:export "gs://$BackupBucket/daily-backups/$Date/firestore"

# Storage sync
gsutil -m rsync -r "gs://$ProjectId.appspot.com" "gs://$BackupBucket/daily-backups/$Date/storage"

Write-Host "Daily backup completed: $Date"
```

## 🔧 Backup Tools & Scripts

### Complete Backup Utility:
```javascript
// complete-backup-utility.js
class BackupManager {
    constructor(projectId, backupBucket) {
        this.projectId = projectId;
        this.backupBucket = backupBucket;
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    }
    
    async createCompleteBackup() {
        console.log(`Creating complete backup: ${this.timestamp}`);
        
        try {
            // 1. Backup Firestore
            await this.backupFirestore();
            
            // 2. Backup Storage
            await this.backupStorage();
            
            // 3. Backup Users
            await this.backupUsers();
            
            // 4. Create manifest
            await this.createManifest();
            
            console.log('Complete backup finished successfully');
            return this.timestamp;
        } catch (error) {
            console.error('Backup failed:', error);
            throw error;
        }
    }
    
    async backupFirestore() {
        // Implementation from previous examples
    }
    
    async backupStorage() {
        // Implementation from previous examples
    }
    
    async backupUsers() {
        // Implementation from previous examples
    }
    
    async createManifest() {
        const manifest = {
            timestamp: this.timestamp,
            projectId: this.projectId,
            backupType: 'complete',
            components: ['firestore', 'storage', 'auth'],
            version: '1.0.0'
        };
        
        const bucket = admin.storage().bucket(this.backupBucket);
        const file = bucket.file(`complete-backups/${this.timestamp}/manifest.json`);
        await file.save(JSON.stringify(manifest, null, 2));
    }
}

// Usage
const backupManager = new BackupManager('your-project-id', 'your-backup-bucket');
backupManager.createCompleteBackup()
    .then(timestamp => console.log(`Backup completed: ${timestamp}`))
    .catch(error => console.error('Backup error:', error));
```

## 📞 Emergency Contacts

### For Backup/Restore Issues:
- **Primary:** technical-admin@shahsultansielts.com
- **Emergency:** +880-XXX-XXXXXXX (24/7 for critical issues)
- **Firebase Support:** Google Cloud Support (if enterprise plan)

### Escalation Procedure:
1. **Level 1:** Technical administrator attempts recovery
2. **Level 2:** Contact Firebase/Google Cloud support
3. **Level 3:** Engage external data recovery specialists

---

## 🎯 Backup Best Practices Summary

✅ **Automated Daily Backups:** Ensure consistent data protection  
✅ **Multiple Backup Locations:** Cloud and local storage redundancy  
✅ **Regular Testing:** Verify backup integrity and restore procedures  
✅ **Documentation:** Keep detailed records of backup procedures  
✅ **Access Control:** Secure backup storage with proper permissions  
✅ **Retention Policy:** Balance storage costs with recovery needs  
✅ **Emergency Procedures:** Clear steps for disaster recovery  
✅ **Monitoring:** Alert systems for backup failures  

**Remember:** The best backup is the one you can successfully restore. Test your recovery procedures regularly to ensure data safety and business continuity.