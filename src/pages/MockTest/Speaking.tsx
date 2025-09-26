import React from 'react'

interface SpeakingProps {
  onComplete: () => void
}

const Speaking: React.FC<SpeakingProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with logos */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShfJZ-OWNpJhY2GvpJkLrxQB0JMoLsovgfyQ&s" alt="IELTS" className="h-8" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNNi0aWgX3E6XRmU2FZdqFE3ew-rrCCGZcbg&s" alt="Shah Sultan" className="h-8" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyRRd0PF6YjKE1pIwCnqGGfKkiWEjYSYZKcw&s" alt="British Council" className="h-8" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKGmXrSX5w3fwrFWQdkKB6JgVB3LUMhJDyJg&s" alt="IDP" className="h-8" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToIcCCU4x1QGUTwG0HqC5r7-bfPO8kCYQGxQ&s" alt="Cambridge University" className="h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gray-200 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-gray-700">IELTS Speaking Test</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">Time: 00:15:00</span>
              <span className="text-sm text-gray-600">Candidate: John Doe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">IELTS Speaking Test</h2>
            <div className="mb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Coming Soon</h3>
                <p className="text-yellow-700">
                  The Speaking section is currently under development. This will include:
                </p>
                <ul className="mt-3 text-left text-yellow-700 space-y-1">
                  <li>• Part 1: Introduction and interview (4-5 minutes)</li>
                  <li>• Part 2: Individual long turn (3-4 minutes)</li>
                  <li>• Part 3: Two-way discussion (4-5 minutes)</li>
                </ul>
              </div>
            </div>
            <button
              onClick={onComplete}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-medium transition-colors duration-200"
            >
              Continue to Next Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Speaking
