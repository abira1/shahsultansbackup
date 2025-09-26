import React from 'react'
import { useExam } from '../../context/ExamContext'
import { FlagIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

const QuestionNavigation: React.FC = () => {
  const {
    exam,
    answers,
    flaggedQuestions,
    toggleFlagQuestion,
    currentSectionIndex,
    setCurrentSectionIndex,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    scrollToQuestion,
    isReviewMode,
  } = useExam()

  // Group questions into parts (1-10, 11-20, 21-30, 31-40)
  const questionsByPart = [
    {
      label: 'Part 1',
      start: 1,
      end: 10,
    },
    {
      label: 'Part 2',
      start: 11,
      end: 20,
    },
    {
      label: 'Part 3',
      start: 21,
      end: 30,
    },
    {
      label: 'Part 4',
      start: 31,
      end: 40,
    },
  ]

  // Get all questions sorted by order
  const allQuestions = [...exam.questions].sort((a, b) => a.order - b.order)

  // Get the current active question
  const currentQuestion = allQuestions[currentQuestionIndex]

  const handleQuestionClick = (questionIndex: number) => {
    const question = allQuestions[questionIndex]
    if (!question) return

    // Find the section this question belongs to
    const sectionIndex = exam.settings.sections.findIndex(
      (s) => s.id === question.sectionId,
    )
    if (sectionIndex !== -1 && sectionIndex !== currentSectionIndex) {
      setCurrentSectionIndex(sectionIndex)
    }

    // Set as current question
    setCurrentQuestionIndex(questionIndex)

    // Scroll to the question
    scrollToQuestion(question.id)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      handleQuestionClick(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionClick(currentQuestionIndex - 1)
    }
  }

  const handleToggleReview = () => {
    if (currentQuestion) {
      toggleFlagQuestion(currentQuestion.id)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 py-2 px-3 z-10 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left side - Review checkbox */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="review"
              checked={
                currentQuestion
                  ? flaggedQuestions.has(currentQuestion.id)
                  : false
              }
              onChange={handleToggleReview}
              disabled={isReviewMode}
              className="mr-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="review"
              className="text-xs text-gray-600 font-medium"
            >
              Review
            </label>
          </div>
          <button
            onClick={handleToggleReview}
            disabled={isReviewMode}
            className={`p-1.5 rounded-full ${isReviewMode ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            aria-label="Flag question for review"
          >
            <FlagIcon
              className={`h-3.5 w-3.5 ${currentQuestion && flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-500' : 'text-gray-500'}`}
            />
          </button>
        </div>

        {/* Middle - Question numbers by part */}
        <div className="flex-1 flex flex-wrap justify-center gap-y-2">
          {questionsByPart.map((part, partIndex) => (
            <div key={partIndex} className="flex items-center mx-1 my-1">
              <span className="text-xs font-medium text-gray-700 mr-1.5 whitespace-nowrap">
                {part.label}
              </span>
              <div className="flex flex-wrap">
                {Array.from({
                  length: part.end - part.start + 1,
                }).map((_, i) => {
                  const questionIndex = part.start - 1 + i
                  const question = allQuestions[questionIndex]
                  if (!question) return null

                  const isAnswered = !!answers[question.id]
                  const isFlagged = flaggedQuestions.has(question.id)
                  const isActive = currentQuestionIndex === questionIndex

                  return (
                    <button
                      key={questionIndex}
                      onClick={() => handleQuestionClick(questionIndex)}
                      className={`relative w-7 h-7 flex items-center justify-center text-xs m-0.5 rounded shadow-sm
                        ${isActive ? 'bg-blue-600 text-white font-medium' : isAnswered ? 'bg-white text-gray-800 border border-gray-300' : 'bg-gray-800 text-white'}`}
                      aria-label={`Go to question ${question.order}`}
                      disabled={isReviewMode && !isActive}
                    >
                      {question.order}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Navigation buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0 || isReviewMode}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${currentQuestionIndex === 0 || isReviewMode ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
            aria-label="Previous question"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={
              currentQuestionIndex === allQuestions.length - 1 || isReviewMode
            }
            className={`w-8 h-8 flex items-center justify-center rounded-full ${currentQuestionIndex === allQuestions.length - 1 || isReviewMode ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
            aria-label="Next question"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionNavigation