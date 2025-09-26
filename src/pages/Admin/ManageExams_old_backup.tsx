import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  Users,
  BookOpen,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  FileAudio,
  PenTool,
  X,
  Save
} from 'lucide-react';
import { trackManagementService, TrackData, ExamData } from '../../services/trackManagementService';

const ManageExams: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'edit'>('home');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Exam management state
  const [exams, setExams] = useState<Record<string, ExamData>>({});
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  
  // Track management state
  const [listeningTracks, setListeningTracks] = useState<Record<string, TrackData>>({});
  const [readingTracks, setReadingTracks] = useState<Record<string, TrackData>>({});
  const [writingTracks, setWritingTracks] = useState<Record<string, TrackData>>({});
  
  // Form state for exam creation/editing
  const [formData, setFormData] = useState({
    title: '',
    tracks: {
      listening: undefined as string | undefined,
      reading: undefined as string | undefined,
      writing: undefined as string | undefined
    },
    duration: 180, // 3 hours in minutes
    status: 'draft' as 'draft' | 'published'
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all tracks
      const [listening, reading, writing, examData] = await Promise.all([
        trackManagementService.getAllTracks('listening'),
        trackManagementService.getAllTracks('reading'),
        trackManagementService.getAllTracks('writing'),
        trackManagementService.getAllExams()
      ]);
      
      setListeningTracks(listening);
      setReadingTracks(reading);
      setWritingTracks(writing);
      setExams(examData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      tracks: {
        listening: undefined,
        reading: undefined,
        writing: undefined
      },
      duration: 180,
      status: 'draft'
    });
  };

  const handleCreateExam = () => {
    resetForm();
    setSelectedExam(null);
    setCurrentView('create');
  };

  const handleEditExam = (exam: ExamData) => {
    setSelectedExam(exam);
    setFormData({
      title: exam.title,
      tracks: {
        listening: exam.tracks.listening,
        reading: exam.tracks.reading,
        writing: exam.tracks.writing
      },
      duration: exam.duration,
      status: exam.status
    });
    setCurrentView('edit');
  };

  const handleSaveExam = async () => {
    if (!formData.title.trim()) {
      showMessage('error', 'Exam title is required');
      return;
    }

    if (!formData.tracks.listening && !formData.tracks.reading && !formData.tracks.writing) {
      showMessage('error', 'At least one track must be selected');
      return;
    }

    try {
      setLoading(true);
      
      const examData: Omit<ExamData, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        tracks: formData.tracks,
        status: formData.status,
        duration: formData.duration,
        createdBy: 'admin', // TODO: Get actual admin ID
        isActive: true
      };

      if (selectedExam) {
        // Update existing exam
        await trackManagementService.updateExam(selectedExam.id, examData);
        showMessage('success', 'Exam updated successfully!');
      } else {
        // Create new exam
        await trackManagementService.createExam(examData);
        showMessage('success', 'Exam created successfully!');
      }

      // Reload data and return to home
      await loadData();
      setCurrentView('home');
      resetForm();
      setSelectedExam(null);

    } catch (error) {
      console.error('Error saving exam:', error);
      showMessage('error', 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await trackManagementService.deleteExam(examId);
      showMessage('success', 'Exam deleted successfully!');
      await loadData();
    } catch (error) {
      console.error('Error deleting exam:', error);
      showMessage('error', 'Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishExam = async (examId: string) => {
    try {
      await trackManagementService.publishExam(examId);
      showMessage('success', 'Exam published successfully!');
      await loadData();
    } catch (error) {
      console.error('Error publishing exam:', error);
      showMessage('error', 'Failed to publish exam');
    }
  };

  const handleUnpublishExam = async (examId: string) => {
    try {
      await trackManagementService.unpublishExam(examId);
      showMessage('success', 'Exam unpublished successfully!');
      await loadData();
    } catch (error) {
      console.error('Error unpublishing exam:', error);
      showMessage('error', 'Failed to unpublish exam');
    }
  };

  const getTrackName = (trackId: string, trackType: 'listening' | 'reading' | 'writing'): string => {
    const tracks = trackType === 'listening' ? listeningTracks : 
                  trackType === 'reading' ? readingTracks : writingTracks;
    return tracks[trackId]?.title || 'Unknown Track';
  };

  const getExamStats = (exam: ExamData) => {
    let totalQuestions = 0;
    
    if (exam.tracks.listening) {
      const track = listeningTracks[exam.tracks.listening];
      if (track) {
        totalQuestions += track.sections.reduce((sum, section) => sum + section.questions.length, 0);
      }
    }
    
    if (exam.tracks.reading) {
      const track = readingTracks[exam.tracks.reading];
      if (track) {
        totalQuestions += track.sections.reduce((sum, section) => sum + section.questions.length, 0);
      }
    }
    
    if (exam.tracks.writing) {
      const track = writingTracks[exam.tracks.writing];
      if (track) {
        totalQuestions += track.sections.reduce((sum, section) => sum + section.questions.length, 0);
      }
    }
    
    return { totalQuestions };
  };

  const filteredExams = Object.values(exams).filter(exam => {
    if (statusFilter !== 'all' && exam.status !== statusFilter) return false;
    if (searchTerm && !exam.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const renderExamCard = (exam: ExamData) => {
    const stats = getExamStats(exam);
    
    return (
      <div key={exam.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {exam.duration} min
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {stats.totalQuestions} questions
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(exam.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              exam.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {exam.status === 'published' ? 'Published' : 'Draft'}
            </span>
            
            <div className="relative">
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {exam.tracks.listening && (
            <div className="flex items-center text-sm">
              <FileAudio className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-gray-600">Listening:</span>
              <span className="ml-1 font-medium">{getTrackName(exam.tracks.listening, 'listening')}</span>
            </div>
          )}
          {exam.tracks.reading && (
            <div className="flex items-center text-sm">
              <BookOpen className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-gray-600">Reading:</span>
              <span className="ml-1 font-medium">{getTrackName(exam.tracks.reading, 'reading')}</span>
            </div>
          )}
          {exam.tracks.writing && (
            <div className="flex items-center text-sm">
              <PenTool className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-gray-600">Writing:</span>
              <span className="ml-1 font-medium">{getTrackName(exam.tracks.writing, 'writing')}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditExam(exam)}
              className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </button>
            
            {exam.status === 'draft' ? (
              <button
                onClick={() => handlePublishExam(exam.id)}
                className="flex items-center px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
              >
                <PlayCircle className="h-3 w-3 mr-1" />
                Publish
              </button>
            ) : (
              <button
                onClick={() => handleUnpublishExam(exam.id)}
                className="flex items-center px-3 py-1 text-sm bg-orange-50 text-orange-600 rounded hover:bg-orange-100"
              >
                <PauseCircle className="h-3 w-3 mr-1" />
                Unpublish
              </button>
            )}
          </div>
          
          <button
            onClick={() => handleDeleteExam(exam.id)}
            className="flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  if (currentView === 'home') {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Exams</h1>
              <p className="text-gray-600 mt-2">Create and manage IELTS mock tests</p>
            </div>
            <button
              onClick={handleCreateExam}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Exam</span>
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Exams</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(exams).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(exams).filter(e => e.status === 'published').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(exams).filter(e => e.status === 'draft').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Tracks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.keys(listeningTracks).length + Object.keys(readingTracks).length + Object.keys(writingTracks).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exam List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading exams...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No exams found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first exam.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateExam}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Exam</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredExams.map(renderExamCard)}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedExam ? 'Edit Exam' : 'Create New Exam'}
              </h1>
              <p className="text-gray-600 mt-1">
                {selectedExam ? 'Update exam details' : 'Combine tracks to create a full mock test'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveExam}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : selectedExam ? 'Update Exam' : 'Create Exam'}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Exam Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter exam title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 180 })}
                  className="w-full p-3 border rounded-lg"
                  min="60"
                  max="240"
                />
              </div>
            </div>
          </div>

          {/* Track Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Tracks</h2>
            <div className="space-y-4">
              {/* Listening Track */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FileAudio className="h-4 w-4 inline mr-2 text-blue-500" />
                  Listening Track
                </label>
                <select
                  value={formData.tracks.listening}
                  onChange={(e) => setFormData({
                    ...formData,
                    tracks: { ...formData.tracks, listening: e.target.value }
                  })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select listening track (optional)</option>
                  {Object.values(listeningTracks).map(track => (
                    <option key={track.id} value={track.id}>
                      {track.title} ({track.sections.reduce((sum, s) => sum + s.questions.length, 0)} questions)
                    </option>
                  ))}
                </select>
              </div>

              {/* Reading Track */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <BookOpen className="h-4 w-4 inline mr-2 text-green-500" />
                  Reading Track
                </label>
                <select
                  value={formData.tracks.reading}
                  onChange={(e) => setFormData({
                    ...formData,
                    tracks: { ...formData.tracks, reading: e.target.value }
                  })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select reading track (optional)</option>
                  {Object.values(readingTracks).map(track => (
                    <option key={track.id} value={track.id}>
                      {track.title} ({track.sections.reduce((sum, s) => sum + s.questions.length, 0)} questions)
                    </option>
                  ))}
                </select>
              </div>

              {/* Writing Track */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <PenTool className="h-4 w-4 inline mr-2 text-purple-500" />
                  Writing Track
                </label>
                <select
                  value={formData.tracks.writing}
                  onChange={(e) => setFormData({
                    ...formData,
                    tracks: { ...formData.tracks, writing: e.target.value }
                  })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select writing track (optional)</option>
                  {Object.values(writingTracks).map(track => (
                    <option key={track.id} value={track.id}>
                      {track.title} ({track.sections.reduce((sum, s) => sum + s.questions.length, 0)} questions)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Publishing Status</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="mr-2"
                />
                <span className="text-sm">Save as Draft (students cannot see this exam)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="mr-2"
                />
                <span className="text-sm">Publish Immediately (students can access this exam)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageExams;