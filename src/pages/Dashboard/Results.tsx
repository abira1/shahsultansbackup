import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  Download, 
  Calendar, 
  Award, 

  CheckCircle,
  FileText,
  Eye,
  Star,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { resultsService, AdminExamResult } from '../../services/resultsService';

// Mock user context - replace with actual auth context
const getCurrentUserId = () => 'current-user-id'; // Replace with actual user ID from auth

const Results: React.FC = () => {
  const [results, setResults] = useState<AdminExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<AdminExamResult | null>(null);

  useEffect(() => {
    loadStudentResults();
  }, []);

  const loadStudentResults = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      const studentResults = await resultsService.getStudentResults(userId);
      setResults(studentResults);
    } catch (error) {
      console.error('Error loading student results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionIcon = (examType: string) => {
    switch (examType?.toLowerCase()) {
      case 'listening': return <Headphones className="w-5 h-5 text-purple-600" />;
      case 'reading': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'writing': return <PenTool className="w-5 h-5 text-green-600" />;
      case 'speaking': return <Mic className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'listening': return 'text-purple-600 bg-purple-100';
      case 'reading': return 'text-blue-600 bg-blue-100';
      case 'writing': return 'text-green-600 bg-green-100';
      case 'speaking': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateOverallBand = () => {
    if (results.length === 0) return 0;
    const validScores = results.filter(r => r.bandScore);
    if (validScores.length === 0) return 0;
    return validScores.reduce((sum, r) => sum + (r.bandScore || 0), 0) / validScores.length;
  };

  const getScoresByType = () => {
    const scoresByType = {
      listening: [] as number[],
      reading: [] as number[],
      writing: [] as number[],
      speaking: [] as number[]
    };

    results.forEach(result => {
      if (result.scores) {
        if (result.scores.listening) scoresByType.listening.push(result.scores.listening);
        if (result.scores.reading) scoresByType.reading.push(result.scores.reading);
        if (result.scores.writing) scoresByType.writing.push(result.scores.writing);
        if (result.scores.speaking) scoresByType.speaking.push(result.scores.speaking);
      }
    });

    return {
      listening: scoresByType.listening.length > 0 
        ? scoresByType.listening.reduce((sum, score) => sum + score, 0) / scoresByType.listening.length 
        : 0,
      reading: scoresByType.reading.length > 0 
        ? scoresByType.reading.reduce((sum, score) => sum + score, 0) / scoresByType.reading.length 
        : 0,
      writing: scoresByType.writing.length > 0 
        ? scoresByType.writing.reduce((sum, score) => sum + score, 0) / scoresByType.writing.length 
        : 0,
      speaking: scoresByType.speaking.length > 0 
        ? scoresByType.speaking.reduce((sum, score) => sum + score, 0) / scoresByType.speaking.length 
        : 0,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const overallBand = calculateOverallBand();
  const scoresByType = getScoresByType();

  return (
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
        Test Results
      </h1>

      {/* Overall Performance Summary */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Overall Performance
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Your IELTS journey progress
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <Button variant="outline" size="sm" className="flex items-center text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-lg text-center">
              <p className="text-xs sm:text-sm mb-0.5 sm:mb-1">Current Band</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                {overallBand.toFixed(1)}
              </p>
              <div className="mt-1 inline-flex items-center text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full">
                <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                <span className="text-xs">Latest Score</span>
              </div>
            </div>

            {['listening', 'reading', 'writing', 'speaking'].map((type) => (
              <div key={type} className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1 capitalize">
                  {type}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {scoresByType[type as keyof typeof scoresByType].toFixed(1)}
                </p>
                <div className="mt-1 inline-flex items-center text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 rounded-full">
                  <span className="text-xs">Avg Score</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
            <p className="text-gray-500">
              Complete some exams to see your performance here.
            </p>
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Recent Test Results</h2>
          <p className="text-gray-600 text-sm">View your published exam results</p>
        </div>

        {results.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {results.map((result) => (
              <div key={result.id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getSectionIcon(result.examType || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {result.examTitle}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(result.examType || '')}`}>
                          {result.examType}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(result.submittedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-4">
                    {/* Score Display */}
                    <div className="text-right">
                      {result.scores?.overall ? (
                        <div>
                          <div className="flex items-center justify-end">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-lg font-semibold text-gray-900">
                              {result.scores.overall.toFixed(1)}%
                            </span>
                          </div>
                          {result.bandScore && (
                            <div className="flex items-center justify-end mt-1">
                              <Award className="w-4 h-4 text-purple-500 mr-1" />
                              <span className="text-sm text-gray-600">
                                Band {result.bandScore}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not scored</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-green-600 font-medium">Published</span>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Show detailed breakdown if selected */}
                {selectedResult?.id === result.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Score Breakdown</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {result.scores && Object.entries(result.scores).map(([type, score]) => (
                        <div key={type} className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {score?.toFixed(1) || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{type}</div>
                        </div>
                      ))}
                    </div>
                    
                    {result.notes && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Feedback</h5>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{result.notes}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Hide Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No published results</h3>
            <p className="text-gray-500">
              Your exam results will appear here once they have been reviewed and published by your instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;