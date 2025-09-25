import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Demo reading passage and questions
const demoReadingPassage = {
  title: "The Impact of Climate Change on Arctic Wildlife",
  text: `The Arctic region is experiencing climate change at twice the global average rate, a phenomenon known as Arctic amplification. This rapid warming has profound implications for the region's wildlife, which has evolved over millennia to thrive in one of Earth's most extreme environments.

Polar bears, perhaps the most iconic Arctic species, face unprecedented challenges as sea ice—their primary hunting platform—diminishes each year. These magnificent predators rely on ice floes to hunt seals, their primary food source. As ice-free periods extend, polar bears are forced to fast for longer periods, leading to decreased body condition, reduced reproductive success, and increased mortality rates among cubs.

The Arctic fox, another species uniquely adapted to polar conditions, faces a different set of challenges. While some populations benefit from longer ice-free periods that provide access to new food sources, others struggle as their traditional prey patterns shift. The encroachment of red foxes from southern regions, enabled by warming temperatures, creates additional competition for resources and territory.

Marine mammals such as walruses and seals also confront significant disruptions. Walruses depend on sea ice as resting platforms between feeding sessions on the ocean floor. As ice retreats to deeper waters beyond their diving capabilities, walruses are forced to aggregate in massive numbers on land, leading to dangerous overcrowding and higher mortality rates, particularly among young calves.

Bird species throughout the Arctic face timing mismatches between their arrival from southern wintering grounds and peak food availability. Many Arctic-breeding birds have evolved to synchronize their reproduction with specific environmental cues, such as insect emergence or plant flowering. As these natural cycles shift due to warming temperatures, birds may arrive too early or too late to take advantage of optimal feeding conditions for their offspring.`
};

const demoReadingQuestions = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'According to the passage, Arctic amplification refers to:',
    options: [
      'A) The Arctic warming at twice the global average rate',
      'B) The increase in Arctic wildlife populations',
      'C) The expansion of Arctic ice coverage',
      'D) The migration of species to the Arctic'
    ],
    answer: 'A'
  },
  {
    id: 2,
    type: 'true-false-not-given',
    question: 'Polar bears have completely stopped hunting seals.',
    answer: 'False'
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: 'The main challenge for Arctic foxes mentioned in the passage is:',
    options: [
      'A) Loss of sea ice',
      'B) Competition from red foxes',
      'C) Lack of food sources',
      'D) Extreme weather conditions'
    ],
    answer: 'B'
  },
  {
    id: 4,
    type: 'sentence-completion',
    question: 'Walruses use sea ice as _______ between feeding sessions.',
    answer: 'resting platforms'
  },
  {
    id: 5,
    type: 'true-false-not-given',
    question: 'All Arctic bird species are negatively affected by climate change.',
    answer: 'Not Given'
  }
];

const DemoReadingTest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId');
  const isDemo = searchParams.get('demo') === 'true';

  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Timer effect
  useEffect(() => {
    if (hasStarted && !showInstructions && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
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
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFinishTest = () => {
    const answeredCount = Object.keys(answers).length;
    alert(`Demo completed! You answered ${answeredCount} out of ${demoReadingQuestions.length} questions.`);
    navigate('/admin/exams');
  };

  const currentQuestionData = demoReadingQuestions.find(q => q.id === currentQuestion);

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IELTS Reading Test</h1>
            <p className="text-gray-600">{isDemo ? 'Demo Mode' : 'Practice Mode'}</p>
            {trackId && (
              <p className="text-sm text-blue-600 mt-2">Track ID: {trackId}</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2">Instructions:</h2>
              <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>You have 60 minutes to complete this test</li>
                <li>Read the passage carefully before answering questions</li>
                <li>All answers should be based on the information in the passage</li>
                <li>Write your answers clearly</li>
                <li>Check your spelling carefully</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="font-semibold text-yellow-900 mb-2">Test Structure:</h2>
              <div className="text-sm text-yellow-800">
                <p><strong>Passage:</strong> The Impact of Climate Change on Arctic Wildlife</p>
                <p><strong>Questions:</strong> {demoReadingQuestions.length} questions (Multiple choice, True/False/Not Given, Sentence completion)</p>
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
            <h1 className="text-xl font-semibold text-gray-900">IELTS Reading Test</h1>
            {isDemo && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">DEMO MODE</span>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl">⏰</div>
              <div className={`text-lg font-mono ${timeLeft < 600 ? 'text-red-600' : 'text-gray-900'}`}>
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

      <div className="flex h-screen">
        {/* Reading Passage */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {demoReadingPassage.title}
            </h2>
            <div className="prose max-w-none text-gray-800 leading-relaxed">
              {demoReadingPassage.text.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Questions Panel */}
        <div className="w-1/2 overflow-y-auto">
          <div className="p-6">
            {/* Question Navigation */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Questions</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {demoReadingQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(q.id)}
                    className={`w-8 h-8 text-sm rounded ${
                      q.id === currentQuestion
                        ? 'bg-indigo-600 text-white'
                        : answers[q.id]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {q.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question */}
            {currentQuestionData && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Question {currentQuestion}
                </h3>
                
                <div className="mb-4">
                  <p className="text-gray-800 mb-4">{currentQuestionData.question}</p>
                  
                  {/* Answer Input Based on Question Type */}
                  {currentQuestionData.type === 'multiple-choice' && currentQuestionData.options && (
                    <div className="space-y-2">
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

                  {currentQuestionData.type === 'true-false-not-given' && (
                    <div className="space-y-2">
                      {['True', 'False', 'Not Given'].map((option) => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`question_${currentQuestion}`}
                            value={option}
                            checked={answers[currentQuestion] === option}
                            onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestionData.type === 'sentence-completion' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Complete the sentence:
                      </label>
                      <input
                        type="text"
                        value={answers[currentQuestion] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type your answer here..."
                      />
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={() => currentQuestion > 1 && setCurrentQuestion(currentQuestion - 1)}
                    disabled={currentQuestion === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {Object.keys(answers).length} of {demoReadingQuestions.length} answered
                  </div>
                  
                  <button
                    onClick={() => currentQuestion < demoReadingQuestions.length && setCurrentQuestion(currentQuestion + 1)}
                    disabled={currentQuestion === demoReadingQuestions.length}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoReadingTest;