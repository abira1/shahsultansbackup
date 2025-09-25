import React from 'react'
import { Question } from '../../../context/ExamContext'
import { useExam } from '../../../context/ExamContext'

interface TableCompletionQuestionProps {
  question: Question
  disabled?: boolean
}

const TableCompletionQuestion: React.FC<TableCompletionQuestionProps> = ({
  question,
  disabled = false,
}) => {
  const { answers, setAnswer } = useExam()
  const currentAnswer = (answers[question.id]?.answer || {}) as Record<
    string,
    string
  >

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    const cellKey = `${rowIndex}-${colIndex}`
    const newAnswer = {
      ...currentAnswer,
      [cellKey]: value,
    }
    setAnswer(question.id, newAnswer)
  }

  if (!question.table_data) {
    return <div className="text-red-500">Table data is missing</div>
  }

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {question.table_data.headers.map(
              (header: string, index: number) => (
                <th
                  key={index}
                  className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {question.table_data.rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: string, colIndex: number) => {
                const isEmpty = cell === ''
                const cellKey = `${rowIndex}-${colIndex}`
                const cellValue = currentAnswer[cellKey] || ''
                return (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    {isEmpty ? (
                      <input
                        type="text"
                        value={cellValue}
                        onChange={(e) =>
                          handleCellChange(rowIndex, colIndex, e.target.value)
                        }
                        disabled={disabled}
                        className={`w-full p-1 border border-gray-300 rounded bg-blue-50 text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
                        aria-label={`Answer for row ${rowIndex + 1}, column ${colIndex + 1}`}
                      />
                    ) : (
                      <span className="text-gray-800">{cell}</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableCompletionQuestion