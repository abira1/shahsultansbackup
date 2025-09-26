import React from 'react';
import { Link } from 'react-router-dom';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  href,
  to,
  type = 'button',
  onClick,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-center';
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-light focus:ring-accent disabled:bg-gray-300',
    secondary: 'bg-primary text-white hover:bg-primary-light focus:ring-primary disabled:bg-gray-300',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300'
  };
  const sizeClasses = {
    sm: 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm',
    md: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
    lg: 'px-5 sm:px-8 py-2.5 sm:py-4 text-base sm:text-lg'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'cursor-not-allowed' : '';
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`;
  if (loading) {
    return <button type={type} className={buttonClasses} disabled={true}>
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>;
  }
  if (href) {
    return <a href={href} className={buttonClasses} target="_blank" rel="noopener noreferrer">
        {children}
      </a>;
  }
  if (to) {
    return <Link to={to} className={buttonClasses}>
        {children}
      </Link>;
  }
  return <button type={type} className={buttonClasses} disabled={disabled} onClick={onClick}>
      {children}
    </button>;
};
export default Button;