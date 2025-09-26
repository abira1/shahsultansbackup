import React, { useState } from 'react';
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
  const [selectedTrackType, setSelectedTrackType] = useState<TrackType | null>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'upload' | 'sections' | 'content'>('select');
  const [trackTitle, setTrackTitle] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [questionText, setQuestionText] = useState(''); // For Writing/Speaking

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
    },
    {
      id: 'speaking-part1',
      title: 'Speaking Part 1',
      description: 'Introduction and interview',
      icon: <Mic className="h-8 w-8" />,
      color: 'bg-orange-50 border-orange-200 hover:border-orange-300',
      type: 'speaking-part1'
    },
    {
      id: 'speaking-part2',
      title: 'Speaking Part 2',
      description: 'Long turn (cue card)',
      icon: <Mic className="h-8 w-8" />,
      color: 'bg-orange-50 border-orange-200 hover:border-orange-300',
      type: 'speaking-part2'
    }
  ];

  const questionTypes = [
    { id: 'multiple-choice-single', title: 'Multiple Choice (Single)' },
    { id: 'multiple-choice-multiple', title: 'Multiple Choice (Multiple)' },
    { id: 'matching', title: 'Matching' },
    { id: 'form-completion', title: 'Form Completion' },
    { id: 'note-table-completion', title: 'Note/Table Completion' },
    { id: 'sentence-completion', title: 'Sentence Completion' },
    { id: 'short-answer', title: 'Short Answer' },
    { id: 'diagram-labeling', title: 'Diagram/Flowchart/Map Labeling' },
  ];

  const initializeSections = (type: TrackType) => {
    if (type.includes('listening')) {
      return Array.from({ length: 4 }, (_, i) => ({
        id: `section-${i + 1}`,
        title: `Section ${i + 1}`,
        questions: []
      }));
    } else if (type.includes('reading')) {
      return Array.from({ length: 3 }, (_, i) => ({
        id: `section-${i + 1}`,
        title: `Passage ${i + 1}`,
        questions: []
      }));
    }
    return [];
  };

  const handleTrackTypeSelect = (type: TrackType) => {
    setSelectedTrackType(type);
    setTrackTitle('');
    
    // Direct flow based on track type
    if (type.includes('listening')) {
      setCurrentStep('upload'); // Audio upload first
      setSections(initializeSections(type));
    } else if (type.includes('reading')) {
      setCurrentStep('sections'); // Direct to sections (no audio)
      setSections(initializeSections(type));
    } else if (type.includes('writing') || type.includes('speaking')) {
      setCurrentStep('content'); // Direct to content entry
    }
  };

  const handleAudioUpload = async (file: File) => {
    setAudioFile(file);
    // Simulate upload to Firebase Storage
    const fakeUrl = `https://firebase-storage.com/audio/${file.name}`;
    setAudioUrl(fakeUrl);
    // After audio upload, go to sections
    setCurrentStep('sections');
  };

  const addQuestion = (sectionIndex: number) => {
    if (sections[sectionIndex].questions.length >= 10) return;
    
    const newQuestion: Question = {
      id: `q-${Date.now()}-${Math.random()}`,
      type: 'multiple-choice-single',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1
    };

    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.push(newQuestion);
    setSections(updatedSections);
  };

  const updateQuestion = (sectionIndex: number, questionIndex: number, field: string, value: any) => {
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
    setSections(updatedSections);
  };

  const saveTrack = async () => {
    const trackData: Track = {
      id: `track-${Date.now()}`,
      title: trackTitle,
      type: selectedTrackType!,
      createdAt: new Date()
    };

    // Add type-specific data
    if (selectedTrackType?.includes('listening')) {
      trackData.audioUrl = audioUrl;
      trackData.sections = sections;
    } else if (selectedTrackType?.includes('reading')) {
      trackData.sections = sections;
    } else if (selectedTrackType?.includes('writing') || selectedTrackType?.includes('speaking')) {
      trackData.questionText = questionText;
    }

    // Save to Firebase (simulated)
    console.log('Saving track:', trackData);
    alert('Track saved successfully!');
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setSelectedTrackType(null);
    setCurrentStep('select');
    setTrackTitle('');
    setAudioFile(null);
    setAudioUrl('');
    setSections([]);
    setCurrentSection(0);
    setQuestionText('');
  };

  const renderTrackSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create New Track</h1>
        <p className="text-lg text-gray-600">Select the type of track you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {trackTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTrackTypeSelect(template.type)}
            className={`${template.color} p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
          >
            <div className="text-center">
              <div className="text-gray-700 mb-4 group-hover:scale-110 transition-transform">
                {template.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <div className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm">
                Use Template
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAudioUpload = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentStep('select')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Selection
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {trackTemplates.find(t => t.type === selectedTrackType)?.title}
          </h2>
          <p className="text-gray-600">Step 1: Upload Audio File</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Track Title</label>
          <input
            type="text"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter track title (e.g., 'IELTS Academic Listening Test 1')"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 transition-colors">
          <FileAudio className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Audio File</h3>
          <p className="text-gray-600 mb-6">Upload one audio file for the entire listening test (MP3, WAV, M4A)</p>
          
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-3 font-medium transition-colors"
          >
            <Upload className="w-5 h-5" />
            Choose Audio File
          </label>
          
          {audioFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">{audioFile.name} uploaded successfully!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Ready to proceed to question setup</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuestionForm = (question: Question, sectionIndex: number, questionIndex: number) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold text-gray-900 text-lg">Question {questionIndex + 1}</h4>
        <button
          onClick={() => removeQuestion(sectionIndex, questionIndex)}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
          <select
            value={question.type}
            onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'type', e.target.value)}
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
            onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'marks', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
        <textarea
          value={question.questionText}
          onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'questionText', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter question text..."
        />
      </div>

      {(question.type === 'multiple-choice-single' || question.type === 'multiple-choice-multiple') && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>
          {question.options?.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-500 w-8 text-center">
                {String.fromCharCode(65 + optionIndex)}.
              </span>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...(question.options || [])];
                  newOptions[optionIndex] = e.target.value;
                  updateQuestion(sectionIndex, questionIndex, 'options', newOptions);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
        <input
          type="text"
          value={Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
          onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'correctAnswer', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter correct answer..."
        />
      </div>
    </div>
  );

  const renderSections = () => (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => selectedTrackType?.includes('listening') ? setCurrentStep('upload') : setCurrentStep('select')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {trackTemplates.find(t => t.type === selectedTrackType)?.title}
          </h2>
          <p className="text-gray-600">
            {selectedTrackType?.includes('listening') ? 'Step 2: Add Questions' : 'Add Questions'}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Track Title</label>
          <input
            type="text"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter track title..."
          />
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                currentSection === index
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.title} ({section.questions.length}/10)
            </button>
          ))}
        </div>

        {/* Current Section Questions */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {sections[currentSection]?.title}
            </h3>
            <button
              onClick={() => addQuestion(currentSection)}
              disabled={sections[currentSection]?.questions.length >= 10}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Question ({sections[currentSection]?.questions.length || 0}/10)
            </button>
          </div>

          {sections[currentSection]?.questions.map((question, questionIndex) => (
            <div key={question.id}>
              {renderQuestionForm(question, currentSection, questionIndex)}
            </div>
          ))}

          {sections[currentSection]?.questions.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg mb-2">No questions added yet</p>
              <p>Click "Add Question" to start creating questions for this section</p>
            </div>
          )}
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
            disabled={!trackTitle || sections.some(section => section.questions.length === 0)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            Save Track
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentStep('select')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Selection
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {trackTemplates.find(t => t.type === selectedTrackType)?.title}
          </h2>
          <p className="text-gray-600">Add question content</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Track Title</label>
            <input
              type="text"
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter track title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedTrackType?.includes('writing') ? 'Writing Prompt' : 'Speaking Question'}
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={8}
              placeholder={
                selectedTrackType?.includes('writing')
                  ? 'Enter the writing task prompt...'
                  : 'Enter the speaking question or cue card content...'
              }
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveTrack}
              disabled={!trackTitle || !questionText}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Save Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
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