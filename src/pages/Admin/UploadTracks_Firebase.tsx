import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  FileAudio, 
  BookOpen, 
  PenTool, 
  Plus,
  Upload,
  ArrowLeft,
  Save,
  Trash2,
  Image,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { 
  trackManagementService, 
  TrackData, 
  SectionData, 
  QuestionData,
  TrackType as ServiceTrackType,
  ExamType
} from '../../services/trackManagementService';

type TrackType = 'academic-listening' | 'general-listening' | 'academic-reading' | 'general-reading' | 'writing-task1' | 'writing-task2';

interface TrackTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: TrackType;
}

const UploadTracks: React.FC = () => {
  // Form state
  const [selectedTrackType, setSelectedTrackType] = useState<TrackType | null>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'upload' | 'sections' | 'content'>('select');
  const [trackTitle, setTrackTitle] = useState('');
  
  // File upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [passageFile, setPassageFile] = useState<File | null>(null);
  const [passageText, setPassageText] = useState('');
  const [taskImageFile, setTaskImageFile] = useState<File | null>(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [sampleAnswer, setSampleAnswer] = useState('');
  
  // Sections and questions state
  const [sections, setSections] = useState<SectionData[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Loading and message state
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const trackTemplates: TrackTemplate[] = [
    {
      id: 'academic-listening',
      title: 'Academic Listening',
      description: '4 sections, 40 questions total',
      icon: <FileAudio className="h-8 w-8" />,
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      type: 'academic-listening'
    },
    {
      id: 'general-listening',
      title: 'General Listening',
      description: '4 sections, 40 questions total',
      icon: <FileAudio className="h-8 w-8" />,
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      type: 'general-listening'
    },
    {
      id: 'academic-reading',
      title: 'Academic Reading',
      description: '3 passages, 40 questions total',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'bg-green-50 border-green-200 hover:border-green-300',
      type: 'academic-reading'
    },
    {
      id: 'general-reading',
      title: 'General Reading',
      description: '3 sections, 40 questions total',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'bg-green-50 border-green-200 hover:border-green-300',
      type: 'general-reading'
    },
    {
      id: 'writing-task1',
      title: 'Writing Task 1',
      description: 'Academic/General Writing Task 1',
      icon: <PenTool className="h-8 w-8" />,
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      type: 'writing-task1'
    },
    {
      id: 'writing-task2',
      title: 'Writing Task 2 (Essay)',
      description: 'Academic/General Writing Task 2',
      icon: <PenTool className="h-8 w-8" />,
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      type: 'writing-task2'
    }
  ];

  const questionTypes = [
    { id: 'multiple-choice-single', title: 'Multiple Choice (Single)' },
    { id: 'multiple-choice-multiple', title: 'Multiple Choice (Multiple)' },
    { id: 'matching', title: 'Matching' },
    { id: 'fill-in-blank', title: 'Fill in the Blank' },
    { id: 'sentence-completion', title: 'Sentence Completion' },
    { id: 'summary-completion', title: 'Summary Completion' },
    { id: 'diagram-labeling', title: 'Diagram/Flowchart/Map Labeling' },
    { id: 'short-answer', title: 'Short Answer' },
    { id: 'true-false-not-given', title: 'True/False/Not Given' }
  ];

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const convertTrackType = (type: TrackType): { trackType: ServiceTrackType; examType: ExamType } => {
    if (type.includes('listening')) {
      return {
        trackType: 'listening',
        examType: type.includes('academic') ? 'academic' : 'general'
      };
    } else if (type.includes('reading')) {
      return {
        trackType: 'reading',
        examType: type.includes('academic') ? 'academic' : 'general'
      };
    } else {
      return {
        trackType: 'writing',
        examType: 'academic' // Default for writing
      };
    }
  };

  const initializeSections = (type: TrackType): SectionData[] => {
    if (type.includes('listening')) {
      return Array.from({ length: 4 }, (_, i) => ({
        id: trackManagementService.generateSectionId(),
        sectionNumber: i + 1,
        title: `Section ${i + 1}`,
        instructions: `Instructions for Section ${i + 1}`,
        questions: []
      }));
    } else if (type.includes('reading')) {
      return Array.from({ length: 3 }, (_, i) => ({
        id: trackManagementService.generateSectionId(),
        sectionNumber: i + 1,
        title: `Passage ${i + 1}`,
        instructions: `Read the passage and answer the questions`,
        questions: []
      }));
    } else if (type.includes('writing')) {
      return [{
        id: trackManagementService.generateSectionId(),
        sectionNumber: 1,
        title: type.includes('task1') ? 'Writing Task 1' : 'Writing Task 2',
        instructions: type.includes('task1') 
          ? 'Describe the information shown in the diagram/chart/table'
          : 'Write an essay in response to the topic',
        questions: []
      }];
    }
    return [];
  };

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handleTrackTypeSelect = (type: TrackType) => {
    setSelectedTrackType(type);
    setTrackTitle('');
    setSections(initializeSections(type));
    
    // Direct flow based on track type
    if (type.includes('listening')) {
      setCurrentStep('upload'); // Audio upload first
    } else if (type.includes('reading')) {
      setCurrentStep('sections'); // Direct to sections (no audio)
    } else if (type.includes('writing')) {
      setCurrentStep('content'); // Direct to content entry
    }
  };

  const handleAudioUpload = async (file: File) => {
    if (!selectedTrackType) return;
    
    setLoading(true);
    setUploadProgress(0);
    
    try {
      const tempTrackId = `temp_${Date.now()}`;
      const result = await trackManagementService.uploadAudioFile(file, tempTrackId);
      
      setAudioFile(file);
      setAudioUrl(result.url);
      setUploadProgress(100);
      showMessage('success', 'Audio file uploaded successfully!');
      
      // Move to sections step
      setTimeout(() => {
        setCurrentStep('sections');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error uploading audio:', error);
      showMessage('error', 'Failed to upload audio file');
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'passage' | 'task') => {
    if (!selectedTrackType) return;
    
    setLoading(true);
    
    try {
      const tempTrackId = `temp_${Date.now()}`;
      await trackManagementService.uploadImageFile(file, tempTrackId, type);
      
      if (type === 'passage') {
        setPassageFile(file);
      } else {
        setTaskImageFile(file);
      }
      
      showMessage('success', `${type} image uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', `Failed to upload ${type} image`);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (sectionIndex: number) => {
    if (sections[sectionIndex].questions.length >= 10) return;
    
    const newQuestion: QuestionData = {
      id: trackManagementService.generateQuestionId(),
      type: 'multiple-choice-single',
      questionText: '',
      questionNumber: sections[sectionIndex].questions.length + 1,
      options: [
        { id: 'A', text: '', isCorrect: false },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
      ],
      correctAnswer: '',
      marks: 1
    };

    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.push(newQuestion);
    setSections(updatedSections);
  };

  const updateQuestion = (sectionIndex: number, questionIndex: number, field: keyof QuestionData, value: any) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex] = {
      ...updatedSections[sectionIndex].questions[questionIndex],
      [field]: value
    };
    setSections(updatedSections);
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.splice(questionIndex, 1);
    
    // Renumber remaining questions
    updatedSections[sectionIndex].questions.forEach((question, index) => {
      question.questionNumber = index + 1;
    });
    
    setSections(updatedSections);
  };

  const saveTrack = async () => {
    if (!selectedTrackType || !trackTitle.trim()) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    const { trackType, examType } = convertTrackType(selectedTrackType);
    
    // Validate sections have questions (except for writing)
    if (trackType !== 'writing' && sections.some(section => section.questions.length === 0)) {
      showMessage('error', 'All sections must have at least one question');
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
      const totalMarks = sections.reduce((sum, section) => 
        sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0), 0
      );

      const trackData: Omit<TrackData, 'id' | 'createdAt' | 'updatedAt'> = {
        title: trackTitle,
        type: trackType,
        examType: examType,
        sections: sections,
        totalQuestions: totalQuestions,
        totalMarks: totalMarks,
        duration: trackType === 'listening' ? 30 : trackType === 'reading' ? 60 : 60,
        status: 'draft',
        isActive: false,
        createdBy: 'admin' // TODO: Get actual admin ID
      };

      // Add type-specific data
      if (trackType === 'listening' && audioUrl) {
        trackData.audioUrl = audioUrl;
        trackData.audioFileName = audioFile?.name;
      } else if (trackType === 'reading') {
        trackData.passageText = passageText;
        if (passageFile) {
          // Upload passage image if selected
          const result = await trackManagementService.uploadImageFile(passageFile, 'temp_passage', 'passage');
          trackData.passageImageUrl = result.url;
          trackData.passageFileName = result.fileName;
        }
      } else if (trackType === 'writing') {
        trackData.taskDescription = taskDescription;
        trackData.sampleAnswer = sampleAnswer;
        trackData.taskType = selectedTrackType.includes('task1') ? 'task1' : 'task2';
        trackData.wordLimit = selectedTrackType.includes('task1') ? 150 : 250;
        
        if (taskImageFile) {
          const result = await trackManagementService.uploadImageFile(taskImageFile, 'temp_task', 'task');
          trackData.taskImageUrl = result.url;
          trackData.taskFileName = result.fileName;
        }
      }

      // Save track to Firebase
      await trackManagementService.createTrack(trackData);
      
      showMessage('success', `Track "${trackTitle}" created successfully!`);
      
      // Reset form
      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Error saving track:', error);
      showMessage('error', 'Failed to save track');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTrackType(null);
    setCurrentStep('select');
    setTrackTitle('');
    setAudioFile(null);
    setAudioUrl('');
    setPassageFile(null);
    setPassageText('');
    setTaskImageFile(null);
    setTaskDescription('');
    setSampleAnswer('');
    setSections([]);
    setCurrentSection(0);
    setUploadProgress(0);
  };

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  const renderTrackSelection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload New Track</h1>
        <p className="text-xl text-gray-600">Choose the type of track you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trackTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTrackTypeSelect(template.type)}
            className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left ${template.color}`}
          >
            <div className="flex items-center mb-6">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                {template.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{template.title}</h3>
            <p className="text-gray-700 text-lg">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAudioUpload = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setCurrentStep('select')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Selection
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900">
            {trackTemplates.find(t => t.type === selectedTrackType)?.title}
          </h2>
          <p className="text-gray-600">Upload audio file for listening track</p>
        </div>
      </div>

      {/* Track Title */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Track Information</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Track Title</label>
          <input
            type="text"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter track title..."
            required
          />
        </div>
      </div>

      {/* Audio Upload */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Audio File</h3>
        
        {!audioUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAudioUpload(file);
              }}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer flex flex-col items-center text-center"
            >
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-lg font-medium text-gray-900">Uploading...</p>
                  <div className="w-64 bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">Upload Audio File</p>
                  <p className="text-gray-600">MP3, WAV, or other audio formats (max 100MB)</p>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="border rounded-lg p-6 bg-green-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Audio uploaded successfully</p>
                <p className="text-sm text-gray-600">{audioFile?.name}</p>
              </div>
              <button
                onClick={() => {
                  setAudioUrl('');
                  setAudioFile(null);
                  setUploadProgress(0);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      {audioUrl && trackTitle && (
        <div className="flex justify-end">
          <button
            onClick={() => setCurrentStep('sections')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            Continue to Questions
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );

  const renderSections = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setCurrentStep(selectedTrackType?.includes('listening') ? 'upload' : 'select')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900">
            {trackTemplates.find(t => t.type === selectedTrackType)?.title}
          </h2>
          <p className="text-gray-600">Add questions to your track</p>
        </div>
      </div>

      {/* Track Title (if not set) */}
      {!trackTitle && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Track Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Track Title</label>
            <input
              type="text"
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter track title..."
              required
            />
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex-1 ${
                currentSection === index
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.title} ({section.questions.length} questions)
            </button>
          ))}
        </div>

        {/* Current Section Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {sections[currentSection]?.title}
            </h3>
            <button
              onClick={() => addQuestion(currentSection)}
              disabled={sections[currentSection]?.questions.length >= 10}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {sections[currentSection]?.questions.map((question, questionIndex) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Question {question.questionNumber}</h4>
                  <button
                    onClick={() => removeQuestion(currentSection, questionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(currentSection, questionIndex, 'type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {questionTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                    <input
                      type="number"
                      value={question.marks}
                      onChange={(e) => updateQuestion(currentSection, questionIndex, 'marks', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                  <textarea
                    value={question.questionText}
                    onChange={(e) => updateQuestion(currentSection, questionIndex, 'questionText', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter the question..."
                  />
                </div>

                {/* Multiple Choice Options */}
                {(question.type === 'multiple-choice-single' || question.type === 'multiple-choice-multiple') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {option.id}
                          </span>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => {
                              const updatedOptions = [...(question.options || [])];
                              updatedOptions[optionIndex] = { ...option, text: e.target.value };
                              updateQuestion(currentSection, questionIndex, 'options', updatedOptions);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${option.id}...`}
                          />
                          <label className="flex items-center">
                            <input
                              type={question.type === 'multiple-choice-single' ? 'radio' : 'checkbox'}
                              name={`question-${question.id}-correct`}
                              checked={question.type === 'multiple-choice-single' 
                                ? question.correctAnswer === option.id
                                : Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option.id)
                              }
                              onChange={(e) => {
                                if (question.type === 'multiple-choice-single') {
                                  updateQuestion(currentSection, questionIndex, 'correctAnswer', option.id);
                                } else {
                                  const currentAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                                  const newAnswers = e.target.checked
                                    ? [...currentAnswers, option.id]
                                    : currentAnswers.filter(id => id !== option.id);
                                  updateQuestion(currentSection, questionIndex, 'correctAnswer', newAnswers);
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-600">Correct</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other question types - simplified for now */}
                {!['multiple-choice-single', 'multiple-choice-multiple'].includes(question.type) && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer(s)</label>
                    <input
                      type="text"
                      value={Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer || ''}
                      onChange={(e) => {
                        const answers = e.target.value.split(',').map(a => a.trim()).filter(a => a);
                        updateQuestion(currentSection, questionIndex, 'correctAnswer', 
                          question.type === 'multiple-choice-multiple' ? answers : answers[0] || ''
                        );
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter correct answer(s), separated by commas if multiple..."
                    />
                  </div>
                )}
              </div>
            ))}

            {sections[currentSection]?.questions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No questions added yet</p>
                <p>Click "Add Question" to start adding questions to this section</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>Total Questions: <span className="font-medium">{sections.reduce((total, section) => total + section.questions.length, 0)}</span></p>
            <p>Target: <span className="font-medium">{selectedTrackType?.includes('listening') ? '40' : '40'} questions</span></p>
          </div>
          
          <button
            onClick={saveTrack}
            disabled={!trackTitle || sections.some(section => section.questions.length === 0) || loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : 'Save Track'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setCurrentStep('select')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Selection
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900">
            {trackTemplates.find(t => t.type === selectedTrackType)?.title}
          </h2>
          <p className="text-gray-600">Add task content and sample answer</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
        {/* Track Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Track Title</label>
          <input
            type="text"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter track title..."
            required
          />
        </div>

        {/* Task Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Image (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'task');
              }}
              className="hidden"
              id="task-image-upload"
            />
            <label
              htmlFor="task-image-upload"
              className="cursor-pointer flex flex-col items-center text-center"
            >
              <Image className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-900">Upload Task Image</p>
              <p className="text-xs text-gray-600">Charts, graphs, diagrams (JPG, PNG)</p>
            </label>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder={
              selectedTrackType?.includes('task1')
                ? 'Enter the writing task 1 prompt (describe the chart/graph/diagram)...'
                : 'Enter the writing task 2 essay question...'
            }
            required
          />
        </div>

        {/* Sample Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sample Answer (Optional)</label>
          <textarea
            value={sampleAnswer}
            onChange={(e) => setSampleAnswer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={8}
            placeholder="Enter a sample answer for reference..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveTrack}
            disabled={!trackTitle || !taskDescription || loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : 'Save Track'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Message Display */}
        {message && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {currentStep === 'select' && renderTrackSelection()}
          {currentStep === 'upload' && renderAudioUpload()}
          {currentStep === 'sections' && renderSections()}
          {currentStep === 'content' && renderContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadTracks;