import React from 'react';
import { useNavigate } from 'react-router-dom';

const UploadTracks: React.FC = () => {
  const navigate = useNavigate();

  const trackTypes = [
    {
      id: 'listening',
      name: 'Listening Track',
      description: 'Upload audio files and create listening comprehension questions',
      icon: '🎧',
      color: 'bg-blue-500',
      path: '/admin/questions/upload'
    },
    {
      id: 'reading',
      name: 'Reading Track',
      description: 'Create reading passages with comprehension questions',
      icon: '📖',
      color: 'bg-green-500',
      path: '/admin/reading/tracks/new'
    },
    {
      id: 'writing',
      name: 'Writing Track',
      description: 'Create writing tasks with prompts and requirements',
      icon: '✍️',
      color: 'bg-purple-500',
      path: '/admin/writing/tracks/new'
    },
    {
      id: 'speaking',
      name: 'Speaking Track',
      description: 'Create speaking prompts and conversation topics',
      icon: '🎤',
      color: 'bg-red-500',
      path: '/admin/speaking/create'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Tracks</h1>
        <p className="text-gray-600">Create and upload tracks for different IELTS test sections</p>
      </div>

      {/* Track Type Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {trackTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-200"
            onClick={() => navigate(type.path)}
          >
            <div className="p-6">
              <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                {type.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{type.description}</p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Create {type.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Upload Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Listening Tracks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Reading Tracks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-sm text-gray-600">Writing Tracks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">4</div>
            <div className="text-sm text-gray-600">Speaking Tracks</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Upload Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                🎧
              </div>
              <div>
                <div className="font-medium text-gray-900">Listening Track: Academic Practice Set 1</div>
                <div className="text-sm text-gray-500">Created 2 hours ago</div>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                📖
              </div>
              <div>
                <div className="font-medium text-gray-900">Reading Track: Environmental Issues</div>
                <div className="text-sm text-gray-500">Created 1 day ago</div>
              </div>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                ✍️
              </div>
              <div>
                <div className="font-medium text-gray-900">Writing Track: Task 1 Charts and Graphs</div>
                <div className="text-sm text-gray-500">Created 3 days ago</div>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTracks;