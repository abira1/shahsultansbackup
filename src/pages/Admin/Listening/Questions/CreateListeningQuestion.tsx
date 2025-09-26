import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon, 
  SaveIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
  InfoIcon,
  AlertCircleIcon
} from 'lucide-react';
import { listeningService } from '../../../../services/listeningService';
import { 
  ListeningTrack, 
  CreateQuestionData,
  QuestionType,
  QuestionDifficulty
} from '../../../../types/listening';

const CreateListeningQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { trackId, sectionNumber, questionId } = useParams<{ 
    trackId: string; 
    sectionNumber: string;
    questionId?: string;
  }>();
  
  const [track, setTrack] = useState<ListeningTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice-single');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [points, setPoints] = useState(1);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [timeStamp, setTimeStamp] = useState<number | undefined>();
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState('');
  const [maxWords, setMaxWords] = useState<number | undefined>();
  
  const isEdit = !!questionId;

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

      // If editing, load existing question data
      if (questionId && sectionNumber) {
        const sectionKey = `section${sectionNumber}` as keyof typeof trackData.sections;
        const section = trackData.sections[sectionKey];
        const existingQuestion = section.questions.find(q => q.id === questionId);
        
        if (existingQuestion) {
          setQuestionType(existingQuestion.type);
          setQuestionText(existingQuestion.text);
          setOptions(existingQuestion.options || ['', '', '', '']);
          setCorrectAnswer(typeof existingQuestion.correctAnswer === 'string' ? existingQuestion.correctAnswer : '');
          setCorrectAnswers(existingQuestion.correctAnswers || []);
          setPoints(existingQuestion.points);
          setDifficulty(existingQuestion.difficulty);
          setTimeStamp(existingQuestion.timeStamp);
          setKeywords(existingQuestion.keywords || ['']);
          setInstructions(existingQuestion.instructions || '');
          setMaxWords(existingQuestion.maxWords);
        }
      }
    } catch (error) {
      console.error('Error loading track:', error);
      alert('Failed to load track');
      navigate('/admin/listening/tracks');
    } finally {
      setLoading(false);
    }
  };

  const questionTypes: { value: QuestionType; label: string; description: string }[] = [
    {
      value: 'multiple-choice-single',
      label: 'Multiple Choice (Single)',
      description: 'Choose one correct answer from 3-4 options'
    },
    {
      value: 'multiple-choice-multiple',
      label: 'Multiple Choice (Multiple)',
      description: 'Choose multiple correct answers from given options'
    },
    {
      value: 'matching',
      label: 'Matching',
      description: 'Match items from two lists'
    },
    {
      value: 'form-completion',
      label: 'Form Completion',
      description: 'Complete a form with missing information'
    },
    {
      value: 'note-completion',
      label: 'Note Completion',
      description: 'Complete notes with missing words/phrases'
    },
    {
      value: 'table-completion',
      label: 'Table Completion',
      description: 'Fill in missing information in a table'
    },
    {
      value: 'sentence-completion',
      label: 'Sentence Completion',
      description: 'Complete sentences with missing words'
    },
    {
      value: 'short-answer',
      label: 'Short Answer',
      description: 'Provide short answers to questions'
    },
    {
      value: 'diagram-labeling',
      label: 'Diagram Labeling',
      description: 'Label parts of a diagram'
    },
    {
      value: 'flow-chart-completion',
      label: 'Flow Chart Completion',
      description: 'Complete a flow chart with missing information'
    },
    {
      value: 'map-plan-diagram',
      label: 'Map/Plan/Diagram',
      description: 'Complete information on maps, plans or diagrams'
    }
  ];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const addKeyword = () => {
    setKeywords([...keywords, '']);
  };

  const removeKeyword = (index: number) => {
    if (keywords.length > 1) {
      const newKeywords = keywords.filter((_, i) => i !== index);
      setKeywords(newKeywords);
    }
  };

  const handleCorrectAnswersChange = (answer: string, checked: boolean) => {
    if (checked) {
      setCorrectAnswers([...correctAnswers, answer]);
    } else {
      setCorrectAnswers(correctAnswers.filter(a => a !== answer));
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!questionText.trim()) {
      errors.push('Question text is required');
    }
    
    if (questionType.includes('multiple-choice') && options.filter(opt => opt.trim()).length < 2) {
      errors.push('At least 2 options are required for multiple choice questions');
    }
    
    if (questionType === 'multiple-choice-single' && !correctAnswer.trim()) {
      errors.push('Correct answer is required for single choice questions');
    }
    
    if (questionType === 'multiple-choice-multiple' && correctAnswers.length === 0) {
      errors.push('At least one correct answer is required for multiple choice questions');
    }
    
    if (points < 1) {
      errors.push('Points must be at least 1');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    if (!trackId || !sectionNumber) {
      alert('Missing track or section information');
      return;
    }

    setSaving(true);
    
    try {
      const questionData: CreateQuestionData = {
        type: questionType,
        text: questionText.trim(),
        difficulty,
        points,
        timeStamp,
        keywords: keywords.filter(k => k.trim()).map(k => k.trim()),
        instructions: instructions.trim() || undefined,
        maxWords: maxWords || undefined
      };

      // Add type-specific fields
      if (questionType.includes('multiple-choice')) {
        questionData.options = options.filter(opt => opt.trim()).map(opt => opt.trim());
        
        if (questionType === 'multiple-choice-single') {
          questionData.correctAnswer = correctAnswer.trim();
        } else {
          questionData.correctAnswers = correctAnswers.filter(ans => ans.trim()).map(ans => ans.trim());
        }
      } else {
        // For non-multiple-choice questions, correctAnswer is the expected answer
        questionData.correctAnswer = correctAnswer.trim();
      }

      const sectionNum = parseInt(sectionNumber) as 1 | 2 | 3 | 4;
      
      if (isEdit && questionId) {
        await listeningService.updateQuestion(trackId, sectionNum, questionId, questionData);
        alert('Question updated successfully!');
      } else {
        await listeningService.addQuestion(trackId, sectionNum, questionData);
        alert('Question created successfully!');
      }

      navigate(`/admin/listening/tracks/${trackId}/sections`);
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionTypeSpecificFields = () => {
    switch (questionType) {
      case 'multiple-choice-single':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Option
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select correct answer</option>
                {options.filter(opt => opt.trim()).map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'multiple-choice-multiple':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Option
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answers (Select multiple)
              </label>
              <div className="space-y-2">
                {options.filter(opt => opt.trim()).map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={correctAnswers.includes(option)}
                      onChange={(e) => handleCorrectAnswersChange(option, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'short-answer':
      case 'sentence-completion':
      case 'note-completion':
      case 'form-completion':
      case 'table-completion':
      case 'diagram-labeling':
      case 'flow-chart-completion':
      case 'map-plan-diagram':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Answer/Key Words
              </label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter the expected answer or key words"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                For multiple acceptable answers, separate with commas (e.g., "answer1, answer2, answer3")
              </p>
            </div>
            
            {(questionType === 'short-answer' || questionType.includes('completion')) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Words (optional)
                </label>
                <input
                  type="number"
                  value={maxWords || ''}
                  onChange={(e) => setMaxWords(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., 3 (for 'NO MORE THAN THREE WORDS')"
                />
              </div>
            )}
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matching Pairs
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Enter the correct matching answer (e.g., "A", "B", "C" for letter matching, or the actual matched item)
              </p>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter the correct match (e.g., 'B' or 'Swimming Pool')"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/admin/listening/tracks/${trackId}/sections`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit' : 'Create'} Question - Section {sectionNumber}
            </h1>
            <p className="text-gray-600">
              {track.title}
            </p>
          </div>
        </div>

        {/* Track Audio Player */}
        {track.audioUrl && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <PlayIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Track Audio</span>
            </div>
            <audio controls className="w-full">
              <source src={track.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Question Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {questionTypes.find(t => t.value === questionType)?.description}
              </p>
            </div>

            {/* Basic Question Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                  min="1"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={3}
                placeholder="Enter the question text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
                required
              />
            </div>

            {/* Instructions (optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions (optional)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="Special instructions for this question (optional)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
              />
            </div>

            {/* Question Type Specific Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Answer Configuration</h3>
              {renderQuestionTypeSpecificFields()}
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Stamp (seconds) - optional
                </label>
                <input
                  type="number"
                  value={timeStamp || ''}
                  onChange={(e) => setTimeStamp(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="0"
                  placeholder="When this question appears in the audio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (for search and categorization)
              </label>
              <div className="space-y-2">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder="Enter keyword"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    {keywords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addKeyword}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Keyword
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(`/admin/listening/tracks/${trackId}/sections`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4" />
                  {isEdit ? 'Update' : 'Create'} Question
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <h4 className="font-semibold mb-2">Question Creation Tips:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use clear, unambiguous language in your questions</li>
                <li>Add time stamps to help students locate answers in the audio</li>
                <li>Include relevant keywords for better searchability</li>
                <li>For completion questions, accept multiple valid answers where appropriate</li>
                <li>Test your questions with the audio to ensure they work correctly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateListeningQuestion;