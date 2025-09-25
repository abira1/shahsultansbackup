import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../components/auth/AuthContext';
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}
interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}
const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login
  } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
      isValid = false;
    }
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const showToastNotification = (type: 'success' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      showToastNotification('success', 'Login successful! Redirecting...');
      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    } catch (error: any) {
      setErrors({
        general: error.message || 'Authentication failed. Please check your credentials.'
      });
      showToastNotification('error', error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="py-10 sm:py-16 bg-secondary min-h-screen">
      <div className="container max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
              Welcome Back
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              Sign in to access your student dashboard
            </p>
          </div>
          {errors.general && <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm" role="alert">
              <div className="flex">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>{errors.general}</span>
              </div>
            </div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4 sm:mb-6">
              <label htmlFor="email" className="form-label text-xs sm:text-sm">
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`form-input text-sm ${errors.email ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your email address" required aria-invalid={errors.email ? 'true' : 'false'} aria-describedby={errors.email ? 'email-error' : undefined} />
              {errors.email && <p id="email-error" className="form-error text-xs sm:text-sm">
                  {errors.email}
                </p>}
            </div>
            <div className="mb-4 sm:mb-6">
              <label htmlFor="password" className="form-label text-xs sm:text-sm">
                Password
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className={`form-input pr-10 text-sm ${errors.password ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your password" required aria-invalid={errors.password ? 'true' : 'false'} aria-describedby={errors.password ? 'password-error' : undefined} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="form-error text-xs sm:text-sm">
                  {errors.password}
                </p>}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <div className="flex items-center">
                <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="h-3 w-3 sm:h-4 sm:w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="rememberMe" className="ml-2 block text-xs sm:text-sm text-text-secondary">
                  Remember me
                </label>
              </div>
              <div className="text-xs sm:text-sm">
                <Link to="/forgot-password" className="text-accent hover:text-accent-dark font-medium">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <Button variant="primary" type="submit" fullWidth loading={isLoading} disabled={isLoading}>
              Sign In
            </Button>
          </form>
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-text-secondary text-xs sm:text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-dark font-medium">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {showToast && <div className={`fixed bottom-4 right-4 max-w-xs sm:max-w-md w-full bg-white rounded-lg shadow-lg border-l-4 ${toastType === 'success' ? 'border-green-500' : 'border-red-500'} overflow-hidden z-50`}>
          <div className="p-3 sm:p-4 flex items-start">
            {toastType === 'success' ? <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-500 mr-2 sm:mr-3" /> : <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 mr-2 sm:mr-3" />}
            <div className="flex-1">
              <p className={`font-medium text-xs sm:text-sm ${toastType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {toastType === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600">
                {toastMessage}
              </p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-500" aria-label="Close notification">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className={`h-1 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-shrink`}></div>
        </div>}
    </div>;
};
export default LoginPage;