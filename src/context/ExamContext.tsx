import React, { useEffect, useState, createContext, useContext } from 'react'
import { sampleExamData } from '../data/sampleExamData'

export type QuestionType =
  | 'fill'
  | 'mcq'
  | 'mcq_multiple'
  | 'tf'
  | 'yn'
  | 'table'
  | 'summary'
  | 'summary_list'
  | 'diagram'
  | 'matching_headings'
  | 'drag_drop'
  | 'sentence_completion'
  | 'matching_sentence_endings'
  | 'form_completion'
  | 'flow_chart'
  | 'matching_features'
  | 'short_answer'
  | 'writing_task'

export interface Question {
  id: string
  sectionId: string
  type: QuestionType
  body: string
  options?: string[]
  answer_key: string[]
  order: number
  // New fields for enhanced question types
  passage?: string
  diagram_url?: string
  table_data?: any
  drag_items?: string[]
  drop_zones?: string[]
  heading_items?: string[]
  paragraph_numbers?: string[]
  summary_text?: string
  sentence_text?: string
  sentence_beginnings?: string[]
  sentence_endings?: string[]
  form_fields?: any[]
  flow_chart_steps?: any[]
  items?: string[]
  features?: string[]
  gaps?: number[]
  max_words?: number
  min_words?: number
  select_count?: number
  task_type?: 'task1' | 'task2'
  instructions?: string
  visual_data?: string
  word_bank?: string[]
}

export interface Section {
  id: string
  title: string
  audio?: string
  passage?: string
  playCountAllowed: number
  instructions: string
}

export interface ExamSettings {
  timeLimitSeconds: number
  sections: Section[]
  defaultPlayOnce: boolean
  allowPause: boolean
  allowSeek: boolean
  allowHighlight: boolean
  allowNotes: boolean
}

export interface Exam {
  id: string
  title: string
  settings: ExamSettings
  questions: Question[]
}

export interface Answer {
  questionId: string
  answer: string | string[] | Record<string, string>
  clientTime: number
}

interface ExamContextType {
  exam: Exam
  currentSectionIndex: number
  setCurrentSectionIndex: (index: number) => void
  currentQuestionIndex: number
  setCurrentQuestionIndex: (index: number) => void
  answers: Record<string, Answer>
  setAnswer: (
    questionId: string,
    answer: string | string[] | Record<string, string>,
  ) => void
  flaggedQuestions: Set<string>
  toggleFlagQuestion: (questionId: string) => void
  timeRemaining: number
  startExam: () => void
  isExamStarted: boolean
  audioPlayCounts: Record<string, number>
  incrementPlayCount: (sectionId: string) => void
  canPlayAudio: (sectionId: string) => boolean
  // Review mode
  isReviewMode: boolean
  setReviewMode: (isReviewMode: boolean) => void
  reviewTimeRemaining: number
  startReviewPhase: () => void
  scrollToQuestion: (questionId: string) => void
  isSubmitting: boolean
  submitExam: () => void
  // Exam loading
  loadExam: (examData: Exam) => void
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

export const ExamProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [exam, setExam] = useState<Exam>(sampleExamData)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  )
  const [timeRemaining, setTimeRemaining] = useState(
    exam.settings.timeLimitSeconds,
  )
  const [isExamStarted, setIsExamStarted] = useState(false)
  const [audioPlayCounts, setAudioPlayCounts] = useState<
    Record<string, number>
  >({})
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [reviewTimeRemaining, setReviewTimeRemaining] = useState(120) // 2 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-save timer
  useEffect(() => {
    if (!isExamStarted) return
    const autoSaveTimer = setInterval(() => {
      console.log('Auto-saving answers...')
      // In a real app, we would call the API to save all answers
      // POST /api/attempts/:attemptId/answers
    }, 5000)
    return () => clearInterval(autoSaveTimer)
  }, [isExamStarted, answers])

  // Timer effect
  useEffect(() => {
    if (!isExamStarted) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          submitExam() // Auto-submit on timeout
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isExamStarted])

  // Review mode timer
  useEffect(() => {
    if (!isReviewMode) return
    const timer = setInterval(() => {
      setReviewTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          // Auto-submit when review time is up
          submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isReviewMode])

  const startExam = () => {
    setIsExamStarted(true)
    // In a real app, we would call the API to create an attempt
    // POST /api/attempts
  }

  const loadExam = (examData: Exam) => {
    setExam(examData)
    setTimeRemaining(examData.settings.timeLimitSeconds)
    setAnswers({})
    setFlaggedQuestions(new Set())
    setCurrentSectionIndex(0)
    setCurrentQuestionIndex(0)
    setIsExamStarted(false)
    setAudioPlayCounts({})
    setIsReviewMode(false)
    setIsSubmitting(false)
  }

  const setAnswer = (
    questionId: string,
    answer: string | string[] | Record<string, string>,
  ) => {
    // If the answer is empty string, empty array, or empty object, consider it as deleting the answer
    const isEmpty =
      (typeof answer === 'string' && answer.trim() === '') ||
      (Array.isArray(answer) && answer.length === 0) ||
      (typeof answer === 'object' && Object.keys(answer).length === 0)

    if (isEmpty) {
      // Delete the answer
      setAnswers((prev) => {
        const newAnswers = {
          ...prev,
        }
        delete newAnswers[questionId]
        return newAnswers
      })
    } else {
      // Set or update the answer
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          questionId,
          answer,
          clientTime: Date.now(),
        },
      }))
    }
    // In a real app, we would call the API to save the answer
    // PATCH /api/attempts/:attemptId/answer
  }

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const incrementPlayCount = (sectionId: string) => {
    setAudioPlayCounts((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || 0) + 1,
    }))
    // In a real app, we would call the API to record the play event
    // POST /api/attempts/:attemptId/play-event
  }

  const canPlayAudio = (sectionId: string) => {
    const section = exam.settings.sections.find((s) => s.id === sectionId)
    if (!section) return false
    const playCount = audioPlayCounts[sectionId] || 0
    return playCount < section.playCountAllowed
  }

  const scrollToQuestion = (questionId: string) => {
    const questionElement = document.getElementById(`question-${questionId}`)
    if (questionElement) {
      questionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const startReviewPhase = () => {
    setIsReviewMode(true)
    setReviewTimeRemaining(120) // 2 minutes
  }

  const submitExam = () => {
    setIsSubmitting(true)
    // In a real app, we would call the API to submit the exam
    // POST /api/attempts/:attemptId/submit
    setTimeout(() => {
      setIsSubmitting(false)
      // Navigate to review page would be handled in the component
    }, 1000)
  }

  return (
    <ExamContext.Provider
      value={{
        exam,
        currentSectionIndex,
        setCurrentSectionIndex,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        setAnswer,
        flaggedQuestions,
        toggleFlagQuestion,
        timeRemaining,
        startExam,
        isExamStarted,
        audioPlayCounts,
        incrementPlayCount,
        canPlayAudio,
        isReviewMode,
        setReviewMode: setIsReviewMode,
        reviewTimeRemaining,
        startReviewPhase,
        scrollToQuestion,
        isSubmitting,
        submitExam,
        loadExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  )
}

export const useExam = (): ExamContextType => {
  const context = useContext(ExamContext)
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider')
  }
  return context
}