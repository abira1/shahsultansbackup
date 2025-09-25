import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, X as CloseIcon, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import Logo from '../ui/Logo';
interface NavbarProps {
  isLoggedIn?: boolean;
  minimal?: boolean;
  userRole?: 'student' | 'teacher' | 'admin';
}
const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = false,
  minimal = false,
  userRole = 'student'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  // Handle click outside to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  // Determine nav links based on login status and role
  let navLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Teachers',
    path: '/teachers'
  }, {
    name: 'Courses',
    path: '/courses'
  }];
  // Add appropriate dashboard link based on user role
  if (isLoggedIn) {
    if (userRole === 'student') {
      navLinks.push({
        name: 'Student Panel',
        path: '/dashboard'
      });
    } else {
      navLinks.push({
        name: 'Teacher/Admin Panel',
        path: '/admin'
      });
    }
  }
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  if (minimal) {
    return <header className="bg-white py-4 shadow-sm">
        <div className="container flex justify-center">
          <Logo navbarLogo={true} />
        </div>
      </header>;
  }
  return <header className="bg-white text-primary shadow-md sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Shah Sultan's IELTS Academy Home">
              <Logo navbarLogo={true} />
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors relative hover:text-accent focus:text-accent focus:outline-none ${isActive(link.path) ? 'text-accent' : 'text-primary'}`} aria-current={isActive(link.path) ? 'page' : undefined}>
                {link.name}
                {isActive(link.path) && <span className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-accent"></span>}
              </Link>)}
            {isLoggedIn ? <div className="relative" ref={profileDropdownRef}>
                <button className="flex items-center text-sm font-medium text-primary hover:text-accent focus:text-accent focus:outline-none" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} onKeyDown={e => handleKeyDown(e, () => setIsProfileDropdownOpen(!isProfileDropdownOpen))} aria-expanded={isProfileDropdownOpen} aria-haspopup="true">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span>My Account</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {isProfileDropdownOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link to={userRole === 'student' ? '/dashboard/profile' : '/admin/profile'} className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary">
                      Profile
                    </Link>
                    <Link to={userRole === 'student' ? '/dashboard' : '/admin'} className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary">
                      Dashboard
                    </Link>
                    <Link to="/logout" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary border-t border-gray-100">
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </div>
                    </Link>
                  </div>}
              </div> : <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-outline text-sm py-2 px-4 rounded-md border border-primary text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 rounded-md bg-accent text-white hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-white transition-colors">
                  Enroll Now
                </Link>
              </div>}
          </div>
          {/* Mobile Navigation Toggle */}
          <button className="md:hidden text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white rounded-md p-1" onClick={() => setIsMenuOpen(!isMenuOpen)} onKeyDown={e => handleKeyDown(e, () => setIsMenuOpen(!isMenuOpen))} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen} aria-controls="mobile-menu">
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </nav>
        {/* Mobile Navigation Menu */}
        <div id="mobile-menu" ref={menuRef} className={`md:hidden fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} onKeyDown={e => handleKeyDown(e, () => setIsMenuOpen(false))} className="text-primary p-1 hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Close menu">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-2 px-4">
                {navLinks.map(link => <Link key={link.path} to={link.path} className={`block py-3 px-4 rounded-md transition-colors ${isActive(link.path) ? 'bg-primary/10 text-accent font-medium border-l-2 border-accent' : 'text-primary hover:bg-gray-100'}`} aria-current={isActive(link.path) ? 'page' : undefined}>
                    {link.name}
                  </Link>)}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              {isLoggedIn ? <div className="space-y-2">
                  <div className="flex items-center p-2 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        John Smith
                      </p>
                      <p className="text-xs text-text-secondary">
                        {userRole === 'student' ? 'Student' : 'Staff'}
                      </p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="flex items-center w-full py-2 px-4 rounded-md text-primary hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Student Panel</span>
                  </Link>
                  <Link to="/logout" className="flex items-center w-full py-2 px-4 rounded-md text-primary hover:bg-gray-100 transition-colors">
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </Link>
                </div> : <div className="space-y-3">
                  <Link to="/login" className="block w-full text-center py-2 px-4 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="block w-full text-center py-2 px-4 bg-accent text-white rounded-md hover:bg-accent-light transition-colors">
                    Enroll Now
                  </Link>
                </div>}
            </div>
          </div>
        </div>
        {/* Overlay for mobile menu */}
        {isMenuOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />}
      </div>
    </header>;
};
export default Navbar;