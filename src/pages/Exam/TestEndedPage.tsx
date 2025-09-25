import React from 'react'
import { UserIcon, InfoIcon } from 'lucide-react'

const TestEndedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#e6eef8] flex flex-col">
      <header className="bg-[#1a1a1a] text-white py-2 px-4 flex items-center">
        <UserIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">XXXX XXXXXXX - 123456</span>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] text-white p-3 flex items-center">
            <div className="w-8 h-8 bg-[#e6eef8] rounded-full flex items-center justify-center mr-3">
              <InfoIcon className="w-5 h-5 text-[#333]" />
            </div>
            <h2 className="text-lg font-medium">Test ended</h2>
          </div>
          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-gray-700">Your test has finished.</p>
              <p className="text-gray-700">
                All of your answers have been stored.
              </p>
              <p className="text-gray-700">
                Please wait for further instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestEndedPage