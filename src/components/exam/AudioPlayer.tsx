import React, { useEffect, useRef } from 'react'
import { useExam } from '../../context/ExamContext'

interface AudioPlayerProps {
  sectionId: string
  audioUrl: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ sectionId, audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { incrementPlayCount, canPlayAudio } = useExam()

  // Auto-play the audio when component mounts
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      if (canPlayAudio(sectionId)) {
        audio
          .play()
          .then(() => {
            incrementPlayCount(sectionId)
          })
          .catch((error) => {
            console.error('Error playing audio:', error)
          })
      }
    }

    const handleEnded = () => {
      console.log('Audio playback completed')
    }

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [sectionId, audioUrl, incrementPlayCount, canPlayAudio])

  return (
    <div className="hidden">
      <audio ref={audioRef} src={audioUrl} preload="auto" />
    </div>
  )
}

export default AudioPlayer