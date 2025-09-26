import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, BookOpenIcon, FileTextIcon, UsersIcon, BarChartIcon, MenuIcon, X as CloseIcon, LogOutIcon, BellIcon, UserIcon, ChevronDownIcon } from 'lucide-react';
import Logo from '../ui/Logo';
// import { useAuth } from '../auth/AuthContext';
interface AdminLayoutProps {
  children: React.ReactNode;
}
const AdminLayout: React.FC<AdminLayoutProps> = ({
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  // const { logout } = useAuth(); // Uncomment when needed
  const menuItems = [{
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboardIcon className="h-5 w-5" />
  }, {
    name: 'Upload Tracks',
    path: '/admin/upload',
    icon: <FileTextIcon className="h-5 w-5" />
  }, {
    name: 'Manage Exams',
    path: '/admin/exams',
    icon: <BookOpenIcon className="h-5 w-5" />
  }, {
    name: 'User Management',
    path: '/admin/users',
    icon: <UsersIcon className="h-5 w-5" />
  }, {
    name: 'Reports',
    path: '/admin/reports',
    icon: <BarChartIcon className="h-5 w-5" />
  }];
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  return <div className="flex h-screen bg-secondary">
      {/* Sidebar for desktop */}
      <div className={`bg-slate-50 border-r border-slate-200 w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static shadow-sm`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-slate-200 bg-white px-4">
            <Link to="/admin" className="flex items-center">
              <Logo navbarLogo={true} />
            </Link>
            <button className="md:hidden absolute right-4 text-slate-600 focus:outline-none" onClick={toggleSidebar}>
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto py-6">
            <nav className="px-4 space-y-2">
              {menuItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path) ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}>
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>)}
            </nav>
          </div>
          <div className="p-4 border-t border-slate-200 bg-white">
            <Link to="/logout" className="flex items-center px-4 py-3 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all duration-200">
              <LogOutIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-secondary-dark h-16 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center">
            <button className="md:hidden text-primary focus:outline-none mr-4" onClick={toggleSidebar}>
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-primary hidden md:block">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-text-secondary hover:text-primary focus:outline-none">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            <div className="relative" ref={node => {
            // This is a simplified version of a click-outside handler
            if (node) {
              const handleClickOutside = (e: MouseEvent) => {
                if (node && !node.contains(e.target as Node)) {
                  setIsProfileDropdownOpen(false);
                }
              };
              document.addEventListener('mousedown', handleClickOutside);
              return () => {
                document.removeEventListener('mousedown', handleClickOutside);
              };
            }
          }}>
              <button className="flex items-center text-sm font-medium text-primary focus:outline-none" onClick={toggleProfileDropdown}>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <UserIcon className="h-4 w-4" />
                </div>
                <span className="hidden md:block">Admin User</span>
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </button>
              {isProfileDropdownOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link to="/admin/profile" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary">
                    Profile
                  </Link>
                  <Link to="/admin/settings" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary">
                    Settings
                  </Link>
                  <Link to="/logout" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary border-t border-gray-100">
                    <div className="flex items-center">
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </div>
                  </Link>
                </div>}
            </div>
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-secondary">{children}</main>
      </div>
    </div>;
};
export default AdminLayout;