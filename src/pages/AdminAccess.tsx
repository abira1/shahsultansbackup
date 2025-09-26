import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import Layout from '../components/layout/Layout';

const AdminAccess: React.FC = () => {
  const { login, isLoggedIn, userRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@shahsultansieltsacademy.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} userRole={userRole}>
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-primary mb-6">Admin Access</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Current status: {isLoggedIn ? `Logged in as ${userRole}` : 'Not logged in'}
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter admin email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAdminLogin}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login as Admin'}
        </button>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> You need to create an admin account first through the register page with role set to 'admin', or use an existing admin account.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAccess;