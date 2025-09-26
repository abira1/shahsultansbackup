import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../../context/ExamContext'
import TopNavigation from '../../components/exam/TopNavigation'
import QuestionNavigation from '../../components/exam/QuestionNavigation'
import AudioPlayer from '../../components/exam/AudioPlayer'
import RightPanel from '../../components/exam/RightPanel'

const ExamPage: React.FC = () => {
  const navigate = useNavigate()
  const { exam, isExamStarted, currentSectionIndex, timeRemaining } = useExam()

  // Redirect to landing page if exam hasn't started
  useEffect(() => {
    if (!isExamStarted) {
      navigate('/exam/start')
    }
  }, [isExamStarted, navigate])

  // Redirect to review page if time is up
  useEffect(() => {
    if (timeRemaining <= 0) {
      navigate('/exam/review')
    }
  }, [timeRemaining, navigate])

  const currentSection = exam.settings.sections[currentSectionIndex]
  
  // Determine exam type based on section content
  const determineExamType = () => {
    const hasAudio = exam.settings.sections.some(section => section.audio)
    const hasPassage = exam.settings.sections.some(section => section.passage)
    
    if (hasAudio) return 'listening'
    if (hasPassage) return 'reading'
    return 'writing' // Default for other cases
  }
  
  const examType = determineExamType()
  const showVolumeControls = examType === 'listening'

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-gray-800 pb-16">
      <TopNavigation 
        showVolumeControls={showVolumeControls} 
        examType={examType}
      />
      {/* Audio Player - Hidden but functional */}
      {currentSection.audio && (
        <AudioPlayer
          sectionId={currentSection.id}
          audioUrl={currentSection.audio}
        />
      )}
      <div className="pt-16 pb-16">
        <div className="container mx-auto p-3 max-w-5xl">
          <div className="bg-white rounded-lg shadow-sm p-4 min-h-[calc(100vh-8rem)]">
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

export default ExamPage