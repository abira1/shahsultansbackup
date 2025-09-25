import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon,
  SaveIcon,
  XIcon,
  PlusIcon,
  TagIcon,
  FileTextIcon,
  PenIcon
} from 'lucide-react';
import { writingService } from '../../../services/writingService';
import { WritingTrack } from '../../../types/writing';

const EditWritingTrack: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  
  const [track, setTrack] = useState<WritingTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testType, setTestType] = useState<'academic' | 'general'>('academic');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (trackId) {
      loadTrack();
    }
  }, [trackId]);

  const loadTrack = async () => {
    if (!trackId) return;
    
    try {
      setLoading(true);
      const trackData = await writingService.getTrack(trackId);
      if (trackData) {
        setTrack(trackData);
        setTitle(trackData.title);
        setDescription(trackData.description || '');
        setTestType(trackData.testType);
        setTags(trackData.tags || []);
      }
    } catch (error) {
      console.error('Error loading track:', error);
      alert('Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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
    
    if (!trackId || !track) return;
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    setSaving(true);
    
    try {
      const updatedTrack: Partial<WritingTrack> = {
        title: title.trim(),
        description: description.trim() || undefined,
        testType,
        tags: tags.filter(tag => tag.trim()).map(tag => tag.trim())
      };

      await writingService.updateTrack(trackId, updatedTrack);
      alert('Writing track updated successfully!');
      navigate('/admin/writing/tracks');
    } catch (error) {
      console.error('Error updating track:', error);
      alert('Failed to update writing track');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/writing/tracks');
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

  if (!track) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <FileTextIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track not found</h3>
            <p className="text-gray-600 mb-4">The requested writing track could not be found.</p>
            <button
              onClick={() => navigate('/admin/writing/tracks')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Tracks
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/writing/tracks')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Writing Track</h1>
              <p className="text-gray-600">Update track information and settings</p>
            </div>
          </div>
        </div>

        {/* Track Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Task 1</p>
                <p className="text-lg font-semibold">
                  {track.task1.instruction ? 'Complete' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PenIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Task 2</p>
                <p className="text-lg font-semibold">
                  {track.task2.instruction ? 'Complete' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                track.isPublished ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <div className={`h-5 w-5 rounded-full ${
                  track.isPublished ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">
                  {track.isPublished ? 'Published' : 'Draft'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Track Information</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Track Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter track title..."
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter track description..."
              />
            </div>

            <div>
              <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-1">
                Test Type *
              </label>
              <select
                id="testType"
                value={testType}
                onChange={(e) => setTestType(e.target.value as 'academic' | 'general')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              >
                <option value="academic">Academic</option>
                <option value="general">General Training</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Academic: Charts, graphs, processes for Task 1. General: Letters for Task 1.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-600 transition-colors"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Current Task Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Current Task Status:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Task 1 - {track.task1.taskType.charAt(0).toUpperCase() + track.task1.taskType.slice(1)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {track.task1.instruction ? '✅ Instructions added' : '⚠️ Instructions needed'}
                    {track.task1.imageUrl ? ' • ✅ Image uploaded' : ' • 📷 No image'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-green-900 mb-2">
                    Task 2 - {track.task2.essayType.charAt(0).toUpperCase() + track.task2.essayType.slice(1)} Essay
                  </h4>
                  <p className="text-sm text-gray-600">
                    {track.task2.instruction ? '✅ Question/prompt added' : '⚠️ Question needed'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SaveIcon className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/admin/writing/tracks/${trackId}/tasks`)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Tasks
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditWritingTrack;