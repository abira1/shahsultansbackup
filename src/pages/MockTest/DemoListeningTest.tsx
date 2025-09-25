import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Demo listening questions for the demo track
const demoListeningQuestions = [
  // Section 1: Form Completion (Questions 1-10)
  {
    id: 1,
    section: 1,
    type: 'form-completion',
    question: 'What is the caller\'s first name?',
    answer: 'Sarah'
  },
  {
    id: 2,
    section: 1,
    type: 'form-completion',
    question: 'What is the caller\'s surname?',
    answer: 'Johnson'
  },
  {
    id: 3,
    section: 1,
    type: 'form-completion',
    question: 'What is the caller\'s phone number?',
    answer: '0207 946 3251'
  },
  {
    id: 4,
    section: 1,
    type: 'form-completion',
    question: 'What is the preferred time for the appointment?',
    answer: '2:30 pm'
  },
  {
    id: 5,
    section: 1,
    type: 'form-completion',
    question: 'What type of service is required?',
    answer: 'dental cleaning'
  },
  {
    id: 6,
    section: 1,
    type: 'multiple-choice',
    question: 'How did the caller hear about the clinic?',
    options: ['A) Advertisement', 'B) Friend recommendation', 'C) Internet search'],
    answer: 'B'
  },
  {
    id: 7,
    section: 1,
    type: 'multiple-choice',
    question: 'What insurance does the caller have?',
    options: ['A) NHS', 'B) Private', 'C) None'],
    answer: 'A'
  },
  {
    id: 8,
    section: 1,
    type: 'multiple-choice',
    question: 'How long since the last dental visit?',
    options: ['A) 6 months', 'B) 1 year', 'C) 2 years'],
    answer: 'B'
  },
  {
    id: 9,
    section: 1,
    type: 'multiple-choice',
    question: 'What is the main concern?',
    options: ['A) Tooth pain', 'B) Routine check', 'C) Teeth whitening'],
    answer: 'B'
  },
  {
    id: 10,
    section: 1,
    type: 'multiple-choice',
    question: 'Preferred dentist gender?',
    options: ['A) Male', 'B) Female', 'C) No preference'],
    answer: 'C'
  }
  // We can add more sections later...
];

const DemoListeningTest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId');
  const isDemo = searchParams.get('demo') === 'true';

  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [currentSection, setCurrentSection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Timer effect
  useEffect(() => {
    if (hasStarted && !showInstructions && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - auto submit
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hasStarted, showInstructions, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < 40) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      
      // Update section based on question number
      const nextSection = Math.ceil(nextQuestion / 10);
      setCurrentSection(nextSection);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 1) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      
      // Update section based on question number
      const prevSection = Math.ceil(prevQuestion / 10);
      setCurrentSection(prevSection);
    }
  };

  const handleFinishTest = () => {
    // For demo, just show results and navigate back
    const answeredCount = Object.keys(answers).length;
    alert(`Demo completed! You answered ${answeredCount} out of 40 questions.`);
    navigate('/admin/exams');
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentQuestionData = demoListeningQuestions.find(q => q.id === currentQuestion);

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IELTS Listening Test</h1>
            <p className="text-gray-600">{isDemo ? 'Demo Mode' : 'Practice Mode'}</p>
            {trackId && (
              <p className="text-sm text-blue-600 mt-2">Track ID: {trackId}</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2">Instructions:</h2>
              <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>You will hear each recording only once</li>
                <li>Write your answers as you listen</li>
                <li>You have 30 minutes for this test</li>
                <li>There are 4 sections with 10 questions each</li>
                <li>All answers should be written clearly</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="font-semibold text-yellow-900 mb-2">Test Structure:</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-yellow-800">
                <div>
                  <strong>Section 1:</strong> Everyday conversation (Questions 1-10)
                </div>
                <div>
                  <strong>Section 2:</strong> Monologue (Questions 11-20)
                </div>
                <div>
                  <strong>Section 3:</strong> Academic discussion (Questions 21-30)
                </div>
                <div>
                  <strong>Section 4:</strong> Academic lecture (Questions 31-40)
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/admin/exams')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Exams
            </button>
            <button
              onClick={handleStartTest}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">IELTS Listening Test</h1>
            {isDemo && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">DEMO MODE</span>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Audio Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAudio}
                className={`p-2 rounded-full ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <span className="text-sm text-gray-600">
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </div>

            {/* Timer */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl">⏰</div>
              <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Finish Button */}
            <button
              onClick={handleFinishTest}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Finish Test
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Questions</h2>
            
            {/* Section Navigation */}
            {[1, 2, 3, 4].map(section => (
              <div key={section} className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Section {section}</h3>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 10 }, (_, i) => {
                    const questionNum = (section - 1) * 10 + i + 1;
                    const isAnswered = answers[questionNum];
                    const isCurrent = questionNum === currentQuestion;
                    
                    return (
                      <button
                        key={questionNum}
                        onClick={() => setCurrentQuestion(questionNum)}
                        className={`w-8 h-8 text-xs rounded ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : isAnswered
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {questionNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Section {currentSection} - Question {currentQuestion}
                </h2>
                <p className="text-gray-600 capitalize">
                  {currentQuestionData?.type?.replace('-', ' ')}
                </p>
              </div>
              
              <div className="text-sm text-gray-500">
                Question {currentQuestion} of 40
              </div>
            </div>

            {/* Question Content */}
            {currentQuestionData && (
              <div className="space-y-4">
                <div className="text-lg text-gray-900 mb-4">
                  {currentQuestionData.question}
                </div>

                {/* Answer Input Based on Question Type */}
                {currentQuestionData.type === 'form-completion' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Your answer:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQuestion] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                      className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type your answer here..."
                    />
                  </div>
                )}

                {currentQuestionData.type === 'multiple-choice' && currentQuestionData.options && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose the correct answer:
                    </label>
                    {currentQuestionData.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question_${currentQuestion}`}
                          value={option.charAt(0)}
                          checked={answers[currentQuestion] === option.charAt(0)}
                          onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <div className="text-sm text-gray-500">
                {Object.keys(answers).length} of 40 answered
              </div>
              
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === 40}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/demo-audio.mp3" // This would be a real audio file
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default DemoListeningTest;