import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon, 
  PlusIcon,
  EditIcon,
  TrashIcon,
  PlayIcon,
  FileTextIcon,
  ClockIcon,
  FileQuestionIcon,
  SaveIcon
} from 'lucide-react';
import { testService, sectionService, questionService } from '../../services/examService';
import { Test, Section, Question } from '../../types/exam';

interface SectionFormData {
  title: string;
  testType: 'listening' | 'reading' | 'writing' | 'speaking';
  instructions: string;
  timeLimit?: number;
  passageText?: string;
  audioUrl?: string;
}

const SectionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  
  const [test, setTest] = useState<Test | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [questions, setQuestions] = useState<{ [sectionId: string]: Question[] }>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<SectionFormData>({
    title: '',
    testType: 'reading',
    instructions: '',
    timeLimit: 60,
    passageText: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (testId) {
      loadTestData();
    }
  }, [testId]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      if (!testId) return;

      // Load test
      const testData = await testService.getById(testId);
      setTest(testData);

      // Load sections
      const sectionsData = await sectionService.getByTestId(testId);
      setSections(sectionsData);

      // Load questions for each section
      const questionsData: { [sectionId: string]: Question[] } = {};
      for (const section of sectionsData) {
        questionsData[section.id] = await questionService.getBySectionId(section.id);
      }
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading test data:', error);
      alert('Failed to load test data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Section title is required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (formData.timeLimit && formData.timeLimit <= 0) {
      newErrors.timeLimit = 'Time limit must be greater than 0';
    }

    if (['reading', 'writing'].includes(formData.testType) && !formData.passageText?.trim()) {
      newErrors.passageText = 'Passage text is required for reading/writing sections';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !testId) return;

    try {
      const sectionData: Omit<Section, 'id' | 'createdAt' | 'updatedAt'> = {
        testId,
        ...formData,
        sectionNumber: editingSection ? editingSection.sectionNumber : sections.length + 1,
        questions: editingSection ? editingSection.questions : []
      };

      if (editingSection) {
        await sectionService.update(editingSection.id, sectionData);
        alert('Section updated successfully!');
      } else {
        await sectionService.create(sectionData);
        alert('Section created successfully!');
      }

      // Reset form and reload data
      setFormData({
        title: '',
        testType: 'reading',
        instructions: '',
        timeLimit: 60,
        passageText: ''
      });
      setShowCreateForm(false);
      setEditingSection(null);
      loadTestData();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section? All questions in this section will also be deleted.')) {
      return;
    }

    try {
      await sectionService.delete(sectionId);
      alert('Section deleted successfully!');
      loadTestData();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      testType: section.testType,
      instructions: section.instructions,
      timeLimit: section.timeLimit,
      passageText: section.passageText || '',
      audioUrl: section.audioUrl || ''
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      testType: 'reading',
      instructions: '',
      timeLimit: 60,
      passageText: ''
    });
    setEditingSection(null);
    setShowCreateForm(false);
    setErrors({});
  };

  const getSectionIcon = (testType: string) => {
    switch (testType) {
      case 'listening': return <PlayIcon className="h-5 w-5" />;
      case 'reading': return <FileTextIcon className="h-5 w-5" />;
      case 'writing': return <EditIcon className="h-5 w-5" />;
      case 'speaking': return <PlayIcon className="h-5 w-5" />;
      default: return <FileTextIcon className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {test?.title} - Sections
              </h1>
              <p className="text-gray-600">
                Manage test sections and questions
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Section
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections List */}
          <div className="lg:col-span-2">
            {sections.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
                <p className="text-gray-600 mb-4">
                  Start by creating your first section for this test.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Section
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {getSectionIcon(section.testType)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {section.testType} Section
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSection(section)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4" />
                        {section.timeLimit ? `${section.timeLimit} mins` : 'No limit'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileQuestionIcon className="h-4 w-4" />
                        {questions[section.id]?.length || 0} questions
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {section.instructions}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/tests/${testId}/sections/${section.id}/questions`)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                      >
                        Manage Questions
                      </button>
                      <button
                        onClick={() => navigate(`/admin/tests/${testId}/sections/${section.id}/questions/new`)}
                        className="border border-primary text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/5 transition-colors"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingSection ? 'Edit Section' : 'Create Section'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Reading Passage 1"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Type *
                    </label>
                    <select
                      value={formData.testType}
                      onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="listening">Listening</option>
                      <option value="reading">Reading</option>
                      <option value="writing">Writing</option>
                      <option value="speaking">Speaking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.timeLimit || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="60"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions *
                    </label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.instructions ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Instructions for this section..."
                    />
                    {errors.instructions && (
                      <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>
                    )}
                  </div>

                  {['reading', 'writing'].includes(formData.testType) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passage Text *
                      </label>
                      <textarea
                        value={formData.passageText || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, passageText: e.target.value }))}
                        rows={6}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.passageText ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter the reading passage or writing prompt..."
                      />
                      {errors.passageText && (
                        <p className="mt-1 text-sm text-red-600">{errors.passageText}</p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <SaveIcon className="h-4 w-4" />
                    {editingSection ? 'Update Section' : 'Create Section'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SectionManagement;