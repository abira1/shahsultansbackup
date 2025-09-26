import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface TrueFalseQuestionProps {
  question: Question
  disabled?: boolean
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ 
  question, 
  disabled = false 
}) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = answers[question.id]?.answer || ''

  const handleAnswerChange = (value: string) => {
    setAnswer(question.id, value)
  }

  return (
    <div className="mt-2 flex space-x-4">
      {['True', 'False', 'Not Given'].map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="radio"
            id={`${question.id}-option-${index}`}
            name={question.id}
            value={option}
            checked={currentAnswer === option}
            onChange={() => handleAnswerChange(option)}
            disabled={disabled}
            className="mr-1.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            aria-labelledby={`${question.id}-label-${index}`}
          />
          <label
            id={`${question.id}-label-${index}`}
            htmlFor={`${question.id}-option-${index}`}
            className={`px-2 py-1 rounded-md cursor-pointer ${
              currentAnswer === option 
                ? 'bg-blue-100 text-blue-800 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'
            } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  )
}

export default TrueFalseQuestion