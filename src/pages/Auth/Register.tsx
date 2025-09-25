import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Eye, EyeOff, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../components/auth/AuthContext';
interface FormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  institution: string;
  role: 'student' | 'teacher' | 'admin';
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}
interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  institution?: string;
  password?: string;
  confirmPassword?: string;
  profileImage?: string;
  agreeToTerms?: string;
  general?: string;
}
const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const {
    register
  } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobileNumber: '',
    email: '',
    institution: '',
    role: 'student',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }
    // Mobile Number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
      isValid = false;
    }
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
      isValid = false;
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
      isValid = false;
    }
    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Conditions';
      isValid = false;
    }
    // Profile image validation
    if (!profileImage) {
      newErrors.profileImage = 'Please upload a profile image';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    
    // Handle checkbox separately since it doesn't exist on HTMLSelectElement
    const checked = (e.target as HTMLInputElement).checked;
    
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Please upload an image file (JPEG, PNG, or GIF)'
        }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Image size should not exceed 5MB'
        }));
        return;
      }
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
      // Clear error if exists
      if (errors.profileImage) {
        setErrors(prev => ({
          ...prev,
          profileImage: undefined
        }));
      }
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
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        institution: formData.institution,
        role: formData.role,
        isActive: true
      };

      await register(userData, formData.password);
      showToastNotification('success', 'Registration successful! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
      showToastNotification('error', error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="py-16 bg-secondary min-h-screen">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-text-secondary">
              Join Shah Sultan's IELTS Academy and start your journey to success
            </p>
          </div>
          {errors.general && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700" role="alert">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{errors.general}</span>
              </div>
            </div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="text-error">*</span>
                </label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={`form-input ${errors.fullName ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your full name" required aria-invalid={errors.fullName ? 'true' : 'false'} aria-describedby={errors.fullName ? 'fullName-error' : undefined} />
                {errors.fullName && <p id="fullName-error" className="form-error">
                    {errors.fullName}
                  </p>}
              </div>
              <div>
                <label htmlFor="mobileNumber" className="form-label">
                  Mobile Number <span className="text-error">*</span>
                </label>
                <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className={`form-input ${errors.mobileNumber ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your mobile number" required aria-invalid={errors.mobileNumber ? 'true' : 'false'} aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined} />
                {errors.mobileNumber && <p id="mobileNumber-error" className="form-error">
                    {errors.mobileNumber}
                  </p>}
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address <span className="text-error">*</span>
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`form-input ${errors.email ? 'border-error focus:ring-error' : ''}`} placeholder="Enter your email address" required aria-invalid={errors.email ? 'true' : 'false'} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <p id="email-error" className="form-error">
                    {errors.email}
                  </p>}
              </div>
              <div>
                <label htmlFor="institution" className="form-label">
                  Current Institution
                </label>
                <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleChange} className="form-input" placeholder="Enter your current institution" />
              </div>
              <div>
                <label htmlFor="role" className="form-label">
                  Role <span className="text-error">*</span>
                </label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-input">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="form-label">
                Profile Image <span className="text-error">*</span>
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {profilePreview ? <img className="h-16 w-16 object-cover rounded-full" src={profilePreview} alt="Profile preview" /> : <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>}
                </div>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input type="file" className={`block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary-light
                      ${errors.profileImage ? 'text-error' : ''}`} accept="image/*" onChange={handleImageChange} aria-invalid={errors.profileImage ? 'true' : 'false'} aria-describedby={errors.profileImage ? 'profileImage-error' : undefined} />
                </label>
              </div>
              {errors.profileImage && <p id="profileImage-error" className="form-error mt-2">
                  {errors.profileImage}
                </p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="password" className="form-label">
                  Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className={`form-input pr-10 ${errors.password ? 'border-error focus:ring-error' : ''}`} placeholder="Create a password" required aria-invalid={errors.password ? 'true' : 'false'} aria-describedby={errors.password ? 'password-error' : undefined} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password ? <p id="password-error" className="form-error">
                    {errors.password}
                  </p> : <p className="text-xs text-text-tertiary mt-1">
                    Password must be at least 8 characters long with at least
                    one uppercase letter and one number.
                  </p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`form-input pr-10 ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`} placeholder="Confirm your password" required aria-invalid={errors.confirmPassword ? 'true' : 'false'} aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p id="confirmPassword-error" className="form-error">
                    {errors.confirmPassword}
                  </p>}
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-start">
                <input type="checkbox" id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className={`h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded ${errors.agreeToTerms ? 'border-error' : ''}`} required aria-invalid={errors.agreeToTerms ? 'true' : 'false'} aria-describedby={errors.agreeToTerms ? 'agreeToTerms-error' : undefined} />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link to="/terms" className="text-accent hover:text-accent-dark font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-accent hover:text-accent-dark font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && <p id="agreeToTerms-error" className="form-error ml-6">
                  {errors.agreeToTerms}
                </p>}
            </div>
            <Button variant="primary" type="submit" fullWidth loading={isLoading} disabled={isLoading}>
              Create Account
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-dark font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {showToast && <div className={`fixed bottom-4 right-4 max-w-md w-full bg-white rounded-lg shadow-lg border-l-4 ${toastType === 'success' ? 'border-green-500' : 'border-red-500'} overflow-hidden`}>
          <div className="p-4 flex items-start">
            {toastType === 'success' ? <CheckCircle className="h-6 w-6 text-green-500 mr-3" /> : <AlertCircle className="h-6 w-6 text-red-500 mr-3" />}
            <div className="flex-1">
              <p className={`font-medium ${toastType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {toastType === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="mt-1 text-sm text-gray-600">{toastMessage}</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-500" aria-label="Close notification">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className={`h-1 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-shrink`}></div>
        </div>}
    </div>;
};
export default RegisterPage;