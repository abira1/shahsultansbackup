import { auth, database } from '../config/firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { User } from '../types/database';

export const createAdminAccount = async () => {
  const adminEmail = 'admin@shahsultansieltsacademy.com';
  const adminPassword = 'admin123456';

  try {
    console.log('🔧 Creating admin account...');
    
    // First, check if user already exists in auth but not in database
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      const existingUser = Object.entries(users).find(([, user]: [string, any]) => 
        user.email === adminEmail
      );
      
      if (existingUser) {
        const [uid, userData] = existingUser;
        const userInfo = userData as any;
        console.log('👤 Found existing user, updating to admin role:', userInfo);
        
        // Update existing user to admin role
        const updatedUser: User = {
          id: uid,
          fullName: userInfo.fullName || 'Admin User',
          email: userInfo.email,
          mobileNumber: userInfo.mobileNumber || '01777-476142',
          institution: userInfo.institution || 'Shah Sultan IELTS Academy',
          role: 'admin',
          createdAt: userInfo.createdAt || Date.now(),
          updatedAt: Date.now(),
          isActive: true
        };
        
        const userRef = ref(database, `users/${uid}`);
        await set(userRef, updatedUser);
        
        console.log('✅ Existing user updated to admin role!');
        return { success: true, email: adminEmail, password: adminPassword, exists: true };
      }
    }
    
    // Create Firebase auth user if doesn't exist
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const firebaseUser = userCredential.user;

    // Create user record in database with admin role
    const adminUser: User = {
      id: firebaseUser.uid,
      fullName: 'Admin User',
      email: adminEmail,
      mobileNumber: '01777-476142',
      institution: 'Shah Sultan IELTS Academy',
      role: 'admin',
      createdAt: Date.now(),
      isActive: true
    };

    const userRef = ref(database, `users/${firebaseUser.uid}`);
    await set(userRef, adminUser);

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: admin');

    // Sign out so it doesn't auto-login
    await signOut(auth);

    return { success: true, email: adminEmail, password: adminPassword };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Admin email already in use, trying to update role...');
      
      // Try to find and update the existing user
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const users = snapshot.val();
          const existingEntry = Object.entries(users).find(([, user]: [string, any]) => 
            user.email === adminEmail
          );
          
          if (existingEntry) {
            const [uid, userData] = existingEntry;
            const userInfo = userData as any;
            
            const updatedUser: User = {
              id: uid,
              fullName: userInfo.fullName || 'Admin User',
              email: userInfo.email,
              mobileNumber: userInfo.mobileNumber || '01777-476142',
              institution: userInfo.institution || 'Shah Sultan IELTS Academy',
              role: 'admin',
              createdAt: userInfo.createdAt || Date.now(),
              updatedAt: Date.now(),
              isActive: true
            };
            
            const userRef = ref(database, `users/${uid}`);
            await set(userRef, updatedUser);
            
            console.log('✅ Admin role updated for existing user!');
            return { success: true, email: adminEmail, password: adminPassword, exists: true };
          }
        }
      } catch (updateError) {
        console.error('Error updating existing user:', updateError);
      }
      
      return { success: true, email: adminEmail, password: adminPassword, exists: true };
    } else {
      console.error('❌ Error creating admin account:', error.message);
      return { success: false, error: error.message };
    }
  }
};

export const checkAdminAccount = async () => {
  try {
    const adminRef = ref(database, 'users');
    const snapshot = await get(adminRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      const adminUser = Object.values(users).find((user: any) => 
        user.email === 'admin@shahsultansieltsacademy.com' && user.role === 'admin'
      );
      
      if (adminUser) {
        console.log('✅ Admin account exists in database');
        return true;
      }
    }
    
    console.log('⚠️ No admin account found in database');
    return false;
  } catch (error) {
    console.error('❌ Error checking admin account:', error);
    return false;
  }
};

export const fixAdminRole = async () => {
  const adminEmail = 'admin@shahsultansieltsacademy.com';
  
  try {
    console.log('🔧 Fixing admin role...');
    
    // Get all users
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      
      // Find user with admin email
      const adminEntry = Object.entries(users).find(([, user]: [string, any]) => 
        user.email === adminEmail
      );
      
      if (adminEntry) {
        const [uid, userData] = adminEntry;
        const userInfo = userData as any; // Type assertion for existing user data
        console.log('👤 Found existing user:', userInfo);
        
        // Update role to admin
        const updatedUser: User = {
          id: uid,
          fullName: userInfo.fullName || 'Admin User',
          email: userInfo.email,
          mobileNumber: userInfo.mobileNumber || '01777-476142',
          institution: userInfo.institution || 'Shah Sultan IELTS Academy',
          role: 'admin',
          createdAt: userInfo.createdAt || Date.now(),
          updatedAt: Date.now(),
          isActive: true
        };
        
        const userRef = ref(database, `users/${uid}`);
        await set(userRef, updatedUser);
        
        console.log('✅ Admin role updated successfully!');
        return { success: true, message: 'Admin role updated' };
      } else {
        console.log('❌ No user found with admin email');
        return { success: false, error: 'User not found' };
      }
    } else {
      console.log('❌ No users found in database');
      return { success: false, error: 'No users in database' };
    }
  } catch (error: any) {
    console.error('❌ Error fixing admin role:', error.message);
    return { success: false, error: error.message };
  }
};