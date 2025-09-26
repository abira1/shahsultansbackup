// Firebase Database Rules for different environments
// Copy and paste the appropriate rules into Firebase Console

export const FIREBASE_RULES = {
  
  // DEVELOPMENT RULES - Unrestricted access for testing
  development: {
    "rules": {
      ".read": true,
      ".write": true
    }
  },

  // PRODUCTION RULES - Secure, role-based access
  production: {
    "rules": {
      // Users can only access their own data
      "users": {
        "$uid": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        }
      },
      
      // Tracks - public read, admin write
      "tracks": {
        ".read": true,
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
      },
      
      // Exams - authenticated read, admin write
      "exams": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
      },
      
      // Results - user can access own results, admin can access all
      "results": {
        "$uid": {
          ".read": "$uid === auth.uid || (auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin')",
          ".write": "$uid === auth.uid || (auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin')"
        }
      },
      
      // Customization - admin only
      "customization": {
        ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
      },
      
      // Test nodes for development
      "testNode": {
        ".read": true,
        ".write": true
      }
    }
  },

  // STAGING RULES - Moderate security for testing
  staging: {
    "rules": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
};

// Helper function to log current environment rules
export const logCurrentRules = () => {
  const env = import.meta.env.MODE || 'development';
  console.log(`🔒 Recommended Firebase Rules for ${env}:`, 
    JSON.stringify(FIREBASE_RULES[env as keyof typeof FIREBASE_RULES], null, 2)
  );
};