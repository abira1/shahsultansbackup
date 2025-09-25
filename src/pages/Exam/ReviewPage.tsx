import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../../context/ExamContext'
import {
  FlagIcon,
  CheckIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
} from 'lucide-react'

const ReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    exam,
    answers,
    flaggedQuestions,
    timeRemaining,
    submitExam,
    isSubmitting,
  } = useExam()

  // Sort questions by section and order
  const questionsBySection = exam.settings.sections.map((section) => {
    const sectionQuestions = exam.questions
      .filter((q) => q.sectionId === section.id)
      .sort((a, b) => a.order - b.order)
    return {
      section,
      questions: sectionQuestions,
    }
  })

  const unansweredQuestions = exam.questions.filter((q) => !answers[q.id])
  const answeredQuestions = exam.questions.filter((q) => !!answers[q.id])
  const flaggedQuestionsArray = Array.from(flaggedQuestions)
    .map((id) => exam.questions.find((q) => q.id === id))
    .filter(Boolean)

  const handleSubmit = () => {
    if (
      window.confirm(
        'Are you sure you want to submit your exam? This action cannot be undone.',
      )
    ) {
      submitExam()
      navigate('/exam/test-ended')
    }
  }

  const handleReturnToExam = () => {
    navigate('/exam/test')
  }

  const handleGoToQuestion = (questionId: string) => {
    const question = exam.questions.find((q) => q.id === questionId)
    if (!question) return

    // Store the question ID in localStorage so ExamPage can scroll to it
    localStorage.setItem('scrollToQuestionId', questionId)

    // Navigate to the exam page
    navigate('/exam/test')
  }

  return (
    <div className="min-h-screen bg-[#0f1724] text-white">
      <header className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Review Your Answers</h1>
          <button
            onClick={handleReturnToExam}
            className="flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Return to Exam
          </button>
        </div>
        {timeRemaining > 0 && (
          <p className="text-gray-300 mt-1">
            Time remaining: {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, '0')}
          </p>
        )}
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {answeredQuestions.length}
            </div>
            <div className="text-gray-300 text-center">
              <CheckIcon className="inline w-5 h-5 mr-1" />
              Answered
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {unansweredQuestions.length}
            </div>
            <div className="text-gray-300 text-center">
              <AlertCircleIcon className="inline w-5 h-5 mr-1" />
              Unanswered
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-red-400 mb-2">
              {flaggedQuestionsArray.length}
            </div>
            <div className="text-gray-300 text-center">
              <FlagIcon className="inline w-5 h-5 mr-1" />
              Flagged
            </div>
          </div>
        </div>

        {/* Review by section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Review by Section
          </h2>
          <div className="space-y-4">
            {questionsBySection.map(({ section, questions }, index) => {
              const sectionAnswered = questions.filter(
                (q) => !!answers[q.id],
              ).length
              const sectionUnanswered = questions.length - sectionAnswered
              const sectionFlagged = questions.filter((q) =>
                flaggedQuestions.has(q.id),
              ).length

              return (
                <div
                  key={section.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <h3 className="text-lg font-medium text-white mb-2">
                    Part {index + 1}: {section.title}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-sm text-green-400">
                      <CheckIcon className="inline w-4 h-4 mr-1" />
                      {sectionAnswered} Answered
                    </div>
                    <div className="text-sm text-yellow-400">
                      <AlertCircleIcon className="inline w-4 h-4 mr-1" />
                      {sectionUnanswered} Unanswered
                    </div>
                    <div className="text-sm text-red-400">
                      <FlagIcon className="inline w-4 h-4 mr-1" />
                      {sectionFlagged} Flagged
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {questions.map((question) => {
                      const isAnswered = !!answers[question.id]
                      const isFlagged = flaggedQuestions.has(question.id)
                      return (
                        <button
                          key={question.id}
                          onClick={() => handleGoToQuestion(question.id)}
                          className={`relative w-9 h-9 flex items-center justify-center text-sm rounded-md ${isAnswered ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}
                        >
                          {question.order}
                          {isFlagged && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full btn-semi3d px-6 py-3 text-white bg-gradient-to-b from-green-500 to-green-600 rounded-lg font-semibold hover:from-green-400 hover:to-green-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{
              boxShadow:
                '0 6px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default ReviewPage