import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Demo data - will be replaced with real data from services
const demoTracks = {
  listening: [
    {
      id: 'listening_1',
      title: 'Academic Listening Practice Set 1',
      testType: 'academic',
      sectionsCount: 4,
      totalQuestions: 40,
      duration: 30,
      isPublished: true,
      createdAt: Date.now() - 86400000
    },
    {
      id: 'listening_2', 
      title: 'General Training Listening Set 1',
      testType: 'general',
      sectionsCount: 4,
      totalQuestions: 40,
      duration: 30,
      isPublished: true,
      createdAt: Date.now() - 172800000
    }
  ],
  reading: [
    {
      id: 'reading_1',
      title: 'Academic Reading: Environmental Issues',
      testType: 'academic',
      passagesCount: 3,
      totalQuestions: 40,
      duration: 60,
      isPublished: true,
      createdAt: Date.now() - 86400000
    },
    {
      id: 'reading_2',
      title: 'General Training Reading Set 1',
      testType: 'general',
      passagesCount: 3,
      totalQuestions: 40,
      duration: 60,
      isPublished: true,
      createdAt: Date.now() - 259200000
    }
  ],
  writing: [
    {
      id: 'writing_1',
      title: 'Academic Writing: Task 1 & 2',
      testType: 'academic',
      hasTask1: true,
      hasTask2: true,
      duration: 60,
      isPublished: true,
      createdAt: Date.now() - 172800000
    },
    {
      id: 'writing_2',
      title: 'General Training Writing Tasks',
      testType: 'general',
      hasTask1: true,
      hasTask2: true,
      duration: 60,
      isPublished: true,
      createdAt: Date.now() - 345600000
    }
  ]
};

const ManageExams: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'listening' | 'reading' | 'writing' | 'exams'>('all');
  const [selectedTracks, setSelectedTracks] = useState<{
    listening?: string;
    reading?: string;
    writing?: string;
  }>({});

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateExam = () => {
    if (Object.keys(selectedTracks).length === 0) {
      alert('Please select at least one track to create an exam');
      return;
    }
    // Navigate to exam creation with selected tracks
    const queryParams = new URLSearchParams(selectedTracks).toString();
    navigate(`/admin/exams/create?${queryParams}`);
  };

  const handleStartDemo = (trackType: string, trackId: string) => {
    // Navigate to student demo interface
    navigate(`/mock-test/${trackType}?trackId=${trackId}&demo=true`);
  };

  const allTracks = [
    ...demoTracks.listening.map(track => ({ ...track, type: 'listening', icon: '🎧', color: 'bg-blue-500' })),
    ...demoTracks.reading.map(track => ({ ...track, type: 'reading', icon: '📖', color: 'bg-green-500' })),
    ...demoTracks.writing.map(track => ({ ...track, type: 'writing', icon: '✍️', color: 'bg-purple-500' }))
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Exams</h1>
          <p className="text-gray-600">View all tracks, create exams, and manage test content</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreateExam}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            disabled={Object.keys(selectedTracks).length === 0}
          >
            Create Full Exam ({Object.keys(selectedTracks).length} tracks selected)
          </button>
          <button
            onClick={() => navigate('/admin/upload')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Upload New Track
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">🎧</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Listening</h3>
              <p className="text-2xl font-bold text-blue-600">{demoTracks.listening.length}</p>
              <p className="text-sm text-gray-500">Tracks Available</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">📖</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Reading</h3>
              <p className="text-2xl font-bold text-green-600">{demoTracks.reading.length}</p>
              <p className="text-sm text-gray-500">Tracks Available</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">✍️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Writing</h3>
              <p className="text-2xl font-bold text-purple-600">{demoTracks.writing.length}</p>
              <p className="text-sm text-gray-500">Tracks Available</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Full Exams</h3>
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-sm text-gray-500">Complete Tests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All Tracks', count: allTracks.length },
            { id: 'listening', label: 'Listening', count: demoTracks.listening.length },
            { id: 'reading', label: 'Reading', count: demoTracks.reading.length },
            { id: 'writing', label: 'Writing', count: demoTracks.writing.length },
            { id: 'exams', label: 'Full Exams', count: 3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Track Selection for Exam Creation */}
      {activeTab === 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Create Full IELTS Exam</h3>
          <p className="text-blue-700 text-sm mb-3">Select one track from each section to create a complete IELTS exam</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-blue-600">Selected: </span>
            {selectedTracks.listening && <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">🎧 Listening</span>}
            {selectedTracks.reading && <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">📖 Reading</span>}
            {selectedTracks.writing && <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">✍️ Writing</span>}
            {Object.keys(selectedTracks).length === 0 && <span className="text-gray-500 text-sm">None selected</span>}
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* All Tracks */}
        {(activeTab === 'all') && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Available Tracks</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTracks.map((track) => (
                    <tr key={track.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="radio"
                          name={track.type}
                          checked={selectedTracks[track.type as keyof typeof selectedTracks] === track.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTracks(prev => ({
                                ...prev,
                                [track.type]: track.id
                              }));
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 ${track.color} rounded-full flex items-center justify-center mr-3`}>
                            <span className="text-white text-sm">{track.icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{track.title}</div>
                            <div className="text-sm text-gray-500 capitalize">{track.testType} • {track.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {track.type === 'listening' && `${(track as any).sectionsCount} sections, ${(track as any).totalQuestions} questions`}
                        {track.type === 'reading' && `${(track as any).passagesCount} passages, ${(track as any).totalQuestions} questions`}
                        {track.type === 'writing' && `Task 1 & Task 2`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {track.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(track.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleStartDemo(track.type, track.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Demo
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Individual Section Views */}
        {(activeTab === 'listening') && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Listening Tracks</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {demoTracks.listening.map((track) => (
                  <div key={track.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white">🎧</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{track.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{track.testType}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {track.sectionsCount} sections • {track.totalQuestions} questions • {track.duration} minutes
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartDemo('listening', track.id)}
                        className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Start Demo
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Similar structure for reading, writing, and exams tabs */}
        {(activeTab === 'reading') && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Reading Tracks</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {demoTracks.reading.map((track) => (
                  <div key={track.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white">📖</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{track.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{track.testType}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {track.passagesCount} passages • {track.totalQuestions} questions • {track.duration} minutes
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartDemo('reading', track.id)}
                        className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Start Demo
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'writing') && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Writing Tracks</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {demoTracks.writing.map((track) => (
                  <div key={track.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white">✍️</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{track.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{track.testType}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Task 1 & Task 2 • {track.duration} minutes
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartDemo('writing', track.id)}
                        className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Start Demo
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'exams') && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Complete IELTS Exams</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Complete Exams Yet</h3>
                <p className="text-gray-500 mb-4">Create complete IELTS exams by combining tracks from different sections.</p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Select Tracks to Create Exam
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageExams;