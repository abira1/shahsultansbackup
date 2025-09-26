import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Users, 
  BookOpen, 
  FileText,
  Settings,
  Activity,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { customizationService } from '../../services/customizationService';
import { trackManagementService } from '../../services/trackManagementService';
import { resultsService } from '../../services/resultsService';

interface SystemStatus {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastChecked: Date;
  details?: any;
}

const SystemMonitor: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkSystemHealth = async () => {
    setLoading(true);
    const status: SystemStatus[] = [];

    // Check Firebase Connection
    try {
      await customizationService.getHeroData();
      status.push({
        component: 'Firebase Connection',
        status: 'healthy',
        message: 'Connected and responsive',
        lastChecked: new Date()
      });
    } catch (error) {
      status.push({
        component: 'Firebase Connection',
        status: 'error',
        message: 'Connection failed',
        lastChecked: new Date(),
        details: error
      });
    }

    // Check Customization Service
    try {
      const [heroData, teachers, courses] = await Promise.all([
        customizationService.getHeroData(),
        customizationService.getTeachers(),
        customizationService.getCourses()
      ]);

      status.push({
        component: 'Customization System',
        status: 'healthy',
        message: `Hero: ✓, Teachers: ${teachers.length}, Courses: ${courses.length}`,
        lastChecked: new Date(),
        details: { heroData, teachersCount: teachers.length, coursesCount: courses.length }
      });
    } catch (error) {
      status.push({
        component: 'Customization System',
        status: 'error',
        message: 'Service unavailable',
        lastChecked: new Date(),
        details: error
      });
    }

    // Check Track Management
    try {
      const [listeningTracks, readingTracks, writingTracks, exams] = await Promise.all([
        trackManagementService.getAllTracks('listening'),
        trackManagementService.getAllTracks('reading'),
        trackManagementService.getAllTracks('writing'),
        trackManagementService.getAllExams()
      ]);

      const totalTracks = Object.keys(listeningTracks).length + 
                         Object.keys(readingTracks).length + 
                         Object.keys(writingTracks).length;

      status.push({
        component: 'Track Management',
        status: totalTracks > 0 ? 'healthy' : 'warning',
        message: `Tracks: ${totalTracks}, Exams: ${Object.keys(exams).length}`,
        lastChecked: new Date(),
        details: { 
          listening: Object.keys(listeningTracks).length,
          reading: Object.keys(readingTracks).length,
          writing: Object.keys(writingTracks).length,
          exams: Object.keys(exams).length
        }
      });
    } catch (error) {
      status.push({
        component: 'Track Management',
        status: 'error',
        message: 'Service unavailable',
        lastChecked: new Date(),
        details: error
      });
    }

    // Check Results System
    try {
      const results = await resultsService.getAllResults();
      const pendingResults = results.filter(r => r.status === 'submitted').length;
      const publishedResults = results.filter(r => r.published).length;

      status.push({
        component: 'Results System',
        status: 'healthy',
        message: `Total: ${results.length}, Pending: ${pendingResults}, Published: ${publishedResults}`,
        lastChecked: new Date(),
        details: { total: results.length, pending: pendingResults, published: publishedResults }
      });
    } catch (error) {
      status.push({
        component: 'Results System',
        status: 'error',
        message: 'Service unavailable',
        lastChecked: new Date(),
        details: error
      });
    }

    setSystemStatus(status);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const healthyCount = systemStatus.filter(s => s.status === 'healthy').length;
  const warningCount = systemStatus.filter(s => s.status === 'warning').length;
  const errorCount = systemStatus.filter(s => s.status === 'error').length;

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="w-8 h-8 mr-3 text-blue-600" />
            System Monitor
          </h1>
          <button
            onClick={checkSystemHealth}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <p className="text-gray-600 mt-2">
          Last updated: {lastUpdate.toLocaleString()}
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-700">{healthyCount}</p>
              <p className="text-green-600">Healthy</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-700">{warningCount}</p>
              <p className="text-yellow-600">Warnings</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-700">{errorCount}</p>
              <p className="text-red-600">Errors</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{systemStatus.length}</p>
              <p className="text-blue-600">Components</p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Status */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Component Status</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Checking system health...</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {systemStatus.map((component, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(component.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(component.status)}
                    <h3 className="text-lg font-medium text-gray-900 ml-3">
                      {component.component}
                    </h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {component.lastChecked.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{component.message}</p>
                {component.details && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer">
                      View details
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
                      {JSON.stringify(component.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => window.open('http://localhost:5173/admin/customization', '_blank')}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Customization
          </button>
          <button
            onClick={() => window.open('http://localhost:5173/admin/upload-tracks', '_blank')}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Upload Tracks
          </button>
          <button
            onClick={() => window.open('http://localhost:5173/admin/manage-exams', '_blank')}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            Manage Exams
          </button>
          <button
            onClick={() => window.open('http://localhost:5173/admin/results', '_blank')}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Users className="w-4 h-4 mr-2" />
            Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;