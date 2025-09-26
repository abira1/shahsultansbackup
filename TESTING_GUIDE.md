# Testing Guide for Admin Panel Track Management

## 🚀 Quick Start Testing

### Prerequisites
1. **Firebase Setup**: Apply the rules from `FIREBASE_SETUP_ADMIN.md`
2. **Environment Variables**: Ensure `.env.local` has all Firebase configuration
3. **Development Server**: Run `npm run dev` from the correct directory

### Directory Structure
```
shahsultansbackup-main/
├── shahsultansbackup-main/    # ← Main project directory
│   ├── package.json           # ← npm commands here
│   ├── src/
│   │   ├── services/
│   │   │   └── trackManagementService.ts    # ✅ Created
│   │   └── pages/Admin/
│   │       ├── UploadTracks.tsx             # ✅ Enhanced
│   │       └── ManageExams.tsx              # ✅ Enhanced
│   └── .env.local            # ← Firebase config
```

## 🧪 Test Cases

### 1. Track Upload Testing
**URL**: `http://localhost:5173/admin/upload`

#### Test Listening Track:
1. Click "Academic Listening" or "General Listening"
2. Enter track title: "IELTS Listening Practice Test 1"
3. Upload an MP3 audio file
4. Navigate through sections (Section 1, 2, 3, 4)
5. Add questions in each section:
   - Question Type: Multiple Choice (Single)
   - Question Text: "What is the main topic?"
   - Options: A, B, C, D with one marked as correct
   - Marks: 1
6. Click "Save Track"
7. ✅ **Expected**: Success message, track saved to Firebase

#### Test Reading Track:
1. Click "Academic Reading" or "General Reading"
2. Enter track title: "IELTS Reading Practice Test 1"
3. Navigate through passages (Passage 1, 2, 3)
4. Add questions for each passage
5. Optional: Upload passage images
6. Click "Save Track"
7. ✅ **Expected**: Success message, track saved to Firebase

#### Test Writing Track:
1. Click "Writing Task 1" or "Writing Task 2"
2. Enter track title: "Writing Task 1 - Chart Description"
3. Enter task description
4. Optional: Upload task image (chart/graph)
5. Enter sample answer
6. Click "Save Track"
7. ✅ **Expected**: Success message, track saved to Firebase

### 2. Exam Management Testing
**URL**: `http://localhost:5173/admin/exams`

#### View Tracks:
1. Click "Manage Tracks"
2. Switch between Listening/Reading/Writing tabs
3. ✅ **Expected**: See uploaded tracks with correct counts
4. Test search functionality
5. Test status filtering (All/Draft/Published)

#### Create Exam:
1. Click "Create New Exam"
2. Enter exam title: "IELTS Full Practice Test 1"
3. Select tracks:
   - Listening: Choose from dropdown
   - Reading: Choose from dropdown  
   - Writing: Choose from dropdown
4. Set duration: 180 minutes
5. Choose "Save as Draft" or "Publish Immediately"
6. Click "Create Exam"
7. ✅ **Expected**: Success message, exam appears in list

#### Publish/Unpublish:
1. Find a draft track/exam
2. Click "Publish" button
3. ✅ **Expected**: Status changes to "Published"
4. Click "Unpublish" 
5. ✅ **Expected**: Status changes to "Draft"

## 🔍 Firebase Data Verification

### Check Database Structure:
1. Open Firebase Console → Realtime Database
2. Verify data structure:
```
/tracks/
  /listening/
    /{trackId}/
      - id, title, type, examType, audioUrl, sections[], status, etc.
  /reading/
    /{trackId}/
      - id, title, type, examType, passageText, sections[], status, etc.
  /writing/
    /{trackId}/
      - id, title, type, examType, taskDescription, sections[], status, etc.

/exams/
  /{examId}/
    - id, title, tracks{listening, reading, writing}, status, duration, etc.
```

### Check Storage Files:
1. Open Firebase Console → Storage
2. Verify file organization:
```
/audio/
  - {trackId}_{timestamp}_{filename}.mp3
/images/
  - {trackId}_task_{timestamp}_{filename}.jpg/png
/passages/
  - {trackId}_passage_{timestamp}_{filename}.jpg/png
```

## 🐛 Troubleshooting

### Common Issues:

#### 1. Firebase Permission Errors
**Symptoms**: "Permission denied" in console
**Solution**: Apply development rules from `FIREBASE_SETUP_ADMIN.md`

#### 2. File Upload Fails
**Symptoms**: Upload progress stops or errors
**Solution**: 
- Check Firebase Storage rules
- Verify file size < 100MB
- Check internet connection

#### 3. Data Not Saving
**Symptoms**: Success message but no data in Firebase
**Solution**:
- Check Firebase Database rules
- Verify environment variables in `.env.local`
- Check browser console for errors

#### 4. TypeScript Errors
**Symptoms**: Red underlines in VS Code
**Solution**: All files should compile clean (verified ✅)

### Development Server Issues:
If `npm run dev` fails:
1. Ensure you're in the nested `shahsultansbackup-main/` directory
2. Check `package.json` exists in current directory
3. Run `npm install` first if `node_modules/` missing
4. Try restarting VS Code and terminal

## 📊 Expected Results

### After Successful Testing:
- ✅ **Tracks Created**: Listening, Reading, Writing tracks in Firebase
- ✅ **Files Uploaded**: Audio/image files in Firebase Storage  
- ✅ **Exams Built**: Complete exams combining tracks
- ✅ **Publishing Works**: Status changes reflect in database
- ✅ **Student Access**: Published exams appear in student dashboard

### Student Dashboard Verification:
**URL**: `http://localhost:5173/dashboard/exams`
1. Login as student
2. ✅ **Expected**: See published exams only
3. Click on exam to start
4. ✅ **Expected**: Load track data from Firebase

## 🎯 Success Criteria

The implementation is successful when:
- [x] All TypeScript files compile without errors ✅
- [ ] Development server runs without crashes
- [ ] Upload tracks saves to Firebase Database
- [ ] File uploads work to Firebase Storage
- [ ] Exam creation combines tracks correctly
- [ ] Publishing controls work as expected
- [ ] Students see published content only

**Implementation Status**: **COMPLETE** - All code files ready, awaiting Firebase rules setup and testing.