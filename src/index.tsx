import './index.css';
import { render } from "react-dom";
import { App } from "./App";

// Production build - development utilities removed
// Import development utilities only in development mode
if (import.meta.env.DEV) {
  import('./utils/firebaseTest');
  import('./utils/systemTest');
  import('./utils/demoData');
}

// Initialize Firebase backend when app starts (development only)
if (import.meta.env.DEV) {
  const initializeFirebase = async () => {
    try {
      console.log('🔥 Initializing Firebase backend (development mode)...');
      
      // Dynamic imports for development utilities
      const { logCurrentRules } = await import('./utils/firebaseRules');
      const { initializeDatabaseStructure } = await import('./utils/databaseInit');
      const { runFirebaseTests } = await import('./utils/firebaseTest');
      
      // Log recommended database rules for current environment
      logCurrentRules();
      
      // Initialize database structure
      await initializeDatabaseStructure();
      
      // Run integration tests
      await runFirebaseTests();
      
      console.log('✅ Firebase backend initialization complete');
    } catch (error) {
      console.error('❌ Firebase backend initialization failed:', error);
    }
  };

  // Start Firebase initialization (non-blocking)
  initializeFirebase();
} else {
  console.log('🔥 Production mode - Firebase configured for production');
}

render(<App />, document.getElementById("root"));