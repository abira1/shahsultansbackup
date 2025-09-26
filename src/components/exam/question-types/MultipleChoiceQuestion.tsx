import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface MultipleChoiceQuestionProps {
  question: Question
  disabled?: boolean
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  disabled = false,
}) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = answers[question.id]?.answer || ''

  const handleAnswerChange = (value: string) => {
    setAnswer(question.id, value)
  }

  return (
    <div className="mt-2 space-y-2">
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="radio"
            id={`${question.id}-option-${index}`}
            name={question.id}
            value={option}
            checked={currentAnswer === option}
            onChange={() => handleAnswerChange(option)}
            disabled={disabled}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            aria-labelledby={`${question.id}-label-${index}`}
          />
          <label
            id={`${question.id}-label-${index}`}
            htmlFor={`${question.id}-option-${index}`}
            className={`text-gray-800 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  )
}

export default MultipleChoiceQuestion