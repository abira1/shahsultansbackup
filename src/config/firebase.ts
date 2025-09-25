// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCunI3NUaFID3K79aY-JgJS7Z4wtwCDFkg",
  authDomain: "shahsultansieltsacademy.firebaseapp.com",
  databaseURL: "https://shahsultansieltsacademy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shahsultansieltsacademy",
  storageBucket: "shahsultansieltsacademy.firebasestorage.app",
  messagingSenderId: "260846136484",
  appId: "1:260846136484:web:dbbcee7135169012830a31",
  measurementId: "G-FE6M18T1PX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;