import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon, 
  SaveIcon,
  BookOpenIcon,
  FileTextIcon,
  PlusIcon,
  InfoIcon
} from 'lucide-react';
import { readingService } from '../../../services/readingService';
import { ReadingTrackFormData, ReadingQuestionDifficulty } from '../../../types/reading';

const CreateReadingTrack: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testType, setTestType] = useState<'academic' | 'general'>('academic');
  const [difficulty, setDifficulty] = useState<ReadingQuestionDifficulty>('medium');
  const [tags, setTags] = useState<string[]>(['']);

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!title.trim()) {
      errors.push('Track title is required');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    setSaving(true);
    
    try {
      const trackData: ReadingTrackFormData = {
        title: title.trim(),
        description: description.trim() || undefined,
        testType,
        difficulty,
        tags: tags.filter(tag => tag.trim()).map(tag => tag.trim())
      };

      const trackId = await readingService.createTrack(trackData);
      alert('Reading track created successfully!');
      navigate(`/admin/reading/tracks/${trackId}/passages`);
    } catch (error) {
      console.error('Error creating track:', error);
      alert('Failed to create reading track');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/reading/tracks')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Reading Track</h1>
            <p className="text-gray-600">
              Set up a new IELTS Reading test with passages and questions
            </p>
          </div>
        </div>

        {/* Track Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Track Information</h2>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Track Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Cambridge Reading Test 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type *
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as 'academic' | 'general')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="academic">Academic</option>
                  <option value="general">General Training</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as ReadingQuestionDifficulty)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the reading track content and focus areas..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="Enter tag (e.g., Science, History, Technology)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    {tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Test Structure Info */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Reading Track Structure</h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong>Standard IELTS Reading Format:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>3 Passages:</strong> You'll add content to each passage after creating the track</li>
                    <li><strong>40 Questions Total:</strong> Typically 12-14 questions per passage</li>
                    <li><strong>60 Minutes:</strong> Standard time allocation for the complete test</li>
                    <li><strong>12+ Question Types:</strong> Multiple choice, True/False/Not Given, matching, completion tasks, etc.</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-100 rounded">
                    <p><strong>Next Steps:</strong> After creating this track, you'll:</p>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                      <li>Add content to each of the 3 passages</li>
                      <li>Create questions for each passage</li>
                      <li>Review and publish your track</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin/reading/tracks')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4" />
                  Create Track
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileTextIcon className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <h4 className="font-semibold mb-2">Reading Track Creation Tips:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Choose descriptive titles that indicate the test level and content</li>
                <li>Academic tests typically focus on academic topics (science, research, education)</li>
                <li>General Training tests focus on everyday topics (workplace, community, social situations)</li>
                <li>Use tags to categorize by topics, making tracks easier to find and organize</li>
                <li>You can always edit track information after creation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateReadingTrack;