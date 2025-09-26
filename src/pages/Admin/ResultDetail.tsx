import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle,
  Star,
  Edit3,
  Save,
  BookOpen,
  Headphones,
  Mic,
  PenTool
} from 'lucide-react';
import { resultsService, AdminExamResult, DetailedAnswer } from '../../services/resultsService';

const ResultDetail: React.FC = () => {
  const { examId, studentId } = useParams<{ examId: string; studentId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AdminExamResult | null>(null);
  const [detailedAnswers, setDetailedAnswers] = useState<DetailedAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [scores, setScores] = useState({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    overall: 0
  });
  const [bandScore, setBandScore] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (examId && studentId) {
      loadResultDetail();
    }
  }, [examId, studentId]);

  const loadResultDetail = async () => {
    try {
      setLoading(true);
      const data = await resultsService.getDetailedResult(examId!, studentId!);
      setResult(data.result);
      setDetailedAnswers(data.detailedAnswers);
      
      // Initialize edit form with existing scores
      if (data.result.scores) {
        setScores({
          listening: data.result.scores.listening || 0,
          reading: data.result.scores.reading || 0,
          writing: data.result.scores.writing || 0,
          speaking: data.result.scores.speaking || 0,
          overall: data.result.scores.overall || 0
        });
      }
      if (data.result.bandScore) {
        setBandScore(data.result.bandScore);
      }
      if (data.result.notes) {
        setNotes(data.result.notes);
      }
    } catch (error) {
      console.error('Error loading result detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScores = async () => {
    try {
      await resultsService.updateResult(examId!, studentId!, {
        scores,
        bandScore,
        notes,
        status: 'scored'
      });
      setEditMode(false);
      await loadResultDetail();
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };

  const handlePublish = async () => {
    try {
      await resultsService.publishResult(examId!, studentId!);
      await loadResultDetail();
    } catch (error) {
      console.error('Error publishing result:', error);
    }
  };

  const getSectionIcon = (sectionTitle: string) => {
    const lowerTitle = sectionTitle.toLowerCase();
    if (lowerTitle.includes('listen')) return <Headphones className="w-5 h-5" />;
    if (lowerTitle.includes('read')) return <BookOpen className="w-5 h-5" />;
    if (lowerTitle.includes('writ')) return <PenTool className="w-5 h-5" />;
    if (lowerTitle.includes('speak')) return <Mic className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Result not found</h2>
          <button
            onClick={() => navigate('/admin/results')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/results')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Result Details</h1>
            <p className="text-gray-600">{result.examTitle} - {result.studentName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Scores
            </button>
          )}
          {editMode && (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScores}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </>
          )}
          {!result.published && !editMode && (
            <button
              onClick={handlePublish}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Publish Result
            </button>
          )}
        </div>
      </div>

      {/* Student & Exam Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Student Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Name</span>
              <p className="text-gray-900">{result.studentName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-gray-900">{result.studentEmail}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Submitted</span>
              <p className="text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                {formatDate(result.submittedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-600" />
            Exam Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Exam Title</span>
              <p className="text-gray-900">{result.examTitle}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Type</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(result.examType || '')}`}>
                {result.examType}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <div className="flex items-center">
                {result.published ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {result.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scores Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-600" />
          Scores & Assessment
        </h2>
        
        {editMode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Listening</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scores.listening}
                  onChange={(e) => setScores(prev => ({ ...prev, listening: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reading</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scores.reading}
                  onChange={(e) => setScores(prev => ({ ...prev, reading: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Writing</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scores.writing}
                  onChange={(e) => setScores(prev => ({ ...prev, writing: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speaking</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scores.speaking}
                  onChange={(e) => setScores(prev => ({ ...prev, speaking: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overall</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scores.overall}
                  onChange={(e) => setScores(prev => ({ ...prev, overall: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Band Score</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  step="0.5"
                  value={bandScore}
                  onChange={(e) => setBandScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Feedback</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes or feedback for the student..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['listening', 'reading', 'writing', 'speaking', 'overall'].map((type) => (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {result.scores?.[type as keyof typeof result.scores] || 0}
                </div>
                <div className="text-sm text-gray-500 capitalize">{type}</div>
              </div>
            ))}
            {result.bandScore && (
              <div className="md:col-span-5 text-center pt-4 border-t border-gray-200">
                <div className="text-3xl font-bold text-purple-600">Band {result.bandScore}</div>
                <div className="text-sm text-gray-500">Overall Band Score</div>
              </div>
            )}
            {result.notes && (
              <div className="md:col-span-5 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Notes / Feedback</h3>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{result.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Answers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Detailed Answers ({detailedAnswers.length} questions)
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {detailedAnswers.map((answer, index) => (
            <div key={answer.questionId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{answer.questionText}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-500 flex items-center">
                        {getSectionIcon(answer.sectionTitle || '')}
                        <span className="ml-1">{answer.sectionTitle}</span>
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {answer.questionType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {answer.points}/{answer.maxPoints} points
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Student Answer</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900">{answer.studentAnswer}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Correct Answer</h4>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-gray-900">
                      {Array.isArray(answer.correctAnswer) 
                        ? answer.correctAnswer.join(', ') 
                        : answer.correctAnswer || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {answer.feedback && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-900">{answer.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultDetail;