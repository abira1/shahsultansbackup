import React, { useEffect, useState, createContext, useContext } from 'react';
import { auth, database } from '../../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { User } from '../../types/database';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  userRole: 'student' | 'teacher' | 'admin';
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: 'student' | 'teacher' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  userRole: 'student',
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserRole: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('🔄 Auth state changed:', firebaseUser ? firebaseUser.uid : 'null');
      
      if (firebaseUser) {
        try {
          // Set a timeout to prevent hanging
          const timeout = setTimeout(() => {
            console.log('⏰ Database fetch timeout, setting default state');
            setIsLoggedIn(true);
            setUserRole('student');
            setLoading(false);
          }, 8000); // 8 second timeout

          // Get user data from database
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const userSnapshot = await get(userRef);
          
          clearTimeout(timeout); // Clear timeout if successful
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val() as User;
            console.log('👤 User data loaded:', userData.role, userData.email);
            setUser(userData);
            setUserRole(userData.role);
            setIsLoggedIn(true);
          } else {
            console.log('⚠️ User exists in auth but not in database, creating minimal record');
            // User exists in auth but not in database - create minimal user record
            const newUser: User = {
              id: firebaseUser.uid,
              fullName: firebaseUser.displayName || 'Unknown User',
              email: firebaseUser.email || '',
              mobileNumber: '',
              role: 'student',
              createdAt: Date.now(),
              isActive: true
            };
            await set(userRef, newUser);
            setUser(newUser);
            setUserRole('student');
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
          setIsLoggedIn(false);
          setUser(null);
          setUserRole('student');
        }
      } else {
        console.log('🚪 User logged out');
        setIsLoggedIn(false);
        setUser(null);
        setUserRole('student');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔐 Starting login process for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase auth successful, user:', userCredential.user.uid);
      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      setLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, password: string): Promise<void> => {
    try {
      setLoading(true);
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const firebaseUser = userCredential.user;

      // Create user record in database
      const newUser: User = {
        ...userData,
        id: firebaseUser.uid,
        createdAt: Date.now(),
        isActive: true
      };

      const userRef = ref(database, `users/${firebaseUser.uid}`);
      await set(userRef, newUser);

      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  const updateUserRole = (role: 'student' | 'teacher' | 'admin') => {
    setUserRole(role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      // Update in database
      const userRef = ref(database, `users/${user.id}`);
      set(userRef, { ...updatedUser, updatedAt: Date.now() });
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      userRole,
      loading,
      login,
      register,
      logout,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};