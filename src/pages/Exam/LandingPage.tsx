import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../../context/ExamContext'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { startExam } = useExam()

  const handleStartExam = () => {
    startExam()
    navigate('/exam/confirm-details')
  }

  return (
    <div className="min-h-screen bg-[#e6eef8]">
      {/* Header */}
      <div className="bg-[#e6eef8] py-4 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-xl font-bold text-gray-800">IELTS Listening Test</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex justify-center items-start pt-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sample Listening Test</h2>
          
          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-3">Instructions</h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>This test consists of 4 sections, with a total of 40 questions.</p>
              <p>You will hear each section only ONCE.</p>
              <p>Answer all questions as you listen. At the end of the test, you will have 2 minutes to check your answers.</p>
              <p>The test will last approximately 30 minutes.</p>
            </div>
          </div>

          {/* Test Information */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">Test Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Time Limit</div>
                <div className="font-medium text-gray-800">45 minutes</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Number of Sections</div>
                <div className="font-medium text-gray-800">4</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Number of Questions</div>
                <div className="font-medium text-gray-800">22</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Audio Playback</div>
                <div className="font-medium text-gray-800">Once per section</div>
              </div>
            </div>
          </div>

          {/* Start Test Button */}
          <div className="pt-2">
            <button
              onClick={handleStartExam}
              className="bg-gradient-to-b from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 px-6 py-2 rounded font-medium transition-colors duration-200 shadow-sm border border-gray-400"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 py-4 bg-[#e6eef8] border-t border-gray-300">
        <div className="text-center">
          <p className="text-sm text-gray-600">IELTS Listening Exam Interface © 2025</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
