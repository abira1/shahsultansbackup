import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface DiagramQuestionProps {
  question: Question
  disabled?: boolean
}

const DiagramQuestion: React.FC<DiagramQuestionProps> = ({ question, disabled = false }) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = (answers[question.id]?.answer || {}) as Record<string, string>

  const handleAnswerChange = (zone: string, value: string) => {
    const newAnswer = {
      ...currentAnswer,
      [zone]: value,
    }
    setAnswer(question.id, newAnswer)
  }

  if (!question.diagram_url || !question.drag_items || !question.drop_zones) {
    return <div className="text-red-500">Diagram data is incomplete</div>
  }

  return (
    <div className="mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <img
            src={question.diagram_url}
            alt="Diagram for labeling"
            className="w-full"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Select answers for each zone:
          </h4>
          {question.drop_zones.map((zone, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="text-sm text-gray-600 mr-2">Zone {index + 1}:</span>
              <select
                value={currentAnswer[zone] || ''}
                onChange={(e) => handleAnswerChange(zone, e.target.value)}
                disabled={disabled}
                className={`p-1 border border-gray-300 rounded bg-white text-gray-800 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <option value="">Select an answer</option>
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
    </div>
  )
}

export default DiagramQuestion