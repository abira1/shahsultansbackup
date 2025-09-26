import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon,
  SaveIcon,
  UploadIcon,
  ImageIcon,
  FileTextIcon,
  PenIcon,
  XIcon,
  CheckCircleIcon,
  AlertTriangleIcon
} from 'lucide-react';
import { writingService } from '../../../services/writingService';
import { WritingTrack, WritingTask1FormData, WritingTask2FormData, TASK1_TYPES, TASK2_TYPES } from '../../../types/writing';

const TaskManagement: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  
  const [track, setTrack] = useState<WritingTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingTask1, setSavingTask1] = useState(false);
  const [savingTask2, setSavingTask2] = useState(false);
  
  // Task 1 form states
  const [task1Form, setTask1Form] = useState<WritingTask1FormData>({
    instruction: '',
    passage: '',
    taskType: 'chart',
    imageFile: undefined
  });
  
  // Task 2 form states
  const [task2Form, setTask2Form] = useState<WritingTask2FormData>({
    instruction: '',
    passage: '',
    essayType: 'opinion'
  });

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
        
        // Populate form data
        setTask1Form({
          instruction: trackData.task1.instruction,
          passage: trackData.task1.passage || '',
          taskType: trackData.task1.taskType,
          imageFile: undefined
        });
        
        setTask2Form({
          instruction: trackData.task2.instruction,
          passage: trackData.task2.passage || '',
          essayType: trackData.task2.essayType
        });
      }
    } catch (error) {
      console.error('Error loading track:', error);
      alert('Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  const handleTask1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId) return;
    
    setSavingTask1(true);
    try {
      await writingService.updateTask1(trackId, task1Form);
      await loadTrack(); // Reload to get updated data
      alert('Task 1 saved successfully!');
    } catch (error) {
      console.error('Error saving Task 1:', error);
      alert('Failed to save Task 1');
    } finally {
      setSavingTask1(false);
    }
  };

  const handleTask2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId) return;
    
    setSavingTask2(true);
    try {
      await writingService.updateTask2(trackId, task2Form);
      await loadTrack(); // Reload to get updated data
      alert('Task 2 saved successfully!');
    } catch (error) {
      console.error('Error saving Task 2:', error);
      alert('Failed to save Task 2');
    } finally {
      setSavingTask2(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      alert('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }
    
    setTask1Form({ ...task1Form, imageFile: file });
  };

  const handleDeleteImage = async () => {
    if (!track || !track.task1.imageName || !trackId) return;
    
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      setUploading(true);
      await writingService.deleteTask1Image(trackId, track.task1.imageName);
      await loadTrack();
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setUploading(false);
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

  if (!track) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
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

  const getTaskTypeConfig = (taskType: string, isTask1: boolean) => {
    const configs = isTask1 ? TASK1_TYPES : TASK2_TYPES;
    return configs.find(config => config.value === taskType);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Manage Writing Tasks</h1>
              <p className="text-gray-600">{track.title}</p>
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${
              track.testType === 'academic'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {track.testType}
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              track.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {track.isPublished ? (
                <>
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Published
                </>
              ) : (
                <>
                  <XIcon className="h-3 w-3 mr-1" />
                  Draft
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task 1 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-blue-50">
              <div className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900">Task 1 - Report Writing</h2>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {track.testType === 'academic' 
                  ? 'Visual description (charts, graphs, processes, maps)' 
                  : 'Letter writing (formal or informal)'
                }
              </p>
            </div>
            
            <form onSubmit={handleTask1Submit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Type *
                </label>
                <select
                  value={task1Form.taskType}
                  onChange={(e) => setTask1Form({...task1Form, taskType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  {TASK1_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {getTaskTypeConfig(task1Form.taskType, true) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {getTaskTypeConfig(task1Form.taskType, true)?.description}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart/Diagram/Map Image
                </label>
                
                {track.task1.imageUrl ? (
                  <div className="space-y-3">
                    <div className="relative border border-gray-200 rounded-lg p-2">
                      <img 
                        src={track.task1.imageUrl} 
                        alt="Task 1 visual"
                        className="max-w-full h-auto max-h-64 mx-auto rounded"
                      />
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        disabled={uploading}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>Image uploaded successfully</span>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="task1-image-upload"
                    />
                    <label
                      htmlFor="task1-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </span>
                    </label>
                  </div>
                )}
                
                {task1Form.imageFile && !track.task1.imageUrl && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                    <ImageIcon className="h-4 w-4" />
                    <span>Ready to upload: {task1Form.imageFile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Instructions *
                </label>
                <textarea
                  value={task1Form.instruction}
                  onChange={(e) => setTask1Form({...task1Form, instruction: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., The chart shows the number of visitors to different museums..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={task1Form.passage}
                  onChange={(e) => setTask1Form({...task1Form, passage: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Any additional context or description..."
                />
              </div>

              <button
                type="submit"
                disabled={savingTask1 || !task1Form.instruction.trim()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SaveIcon className="h-4 w-4" />
                {savingTask1 ? 'Saving...' : 'Save Task 1'}
              </button>
            </form>
          </div>

          {/* Task 2 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-green-50">
              <div className="flex items-center gap-2">
                <PenIcon className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-green-900">Task 2 - Essay Writing</h2>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Academic essay writing (argument, opinion, problem-solution, discussion)
              </p>
            </div>
            
            <form onSubmit={handleTask2Submit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Essay Type *
                </label>
                <select
                  value={task2Form.essayType}
                  onChange={(e) => setTask2Form({...task2Form, essayType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  {TASK2_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {getTaskTypeConfig(task2Form.essayType, false) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {getTaskTypeConfig(task2Form.essayType, false)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Essay Question/Prompt *
                </label>
                <textarea
                  value={task2Form.instruction}
                  onChange={(e) => setTask2Form({...task2Form, instruction: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Some people believe that technology has made our lives more complicated rather than simpler. To what extent do you agree or disagree with this statement?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Context (Optional)
                </label>
                <textarea
                  value={task2Form.passage}
                  onChange={(e) => setTask2Form({...task2Form, passage: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Additional context, background information, or examples..."
                />
              </div>

              <button
                type="submit"
                disabled={savingTask2 || !task2Form.instruction.trim()}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SaveIcon className="h-4 w-4" />
                {savingTask2 ? 'Saving...' : 'Save Task 2'}
              </button>
            </form>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/writing/tracks')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Tracks
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/admin/writing/tracks/${trackId}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Track Info
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TaskManagement;