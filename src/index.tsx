import './index.css';
import React from "react";
import { render } from "react-dom";
import { App } from "./App";

// Firebase integration tests and database initialization
import { runFirebaseTests } from './utils/firebaseTest';
import { initializeDatabaseStructure } from './utils/databaseInit';

// Initialize Firebase backend when app starts
const initializeFirebase = async () => {
  try {
    console.log('🔥 Initializing Firebase backend...');
    
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

render(<App />, document.getElementById("root"));