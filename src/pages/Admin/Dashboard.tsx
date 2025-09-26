import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  PlusIcon, 
  BookOpenIcon, 
  FileTextIcon,
  UsersIcon,
  ClockIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  Settings,
  BarChart3
} from 'lucide-react';

interface DashboardStats {
  tracks: { total: number; published: number; drafts: number };
  exams: { total: number; active: number; completed: number };
  students: { total: number; pending: number; approved: number };
  attempts: { inProgress: number; completed: number; todayCount: number };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    tracks: { total: 0, published: 0, drafts: 0 },
    exams: { total: 0, active: 0, completed: 0 },
    students: { total: 0, pending: 0, approved: 0 },
    attempts: { inProgress: 0, completed: 0, todayCount: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // TODO: Replace with real API calls
      // Simulated data for now
      setStats({
        tracks: { total: 24, published: 18, drafts: 6 },
        exams: { total: 12, active: 3, completed: 9 },
        students: { total: 156, pending: 8, approved: 148 },
        attempts: { inProgress: 12, completed: 234, todayCount: 15 }
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to Shah Sultan's IELTS Academy Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/upload')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Create Track
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tracks Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tracks.total}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-green-600">{stats.tracks.published} Published</span>
                  <span className="text-yellow-600">{stats.tracks.drafts} Drafts</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Exams Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exams</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.exams.total}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-green-600">{stats.exams.active} Active</span>
                  <span className="text-gray-500">{stats.exams.completed} Completed</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Students Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.students.total}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-green-600">{stats.students.approved} Approved</span>
                  <span className="text-orange-600">{stats.students.pending} Pending</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Attempts Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Activity</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.attempts.todayCount}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-blue-600">{stats.attempts.inProgress} In Progress</span>
                  <span className="text-gray-500">{stats.attempts.completed} Total</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUpIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/upload')}
              className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create Track</h3>
                  <p className="text-sm text-gray-600">Upload new content and questions</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/exams')}
              className="p-4 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <BookOpenIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Exams</h3>
                  <p className="text-sm text-gray-600">Create and schedule exams</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/students')}
              className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <UsersIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Review Students</h3>
                  <p className="text-sm text-gray-600">Approve pending registrations</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/results')}
              className="p-4 text-left rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Review Results</h3>
                  <p className="text-sm text-gray-600">Grade and publish results</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="p-4 text-left rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Settings className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Configure system preferences</p>
                </div>
              </div>
            </button>

            {stats.students.pending > 0 && (
              <button
                onClick={() => navigate('/admin/students?filter=pending')}
                className="p-4 text-left rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg">
                    <AlertCircleIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Pending Approvals</h3>
                    <p className="text-sm text-orange-700">{stats.students.pending} students awaiting approval</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New student registered</p>
                <p className="text-xs text-gray-500">Sarah Johnson • 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileTextIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Track "Advanced Reading" published</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Exam attempt completed</p>
                <p className="text-xs text-gray-500">Michael Chen • 1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
