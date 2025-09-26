import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, push, set, update, remove, DataSnapshot } from 'firebase/database';

// Custom hook for reading data from Firebase Realtime Database
export const useFirebaseData = <T>(path: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataRef = ref(database, path);
    
    const unsubscribe = onValue(dataRef, 
      (snapshot: DataSnapshot) => {
        try {
          const value = snapshot.val();
          setData(value);
          setError(null);
        } catch (err) {
          setError('Failed to fetch data');
          console.error('Firebase read error:', err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        console.error('Firebase connection error:', error);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
};

// Firebase database operations
export const firebaseService = {
  // Create new record
  create: async (path: string, data: any) => {
    try {
      const listRef = ref(database, path);
      const newRef = push(listRef);
      await set(newRef, { ...data, id: newRef.key, createdAt: Date.now() });
      return newRef.key;
    } catch (error) {
      console.error('Firebase create error:', error);
      throw error;
    }
  },

  // Update existing record
  update: async (path: string, data: any) => {
    try {
      const dataRef = ref(database, path);
      await update(dataRef, { ...data, updatedAt: Date.now() });
      return true;
    } catch (error) {
      console.error('Firebase update error:', error);
      throw error;
    }
  },

  // Set data (overwrite)
  set: async (path: string, data: any) => {
    try {
      const dataRef = ref(database, path);
      await set(dataRef, data);
      return true;
    } catch (error) {
      console.error('Firebase set error:', error);
      throw error;
    }
  },

  // Delete record
  delete: async (path: string) => {
    try {
      const dataRef = ref(database, path);
      await remove(dataRef);
      return true;
    } catch (error) {
      console.error('Firebase delete error:', error);
      throw error;
    }
  }
};