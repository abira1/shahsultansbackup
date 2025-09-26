import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon, 
  PlusIcon,
  EditIcon,
  TrashIcon,
  PlayIcon,
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import { listeningService } from '../../../services/listeningService';
import { ListeningTrack, ListeningQuestion } from '../../../types/listening';

const ListeningTrackSections: React.FC = () => {
  const navigate = useNavigate();
  const { trackId } = useParams<{ trackId: string }>();
  
  const [track, setTrack] = useState<ListeningTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    if (trackId) {
      loadTrack();
    }
  }, [trackId]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      if (!trackId) return;

      const trackData = await listeningService.getTrackById(trackId);
      setTrack(trackData);
    } catch (error) {
      console.error('Error loading track:', error);
      alert('Failed to load track');
      navigate('/admin/listening/tracks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (sectionNumber: 1 | 2 | 3 | 4, questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      if (!trackId) return;
      await listeningService.deleteQuestion(trackId, sectionNumber, questionId);
      await loadTrack(); // Reload to get updated data
      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const handlePublishTrack = async () => {
    if (!track || !trackId) return;

    try {
      // Validate track before publishing
      const validation = await listeningService.validateTrackForPublishing(trackId);
      
      if (!validation.isValid) {
        alert(`Cannot publish track:\n${validation.errors.join('\n')}`);
        return;
      }

      await listeningService.togglePublish(trackId, !track.isPublished);
      await loadTrack();
      alert(`Track ${track.isPublished ? 'unpublished' : 'published'} successfully!`);
    } catch (error) {
      console.error('Error publishing track:', error);
      alert('Failed to publish track');
    }
  };

  const getSectionIcon = (sectionNumber: number) => {
    const icons = {
      1: '📞', // Phone conversation
      2: '🏢', // Workplace/service
      3: '🎓', // Academic discussion
      4: '📚'  // Academic lecture
    };
    return icons[sectionNumber as keyof typeof icons] || '📝';
  };

  const getSectionDescription = (sectionNumber: number) => {
    const descriptions = {
      1: 'Conversation between two people in a social context',
      2: 'Monologue in a social context (e.g., information about facilities)',
      3: 'Conversation between up to four people in an academic context',
      4: 'Monologue on an academic subject (e.g., university lecture)'
    };
    return descriptions[sectionNumber as keyof typeof descriptions] || '';
  };

  const QuestionTypeIcon = ({ type }: { type: string }) => {
    const icons: { [key: string]: string } = {
      'multiple-choice-single': '🔘',
      'multiple-choice-multiple': '☑️',
      'matching': '🔗',
      'form-completion': '📋',
      'note-completion': '📝',
      'table-completion': '📊',
      'sentence-completion': '✍️',
      'short-answer': '💬',
      'diagram-labeling': '🏗️',
      'flow-chart-completion': '📈'
    };
    return <span>{icons[type] || '❓'}</span>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!track) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track not found</h3>
            <button
              onClick={() => navigate('/admin/listening/tracks')}
              className="text-primary hover:text-primary/80"
            >
              Back to Tracks
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/listening/tracks')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{track.title}</h1>
              <p className="text-gray-600">
                Manage questions across 4 listening sections
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePublishTrack}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                track.isPublished
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              <CheckCircleIcon className="h-4 w-4" />
              {track.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Track Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlayIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{Math.round((track.audioDuration || 0) / 60)} min</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileTextIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="font-semibold">{track.totalQuestions}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-semibold capitalize">{track.difficulty}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                track.isPublished 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">{track.isPublished ? 'Published' : 'Draft'}</p>
              </div>
            </div>
          </div>
          
          {track.audioUrl && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <audio controls className="w-full">
                <source src={track.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[1, 2, 3, 4].map((sectionNum) => {
            const section = track.sections[`section${sectionNum}` as keyof typeof track.sections];
            return (
              <button
                key={sectionNum}
                onClick={() => setSelectedSection(sectionNum as 1 | 2 | 3 | 4)}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  selectedSection === sectionNum
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">{getSectionIcon(sectionNum)}</div>
                  <div className="font-medium">Section {sectionNum}</div>
                  <div className="text-xs opacity-75">{section.questions.length} questions</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Section Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {getSectionIcon(selectedSection)} Section {selectedSection}
              </h3>
              <button
                onClick={() => navigate(`/admin/listening/tracks/${trackId}/sections/${selectedSection}/questions/new`)}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add Question
              </button>
            </div>
            <p className="text-gray-600 text-sm">{getSectionDescription(selectedSection)}</p>
          </div>

          {/* Questions List */}
          <div className="divide-y divide-gray-200">
            {track.sections[`section${selectedSection}` as keyof typeof track.sections].questions.length === 0 ? (
              <div className="p-8 text-center">
                <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-4">
                  Start adding questions for Section {selectedSection}
                </p>
                <button
                  onClick={() => navigate(`/admin/listening/tracks/${trackId}/sections/${selectedSection}/questions/new`)}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add First Question
                </button>
              </div>
            ) : (
              track.sections[`section${selectedSection}` as keyof typeof track.sections].questions.map((question: ListeningQuestion) => (
                <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded font-mono">
                          Q{question.questionNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <QuestionTypeIcon type={question.type} />
                          <span className="text-sm text-gray-600 capitalize">
                            {question.type.replace('-', ' ')}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          question.difficulty === 'easy' 
                            ? 'bg-green-100 text-green-800'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-gray-900 mb-2">{question.text}</p>
                      
                      {question.options && question.options.length > 0 && (
                        <div className="text-sm text-gray-600 mb-2">
                          Options: {question.options.join(', ')}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Points: {question.points}</span>
                        {question.timeStamp && (
                          <span>Time: {Math.floor(question.timeStamp / 60)}:{(question.timeStamp % 60).toString().padStart(2, '0')}</span>
                        )}
                        {question.keywords && question.keywords.length > 0 && (
                          <span>Keywords: {question.keywords.join(', ')}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/admin/listening/tracks/${trackId}/sections/${selectedSection}/questions/${question.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit question"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(selectedSection, question.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete question"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListeningTrackSections;