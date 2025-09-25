import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, User, Menu, X, LogOut, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Overview from './Overview';
import Exams from './Exams';
import Results from './Results';
import Profile from './Profile';
const StudentDashboard: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (newIsMobile) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      if (isMobile && isSidebarOpen && sidebar && !sidebar.contains(event.target as Node) && menuButton && !menuButton.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };
  const isActive = (path: string) => {
    return location.pathname === `/dashboard${path}`;
  };
  const navItems = [{
    name: 'Overview',
    path: '',
    icon: <LayoutDashboard className="h-4 w-4" />,
    ariaLabel: 'Dashboard overview'
  }, {
    name: 'Exams',
    path: '/exams',
    icon: <FileText className="h-4 w-4" />,
    ariaLabel: 'Available exams'
  }, {
    name: 'Results',
    path: '/results',
    icon: <BarChart2 className="h-4 w-4" />,
    ariaLabel: 'Test results'
  }, {
    name: 'Profile',
    path: '/profile',
    icon: <User className="h-4 w-4" />,
    ariaLabel: 'User profile'
  }];
  return <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top navigation - Mobile only */}
      <header className="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button id="menu-button" onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100" aria-expanded={isSidebarOpen} aria-label="Toggle menu">
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <span className="ml-3 text-base font-medium text-gray-800">
              {navItems.find(item => isActive(item.path))?.name || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Link to="/dashboard/profile" className="p-2 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Profile">
              <User className="h-4 w-4 text-gray-700" />
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />}
        {/* Sidebar */}
        <aside id="sidebar" className={`
            fixed lg:sticky top-0 h-full z-40
            bg-white border-r border-gray-100
            transition-all duration-300 ease-in-out
            ${isMobile ? isSidebarOpen ? 'left-0' : '-left-64' : 'left-0'}
            ${isMobile ? 'w-64' : isSidebarExpanded ? 'w-64' : 'w-20'}
          `}>
          <div className="flex flex-col h-full">
            {/* Profile section */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" className="h-full w-full object-cover" />
                </div>
                {isSidebarExpanded && !isMobile && <div>
                    <p className="font-medium text-sm text-gray-900">
                      John Smith
                    </p>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>}
              </div>
              {/* Mobile close button */}
              {isMobile ? <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-gray-100" aria-label="Close menu">
                  <X className="h-4 w-4 text-gray-500" />
                </button> : <button onClick={toggleSidebar} className="hidden lg:block p-1 rounded-md hover:bg-gray-100" aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
                  {isSidebarExpanded ? <ChevronsLeft className="h-4 w-4 text-gray-500" /> : <ChevronsRight className="h-4 w-4 text-gray-500" />}
                </button>}
            </div>
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-3 space-y-1">
                {navItems.map(item => <Link key={item.path} to={`/dashboard${item.path}`} className={`
                      flex items-center px-3 py-2 rounded-md text-sm
                      transition-colors group relative
                      ${isActive(item.path) ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}
                    `} onClick={() => isMobile && setIsSidebarOpen(false)} aria-current={isActive(item.path) ? 'page' : undefined} aria-label={item.ariaLabel}>
                    <span className="flex items-center justify-center w-6">
                      {item.icon}
                    </span>
                    {(isSidebarExpanded || isMobile) && <span className="ml-3">{item.name}</span>}
                    {isActive(item.path) && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md"></span>}
                    {!isActive(item.path) && isSidebarExpanded && !isMobile && <ChevronRight className="ml-auto h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />}
                  </Link>)}
              </div>
            </nav>
            {/* Logout */}
            <div className="p-3 border-t border-gray-100">
              <Link to="/logout" className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors" aria-label="Log out">
                <span className="flex items-center justify-center w-6">
                  <LogOut className="h-4 w-4" />
                </span>
                {(isSidebarExpanded || isMobile) && <span className="ml-3">Logout</span>}
              </Link>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Overview />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>;
};
export default StudentDashboard;