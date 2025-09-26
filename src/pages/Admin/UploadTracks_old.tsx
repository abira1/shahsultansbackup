import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  FileAudio, 
  BookOpen, 
  PenTool, 
  Mic,
  Plus,
  Upload,
  ArrowLeft,
  Save,
  Trash2
} from 'lucide-react';

type TrackType = 'academic-listening' | 'general-listening' | 'academic-reading' | 'general-reading' | 'writing-task1' | 'writing-task2' | 'speaking-part1' | 'speaking-part2';

type QuestionType = 'multiple-choice-single' | 'multiple-choice-multiple' | 'matching' | 'form-completion' | 'note-table-completion' | 'sentence-completion' | 'short-answer' | 'diagram-labeling';

interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface Track {
  id: string;
  title: string;
  type: TrackType;
  audioUrl?: string;
  sections?: Section[];
  questionText?: string; // For Writing and Speaking
  createdAt: Date;
}

interface TrackTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: TrackType;
}

const UploadTracks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'listening' | 'reading' | 'writing' | 'speaking'>('all');

  const trackTemplates: TrackTemplate[] = [
    // Listening Templates
    {
      id: 'listening-academic',
      name: 'Academic Listening',
      description: 'University lectures and academic discussions with complex vocabulary',
      difficulty: 'Advanced',
      duration: '30 min',
      questions: 40,
      icon: <Headphones className="h-6 w-6" />,
      color: 'blue',
      path: '/admin/questions/upload?type=listening&template=academic',
      popular: true
    },
    {
      id: 'listening-general',
      name: 'General Listening',
      description: 'Everyday conversations and social situations',
      difficulty: 'Intermediate',
      duration: '25 min',
      questions: 35,
      icon: <Headphones className="h-6 w-6" />,
      color: 'blue',
      path: '/admin/questions/upload?type=listening&template=general'
    },
    
    // Reading Templates
    {
      id: 'reading-academic',
      name: 'Academic Reading',
      description: 'Complex academic texts with analytical questions',
      difficulty: 'Advanced',
      duration: '60 min',
      questions: 40,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'green',
      path: '/admin/reading/tracks/new?template=academic',
      popular: true
    },
    {
      id: 'reading-general',
      name: 'General Reading',
      description: 'Everyday texts including advertisements and articles',
      difficulty: 'Intermediate',
      duration: '45 min',
      questions: 30,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'green',
      path: '/admin/reading/tracks/new?template=general'
    },
    
    // Writing Templates
    {
      id: 'writing-task1-academic',
      name: 'Writing Task 1 (Academic)',
      description: 'Describe charts, graphs, and diagrams',
      difficulty: 'Advanced',
      duration: '20 min',
      questions: 1,
      icon: <PenTool className="h-6 w-6" />,
      color: 'purple',
      path: '/admin/writing/tracks/new?template=task1-academic'
    },
    {
      id: 'writing-task2',
      name: 'Writing Task 2 (Essay)',
      description: 'Argumentative and opinion essays',
      difficulty: 'Advanced',
      duration: '40 min',
      questions: 1,
      icon: <PenTool className="h-6 w-6" />,
      color: 'purple',
      path: '/admin/writing/tracks/new?template=task2',
      popular: true
    },
    
    // Speaking Templates
    {
      id: 'speaking-part1',
      name: 'Speaking Part 1',
      description: 'Introduction and personal questions',
      difficulty: 'Beginner',
      duration: '5 min',
      questions: 12,
      icon: <Mic className="h-6 w-6" />,
      color: 'red',
      path: '/admin/speaking/create?template=part1'
    },
    {
      id: 'speaking-part2',
      name: 'Speaking Part 2',
      description: 'Individual long turn with cue cards',
      difficulty: 'Intermediate',
      duration: '4 min',
      questions: 1,
      icon: <Mic className="h-6 w-6" />,
      color: 'red',
      path: '/admin/speaking/create?template=part2'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: trackTemplates.length },
    { id: 'listening', name: 'Listening', count: trackTemplates.filter(t => t.id.includes('listening')).length },
    { id: 'reading', name: 'Reading', count: trackTemplates.filter(t => t.id.includes('reading')).length },
    { id: 'writing', name: 'Writing', count: trackTemplates.filter(t => t.id.includes('writing')).length },
    { id: 'speaking', name: 'Speaking', count: trackTemplates.filter(t => t.id.includes('speaking')).length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? trackTemplates 
    : trackTemplates.filter(template => template.id.includes(selectedCategory));

  const stats = {
    totalTracks: 30,
    publishedTracks: 24,
    draftTracks: 6,
    totalQuestions: 450
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Track Templates</h1>
            <p className="text-gray-600 mt-1">Create professional IELTS tracks from proven templates</p>
          </div>
          <button
            onClick={() => navigate('/admin/questions/upload')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Custom Track
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTracks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.publishedTracks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.draftTracks}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questions</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalQuestions}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                {category.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => navigate(template.path)}
            >
              {template.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Popular
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className={`p-3 bg-${template.color}-100 rounded-lg inline-flex mb-4 text-${template.color}-600`}>
                  {template.icon}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {template.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      template.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {template.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="text-gray-900 font-medium">{template.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Questions:</span>
                    <span className="text-gray-900 font-medium">{template.questions}</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors group-hover:bg-blue-600">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Track Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Headphones className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Academic Listening Practice Set 1</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created 2 hours ago
                    </span>
                    <span>40 questions</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Reading: Environmental Issues</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created 1 day ago
                    </span>
                    <span>35 questions</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PenTool className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Writing Task 2: Opinion Essay</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created 3 days ago
                    </span>
                    <span>1 question</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadTracks;