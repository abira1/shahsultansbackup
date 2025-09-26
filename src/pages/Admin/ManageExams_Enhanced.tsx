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
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  FileAudio,
  PenTool,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Filter
} from 'lucide-react';
import { 
  trackManagementService, 
  TrackData, 
  ExamData
} from '../../services/trackManagementService';

const ManageExams: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'tracks' | 'exams' | 'create-exam' | 'edit-exam' | 'edit-track'>('home');
  const [activeTab, setActiveTab] = useState<'listening' | 'reading' | 'writing'>('listening');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Data state
  const [exams, setExams] = useState<Record<string, ExamData>>({});
  const [listeningTracks, setListeningTracks] = useState<Record<string, TrackData>>({});
  const [readingTracks, setReadingTracks] = useState<Record<string, TrackData>>({});
  const [writingTracks, setWritingTracks] = useState<Record<string, TrackData>>({});
  
  // Selected items
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);
  
  // Form state for exam creation/editing
  const [examFormData, setExamFormData] = useState({
    title: '',
    description: '',
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

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
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

  const resetExamForm = () => {
    setExamFormData({
      title: '',
      description: '',
      tracks: {
        listening: undefined,
        reading: undefined,
        writing: undefined
      },
      duration: 180,
      status: 'draft'
    });
  };

  const getTrackStats = () => {
    const totalTracks = Object.keys(listeningTracks).length + 
                       Object.keys(readingTracks).length + 
                       Object.keys(writingTracks).length;
    
    const publishedTracks = [
      ...Object.values(listeningTracks),
      ...Object.values(readingTracks),
      ...Object.values(writingTracks)
    ].filter(track => track.status === 'published').length;

    const totalExams = Object.keys(exams).length;
    const publishedExams = Object.values(exams).filter(exam => exam.status === 'published').length;

    return { totalTracks, publishedTracks, totalExams, publishedExams };
  };

  // ========================================================================
  // EXAM HANDLERS
  // ========================================================================

  const handleCreateExam = () => {
    resetExamForm();
    setSelectedExam(null);
    setCurrentView('create-exam');
  };

  const handleEditExam = (exam: ExamData) => {
    setSelectedExam(exam);
    setExamFormData({
      title: exam.title,
      description: exam.description || '',
      tracks: {
        listening: exam.tracks.listening,
        reading: exam.tracks.reading,
        writing: exam.tracks.writing
      },
      duration: exam.duration,
      status: exam.status
    });
    setCurrentView('edit-exam');
  };

  const handleSaveExam = async () => {
    if (!examFormData.title.trim()) {
      showMessage('error', 'Exam title is required');
      return;
    }

    if (!examFormData.tracks.listening && !examFormData.tracks.reading && !examFormData.tracks.writing) {
      showMessage('error', 'At least one track must be selected');
      return;
    }

    setLoading(true);

    try {
      const examData: Omit<ExamData, 'id' | 'createdAt' | 'updatedAt' | 'totalQuestions' | 'totalMarks'> = {
        title: examFormData.title,
        description: examFormData.description,
        tracks: examFormData.tracks,
        status: examFormData.status,
        duration: examFormData.duration,
        createdBy: 'admin', // TODO: Get actual admin ID
        isActive: true
      };

      if (selectedExam) {
        await trackManagementService.updateExam(selectedExam.id, examData);
        showMessage('success', 'Exam updated successfully!');
      } else {
        await trackManagementService.createExam(examData);
        showMessage('success', 'Exam created successfully!');
      }

      await loadData();
      setCurrentView('exams');
      resetExamForm();
      setSelectedExam(null);

    } catch (error) {
      console.error('Error saving exam:', error);
      showMessage('error', 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      await trackManagementService.deleteExam(examId);
      showMessage('success', 'Exam deleted successfully!');
      await loadData();
    } catch (error) {
      console.error('Error deleting exam:', error);
      showMessage('error', 'Failed to delete exam');
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

  // ========================================================================
  // TRACK HANDLERS
  // ========================================================================

  const handleEditTrack = (track: TrackData) => {
    setSelectedTrack(track);
    setCurrentView('edit-track');
  };

  const handleDeleteTrack = async (track: TrackData) => {
    if (!confirm(`Are you sure you want to delete the track "${track.title}"?`)) return;

    try {
      await trackManagementService.deleteTrack(track.id, track.type);
      showMessage('success', 'Track deleted successfully!');
      await loadData();
    } catch (error) {
      console.error('Error deleting track:', error);
      showMessage('error', 'Failed to delete track');
    }
  };

  const handlePublishTrack = async (track: TrackData) => {
    try {
      await trackManagementService.publishTrack(track.id, track.type);
      showMessage('success', 'Track published successfully!');
      await loadData();
    } catch (error) {
      console.error('Error publishing track:', error);
      showMessage('error', 'Failed to publish track');
    }
  };

  const handleUnpublishTrack = async (track: TrackData) => {
    try {
      await trackManagementService.unpublishTrack(track.id, track.type);
      showMessage('success', 'Track unpublished successfully!');
      await loadData();
    } catch (error) {
      console.error('Error unpublishing track:', error);
      showMessage('error', 'Failed to unpublish track');
    }
  };

  // ========================================================================
  // FILTER FUNCTIONS
  // ========================================================================

  const getFilteredTracks = (tracks: Record<string, TrackData>) => {
    return Object.values(tracks).filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || track.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredExams = () => {
    return Object.values(exams).filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  const renderMessage = () => {
    if (!message) return null;

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg ${
        message.type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center gap-2">
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      </div>
    );
  };

  const renderHome = () => {
    const stats = getTrackStats();

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Exams & Tracks</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage your exam content</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateExam}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Exam
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTracks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Tracks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedTracks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <PlayCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Exams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedExams}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setCurrentView('tracks')}
            className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Tracks</h3>
                <p className="text-gray-600">Edit, delete, and publish individual tracks</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('exams')}
            className="p-6 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Exams</h3>
                <p className="text-gray-600">Create, edit, and publish full exams</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderTrackList = () => {
    const currentTracks = activeTab === 'listening' ? listeningTracks : 
                         activeTab === 'reading' ? readingTracks : writingTracks;
    const filteredTracks = getFilteredTracks(currentTracks);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Tracks</h1>
              <p className="text-gray-600">Edit and manage your question tracks</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tracks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Track Type Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {(['listening', 'reading', 'writing'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex-1 px-6 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === type
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {type === 'listening' && <FileAudio className="h-4 w-4" />}
                  {type === 'reading' && <BookOpen className="h-4 w-4" />}
                  {type === 'writing' && <PenTool className="h-4 w-4" />}
                  {type} ({Object.keys(currentTracks).length})
                </div>
              </button>
            ))}
          </div>

          {/* Track List */}
          <div className="p-6">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {activeTab === 'listening' && <FileAudio className="h-12 w-12 mx-auto" />}
                  {activeTab === 'reading' && <BookOpen className="h-12 w-12 mx-auto" />}
                  {activeTab === 'writing' && <PenTool className="h-12 w-12 mx-auto" />}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} tracks found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : `Create your first ${activeTab} track to get started`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTracks.map((track) => (
                  <div key={track.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activeTab === 'listening' ? 'bg-blue-500' :
                          activeTab === 'reading' ? 'bg-green-500' : 'bg-purple-500'
                        }`}>
                          <span className="text-white text-sm">
                            {activeTab === 'listening' && '🎧'}
                            {activeTab === 'reading' && '📖'}
                            {activeTab === 'writing' && '✍️'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{track.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{track.examType} • {track.totalQuestions} questions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          track.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {track.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-4">
                        <span>Sections: {track.sections.length}</span>
                        <span>Total Marks: {track.totalMarks}</span>
                        <span>Duration: {track.duration}min</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditTrack(track)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                      
                      {track.status === 'draft' ? (
                        <button
                          onClick={() => handlePublishTrack(track)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublishTrack(track)}
                          className="bg-orange-600 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-700 transition-colors flex items-center gap-1"
                        >
                          <EyeOff className="h-3 w-3" />
                          Unpublish
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteTrack(track)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderExamList = () => {
    const filteredExams = getFilteredExams();

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Exams</h1>
              <p className="text-gray-600">Create and manage complete exam sets</p>
            </div>
          </div>
          <button
            onClick={handleCreateExam}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Exam
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Exam List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            {filteredExams.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Create your first exam to get started'
                  }
                </p>
                <button
                  onClick={handleCreateExam}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Exam
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExams.map((exam) => (
                  <div key={exam.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            exam.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {exam.status}
                          </span>
                        </div>
                        
                        {exam.description && (
                          <p className="text-gray-600 mb-3">{exam.description}</p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{exam.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{exam.totalQuestions} questions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Track Components */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {exam.tracks.listening && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                              <FileAudio className="h-3 w-3" />
                              Listening
                            </span>
                          )}
                          {exam.tracks.reading && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              Reading
                            </span>
                          )}
                          {exam.tracks.writing && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center gap-1">
                              <PenTool className="h-3 w-3" />
                              Writing
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditExam(exam)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        
                        {exam.status === 'draft' ? (
                          <button
                            onClick={() => handlePublishExam(exam.id)}
                            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <PlayCircle className="h-3 w-3" />
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublishExam(exam.id)}
                            className="bg-orange-600 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-700 transition-colors flex items-center gap-1"
                          >
                            <PauseCircle className="h-3 w-3" />
                            Unpublish
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteExam(exam.id)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderExamForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentView('exams')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exams
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedExam ? 'Edit Exam' : 'Create New Exam'}
          </h1>
          <p className="text-gray-600">Combine tracks to create a complete exam</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Exam Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title *</label>
              <input
                type="text"
                value={examFormData.title}
                onChange={(e) => setExamFormData({ ...examFormData, title: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter exam title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={examFormData.duration}
                onChange={(e) => setExamFormData({ ...examFormData, duration: parseInt(e.target.value) || 180 })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="60"
                max="300"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={examFormData.description}
              onChange={(e) => setExamFormData({ ...examFormData, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter exam description..."
            />
          </div>
        </div>

        {/* Track Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Tracks</h2>
          <div className="space-y-4">
            {/* Listening Track */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listening Track (Optional)</label>
              <select
                value={examFormData.tracks.listening || ''}
                onChange={(e) => setExamFormData({ 
                  ...examFormData, 
                  tracks: { ...examFormData.tracks, listening: e.target.value || undefined }
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select listening track (optional)</option>
                {Object.values(listeningTracks).map(track => (
                  <option key={track.id} value={track.id}>
                    {track.title} ({track.totalQuestions} questions)
                  </option>
                ))}
              </select>
            </div>

            {/* Reading Track */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reading Track (Optional)</label>
              <select
                value={examFormData.tracks.reading || ''}
                onChange={(e) => setExamFormData({ 
                  ...examFormData, 
                  tracks: { ...examFormData.tracks, reading: e.target.value || undefined }
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select reading track (optional)</option>
                {Object.values(readingTracks).map(track => (
                  <option key={track.id} value={track.id}>
                    {track.title} ({track.totalQuestions} questions)
                  </option>
                ))}
              </select>
            </div>

            {/* Writing Track */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Writing Track (Optional)</label>
              <select
                value={examFormData.tracks.writing || ''}
                onChange={(e) => setExamFormData({ 
                  ...examFormData, 
                  tracks: { ...examFormData.tracks, writing: e.target.value || undefined }
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                checked={examFormData.status === 'draft'}
                onChange={(e) => setExamFormData({ ...examFormData, status: e.target.value as any })}
                className="mr-2"
              />
              <span className="text-gray-700">Save as Draft</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="published"
                checked={examFormData.status === 'published'}
                onChange={(e) => setExamFormData({ ...examFormData, status: e.target.value as any })}
                className="mr-2"
              />
              <span className="text-gray-700">Publish Immediately</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            onClick={() => setCurrentView('exams')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveExam}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : selectedExam ? 'Update Exam' : 'Create Exam'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTrackEditor = () => {
    if (!selectedTrack) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('tracks')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tracks
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Track: {selectedTrack.title}</h1>
            <p className="text-gray-600">{selectedTrack.type} • {selectedTrack.examType}</p>
          </div>
        </div>

        {/* Track Editor Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center py-12">
            <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Editor</h3>
            <p className="text-gray-600 mb-4">
              Advanced track editing functionality will be implemented here.
            </p>
            <p className="text-sm text-gray-500">
              This will include question editing, section management, and file uploads.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {renderMessage()}
        
        <div className="max-w-7xl mx-auto">
          {currentView === 'home' && renderHome()}
          {currentView === 'tracks' && renderTrackList()}
          {currentView === 'exams' && renderExamList()}
          {(currentView === 'create-exam' || currentView === 'edit-exam') && renderExamForm()}
          {currentView === 'edit-track' && renderTrackEditor()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageExams;