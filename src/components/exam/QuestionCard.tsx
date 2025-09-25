import React from 'react'
import { Question } from '../../context/ExamContext'
import { useExam } from '../../context/ExamContext'
import QuestionTypeRenderer from './QuestionTypeRenderer'

interface QuestionCardProps {
  question: Question
  index: number
  disabled?: boolean
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  disabled = false,
}) => {
  const { flaggedQuestions } = useExam()
  const isFlagged = flaggedQuestions.has(question.id)

  return (
    <div
      id={`question-${question.id}`}
      className={`p-4 bg-white rounded-lg border border-gray-200 shadow-sm relative ${disabled ? 'opacity-90' : ''}`}
      aria-labelledby={`question-${question.id}-header`}
    >
      {/* Question header */}
      <div className="flex items-center justify-between mb-3">
        <h3
          id={`question-${question.id}-header`}
          className="text-base font-medium text-gray-800"
        >
          Question {question.order}
        </h3>
        {isFlagged && (
          <div className="text-yellow-500 text-sm">Flagged for review</div>
        )}
      </div>
      {/* Question body */}
      <div>
        <div className="text-gray-800 mb-3">{question.body}</div>
        <QuestionTypeRenderer question={question} disabled={disabled} />
      </div>
      {/* Optional hint/note area */}
      {question.max_words && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Write no more than {question.max_words} words for each answer.
        </div>
      )}
    </div>
  )
}

export default QuestionCard