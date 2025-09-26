import { db, storage } from '../config/firebase';
import { ref, set, get } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';

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
    
  } catch (error) {
    console.error('❌ Firebase Realtime Database test FAILED:', error);
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
    
  } catch (error) {
    console.error('❌ Firebase Storage test FAILED:', error);
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
};