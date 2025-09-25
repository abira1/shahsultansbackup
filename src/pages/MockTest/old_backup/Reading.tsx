import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../../context/ExamContext'

interface ReadingProps {
  onComplete: () => void
}

const Reading: React.FC<ReadingProps> = ({ onComplete }) => {
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
    
    switch (question.type) {
      case 'fill':
        return (
          <div key={question.id} className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              Question {question.order}
            </h3>
            <p className="text-gray-700 mb-4">{question.body}</p>
            <input
              type="text"
              value={currentAnswer as string}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your answer"
            />
          </div>
        )
      case 'mcq':
        return (
          <div key={question.id} className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              Question {question.order}
            </h3>
            <p className="text-gray-700 mb-4">{question.body}</p>
            <div className="space-y-2">
              {question.options?.map((option: string, optionIndex: number) => (
                <label key={optionIndex} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={currentAnswer === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div key={question.id} className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              Question {question.order}
            </h3>
            <p className="text-gray-700 mb-4">{question.body}</p>
            <input
              type="text"
              value={currentAnswer as string}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your answer"
            />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header with logos */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/IELTS_logo.svg/1200px-IELTS_logo.svg.png" alt="IELTS" className="h-10" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNNi0aWgX3E6XRmU2FZdqFE3ew-rrCCGZcbg&s" alt="Shah Sultan's IELTS Academy" className="h-10" />
              <img src="https://logos-world.net/wp-content/uploads/2021/11/British-Council-Logo.png" alt="British Council" className="h-8" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/IDP_Education_logo.svg/1200px-IDP_Education_logo.svg.png" alt="IDP" className="h-8" />
              <img src="https://logos-world.net/wp-content/uploads/2021/11/Cambridge-English-Logo.png" alt="Cambridge Assessment English" className="h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Dark Navigation Bar */}
      <div className="bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm">👤 XXXX-XXXXXXX - 123456</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm">⏰ {formatTime(timeRemaining)} minutes left | Reading Test</span>
              <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm">
                🔍 Help
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                👁️ Hide
              </button>
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

            {/* Center - Question numbers */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600 mr-2">Part 1</span>
              {Array.from({ length: 10 }, (_, i) => {
                const questionNum = i + 1
                const isAnswered = sectionQuestions[i] && answers[sectionQuestions[i].id]
                return (
                  <button
                    key={questionNum}
                    onClick={() => handleQuestionNavigation(i)}
                    className="w-8 h-8 text-sm rounded bg-gray-100 hover:bg-gray-200 border"
                  >
                    {questionNum}
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

export default Reading
