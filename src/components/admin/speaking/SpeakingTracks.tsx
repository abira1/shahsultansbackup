import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakingService } from '../../../services/speakingService';
import { SpeakingTrackSummary } from '../../../types/speaking';
import Button from '../../ui/Button';

export const SpeakingTracks: React.FC = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<SpeakingTrackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [testTypeFilter, setTestTypeFilter] = useState<'all' | 'academic' | 'general'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    academic: 0,
    general: 0
  });

  useEffect(() => {
    loadTracks();
    loadStats();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const tracksData = await speakingService.getAllTracks();
      setTracks(tracksData);
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await speakingService.getTrackStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleTogglePublish = async (trackId: string, currentStatus: boolean) => {
    try {
      await speakingService.togglePublish(trackId, !currentStatus);
      await loadTracks();
      await loadStats();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleDeleteTrack = async (trackId: string, trackTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${trackTitle}"? This action cannot be undone.`)) {
      try {
        await speakingService.deleteTrack(trackId);
        await loadTracks();
        await loadStats();
      } catch (error) {
        console.error('Error deleting track:', error);
      }
    }
  };

  const handleDuplicateTrack = async (trackId: string, trackTitle: string) => {
    const newTitle = prompt(`Enter title for duplicated track:`, `Copy of ${trackTitle}`);
    if (newTitle && newTitle.trim()) {
      try {
        await speakingService.duplicateTrack(trackId, newTitle.trim());
        await loadTracks();
        await loadStats();
      } catch (error) {
        console.error('Error duplicating track:', error);
      }
    }
  };

  const filteredTracks = tracks.filter(track => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && track.isPublished) ||
      (filter === 'draft' && !track.isPublished);
    
    const matchesTestType = testTypeFilter === 'all' || track.testType === testTypeFilter;
    
    const matchesSearch = searchTerm === '' || 
      track.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesTestType && matchesSearch;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading tracks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Speaking Tracks</h1>
          <p className="text-gray-600 mt-1">Manage IELTS Speaking test tracks</p>
        </div>
        <Button
          onClick={() => navigate('/admin/speaking/create')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Track
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tracks</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                  <dd className="text-lg font-medium text-green-600">{stats.published}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📝</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                  <dd className="text-lg font-medium text-yellow-600">{stats.draft}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🎓</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Academic</dt>
                  <dd className="text-lg font-medium text-blue-600">{stats.academic}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">💼</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">General</dt>
                  <dd className="text-lg font-medium text-purple-600">{stats.general}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <select
              value={testTypeFilter}
              onChange={(e) => setTestTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="academic">Academic</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No speaking tracks found</h3>
            <p className="text-gray-500 mb-4">Create your first speaking track to get started.</p>
            <Button
              onClick={() => navigate('/admin/speaking/create')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Create Speaking Track
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Track
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTracks.map((track) => (
                  <tr key={track.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{track.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {track.testType.toUpperCase()}
                          </span>
                          {track.tags?.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>Part 1: {track.part1TopicsCount} topics</div>
                        <div>Part 2: {track.part2HasTask ? 'Task card ready' : 'No task card'}</div>
                        <div>Part 3: {track.part3QuestionsCount} questions</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {track.totalDuration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        track.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {track.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(track.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/admin/speaking/create/${track.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(track.id, track.isPublished)}
                        className={`${
                          track.isPublished
                            ? 'text-yellow-600 hover:text-yellow-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {track.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDuplicateTrack(track.id, track.title)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDeleteTrack(track.id, track.title)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};