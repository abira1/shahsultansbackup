import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  PlusIcon, 
  PenIcon,
  FileTextIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  SearchIcon,
  FilterIcon,
  ImageIcon,
  ClockIcon
} from 'lucide-react';
import { writingService } from '../../../services/writingService';
import { WritingTrackSummary } from '../../../types/writing';

const WritingTracks: React.FC = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<WritingTrackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [filterTestType, setFilterTestType] = useState<'all' | 'academic' | 'general'>('all');

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const tracksData = await writingService.getAllTracks();
      setTracks(tracksData);
    } catch (error) {
      console.error('Error loading tracks:', error);
      alert('Failed to load tracks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrack = async (trackId: string, trackTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${trackTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await writingService.deleteTrack(trackId);
      await loadTracks(); // Reload the list
      alert('Track deleted successfully!');
    } catch (error) {
      console.error('Error deleting track:', error);
      alert('Failed to delete track');
    }
  };

  const handleTogglePublish = async (trackId: string, isPublished: boolean) => {
    try {
      await writingService.togglePublish(trackId, !isPublished);
      await loadTracks(); // Reload to show updated status
    } catch (error) {
      console.error('Error updating publish status:', error);
      alert('Failed to update publish status');
    }
  };

  // Filter tracks based on search and filter criteria
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && track.isPublished) ||
      (filterStatus === 'draft' && !track.isPublished);
    const matchesTestType = filterTestType === 'all' || track.testType === filterTestType;
    
    return matchesSearch && matchesStatus && matchesTestType;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskTypeLabel = (taskType: string) => {
    const labels: Record<string, string> = {
      'chart': 'Chart',
      'table': 'Table',
      'graph': 'Line Graph',
      'process': 'Process',
      'map': 'Map',
      'argument': 'Argument',
      'opinion': 'Opinion',
      'problem-solution': 'Problem/Solution',
      'discussion': 'Discussion'
    };
    return labels[taskType] || taskType;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Writing Tracks</h1>
            <p className="text-gray-600">Manage your IELTS writing test tracks</p>
          </div>
          <button
            onClick={() => navigate('/admin/writing/tracks/new')}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Create New Track
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <select
                value={filterTestType}
                onChange={(e) => setFilterTestType(e.target.value as 'all' | 'academic' | 'general')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Test Types</option>
                <option value="academic">Academic</option>
                <option value="general">General Training</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredTracks.length} of {tracks.length} tracks
            </div>
          </div>
        </div>

        {/* Tracks List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <PenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tracks.length === 0 ? 'No tracks created yet' : 'No tracks match your filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {tracks.length === 0 
                ? 'Create your first writing track to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {tracks.length === 0 && (
              <button
                onClick={() => navigate('/admin/writing/tracks/new')}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Create First Track
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTracks.map((track) => (
              <div key={track.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {track.title}
                        </h3>
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
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <FileTextIcon className="h-4 w-4" />
                          <span>Task 1: {getTaskTypeLabel(track.task1Type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <PenIcon className="h-4 w-4" />
                          <span>Task 2: {getTaskTypeLabel(track.task2Type)}</span>
                        </div>
                        {track.hasTask1Image && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <ImageIcon className="h-4 w-4" />
                            <span>Has Image</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>60 min</span>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                          track.testType === 'academic'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {track.testType}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500">
                        Created {formatDate(track.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/admin/writing/tracks/${track.id}/tasks`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Tasks"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => navigate(`/admin/writing/tracks/${track.id}/edit`)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Track"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleTogglePublish(track.id, track.isPublished)}
                        className={`p-2 rounded-lg transition-colors ${
                          track.isPublished
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={track.isPublished ? 'Unpublish Track' : 'Publish Track'}
                      >
                        {track.isPublished ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteTrack(track.id, track.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Track"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PenIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tracks</p>
                <p className="text-lg font-semibold">{tracks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-lg font-semibold">{tracks.filter(t => t.isPublished).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-lg font-semibold">{tracks.filter(t => !t.isPublished).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ImageIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">With Images</p>
                <p className="text-lg font-semibold">{tracks.filter(t => t.hasTask1Image).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WritingTracks;