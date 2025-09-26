import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, BookOpenIcon, FileTextIcon, UsersIcon, BarChartIcon, LogOutIcon } from 'lucide-react';
const Sidebar: React.FC = () => {
  const location = useLocation();
  const menuItems = [{
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboardIcon className="h-5 w-5" />
  }, {
    name: 'Course Management',
    path: '/admin/courses',
    icon: <BookOpenIcon className="h-5 w-5" />
  }, {
    name: 'Question Upload',
    path: '/admin/questions/upload',
    icon: <FileTextIcon className="h-5 w-5" />
  }, {
    name: 'Results Management',
    path: '/admin/results',
    icon: <BarChartIcon className="h-5 w-5" />
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
  return <div className="bg-slate-50 border-r border-slate-200 h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-200 bg-white">
        <Link to="/admin/dashboard" className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
        </Link>
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
    </div>;
};
export default Sidebar;