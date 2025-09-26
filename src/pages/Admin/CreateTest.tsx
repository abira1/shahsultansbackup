import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon, 
  SaveIcon, 
  PlusIcon,
  UploadIcon,
  CheckIcon,
  AlertCircleIcon
} from 'lucide-react';
import { testService } from '../../services/examService';
import { TestType } from '../../types/exam';

interface TestFormData {
  title: string;
  description: string;
  type: TestType;
  duration: number;
  isActive: boolean;
  isPublished: boolean;
}

const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TestFormData>({
    title: '',
    description: '',
    type: 'listening',
    duration: 180,
    isActive: true,
    isPublished: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Test title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Test description is required';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const testId = await testService.create({
        ...formData,
        totalQuestions: 0,
        sections: [],
        createdBy: 'admin' // Replace with actual admin ID
      });

      alert('Test created successfully!');
      navigate(`/admin/tests/${testId}/sections`);
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const draftData = { ...formData, isPublished: false };
    setFormData(draftData);
    handleSubmit(new Event('submit') as any);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Test</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAsDraft}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <SaveIcon className="h-4 w-4" />
              )}
              Create Test
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., IELTS Practice Test 1"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as TestType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="listening">Listening</option>
                    <option value="reading">Reading</option>
                    <option value="writing">Writing</option>
                    <option value="speaking">Speaking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="180"
                    min="1"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe what this test covers..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircleIcon className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Next Steps Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Next Steps</h3>
              <p className="text-blue-700 mb-4">
                After creating this test, you'll be able to:
              </p>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                  Add sections to organize your questions
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                  Upload audio files for listening sections
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                  Create different types of questions (MCQ, Fill-in-blank, etc.)
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                  Preview and test your exam before publishing
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateTest;