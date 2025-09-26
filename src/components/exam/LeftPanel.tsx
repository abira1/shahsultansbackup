import React from 'react'
import { useExam } from '../../context/ExamContext'
import { Section } from '../../context/ExamContext'

interface LeftPanelProps {
  section: Section
}

const LeftPanel: React.FC<LeftPanelProps> = ({ section }) => {
  if (!section.passage) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full overflow-y-auto relative">
      {section.passage && (
        <div className="relative prose max-w-none">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {section.passage}
          </div>
        </div>
      )}
    </div>
  )
}

export default LeftPanel