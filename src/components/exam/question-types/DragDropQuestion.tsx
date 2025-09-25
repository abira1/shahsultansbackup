import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface DragDropQuestionProps {
  question: Question
  disabled?: boolean
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({ question, disabled = false }) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = (answers[question.id]?.answer || {}) as Record<string, string>

  const handleAnswerChange = (zone: string, item: string) => {
    const newAnswer = {
      ...currentAnswer,
      [zone]: item,
    }
    setAnswer(question.id, newAnswer)
  }

  if (!question.drag_items || !question.drop_zones) {
    return <div className="text-red-500">Drag and drop data is incomplete</div>
  }

  return (
    <div className="mt-3">
      <div className="space-y-4">
        {question.drop_zones.map((zone, index) => (
          <div key={index} className="flex items-center">
            <span className="text-sm text-gray-600 mr-2 w-32">{zone}:</span>
            <select
              value={currentAnswer[zone] || ''}
              onChange={(e) => handleAnswerChange(zone, e.target.value)}
              disabled={disabled}
              className={`flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              <option value="">Select an item</option>
              {question.drag_items.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DragDropQuestion