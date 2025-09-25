import React from 'react'
import { useExam } from '../../context/ExamContext'
import TopNavigation from '../../components/exam/TopNavigation'
import QuestionNavigation from '../../components/exam/QuestionNavigation'
import RightPanel from '../../components/exam/RightPanel'

const Writing: React.FC = () => {
  const { exam, currentSectionIndex } = useExam()
  
  const currentSection = exam.settings.sections[currentSectionIndex]

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-gray-800 pb-16">
      <TopNavigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto p-3 max-w-5xl">
          <div className="bg-white rounded-lg shadow-sm p-4 min-h-[calc(100vh-12rem)]">
            {/* Instructions */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-700">
                {currentSection.instructions}
              </p>
            </div>
            
            {/* Main content - Questions */}
            <RightPanel sectionId={currentSection.id} />
          </div>
        </div>
      </div>

      <QuestionNavigation />
    </div>
  )
}

export default Writing
