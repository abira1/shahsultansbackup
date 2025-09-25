import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface MatchingHeadingsQuestionProps {
  question: Question
  disabled?: boolean
}

const MatchingHeadingsQuestion: React.FC<MatchingHeadingsQuestionProps> = ({
  question,
  disabled = false,
}) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = (answers[question.id]?.answer || {}) as Record<string, string>

  const handleAnswerChange = (paragraph: string, heading: string) => {
    const newAnswer = {
      ...currentAnswer,
      [paragraph]: heading,
    }
    setAnswer(question.id, newAnswer)
  }

  if (!question.paragraph_numbers || !question.heading_items) {
    return <div className="text-red-500">Matching headings data is incomplete</div>
  }

  return (
    <div className="mt-3">
      <div className="space-y-4">
        {question.paragraph_numbers.map((paragraph, index) => (
          <div key={index} className="flex items-center">
            <span className="text-sm text-gray-600 mr-2 w-20">{paragraph}:</span>
            <select
              value={currentAnswer[paragraph] || ''}
              onChange={(e) => handleAnswerChange(paragraph, e.target.value)}
              disabled={disabled}
              className={`flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              <option value="">Select a heading</option>
              {question.heading_items.map((heading, i) => (
                <option key={i} value={heading}>
                  {heading}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchingHeadingsQuestion