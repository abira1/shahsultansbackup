import React, { useState } from 'react';
import { 
  Clock, 
  BookOpen, 
  PenTool, 
  Headphones, 
  MessageCircle, 
  Play, 
  Target,
  Timer,
  FileText,
  Users,
  Award,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import Button from '../../components/ui/Button';

interface StudentPanelProps {
  studentId?: string;
  onStartFullMockTest: () => void;
  onStartListening: () => void;
  onStartReading: () => void;
  onStartWriting: () => void;
  onStartSpeaking: () => void;
}

const StudentPanel: React.FC<StudentPanelProps> = ({
  studentId,
  onStartFullMockTest,
  onStartListening,
  onStartReading,
  onStartWriting,
  onStartSpeaking
}) => {
  const [selectedOption, setSelectedOption] = useState<'full' | 'individual' | null>(null);

  // Mock data for student progress
  const mockProgress = {
    completedTests: 5,
    averageScore: 7.5,
    strongestSection: 'Reading',
    weakestSection: 'Speaking',
    lastTestDate: '2024-01-15'
  };

  const sectionDetails = [
    {
      id: 'listening',
      name: 'Listening',
      icon: Headphones,
      duration: '30 minutes',
      questions: '40 questions',
      description: 'Listen to recordings and answer questions',
      difficulty: 'Medium',
      lastScore: 8.0,
      onClick: onStartListening
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: BookOpen,
      duration: '60 minutes',
      questions: '40 questions',
      description: 'Read passages and answer comprehension questions',
      difficulty: 'Medium',
      lastScore: 7.5,
      onClick: onStartReading
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: PenTool,
      duration: '60 minutes',
      questions: '2 tasks',
      description: 'Complete academic writing tasks',
      difficulty: 'Hard',
      lastScore: 7.0,
      onClick: onStartWriting
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: MessageCircle,
      duration: '11-14 minutes',
      questions: '3 parts',
      description: 'Face-to-face speaking assessment',
      difficulty: 'Hard',
      lastScore: 6.5,
      onClick: onStartSpeaking
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IELTS Practice Dashboard</h1>
              <p className="text-gray-600 mt-1">Choose your test format and begin your practice</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back</p>
                <p className="font-medium text-gray-900">Student {studentId || 'Guest'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                <p className="text-2xl font-bold text-gray-900">{mockProgress.completedTests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{mockProgress.averageScore}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Strongest Section</p>
                <p className="text-lg font-bold text-gray-900">{mockProgress.strongestSection}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Test</p>
                <p className="text-sm font-medium text-gray-900">{mockProgress.lastTestDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Test Options */}
        {!selectedOption && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Full Mock Test */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-primary transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-light rounded-full p-3">
                    <Timer className="h-8 w-8 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900">Full Mock Test</h2>
                    <p className="text-gray-600">Complete IELTS simulation</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3" />
                    <span>Total Duration: ~3 hours</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <span>All 4 sections included</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Target className="h-5 w-5 mr-3" />
                    <span>Comprehensive score report</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Experience the complete IELTS Academic test with Listening, Reading, Writing, and Speaking sections.
                  Get detailed feedback and band scores for each section.
                </p>
                
                <Button 
                  variant="primary" 
                  onClick={() => setSelectedOption('full')}
                  className="w-full flex items-center justify-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Full Mock Test
                </Button>
              </div>
            </div>

            {/* Individual Sections */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-accent transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-accent-light rounded-full p-3">
                    <BookOpen className="h-8 w-8 text-accent" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900">Individual Sections</h2>
                    <p className="text-gray-600">Practice specific skills</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3" />
                    <span>Flexible timing</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Target className="h-5 w-5 mr-3" />
                    <span>Focus on weak areas</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BarChart3 className="h-5 w-5 mr-3" />
                    <span>Section-specific feedback</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Choose specific sections to practice. Perfect for targeted improvement and skill development.
                  Track your progress in each area.
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedOption('individual')}
                  className="w-full flex items-center justify-center"
                >
                  <ChevronRight className="h-5 w-5 mr-2" />
                  Choose Individual Section
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Full Mock Test Confirmation */}
        {selectedOption === 'full' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <Timer className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Full IELTS Mock Test</h2>
              <p className="text-gray-600 text-lg">You're about to start a complete IELTS Academic test simulation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {sectionDetails.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">{section.name}</h3>
                    <p className="text-sm text-gray-600">{section.duration}</p>
                    <p className="text-sm text-gray-600">{section.questions}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Instructions
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ensure you have a stable internet connection</li>
                      <li>Find a quiet environment for the full duration</li>
                      <li>You cannot pause the test once started</li>
                      <li>All answers are auto-saved as you progress</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedOption(null)}
              >
                Back to Options
              </Button>
              <Button 
                variant="primary" 
                onClick={onStartFullMockTest}
                className="flex items-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Begin Full Mock Test
              </Button>
            </div>
          </div>
        )}

        {/* Individual Section Selection */}
        {selectedOption === 'individual' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <BookOpen className="h-16 w-16 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Section</h2>
              <p className="text-gray-600 text-lg">Select the IELTS section you want to practice</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {sectionDetails.map((section) => {
                const Icon = section.icon;
                return (
                  <div 
                    key={section.id} 
                    className="border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer group"
                    onClick={section.onClick}
                  >
                    <div className="flex items-start">
                      <div className="bg-gray-100 group-hover:bg-primary-light rounded-full p-3 transition-colors">
                        <Icon className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{section.name}</h3>
                          <span className="text-sm font-medium text-green-600">
                            Last: {section.lastScore}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{section.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{section.duration}</span>
                          <span>{section.questions}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            section.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            section.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {section.difficulty}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setSelectedOption(null)}
              >
                Back to Options
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPanel;