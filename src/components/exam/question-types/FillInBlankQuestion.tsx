import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface FillInBlankQuestionProps {
  question: Question
  disabled?: boolean
}

const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
  question,
  disabled = false,
}) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = answers[question.id]?.answer || ''

  const handleAnswerChange = (value: string) => {
    setAnswer(question.id, value)
  }

  return (
    <div className="mt-2 inline-block">
      <input
        type="text"
        value={currentAnswer as string}
        onChange={(e) => handleAnswerChange(e.target.value)}
        disabled={disabled}
        className={`p-2 w-full sm:w-64 border border-gray-300 rounded bg-blue-50 text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        placeholder="Type your answer"
        aria-label={`Answer for question ${question.order}`}
      />
      {question.max_words && (
        <div className="mt-1 text-xs text-gray-500">
          Write no more than {question.max_words}{' '}
          {question.max_words === 1 ? 'word' : 'words'}.
        </div>
      )}
    </div>
  )
}

export default FillInBlankQuestion