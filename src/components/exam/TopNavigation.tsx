import React, { useState } from 'react'
import {
  ClockIcon,
  VolumeIcon,
  Volume2Icon,
  UserIcon,
  HelpCircleIcon,
  EyeOffIcon,
} from 'lucide-react'
import { useExam } from '../../context/ExamContext'

const TopNavigation: React.FC = () => {
  const {
    timeRemaining,
    isReviewMode,
    reviewTimeRemaining,
    currentSectionIndex,
  } = useExam()
  const [volume, setVolume] = useState(0.8)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    // Update audio elements volume
    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach((audio) => {
      audio.volume = newVolume
    })
  }

  const partNumber = currentSectionIndex + 1

  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      {/* Top logo bar */}
      <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* IELTS logo */}
          <div className="w-1/4">
            <img
              src="https://i.postimg.cc/FKx07M5m/ILTES.png"
              alt="IELTS Logo"
              className="h-12 object-contain"
            />
          </div>
          {/* Shah Sultan logo (centered) */}
          <div className="w-1/2 flex justify-center">
            <img
              src="https://i.postimg.cc/pXGMc6kg/Shah-Sultan-Logo-2.png"
              alt="Shah Sultan Logo"
              className="h-16 object-contain"
            />
          </div>
          {/* Right side logos */}
          <div className="w-1/4 flex justify-end space-x-3">
            <img
              src="https://i.postimg.cc/0Q2DmVPS/Biritsh-Council.png"
              alt="British Council Logo"
              className="h-10 object-contain"
            />
            <img
              src="https://i.postimg.cc/9f2GXWkJ/IDB.png"
              alt="IDP Logo"
              className="h-10 object-contain"
            />
            <img
              src="https://i.postimg.cc/TYZVSjJ8/Cambridge-University.png"
              alt="Cambridge University Logo"
              className="h-10 object-contain"
            />
          </div>
        </div>
      </div>
      {/* Navigation bar */}
      <div className="bg-gray-700 text-white h-12 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Left - User info */}
          <div className="flex items-center space-x-2">
            <UserIcon className="w-4 h-4" />
            <span className="text-sm font-medium">XXXX XXXXXXX - 123456</span>
          </div>
          {/* Center - Timer */}
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span className="font-medium">
              {isReviewMode
                ? formatTime(reviewTimeRemaining)
                : formatTime(timeRemaining)}{' '}
              minutes left | Part {partNumber}
            </span>
          </div>
          {/* Right - Controls */}
          <div className="flex items-center space-x-2">
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded flex items-center text-sm">
              <HelpCircleIcon className="w-4 h-4 mr-1" />
              Help
            </button>
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded flex items-center text-sm">
              <EyeOffIcon className="w-4 h-4 mr-1" />
              Hide
            </button>
            <div className="flex items-center space-x-2">
              <button
                className="text-white"
                aria-label="Volume icon"
              >
                {volume > 0.5 ? (
                  <Volume2Icon className="w-5 h-5" />
                ) : (
                  <VolumeIcon className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Volume control"
                  style={{
                    background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume * 100}%, #9ca3af ${volume * 100}%, #9ca3af 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Review banner when in review mode */}
      {isReviewMode && (
        <div className="review-mode-banner">
          You are in Review Mode. You have {formatTime(reviewTimeRemaining)} to
          review your highlights and notes. Answers cannot be changed.
        </div>
      )}
    </div>
  )
}

export default TopNavigation