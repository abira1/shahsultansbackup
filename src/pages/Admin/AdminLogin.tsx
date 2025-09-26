import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { Eye, EyeOff, Shield, UserPlus, Bug, Wrench, LogOut } from 'lucide-react';
import { createAdminAccount, checkAdminAccount, fixAdminRole } from '../../utils/adminSetup';
import { auth } from '../../config/firebase';

const AdminLogin: React.FC = () => {
  const { login, loading, isLoggedIn, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Check if admin account exists on component mount
  useEffect(() => {
    const checkAdmin = async () => {
      const exists = await checkAdminAccount();
      setAdminExists(exists);
    };
    checkAdmin();
  }, []);

  const handleCreateAdmin = async () => {
    setCreatingAdmin(true);
    setError('');
    
    try {
      const result = await createAdminAccount();
      if (result.success) {
        setAdminExists(true);
        setEmail(result.email || 'admin@shahsultansieltsacademy.com');
        setPassword(result.password || 'admin123456');
        if (result.exists) {
          setError('Admin account already exists. You can now login.');
        } else {
          setError('Admin account created successfully! You can now login.');
        }
      } else {
        setError(`Failed to create admin account: ${result.error}`);
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDebugCheck = async () => {
    setDebugInfo('Checking admin account...');
    try {
      const exists = await checkAdminAccount();
      setDebugInfo(`Admin account exists: ${exists}`);
      
      // Also check Firebase Auth users
      console.log('🔍 Current auth user:', auth.currentUser);
      console.log('🔍 Auth state:', { isLoggedIn, userRole, loading });
      
      setError(`Debug: Admin exists: ${exists}, Auth state: logged=${isLoggedIn}, role=${userRole}, loading=${loading}`);
    } catch (error: any) {
      setDebugInfo(`Debug error: ${error.message}`);
    }
  };

  const handleFixAdminRole = async () => {
    setError('');
    setDebugInfo('Fixing admin role...');
    
    try {
      const result = await fixAdminRole();
      if (result.success) {
        setDebugInfo('Admin role fixed successfully!');
        setError('Admin role has been updated. Please try logging in again.');
      } else {
        setDebugInfo(`Fix failed: ${result.error}`);
        setError(`Failed to fix admin role: ${result.error}`);
      }
    } catch (error: any) {
      setDebugInfo(`Fix error: ${error.message}`);
      setError(`Error fixing admin role: ${error.message}`);
    }
  };

  const handleLogoutAndCreateAdmin = async () => {
    setError('');
    setDebugInfo('Logging out and creating admin...');
    
    try {
      // First logout current user
      await logout();
      
      // Wait a moment for logout to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Then create admin account
      const result = await createAdminAccount();
      if (result.success) {
        setAdminExists(true);
        setEmail(result.email || 'admin@shahsultansieltsacademy.com');
        setPassword(result.password || 'admin123456');
        setDebugInfo('Admin account created successfully!');
        setError('Admin account created! You can now login with the credentials below.');
      } else {
        setDebugInfo(`Creation failed: ${result.error}`);
        setError(`Failed to create admin account: ${result.error}`);
      }
    } catch (error: any) {
      setDebugInfo(`Error: ${error.message}`);
      setError(`Error: ${error.message}`);
    }
  };

  // Redirect if already logged in as admin
  useEffect(() => {
    console.log('🔄 Login state check:', { isLoggedIn, userRole, loading });
    
    if (isLoggedIn && userRole === 'admin') {
      console.log('Admin user detected, redirecting to dashboard');
      setIsLoading(false);
      navigate('/admin/dashboard');
    } else if (isLoggedIn && userRole !== 'admin') {
      console.log('Non-admin user tried to access admin panel:', userRole);
      setError(`Access denied. Admin privileges required. Your role: ${userRole}`);
      setIsLoading(false);
    } else if (!loading && !isLoggedIn) {
      // User is not logged in, reset loading state
      setIsLoading(false);
    }
  }, [isLoggedIn, userRole, loading, navigate]);

  const handleQuickFill = () => {
    setEmail('admin@shahsultansieltsacademy.com');
    setPassword('admin123456');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', email);
      
      // For demo purposes, if using admin credentials, just redirect to dashboard
      if (email === 'admin@shahsultansieltsacademy.com' && password === 'admin123456') {
        console.log('Demo admin credentials detected, redirecting to dashboard...');
        setIsLoading(false);
        navigate('/admin/dashboard');
        return;
      }
      
      // Set a timeout to prevent infinite loading
      const loginTimeout = setTimeout(() => {
        setError('Login timeout - please try again');
        setIsLoading(false);
      }, 10000); // 10 second timeout

      await login(email, password);
      clearTimeout(loginTimeout);
      console.log('Login successful, waiting for role verification...');
      
      // Additional timeout for role verification - clear this when component unmounts
      setTimeout(() => {
        if (isLoading) {
          setError('Role verification timeout - please refresh and try again');
          setIsLoading(false);
        }
      }, 5000); // 5 second timeout for role verification

      // The useEffect will handle navigation after login
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">🔧 ADMIN LOGIN PANEL 🔧</h1>
            <p className="text-gray-600 mt-2">Access the administrative panel (UPDATED)</p>
          </div>

        {/* Error/Success Message */}
        {error && (
          <div className={`mb-6 p-4 border rounded-md ${
            error.includes('successfully') || error.includes('already exists') 
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-6 p-4 border rounded-md bg-yellow-50 border-yellow-200 text-yellow-700">
            <p className="text-sm font-mono">{debugInfo}</p>
          </div>
        )}          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your admin email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading || loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm"
            >
              Use Demo Credentials
            </button>

            {!adminExists && (
              <button
                type="button"
                onClick={handleCreateAdmin}
                disabled={creatingAdmin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {creatingAdmin ? 'Creating Admin...' : 'Create Admin Account'}
              </button>
            )}

            <button
              type="button"
              onClick={handleDebugCheck}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Debug Check
            </button>

            <button
              type="button"
              onClick={handleFixAdminRole}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Wrench className="h-4 w-4" />
              Fix Admin Role
            </button>

            {isLoggedIn && userRole !== 'admin' && (
              <button
                type="button"
                onClick={handleLogoutAndCreateAdmin}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout & Create Admin
              </button>
            )}
          </form>

          {/* Additional Info */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Admin Access Only:</strong> This area is restricted to authorized administrative personnel only.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 font-semibold mb-2">Temporary Admin Credentials:</p>
              <div className="text-sm text-green-600 space-y-1">
                <p><strong>Email:</strong> admin@shahsultansieltsacademy.com</p>
                <p><strong>Password:</strong> admin123456</p>
              </div>
              <p className="text-xs text-green-600 mt-2">
                These credentials are automatically created for testing purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;