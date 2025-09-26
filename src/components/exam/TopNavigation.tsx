import React, { useState } from 'react'
import {
  ClockIcon,
  VolumeIcon,
  Volume2Icon,
  UserIcon,
  HelpCircleIcon,
  EyeOffIcon,
  EyeIcon,
} from 'lucide-react'
import { useExam } from '../../context/ExamContext'

interface TopNavigationProps {
  showVolumeControls?: boolean
  examType?: 'listening' | 'reading' | 'writing' | 'speaking'
}

const TopNavigation: React.FC<TopNavigationProps> = ({ 
  showVolumeControls = false,
  examType = 'reading' 
}) => {
  const {
    timeRemaining,
    isReviewMode,
    reviewTimeRemaining,
    currentSectionIndex,
  } = useExam()
  const [volume, setVolume] = useState(0.8)
  const [showHelp, setShowHelp] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

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

  const handleHelpClick = () => {
    setShowHelp(!showHelp)
  }

  const handleHideClick = () => {
    setIsHidden(!isHidden)
  }

  const getHelpContent = () => {
    switch (examType) {
      case 'listening':
        return {
          title: 'Listening Test Help',
          content: [
            '• You will hear each recording only ONCE',
            '• Use the volume control to adjust audio level',
            '• Read the questions before listening',
            '• Write your answers on the question paper first',
            '• Transfer answers carefully to the answer sheet',
            '• Check spelling and grammar carefully'
          ]
        }
      case 'reading':
        return {
          title: 'Reading Test Help',
          content: [
            '• You have 60 minutes to complete all 3 sections',
            '• Read the instructions for each question type carefully',
            '• Skim the passage first to get an overall understanding',
            '• Look for keywords in questions and find them in the text',
            '• Be aware of synonyms and paraphrasing',
            '• Manage your time - don\'t spend too long on one question'
          ]
        }
      case 'writing':
        return {
          title: 'Writing Test Help',
          content: [
            '• Task 1: Write at least 150 words (20 minutes recommended)',
            '• Task 2: Write at least 250 words (40 minutes recommended)',
            '• Plan your essay before writing',
            '• Check word count using the counter provided',
            '• Leave time to review and edit your work',
            '• Use appropriate academic language and structure'
          ]
        }
      default:
        return {
          title: 'Exam Help',
          content: ['• Follow the instructions carefully', '• Manage your time wisely']
        }
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{getHelpContent().title}</h3>
              <button
                onClick={handleHelpClick}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {getHelpContent().content.map((item, index) => (
                <p key={index} className="text-sm text-gray-700">{item}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleHelpClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top logo bar - Can be hidden */}
      {!isHidden && (
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
      )}
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
            <button 
              onClick={handleHelpClick}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded flex items-center text-sm transition-colors"
            >
              <HelpCircleIcon className="w-4 h-4 mr-1" />
              Help
            </button>
            <button 
              onClick={handleHideClick}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded flex items-center text-sm transition-colors"
            >
              {isHidden ? (
                <>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Show
                </>
              ) : (
                <>
                  <EyeOffIcon className="w-4 h-4 mr-1" />
                  Hide
                </>
              )}
            </button>
            {/* Volume controls - only show for listening exams */}
            {showVolumeControls && (
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
            )}
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