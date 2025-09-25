import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface SentenceCompletionQuestionProps {
  question: Question
  disabled?: boolean
}

const SentenceCompletionQuestion: React.FC<SentenceCompletionQuestionProps> = ({
  question,
  disabled = false,
}) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = (answers[question.id]?.answer || {}) as Record<string, string>

  const handleAnswerChange = (gapNumber: number, value: string) => {
    const newAnswer = {
      ...currentAnswer,
      [gapNumber]: value,
    }
    setAnswer(question.id, newAnswer)
  }

  if (!question.sentence_text || !question.gaps) {
    return <div className="text-red-500">Sentence text or gaps are missing</div>
  }

  return (
    <div className="mt-3">
      <div className="p-4 bg-gray-50 rounded border border-gray-300 text-gray-800">
        <div className="whitespace-pre-line">{question.sentence_text}</div>
        {question.gaps.map((gap) => (
          <div key={gap} className="mt-2">
            <label className="text-sm font-medium">Gap {gap}:</label>
            <input
              type="text"
              value={currentAnswer[gap] || ''}
              onChange={(e) => handleAnswerChange(gap, e.target.value)}
              disabled={disabled}
              className={`ml-2 w-32 p-1 border border-gray-300 rounded bg-blue-50 text-gray-800 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SentenceCompletionQuestion