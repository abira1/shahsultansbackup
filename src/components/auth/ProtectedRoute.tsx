import React from 'react';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
  userRole?: 'student' | 'teacher' | 'admin';
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  requiredRole,
  userRole
}) => {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // If a specific role is required and user doesn't have it, redirect to appropriate page
  if (requiredRole && userRole !== requiredRole) {
    // Students go to student dashboard, others to home page
    const redirectPath = userRole === 'student' ? '/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;