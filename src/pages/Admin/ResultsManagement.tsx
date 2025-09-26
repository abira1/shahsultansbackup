import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';

interface ExamResult {
  id: string;
  studentName: string;
  studentEmail: string;
  examType: 'listening' | 'reading' | 'writing' | 'speaking';
  examDate: string;
  submissionDate: string;
  status: 'pending' | 'graded' | 'published';
  scores: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
    overall?: number;
  };
  bandScore?: number;
  gradedBy?: string;
  gradedDate?: string;
  feedback?: string;
  duration: string;
}

const ResultsManagement: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded' | 'published'>('all');
  const [examTypeFilter, setExamTypeFilter] = useState<'all' | 'listening' | 'reading' | 'writing' | 'speaking'>('all');
  const [selectedResults, setSelectedResults] = useState<string[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockResults: ExamResult[] = [
      {
        id: '1',
        studentName: 'Sarah Johnson',
        studentEmail: 'sarah.johnson@email.com',
        examType: 'reading',
        examDate: '2024-01-16',
        submissionDate: '2024-01-16',
        status: 'pending',
        scores: {},
        duration: '60 minutes'
      },
      {
        id: '2',
        studentName: 'Michael Chen',
        studentEmail: 'michael.chen@email.com',
        examType: 'writing',
        examDate: '2024-01-15',
        submissionDate: '2024-01-15',
        status: 'graded',
        scores: {
          writing: 85,
          overall: 85
        },
        bandScore: 7.5,
        gradedBy: 'Dr. Smith',
        gradedDate: '2024-01-16',
        feedback: 'Good structure and vocabulary. Work on task achievement.',
        duration: '60 minutes'
      },
      {
        id: '3',
        studentName: 'Emma Davis',
        studentEmail: 'emma.davis@email.com',
        examType: 'listening',
        examDate: '2024-01-14',
        submissionDate: '2024-01-14',
        status: 'published',
        scores: {
          listening: 92,
          overall: 92
        },
        bandScore: 8.0,
        gradedBy: 'Prof. Johnson',
        gradedDate: '2024-01-15',
        feedback: 'Excellent performance across all question types.',
        duration: '40 minutes'
      },
      {
        id: '4',
        studentName: 'Raj Patel',
        studentEmail: 'raj.patel@email.com',
        examType: 'reading',
        examDate: '2024-01-13',
        submissionDate: '2024-01-13',
        status: 'graded',
        scores: {
          reading: 78,
          overall: 78
        },
        bandScore: 7.0,
        gradedBy: 'Dr. Smith',
        gradedDate: '2024-01-14',
        feedback: 'Good comprehension. Focus on time management.',
        duration: '60 minutes'
      }
    ];
    
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (resultId: string, newStatus: 'graded' | 'published') => {
    setResults(prev => prev.map(result => 
      result.id === resultId ? { ...result, status: newStatus } : result
    ));
  };

  const handleBulkPublish = () => {
    setResults(prev => prev.map(result => 
      selectedResults.includes(result.id) && result.status === 'graded' 
        ? { ...result, status: 'published' } 
        : result
    ));
    setSelectedResults([]);
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    const matchesExamType = examTypeFilter === 'all' || result.examType === examTypeFilter;
    return matchesSearch && matchesStatus && matchesExamType;
  });

  const pendingCount = results.filter(r => r.status === 'pending').length;
  const publishedCount = results.filter(r => r.status === 'published').length;
  const averageBand = results
    .filter(r => r.bandScore)
    .reduce((sum, r) => sum + (r.bandScore || 0), 0) / results.filter(r => r.bandScore).length || 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Results Management</h1>
            <p className="text-gray-600 mt-1">Grade and publish exam results</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" />
              Export Results
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Results</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{results.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{pendingCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{publishedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Band</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{averageBand.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="graded">Graded</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <select
                value={examTypeFilter}
                onChange={(e) => setExamTypeFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Modules</option>
                <option value="listening">Listening</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>

              {selectedResults.length > 0 && (
                <button
                  onClick={handleBulkPublish}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Publish Selected ({selectedResults.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedResults.length === filteredResults.length && filteredResults.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedResults(filteredResults.map(r => r.id));
                        } else {
                          setSelectedResults([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Exam Details</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedResults.includes(result.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedResults(prev => [...prev, result.id]);
                          } else {
                            setSelectedResults(prev => prev.filter(id => id !== result.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {result.studentName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{result.studentName}</p>
                          <p className="text-sm text-gray-500">{result.studentEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            result.examType === 'listening' ? 'bg-purple-100 text-purple-800' :
                            result.examType === 'reading' ? 'bg-blue-100 text-blue-800' :
                            result.examType === 'writing' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {result.examType.charAt(0).toUpperCase() + result.examType.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.examDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">Duration: {result.duration}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {result.bandScore ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold text-gray-900">Band {result.bandScore}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Score: {result.scores.overall}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        result.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'graded'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {result.status === 'published' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {result.status === 'graded' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {result.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {result.status === 'pending' && (
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Grade"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {result.status === 'graded' && (
                          <button
                            onClick={() => handleStatusChange(result.id, 'published')}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ResultsManagement;