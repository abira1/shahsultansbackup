import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface MultipleChoiceMultipleAnswerQuestionProps {
  question: Question
  disabled?: boolean
}

const MultipleChoiceMultipleAnswerQuestion: React.FC<
  MultipleChoiceMultipleAnswerQuestionProps
> = ({ question, disabled = false }) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = (answers[question.id]?.answer || []) as string[]

  const handleAnswerChange = (value: string) => {
    let newAnswer = [...currentAnswer]
    if (newAnswer.includes(value)) {
      // Remove if already selected
      newAnswer = newAnswer.filter((item) => item !== value)
    } else {
      // Add if not already selected
      newAnswer.push(value)
    }
    setAnswer(question.id, newAnswer)
  }

  return (
    <div className="mt-2 space-y-2">
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="checkbox"
            id={`${question.id}-option-${index}`}
            name={question.id}
            value={option}
            checked={currentAnswer.includes(option)}
            onChange={() => handleAnswerChange(option)}
            disabled={disabled}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
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

export default MultipleChoiceMultipleAnswerQuestion