import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const demoWritingTasks = {
  task1: {
    type: 'chart',
    title: 'Task 1: Describe the chart below',
    prompt: 'The chart below shows the percentage of households in different income brackets in three countries in 2020.',
    description: 'You should write at least 150 words. You should spend about 20 minutes on this task.',
    imageUrl: '/demo-chart.png', // This would be a real chart image
    imageAlt: 'Bar chart showing household income distribution in Country A, B, and C with income brackets: <$20k, $20k-$50k, $50k-$100k, >$100k'
  },
  task2: {
    title: 'Task 2: Essay Writing',
    prompt: 'Some people believe that social media has had a positive impact on society, while others argue that it has been largely negative. Discuss both views and give your own opinion.',
    description: 'You should write at least 250 words. You should spend about 40 minutes on this task.',
    guidelines: [
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
      'Write in a formal style.',
      'Organize your ideas clearly with appropriate paragraphing.',
      'Use a variety of vocabulary and sentence structures.'
    ]
  }
};

const DemoWritingTest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get('trackId');
  const isDemo = searchParams.get('demo') === 'true';

  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [currentTask, setCurrentTask] = useState<1 | 2>(1);
  const [task1Answer, setTask1Answer] = useState('');
  const [task2Answer, setTask2Answer] = useState('');
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

  const handleFinishTest = () => {
    const task1WordCount = task1Answer.trim().split(/\s+/).length;
    const task2WordCount = task2Answer.trim().split(/\s+/).length;
    
    alert(`Demo completed!\nTask 1: ${task1WordCount} words (minimum 150)\nTask 2: ${task2WordCount} words (minimum 250)`);
    navigate('/admin/exams');
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const currentTaskData = currentTask === 1 ? demoWritingTasks.task1 : demoWritingTasks.task2;
  const currentAnswer = currentTask === 1 ? task1Answer : task2Answer;
  const setCurrentAnswer = currentTask === 1 ? setTask1Answer : setTask2Answer;
  const wordCount = getWordCount(currentAnswer);
  const minWords = currentTask === 1 ? 150 : 250;

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IELTS Writing Test</h1>
            <p className="text-gray-600">{isDemo ? 'Demo Mode' : 'Practice Mode'}</p>
            {trackId && (
              <p className="text-sm text-blue-600 mt-2">Track ID: {trackId}</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2">Instructions:</h2>
              <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>You have 60 minutes to complete both tasks</li>
                <li>Task 1: At least 150 words (recommended 20 minutes)</li>
                <li>Task 2: At least 250 words (recommended 40 minutes)</li>
                <li>Write in formal academic style</li>
                <li>Check your grammar and spelling</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="font-semibold text-yellow-900 mb-2">Test Structure:</h2>
              <div className="text-sm text-yellow-800 space-y-1">
                <p><strong>Task 1:</strong> Describe a chart/graph/diagram (150+ words)</p>
                <p><strong>Task 2:</strong> Essay writing - discuss both views and give opinion (250+ words)</p>
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
            <h1 className="text-xl font-semibold text-gray-900">IELTS Writing Test</h1>
            {isDemo && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">DEMO MODE</span>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Task Navigation */}
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentTask(1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentTask === 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Task 1
              </button>
              <button
                onClick={() => setCurrentTask(2)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentTask === 2
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Task 2
              </button>
            </div>

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
        {/* Task Instructions */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentTaskData.title}
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm font-medium">
                  {currentTaskData.description}
                </p>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed">
                  {currentTaskData.prompt}
                </p>
              </div>

              {/* Task 1 Chart Placeholder */}
              {currentTask === 1 && (
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                  <div className="text-center">
                    <div className="text-6xl text-gray-400 mb-4">📊</div>
                    <p className="text-sm text-gray-600">
                      {demoWritingTasks.task1.imageAlt}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      (In a real test, this would be an actual chart/graph)
                    </p>
                  </div>
                </div>
              )}

              {/* Task 2 Guidelines */}
              {currentTask === 2 && 'guidelines' in currentTaskData && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-900 mb-2">Guidelines:</h3>
                  <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
                    {currentTaskData.guidelines.map((guideline, index) => (
                      <li key={index}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Writing Area */}
        <div className="w-1/2 flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Answer - {currentTaskData.title}
              </h3>
              <div className="flex items-center space-x-4">
                <div className={`text-sm ${wordCount >= minWords ? 'text-green-600' : 'text-red-600'}`}>
                  Words: {wordCount} / {minWords} minimum
                </div>
                <div className="text-sm text-gray-500">
                  Recommended time: {currentTask === 1 ? '20' : '40'} minutes
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full h-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm leading-6"
              placeholder={`Start writing your ${currentTask === 1 ? 'description' : 'essay'} here...

${currentTask === 1 
  ? 'Describe the main features of the chart and make comparisons where relevant. Do not give your opinion, just describe what you see.'
  : 'Introduction: Introduce the topic and state your thesis\nBody Paragraph 1: Discuss one view\nBody Paragraph 2: Discuss the other view\nConclusion: Summarize and give your opinion'
}`}
            />
          </div>

          {/* Writing Stats */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                Task {currentTask === 1 ? '1' : '2'} Progress
              </div>
              <div className="flex space-x-4">
                <span>Characters: {currentAnswer.length}</span>
                <span>Words: {wordCount}</span>
                <span className={wordCount >= minWords ? 'text-green-600' : 'text-red-600'}>
                  {wordCount >= minWords ? '✓ Minimum reached' : `${minWords - wordCount} more needed`}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  wordCount >= minWords ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min((wordCount / minWords) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoWritingTest;