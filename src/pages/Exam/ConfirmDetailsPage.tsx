import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../../context/ExamContext'

const ConfirmDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { exam, currentSection } = useExam()

  const handleBack = () => {
    navigate(-1)
  }

  const handleConfirm = () => {
    navigate('/exam/listening')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Confirm Details</h2>
          
          {/* Test Details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Test Type:</span>
              <span className="font-medium text-gray-800">IELTS Listening</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-800">45 minutes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Sections:</span>
              <span className="font-medium text-gray-800">4</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Questions:</span>
              <span className="font-medium text-gray-800">22</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 text-center">
              Once you start the test, you will not be able to pause or go back. 
              Make sure you have a stable internet connection and are in a quiet environment.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-medium transition-colors duration-200"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded font-medium transition-colors duration-200"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDetailsPage
