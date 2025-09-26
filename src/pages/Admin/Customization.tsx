import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Image, 
  Users, 
  BookOpen, 
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { customizationService, HeroData, Teacher, Course } from '../../services/customizationService';

// Tab Components
import HeroTab from '../../components/admin/customization/HeroTab';
import TeachersTab from '../../components/admin/customization/TeachersTab';
import CoursesTab from '../../components/admin/customization/CoursesTab';

type Tab = 'hero' | 'teachers' | 'courses';

interface CustomizationProps {}

const Customization: React.FC<CustomizationProps> = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data states
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Shah Sultan's IELTS Academy",
    subtitle: "Your path to IELTS success"
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Load initial data
  useEffect(() => {
    loadCustomizationData();
  }, []);

  const loadCustomizationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [heroResult, teachersResult, coursesResult] = await Promise.all([
        customizationService.getHeroData(),
        customizationService.getTeachers(),
        customizationService.getCourses()
      ]);

      setHeroData(heroResult);
      setTeachers(teachersResult);
      setCourses(coursesResult);
    } catch (err) {
      console.error('Error loading customization data:', err);
      setError('Failed to load customization data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show success message temporarily
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Tab configuration
  const tabs = [
    {
      id: 'hero' as Tab,
      label: 'Hero Section',
      icon: Image,
      description: 'Customize homepage hero section'
    },
    {
      id: 'teachers' as Tab,
      label: 'Teachers',
      icon: Users,
      description: 'Manage teaching staff profiles'
    },
    {
      id: 'courses' as Tab,
      label: 'Courses',
      icon: BookOpen,
      description: 'Manage course offerings'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading customization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Website Customization
                  </h1>
                  <p className="text-sm text-gray-600">
                    Customize your website content and appearance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Save className="w-5 h-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`flex-shrink-0 w-5 h-5 mr-3 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className={`text-xs ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Teachers</span>
                  <span className="text-sm font-medium text-gray-900">
                    {teachers.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Courses</span>
                  <span className="text-sm font-medium text-gray-900">
                    {courses.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Courses</span>
                  <span className="text-sm font-medium text-gray-900">
                    {courses.filter(c => c.isActive).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-3">
            <div className="bg-white shadow rounded-lg">
              {/* Tab Content */}
              {activeTab === 'hero' && (
                <HeroTab
                  heroData={heroData}
                  onHeroUpdate={(newHeroData: HeroData) => {
                    setHeroData(newHeroData);
                    showSuccessMessage('Hero section updated successfully!');
                  }}
                  onError={setError}
                />
              )}

              {activeTab === 'teachers' && (
                <TeachersTab
                  teachers={teachers}
                  onTeachersUpdate={(newTeachers: Teacher[]) => {
                    setTeachers(newTeachers);
                    showSuccessMessage('Teachers updated successfully!');
                  }}
                  onError={setError}
                />
              )}

              {activeTab === 'courses' && (
                <CoursesTab
                  courses={courses}
                  onCoursesUpdate={(newCourses: Course[]) => {
                    setCourses(newCourses);
                    showSuccessMessage('Courses updated successfully!');
                  }}
                  onError={setError}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;