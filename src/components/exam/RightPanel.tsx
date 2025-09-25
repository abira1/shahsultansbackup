import React from 'react'
import { useExam } from '../../context/ExamContext'
import QuestionCard from './QuestionCard'
import LeftPanel from './LeftPanel'

interface RightPanelProps {
  sectionId: string
}

const RightPanel: React.FC<RightPanelProps> = ({ sectionId }) => {
  const { exam, isReviewMode } = useExam()

  const section = exam.settings.sections.find((s) => s.id === sectionId)
  const sectionQuestions = exam.questions
    .filter((question) => question.sectionId === sectionId)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* If this section has a passage, show it first */}
      {section && section.passage && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Reading Passage
          </h3>
          <LeftPanel section={section} />
        </div>
      )}

      {isReviewMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
          <p className="font-medium">Review Mode</p>
          <p>You are in review mode. You cannot change your answers.</p>
        </div>
      )}

      <div className="space-y-6">
        {sectionQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            disabled={isReviewMode}
          />
        ))}
      </div>
    </div>
  )
}

export default RightPanel