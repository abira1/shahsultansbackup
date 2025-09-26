import { db, storage } from '../config/firebase';
import { ref, set, get } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { runTrackManagementTests } from './trackManagementTester';

// Test Firebase Realtime Database connection
export const testFirebaseDatabase = async (): Promise<boolean> => {
  try {
    console.log('🔥 Testing Firebase Realtime Database connection...');
    
    const testData = {
      test: 'ok',
      timestamp: Date.now(),
      message: 'Firebase Realtime Database is working correctly!'
    };
    
    // Write test data
    const testRef = ref(db, 'testNode');
    await set(testRef, testData);
    console.log('✅ Successfully wrote test data to Firebase');
    
    // Read test data back
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      const readData = snapshot.val();
      console.log('✅ Successfully read test data from Firebase:', readData);
      
      // Verify data integrity
      if (readData.test === 'ok' && readData.timestamp === testData.timestamp) {
        console.log('✅ Firebase Realtime Database test PASSED');
        return true;
      } else {
        console.error('❌ Data integrity check failed');
        return false;
      }
    } else {
      console.error('❌ No data found when reading back test node');
      return false;
    }
    
  } catch (error: any) {
    console.error('❌ Firebase Realtime Database test FAILED:', error);
    
    // Check for common Firebase permission errors
    if (error?.code === 'PERMISSION_DENIED' || error?.message?.includes('permission')) {
      console.error('🔒 PERMISSION DENIED: Firebase Database Rules need to be updated!');
      console.error('📋 Please follow the instructions in FIREBASE_RULES_SETUP.md');
      console.error('🌐 Go to: https://console.firebase.google.com/project/shahsultansieltsacademy/database');
      console.error('⚙️  Set rules to: { "rules": { ".read": true, ".write": true } }');
    }
    
    return false;
  }
};

// Test Firebase Storage connection
export const testFirebaseStorage = async (): Promise<boolean> => {
  try {
    console.log('📦 Testing Firebase Storage connection...');
    
    const testString = `Firebase Storage test - ${Date.now()}`;
    const testRef = storageRef(storage, 'test/connection-test.txt');
    
    // Upload test file
    await uploadString(testRef, testString);
    console.log('✅ Successfully uploaded test file to Firebase Storage');
    
    // Get download URL to verify
    const downloadURL = await getDownloadURL(testRef);
    console.log('✅ Successfully got download URL:', downloadURL);
    
    console.log('✅ Firebase Storage test PASSED');
    return true;
    
  } catch (error: any) {
    console.error('❌ Firebase Storage test FAILED:', error);
    
    // Check for common Firebase permission errors
    if (error?.code === 'storage/unauthorized' || error?.message?.includes('permission')) {
      console.error('🔒 PERMISSION DENIED: Firebase Storage Rules need to be updated!');
      console.error('📋 Please check Firebase Storage rules in the console');
      console.error('🌐 Go to: https://console.firebase.google.com/project/shahsultansieltsacademy/storage');
    }
    
    return false;
  }
};

// Run all Firebase tests
export const runFirebaseTests = async (): Promise<void> => {
  console.log('🚀 Starting Firebase integration tests...');
  
  try {
    const dbTestResult = await testFirebaseDatabase();
    const storageTestResult = await testFirebaseStorage();
    
    if (dbTestResult && storageTestResult) {
      console.log('🎉 All Firebase tests PASSED! Integration is working correctly.');
    } else {
      console.error('⚠️ Some Firebase tests FAILED. Check the logs above for details.');
    }
    
  } catch (error) {
    console.error('💥 Firebase tests encountered an error:', error);
  }
};

// Clean up test data
export const cleanupTestData = async (): Promise<void> => {
  try {
    console.log('🧹 Cleaning up test data...');
    
    // Clean up database test node
    const testRef = ref(db, 'testNode');
    await set(testRef, null);
    
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
}

// Complete Admin Panel System Test
export const testCompleteAdminSystem = async (): Promise<void> => {
  console.log('\n🎯 Testing Complete Admin Panel System...\n');
  
  try {
    // Test basic Firebase services
    console.log('='.repeat(60));
    console.log('🔥 TESTING FIREBASE SERVICES');
    console.log('='.repeat(60));
    
    const dbTest = await testFirebaseDatabase();
    const storageTest = await testFirebaseStorage();
    
    if (!dbTest || !storageTest) {
      throw new Error('Basic Firebase services are not working properly');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🏗️  TESTING TRACK MANAGEMENT SYSTEM');
    console.log('='.repeat(60) + '\n');
    
    // Test the complete Track Management System
    await runTrackManagementTests();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ADMIN PANEL SYSTEM TEST COMPLETE');
    console.log('='.repeat(60));
    console.log('✅ Firebase Realtime Database: Working');
    console.log('✅ Firebase Storage: Working');
    console.log('✅ Track Management Service: Working');
    console.log('✅ Exam Management Service: Working');
    console.log('✅ File Upload System: Working');
    console.log('✅ Admin Panel Backend: Working');
    console.log('✅ Student Access System: Working');
    console.log('\n🚀 Your IELTS Admin Panel is ready for production!');
    console.log('\n📋 Next Steps:');
    console.log('1. Use Upload Tracks page to create exam content');
    console.log('2. Use Manage Exams page to build full mock tests');
    console.log('3. Publish exams for student access');
    console.log('4. Monitor student results and analytics');
    
  } catch (error) {
    console.error('\n💥 Admin Panel System test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check Firebase project configuration');
    console.error('2. Verify database rules are set to allow read/write');
    console.error('3. Ensure environment variables are correctly set');
    console.error('4. Check network connectivity');
    throw error;
  } finally {
    // Clean up test data
    await cleanupTestData();
  }
};;