// Manual verification script for Firebase integration
// This file can be run in browser console to verify Firebase connection

import { runFirebaseTests, cleanupTestData } from './firebaseTest';
import { initializeDatabaseStructure } from './databaseInit';

// Export to window for browser console access
(window as any).firebaseVerification = {
  runTests: runFirebaseTests,
  initDatabase: initializeDatabaseStructure,
  cleanup: cleanupTestData
};

console.log('🔧 Firebase verification tools loaded. Available commands:');
console.log('- firebaseVerification.runTests() - Run Firebase integration tests');
console.log('- firebaseVerification.initDatabase() - Initialize database structure');  
console.log('- firebaseVerification.cleanup() - Clean up test data');