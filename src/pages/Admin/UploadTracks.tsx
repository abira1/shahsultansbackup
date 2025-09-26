import React, { useState, useRef } from 'react';
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
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Image,
  FileText
} from 'lucide-react';
import { trackManagementService, ExamType, QuestionData, SectionData, TrackData } from '../../services/trackManagementService';

type TrackType = 'academic-listening' | 'general-listening' | 'academic-reading' | 'general-reading' | 'writing-task1' | 'writing-task2';

interface TrackTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: TrackType;
  examType: ExamType;
  subType?: string;
}

interface QuestionFormData {
  id: string;
  type: string;
  questionText: string;
  options: string[];
  answer: string | string[];
  points: number;
  explanation: string;
}

interface SectionFormData {
  sectionNumber: number;
  title: string;
  instructions: string;
  passageText: string;
  questions: QuestionFormData[];
}

const UploadTracks: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'create'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<TrackTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form data
  const [trackTitle, setTrackTitle] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sections, setSections] = useState<SectionFormData[]>([]);
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const trackTemplates: TrackTemplate[] = [
    {
      id: 'academic-listening',
      title: 'Academic Listening',
      description: '4 sections, 40 questions total',
      icon: <FileAudio className="h-8 w-8" />,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      type: 'academic-listening',
      examType: 'listening',
      subType: 'academic'
    },
    {
      id: 'general-listening',
      title: 'General Listening',
      description: '4 sections, 40 questions total',
      icon: <FileAudio className="h-8 w-8" />,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      type: 'general-listening',
      examType: 'listening',
      subType: 'general'
    },
    {
      id: 'academic-reading',
      title: 'Academic Reading',
      description: '3 passages, 40 questions total',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      type: 'academic-reading',
      examType: 'reading',
      subType: 'academic'
    },
    {
      id: 'general-reading',
      title: 'General Reading',
      description: '3 sections, 40 questions total',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      type: 'general-reading',
      examType: 'reading',
      subType: 'general'
    },
    {
      id: 'writing-task1',
      title: 'Writing Task 1',
      description: 'Academic/General Writing Task 1',
      icon: <PenTool className="h-8 w-8" />,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      type: 'writing-task1',
      examType: 'writing',
      subType: 'task1'
    },
    {
      id: 'writing-task2',
      title: 'Writing Task 2',
      description: 'Academic/General Writing Task 2',
      icon: <PenTool className="h-8 w-8" />,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      type: 'writing-task2',
      examType: 'writing',
      subType: 'task2'
    }
  ];

  const questionTypes = [
    { value: 'multipleChoice', label: 'Multiple Choice (Single)' },
    { value: 'multipleChoiceMultiple', label: 'Multiple Choice (Multiple)' },
    { value: 'matching', label: 'Matching' },
    { value: 'fillInBlank', label: 'Fill in the Blank' },
    { value: 'sentenceCompletion', label: 'Sentence Completion' },
    { value: 'summaryCompletion', label: 'Summary Completion' },
    { value: 'diagramLabeling', label: 'Diagram/Map/Flowchart Labeling' },
    { value: 'shortAnswer', label: 'Short Answer' }
  ];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const initializeSections = (template: TrackTemplate) => {
    const sectionCount = template.examType === 'listening' ? 4 : template.examType === 'reading' ? 3 : 2;
    const newSections: SectionFormData[] = [];
    
    for (let i = 1; i <= sectionCount; i++) {
      newSections.push({
        sectionNumber: i,
        title: template.examType === 'listening' ? `Section ${i}` : 
               template.examType === 'reading' ? `Passage ${i}` : 
               `Task ${i}`,
        instructions: '',
        passageText: '',
        questions: []
      });
    }
    
    setSections(newSections);
  };

  const handleTemplateSelect = (template: TrackTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('create');
    setTrackTitle('');
    setAudioFile(null);
    setImageFile(null);
    initializeSections(template);
  };

  const addQuestion = (sectionIndex: number) => {
    const newQuestion: QuestionFormData = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'multipleChoice',
      questionText: '',
      options: ['', '', '', ''],
      answer: '',
      points: 1,
      explanation: ''
    };

    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.push(newQuestion);
    setSections(updatedSections);
  };

  const updateQuestion = (sectionIndex: number, questionIndex: number, field: keyof QuestionFormData, value: any) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex] = {
      ...updatedSections[sectionIndex].questions[questionIndex],
      [field]: value
    };
    setSections(updatedSections);
  };

  const updateQuestionOption = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const updatedSections = [...sections];
    const options = [...updatedSections[sectionIndex].questions[questionIndex].options];
    options[optionIndex] = value;
    updatedSections[sectionIndex].questions[questionIndex].options = options;
    setSections(updatedSections);
  };

  const deleteQuestion = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(updatedSections);
  };

  const updateSection = (sectionIndex: number, field: keyof SectionFormData, value: any) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value
    };
    setSections(updatedSections);
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    } else {
      showMessage('error', 'Please select a valid audio file');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    } else {
      showMessage('error', 'Please select a valid image file');
    }
  };

  const validateTrack = (): boolean => {
    if (!trackTitle.trim()) {
      showMessage('error', 'Track title is required');
      return false;
    }

    if (selectedTemplate?.examType === 'listening' && !audioFile) {
      showMessage('error', 'Audio file is required for listening tracks');
      return false;
    }

    if (sections.length === 0) {
      showMessage('error', 'At least one section is required');
      return false;
    }

    for (const section of sections) {
      if (section.questions.length === 0) {
        showMessage('error', `Section ${section.sectionNumber} must have at least one question`);
        return false;
      }

      for (const question of section.questions) {
        if (!question.questionText.trim()) {
          showMessage('error', 'All questions must have question text');
          return false;
        }

        if (['multipleChoice', 'multipleChoiceMultiple'].includes(question.type)) {
          if (question.options.every(opt => !opt.trim())) {
            showMessage('error', 'Multiple choice questions must have options');
            return false;
          }
        }

        if (!question.answer || (Array.isArray(question.answer) && question.answer.length === 0)) {
          showMessage('error', 'All questions must have correct answers');
          return false;
        }
      }
    }

    return true;
  };

  const handleSaveTrack = async () => {
    if (!validateTrack() || !selectedTemplate) return;

    setIsLoading(true);
    try {
      // Prepare track data
      const trackData: Omit<TrackData, 'id' | 'createdAt' | 'updatedAt'> = {
        title: trackTitle,
        examType: selectedTemplate.examType,
        subType: selectedTemplate.subType as any,
        sections: sections.map(section => ({
          sectionNumber: section.sectionNumber,
          title: section.title,
          instructions: section.instructions,
          passageText: section.passageText,
          questions: section.questions.map(q => ({
            id: q.id,
            type: q.type as any,
            questionText: q.questionText,
            options: q.options.filter(opt => opt.trim()),
            answer: q.answer,
            points: q.points,
            explanation: q.explanation
          }))
        })),
        createdBy: 'admin', // TODO: Get actual admin ID
        isActive: true
      };

      // Create track first
      const trackId = await trackManagementService.createTrack(trackData);

      // Upload audio file if exists
      if (audioFile && selectedTemplate.examType === 'listening') {
        const { url, fileName } = await trackManagementService.uploadAudioFile(audioFile, trackId);
        await trackManagementService.updateTrack(selectedTemplate.examType, trackId, {
          audioUrl: url,
          audioFileName: fileName
        });
      }

      // Upload image file if exists
      if (imageFile) {
        const imageUrl = await trackManagementService.uploadImageFile(imageFile, trackId, 'passage');
        await trackManagementService.updateTrack(selectedTemplate.examType, trackId, {
          passageImageUrl: imageUrl
        });
      }

      showMessage('success', 'Track created successfully!');
      
      // Reset form and go back to home
      setTimeout(() => {
        setCurrentView('home');
        setSelectedTemplate(null);
        setTrackTitle('');
        setAudioFile(null);
        setImageFile(null);
        setSections([]);
      }, 2000);

    } catch (error) {
      console.error('Error saving track:', error);
      showMessage('error', 'Failed to save track. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionForm = (question: QuestionFormData, sectionIndex: number, questionIndex: number) => {
    return (
      <div key={question.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="font-medium">Question {questionIndex + 1}</h5>
          <button
            onClick={() => deleteQuestion(sectionIndex, questionIndex)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question Type</label>
            <select
              value={question.type}
              onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'type', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Points</label>
            <input
              type="number"
              min="1"
              value={question.points}
              onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'points', parseInt(e.target.value) || 1)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Question Text</label>
          <textarea
            value={question.questionText}
            onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'questionText', e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Enter the question text..."
          />
        </div>

        {['multipleChoice', 'multipleChoiceMultiple'].includes(question.type) && (
          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateQuestionOption(sectionIndex, questionIndex, optionIndex, e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Correct Answer</label>
          {question.type === 'multipleChoice' ? (
            <select
              value={question.answer as string}
              onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'answer', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select correct answer</option>
              {question.options.map((_, optionIndex) => (
                <option key={optionIndex} value={String.fromCharCode(65 + optionIndex)}>
                  {String.fromCharCode(65 + optionIndex)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
              onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'answer', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter correct answer(s)"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Explanation (Optional)</label>
          <textarea
            value={question.explanation}
            onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'explanation', e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={2}
            placeholder="Explain the correct answer..."
          />
        </div>
      </div>
    );
  };



  if (currentView === 'home') {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Tracks</h1>
              <p className="text-gray-600 mt-2">Create new IELTS exam tracks with questions</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`${template.color} border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-blue-600">{template.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Create Track
                </button>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create {selectedTemplate?.title}</h1>
              <p className="text-gray-600 mt-1">{selectedTemplate?.description}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTrack}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Track'}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          {/* Track Basic Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Track Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Track Title *</label>
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter track title..."
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          {selectedTemplate?.examType === 'listening' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Audio File</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FileAudio className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => audioInputRef.current?.click()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 inline mr-2" />
                      Upload Audio File
                    </button>
                    {audioFile && (
                      <p className="mt-2 text-sm text-green-600">
                        Selected: {audioFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTemplate?.examType !== 'listening' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Passage Image (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Upload className="h-4 w-4 inline mr-2" />
                      Upload Image
                    </button>
                    {imageFile && (
                      <p className="mt-2 text-sm text-green-600">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sections */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Sections & Questions</h2>
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{section.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Title</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Instructions</label>
                      <input
                        type="text"
                        value={section.instructions}
                        onChange={(e) => updateSection(sectionIndex, 'instructions', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Section instructions..."
                      />
                    </div>
                  </div>

                  {selectedTemplate?.examType === 'reading' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Passage Text</label>
                      <textarea
                        value={section.passageText}
                        onChange={(e) => updateSection(sectionIndex, 'passageText', e.target.value)}
                        className="w-full p-3 border rounded-md"
                        rows={6}
                        placeholder="Enter the reading passage text..."
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Questions ({section.questions.length})</h4>
                      <button
                        onClick={() => addQuestion(sectionIndex)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {section.questions.map((question, questionIndex) =>
                      renderQuestionForm(question, sectionIndex, questionIndex)
                    )}

                    {section.questions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2">No questions added yet</p>
                        <button
                          onClick={() => addQuestion(sectionIndex)}
                          className="mt-2 text-blue-600 hover:text-blue-700"
                        >
                          Add your first question
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadTracks;