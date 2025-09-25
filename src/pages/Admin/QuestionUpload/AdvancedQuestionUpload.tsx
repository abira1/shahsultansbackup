import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon, 
  SaveIcon, 
  PlusIcon,
  UploadIcon,
  AlertCircleIcon,
  FileAudioIcon,
  ImageIcon,
  TrashIcon
} from 'lucide-react';
import { questionService, mediaService, sectionService } from '../../../services/examService';
import { Question, QuestionType, Section } from '../../../types/exam';

interface QuestionFormData {
  questionText: string;
  type: QuestionType;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correctAnswers?: number[];
  acceptedAnswers?: string[][];
  leftItems?: string[];
  rightItems?: string[];
  correctMatches?: { [key: string]: string };
  correctAnswer?: 'true' | 'false' | 'not-given';
  wordLimit?: number;
  sampleAnswer?: string;
  preparationTime?: number;
  responseTime?: number;
  explanation?: string;
  tags?: string[];
}

const QuestionUpload: React.FC = () => {
  const navigate = useNavigate();
  const { testId, sectionId } = useParams<{ testId: string; sectionId: string }>();
  const audioFileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<QuestionFormData>({
    questionText: '',
    type: 'multiple-choice-single',
    points: 1,
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctAnswers: [],
    explanation: '',
    tags: []
  });
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [section, setSection] = useState<Section | null>(null);

  // Load section data
  React.useEffect(() => {
    if (sectionId) {
      loadSection();
    }
  }, [sectionId]);

  const loadSection = async () => {
    try {
      if (sectionId) {
        const sectionData = await sectionService.getById(sectionId);
        setSection(sectionData);
      }
    } catch (error) {
      console.error('Error loading section:', error);
    }
  };

  const questionTypes = [
    { value: 'multiple-choice-single', label: 'Multiple Choice (Single Answer)' },
    { value: 'multiple-choice-multiple', label: 'Multiple Choice (Multiple Answers)' },
    { value: 'fill-in-blank', label: 'Fill in the Blank' },
    { value: 'matching', label: 'Matching' },
    { value: 'true-false-not-given', label: 'True/False/Not Given' },
    { value: 'writing-task-1', label: 'Writing Task 1' },
    { value: 'writing-task-2', label: 'Writing Task 2' },
    { value: 'speaking-part-1', label: 'Speaking Part 1' },
    { value: 'speaking-part-2', label: 'Speaking Part 2' },
    { value: 'speaking-part-3', label: 'Speaking Part 3' }
  ];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.questionText.trim()) {
      newErrors.questionText = 'Question text is required';
    }

    if (formData.points <= 0) {
      newErrors.points = 'Points must be greater than 0';
    }

    // Type-specific validations
    switch (formData.type) {
      case 'multiple-choice-single':
      case 'multiple-choice-multiple':
        if (!formData.options || formData.options.filter(opt => opt.trim()).length < 2) {
          newErrors.options = 'At least 2 options are required';
        }
        if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
          newErrors.correctAnswers = 'At least one correct answer must be selected';
        }
        break;
        
      case 'fill-in-blank':
        if (!formData.acceptedAnswers || formData.acceptedAnswers.length === 0) {
          newErrors.acceptedAnswers = 'Accepted answers are required';
        }
        break;
        
      case 'matching':
        if (!formData.leftItems || formData.leftItems.filter(item => item.trim()).length < 2) {
          newErrors.leftItems = 'At least 2 left items are required';
        }
        if (!formData.rightItems || formData.rightItems.filter(item => item.trim()).length < 2) {
          newErrors.rightItems = 'At least 2 right items are required';
        }
        break;
        
      case 'true-false-not-given':
        if (!formData.correctAnswer) {
          newErrors.correctAnswer = 'Correct answer must be selected';
        }
        break;
        
      case 'writing-task-1':
      case 'writing-task-2':
        if (!formData.wordLimit || formData.wordLimit <= 0) {
          newErrors.wordLimit = 'Word limit must be specified';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    handleInputChange('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(formData.options || []), ''];
    handleInputChange('options', newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = (formData.options || []).filter((_, i) => i !== index);
    handleInputChange('options', newOptions);
  };

  const handleCorrectAnswerToggle = (index: number) => {
    const currentAnswers = formData.correctAnswers || [];
    const newAnswers = formData.type === 'multiple-choice-single' 
      ? [index] 
      : currentAnswers.includes(index)
        ? currentAnswers.filter(i => i !== index)
        : [...currentAnswers, index];
    
    handleInputChange('correctAnswers', newAnswers);
  };

  const handleFileUpload = async (file: File, type: 'audio' | 'image') => {
    try {
      setUploadProgress({ [type]: 0 });
      
      const mediaFile = await mediaService.upload(
        file, 
        `questions/${type}s`, 
        (progress) => setUploadProgress({ [type]: progress })
      );
      
      if (type === 'audio') {
        setAudioUrl(mediaFile.url);
      } else {
        setImageUrl(mediaFile.url);
      }
      
      setUploadProgress({ [type]: 100 });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Failed to upload ${type}. Please try again.`);
      setUploadProgress({ [type]: 0 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!sectionId) {
      alert('Section ID is required');
      return;
    }

    setLoading(true);
    try {
      const questionNumber = section ? section.questions.length + 1 : 1;
      
      const questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'> = {
        sectionId,
        testId: testId!,
        questionNumber,
        ...formData,
        audioUrl: audioUrl || undefined,
        imageUrl: imageUrl || undefined
      };

      await questionService.create(questionData);
      
      alert('Question created successfully!');
      
      // Reset form or navigate
      const shouldContinue = window.confirm('Question saved! Do you want to add another question?');
      if (shouldContinue) {
        // Reset form
        setFormData({
          questionText: '',
          type: 'multiple-choice-single',
          points: 1,
          difficulty: 'medium',
          options: ['', '', '', ''],
          correctAnswers: [],
          explanation: '',
          tags: []
        });
        setAudioFile(null);
        setImageFile(null);
        setAudioUrl('');
        setImageUrl('');
      } else {
        navigate(`/admin/tests/${testId}`);
      }
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionTypeFields = () => {
    switch (formData.type) {
      case 'multiple-choice-single':
      case 'multiple-choice-multiple':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options *
              </label>
              {(formData.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <input
                    type={formData.type === 'multiple-choice-single' ? 'radio' : 'checkbox'}
                    name="correctAnswers"
                    checked={(formData.correctAnswers || []).includes(index)}
                    onChange={() => handleCorrectAnswerToggle(index)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {(formData.options || []).length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
              >
                <PlusIcon className="h-4 w-4" />
                Add Option
              </button>
              {errors.options && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircleIcon className="h-4 w-4" />
                  {errors.options}
                </p>
              )}
            </div>
          </div>
        );

      case 'fill-in-blank':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accepted Answers * (one per line)
            </label>
            <textarea
              rows={4}
              value={formData.acceptedAnswers?.map(answers => answers.join(', ')).join('\n') || ''}
              onChange={(e) => {
                const lines = e.target.value.split('\n');
                const acceptedAnswers = lines.map(line => 
                  line.split(',').map(answer => answer.trim()).filter(answer => answer)
                );
                handleInputChange('acceptedAnswers', acceptedAnswers);
              }}
              placeholder="answer1, alternative1&#10;answer2, alternative2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.acceptedAnswers && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircleIcon className="h-4 w-4" />
                {errors.acceptedAnswers}
              </p>
            )}
          </div>
        );

      case 'true-false-not-given':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <div className="space-y-2">
              {(['true', 'false', 'not-given'] as const).map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={option}
                    checked={formData.correctAnswer === option}
                    onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {option.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
            {errors.correctAnswer && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircleIcon className="h-4 w-4" />
                {errors.correctAnswer}
              </p>
            )}
          </div>
        );

      case 'writing-task-1':
      case 'writing-task-2':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Limit *
              </label>
              <input
                type="number"
                value={formData.wordLimit || ''}
                onChange={(e) => handleInputChange('wordLimit', parseInt(e.target.value) || 0)}
                placeholder="150"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.wordLimit && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircleIcon className="h-4 w-4" />
                  {errors.wordLimit}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample Answer (Optional)
              </label>
              <textarea
                rows={6}
                value={formData.sampleAnswer || ''}
                onChange={(e) => handleInputChange('sampleAnswer', e.target.value)}
                placeholder="Provide a sample answer for reference..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/tests/${testId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Question</h1>
              {section && (
                <p className="text-gray-600">
                  Section: {section.title} (Question #{section.questions.length + 1})
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <SaveIcon className="h-4 w-4" />
            )}
            Save Question
          </button>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as QuestionType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points *
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => handleInputChange('questionText', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.questionText ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your question text here..."
                />
                {errors.questionText && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircleIcon className="h-4 w-4" />
                    {errors.questionText}
                  </p>
                )}
              </div>

              {/* Media Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio File (Optional)
                  </label>
                  <div className="space-y-2">
                    <input
                      ref={audioFileRef}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAudioFile(file);
                          handleFileUpload(file, 'audio');
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => audioFileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                    >
                      <UploadIcon className="h-5 w-5 text-gray-400" />
                      Upload Audio
                    </button>
                    {uploadProgress.audio !== undefined && uploadProgress.audio < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.audio}%` }}
                        ></div>
                      </div>
                    )}
                    {audioUrl && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <FileAudioIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">Audio uploaded successfully</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image (Optional)
                  </label>
                  <div className="space-y-2">
                    <input
                      ref={imageFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          handleFileUpload(file, 'image');
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageFileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                    >
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                      Upload Image
                    </button>
                    {uploadProgress.image !== undefined && uploadProgress.image < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.image}%` }}
                        ></div>
                      </div>
                    )}
                    {imageUrl && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <ImageIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">Image uploaded successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Type Specific Fields */}
              {renderQuestionTypeFields()}

              {/* Explanation */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={formData.explanation || ''}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuestionUpload;