import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, FileText, ChevronLeft, ChevronRight, BarChart2, Image } from 'lucide-react';
import Button from '../../components/ui/Button';
interface WritingProps {
  onComplete: () => void;
}
const Writing: React.FC<WritingProps> = ({
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [currentTask, setCurrentTask] = useState(1); // Task 1 or 2
  const [task1Text, setTask1Text] = useState('');
  const [task2Text, setTask2Text] = useState('');
  const [wordCount1, setWordCount1] = useState(0);
  const [wordCount2, setWordCount2] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);
  // Count words in text
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  // Update word count when text changes
  useEffect(() => {
    setWordCount1(countWords(task1Text));
  }, [task1Text]);
  useEffect(() => {
    setWordCount2(countWords(task2Text));
  }, [task2Text]);
  // Simulate auto-save
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (task1Text || task2Text) {
        setIsAutoSaving(true);
        setTimeout(() => {
          setIsAutoSaving(false);
        }, 1500);
      }
    }, 30000); // Auto-save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [task1Text, task2Text]);
  // Switch to Task 2
  const goToTask2 = () => {
    setCurrentTask(2);
  };
  // Switch to Task 1
  const goToTask1 = () => {
    setCurrentTask(1);
  };
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white py-3 px-4 sticky top-0 z-10 shadow-md">
        <div className="container max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">IELTS Academic Writing Test</h1>
          <div className="flex items-center bg-primary-dark px-3 py-1 rounded-full">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>
      <div className="container max-w-4xl mx-auto py-4 px-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Task {currentTask}</h2>
            <p className="text-sm text-text-secondary">
              {currentTask === 1 ? 'You should spend about 20 minutes on this task' : 'You should spend about 40 minutes on this task'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button onClick={goToTask1} className={`px-3 py-1 rounded-full text-sm transition-colors ${currentTask === 1 ? 'bg-accent text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}>
              Task 1
            </button>
            <button onClick={goToTask2} className={`px-3 py-1 rounded-full text-sm transition-colors ${currentTask === 2 ? 'bg-accent text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}>
              Task 2
            </button>
          </div>
        </div>
        {currentTask === 1 ? <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-6">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="mb-4">
                      The graph below shows the number of tourists visiting a
                      particular country from four regions (Europe, Americas,
                      Asia, and Other) between 2010 and 2020.
                    </p>
                    <p className="mb-4">
                      Summarize the information by selecting and reporting the
                      main features, and make comparisons where relevant.
                    </p>
                    <p className="text-text-secondary text-sm">
                      Write at least 150 words.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-center">
                <div className="relative w-full max-w-lg h-64 bg-white rounded border border-gray-300">
                  <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
                    <BarChart2 className="h-16 w-16 text-primary mb-4 opacity-50" />
                    <p className="text-center text-text-tertiary italic">
                      [Bar chart showing tourist numbers from Europe, Americas,
                      Asia, and Other regions between 2010-2020]
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Your Response</h3>
                <div className={`text-sm ${wordCount1 < 150 ? 'text-error' : 'text-success'}`}>
                  Word Count: {wordCount1}{' '}
                  {wordCount1 < 150 ? `(${150 - wordCount1} more needed)` : ''}
                </div>
              </div>
              <textarea value={task1Text} onChange={e => setTask1Text(e.target.value)} className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none font-sans" placeholder="Write your response here..."></textarea>
              {wordCount1 < 150 && <div className="mt-2 flex items-center text-error text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Your response should be at least 150 words.</span>
                </div>}
            </div>
          </> : <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-6">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="mb-4">
                      Some people believe that universities should focus on
                      providing academic skills, while others think that
                      universities should prepare students for their future
                      careers.
                    </p>
                    <p className="mb-4">
                      Discuss both views and give your own opinion.
                    </p>
                    <p className="text-text-secondary text-sm">
                      Write at least 250 words.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Your Response</h3>
                <div className={`text-sm ${wordCount2 < 250 ? 'text-error' : 'text-success'}`}>
                  Word Count: {wordCount2}{' '}
                  {wordCount2 < 250 ? `(${250 - wordCount2} more needed)` : ''}
                </div>
              </div>
              <textarea value={task2Text} onChange={e => setTask2Text(e.target.value)} className="w-full h-80 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none font-sans" placeholder="Write your response here..."></textarea>
              {wordCount2 < 250 && <div className="mt-2 flex items-center text-error text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Your response should be at least 250 words.</span>
                </div>}
            </div>
          </>}
        {/* Footer Navigation */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-text-tertiary">
              {isAutoSaving ? <span className="text-info flex items-center">
                  <div className="h-2 w-2 rounded-full bg-info mr-2 animate-pulse"></div>
                  Auto-saving...
                </span> : <span>All changes saved</span>}
            </div>
            <div className="flex space-x-4">
              {currentTask === 2 && <Button variant="outline" onClick={goToTask1} className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Task 1
                </Button>}
              {currentTask === 1 ? <Button variant="outline" onClick={goToTask2} className="flex items-center">
                  Task 2
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button> : <Button variant="primary" onClick={onComplete} disabled={wordCount1 < 150 || wordCount2 < 250} className="flex items-center">
                  Complete Test
                </Button>}
            </div>
          </div>
          {(wordCount1 < 150 || wordCount2 < 250) && currentTask === 2 && <div className="mt-4 p-3 bg-error/5 border border-error/10 rounded flex items-center text-sm text-error">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p>
                You must meet the minimum word count for both tasks before
                submitting:
                {wordCount1 < 150 && <span className="font-medium">
                    {' '}
                    Task 1: {wordCount1}/150 words
                  </span>}
                {wordCount1 < 150 && wordCount2 < 250 && ', '}
                {wordCount2 < 250 && <span className="font-medium">
                    {' '}
                    Task 2: {wordCount2}/250 words
                  </span>}
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
export default Writing;