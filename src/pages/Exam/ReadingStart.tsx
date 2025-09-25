import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReadingStart: React.FC = () => {
  const navigate = useNavigate()

  const handleStartExam = () => {
    navigate('/mock-test/reading')
  }

  return (
    <div className="min-h-screen bg-[#e6eef8]">
      {/* Header */}
      <div className="bg-[#e6eef8] py-4 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-xl font-bold text-gray-800">IELTS Reading Test</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex justify-center items-start pt-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Academic Reading Practice Test</h2>
          
          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-3">Instructions</h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>This test consists of 3 passages, with a total of 40 questions.</p>
              <p>You have 60 minutes to read the passages and answer all questions.</p>
              <p>Answer all questions. There is no penalty for wrong answers.</p>
              <p>Write your answers clearly in the answer booklet.</p>
            </div>
          </div>

          {/* Test Information */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">Test Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Time Limit</div>
                <div className="font-medium text-gray-800">60 minutes</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Number of Passages</div>
                <div className="font-medium text-gray-800">3</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Total Questions</div>
                <div className="font-medium text-gray-800">40</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Question Types</div>
                <div className="font-medium text-gray-800">Multiple Choice, T/F/NG, Matching</div>
              </div>
            </div>
          </div>

          {/* Start button */}
          <div className="text-center">
            <button
              onClick={handleStartExam}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Start Reading Test
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-3">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          Shah Sultan's IELTS Academy - Practice Test Environment
        </div>
      </div>
    </div>
  )
}

export default ReadingStart
