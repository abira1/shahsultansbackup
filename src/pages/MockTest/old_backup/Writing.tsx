import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../../context/ExamContext'

interface WritingProps {
  onComplete: () => void
}

const Writing: React.FC<WritingProps> = ({ onComplete }) => {
  const navigate = useNavigate()
  const { exam, isExamStarted, currentSectionIndex, timeRemaining, answers, setAnswer, flaggedQuestions, toggleFlagQuestion, scrollToQuestion } = useExam()
  
  // Local state for current question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Redirect to landing page if exam hasn't started
  useEffect(() => {
    if (!isExamStarted) {
      navigate('/')
    }
  }, [isExamStarted, navigate])

  // Redirect to review page if time is up
  useEffect(() => {
    if (timeRemaining <= 0) {
      navigate('/review')
    }
  }, [timeRemaining, navigate])

  const currentSection = exam.settings.sections[currentSectionIndex]
  const sectionQuestions = exam.questions
    .filter((question) => question.sectionId === currentSection.id)
    .sort((a, b) => a.order - b.order)
    
  // Get current question
  const currentQuestion = sectionQuestions[currentQuestionIndex]

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswer(questionId, value)
  }

  const handleQuestionNavigation = (questionIndex: number) => {
    const question = sectionQuestions[questionIndex]
    if (question) {
      scrollToQuestion(question.id)
    }
  }

  const renderQuestion = (question: any, index: number) => {
    const currentAnswer = answers[question.id]?.answer || ''
    
    return (
      <div key={question.id} className="mb-8">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          Task {question.order}
        </h3>
        <p className="text-gray-700 mb-4">{question.body}</p>
        <textarea
          value={currentAnswer as string}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your response here..."
        />
        <div className="mt-2 text-sm text-gray-500">
          Word count: {(currentAnswer as string).split(/\s+/).filter((word) => word.length > 0).length}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with logos */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left logo */}
            <div className="flex items-center">
              <img
                src="https://i.postimg.cc/FKx07M5m/ILTES.png"
                alt="IELTS Logo"
                className="h-12"
              />
            </div>
            
            {/* Center logo */}
            <div className="flex items-center">
              <img
                src="https://i.postimg.cc/pXGMc6kg/Shah-Sultan-Logo-2.png"
                alt="Shah Sultan IELTS Academy"
                className="h-16"
              />
            </div>
            
            {/* Right logos */}
            <div className="flex items-center space-x-4">
              <img
                src="https://i.postimg.cc/0Q2DmVPS/Biritsh-Council.png"
                alt="British Council"
                className="h-10"
              />
              <img
                src="https://i.postimg.cc/9f2GXWkJ/IDB.png"
                alt="IDP"
                className="h-10"
              />
              <img
                src="https://i.postimg.cc/TYZVSjJ8/Cambridge-University.png"
                alt="Cambridge University"
                className="h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left - User info */}
            <div className="flex items-center text-sm">
              <span className="mr-2"></span>
              <span>XXXX XXXXXXX - 123456</span>
            </div>
            
            {/* Center - Timer */}
            <div className="flex items-center text-sm">
              <span className="mr-2"></span>
              <span>{formatTime(timeRemaining)} minutes left | Part {currentSectionIndex + 1}</span>
            </div>
            
            {/* Right - Controls */}
            <div className="flex items-center space-x-2">
              <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm">
                Help
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm">
                Hide
              </button>
              <div className="flex items-center">
                <span className="mr-2"></span>
                <div className="bg-gray-200 rounded-full h-1 w-16">
                  <div className="bg-white h-1 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Questions */}
          <div className="space-y-6">
            {sectionQuestions.map((question, index) => renderQuestion(question, index))}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left - Review checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="review"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="review" className="text-sm text-gray-700">
                Review
              </label>
              <button className="ml-2 p-1 text-gray-500 hover:text-gray-700">
                
              </button>
            </div>

            {/* Center - Question numbers for Writing (usually 2 tasks) */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600 mr-2">Writing</span>
              {Array.from({ length: 2 }, (_, i) => {
                const taskNum = i + 1
                const isAnswered = sectionQuestions[i] && answers[sectionQuestions[i].id]
                return (
                  <button
                    key={taskNum}
                    onClick={() => handleQuestionNavigation(i)}
                    className="w-8 h-8 text-sm rounded bg-gray-100 hover:bg-gray-200 border"
                  >
                    {taskNum}
                  </button>
                )
              })}
            </div>

            {/* Right - Navigation arrows */}
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-300 text-gray-600">
                
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-300 text-gray-600">
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Writing
