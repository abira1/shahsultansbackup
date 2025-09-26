import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit3, 
  Send, 
  Search, 
  Filter,
  BarChart3,
  Download,
  Calendar,
  User,
  Trophy,
  Star
} from 'lucide-react';
import { resultsService, AdminExamResult } from '../../services/resultsService';

const ResultsManagement: React.FC = () => {
  const [results, setResults] = useState<AdminExamResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<AdminExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [statistics, setStatistics] = useState({
    totalSubmissions: 0,
    pendingReview: 0,
    published: 0,
    averageScores: {
      listening: 0,
      reading: 0,
      writing: 0,
      speaking: 0,
      overall: 0
    }
  });

  useEffect(() => {
    loadResults();
    loadStatistics();
  }, []);

  useEffect(() => {
    filterResults();
  }, [results, searchTerm, statusFilter, examFilter]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const allResults = await resultsService.getAllResults();
      setResults(allResults);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await resultsService.getResultsStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const filterResults = () => {
    let filtered = results;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.examTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(result => result.status === statusFilter);
    }

    // Exam filter
    if (examFilter !== 'all') {
      filtered = filtered.filter(result => result.examId === examFilter);
    }

    setFilteredResults(filtered);
  };

  const handlePublishResult = async (examId: string, studentId: string) => {
    try {
      await resultsService.publishResult(examId, studentId);
      await loadResults();
      await loadStatistics();
    } catch (error) {
      console.error('Error publishing result:', error);
    }
  };

  const handleUnpublishResult = async (examId: string, studentId: string) => {
    try {
      await resultsService.unpublishResult(examId, studentId);
      await loadResults();
      await loadStatistics();
    } catch (error) {
      console.error('Error unpublishing result:', error);
    }
  };

  const getStatusBadge = (status: string, published: boolean) => {
    if (published) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Published</span>;
    }
    
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending Review</span>;
      case 'in-review':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">In Review</span>;
      case 'scored':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Scored</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueExams = () => {
    const examMap = new Map();
    results.forEach(result => {
      if (!examMap.has(result.examId)) {
        examMap.set(result.examId, {
          id: result.examId,
          title: result.examTitle,
          type: result.examType
        });
      }
    });
    return Array.from(examMap.values());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Results Management</h1>
          <p className="text-gray-600">Review, score, and publish student exam results</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.totalSubmissions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{statistics.pendingReview}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600">{statistics.published}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Overall Score</p>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.averageScores.overall.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students, emails, exams..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Pending Review</option>
              <option value="in-review">In Review</option>
              <option value="scored">Scored</option>
            </select>
          </div>

          {/* Exam Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
            >
              <option value="all">All Exams</option>
              {getUniqueExams().map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.title} ({exam.type})
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setExamFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {result.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.studentEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.examTitle}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {result.examType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(result.submittedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(result.status, result.published)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.scores?.overall ? (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {result.scores.overall.toFixed(1)}
                        </span>
                        {result.bandScore && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Band {result.bandScore})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not scored</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`/admin/results/${result.examId}/${result.studentId}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/admin/results/${result.examId}/${result.studentId}/edit`, '_blank')}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Score & Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {result.published ? (
                        <button
                          onClick={() => handleUnpublishResult(result.examId, result.studentId)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Unpublish Result"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublishResult(result.examId, result.studentId)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                          title="Publish Result"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || examFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'No exam submissions have been received yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsManagement;