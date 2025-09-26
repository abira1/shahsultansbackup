// IELTS Exam System Database Types

export type TestType = 'listening' | 'reading' | 'writing' | 'speaking';

export type QuestionType = 
  | 'multiple-choice-single'
  | 'multiple-choice-multiple'
  | 'fill-in-blank'
  | 'matching'
  | 'true-false-not-given'
  | 'writing-task-1'
  | 'writing-task-2'
  | 'speaking-part-1'
  | 'speaking-part-2'
  | 'speaking-part-3';

// Main Test Structure
export interface Test {
  id: string;
  title: string;
  description: string;
  type: TestType;
  duration: number; // in minutes
  totalQuestions: number;
  sections: string[]; // Array of section IDs
  isActive: boolean;
  isPublished: boolean;
  createdBy: string; // Admin user ID
  createdAt: number;
  updatedAt?: number;
}

// Section Structure (each test has multiple sections)
export interface Section {
  id: string;
  testId: string;
  testType: TestType;
  sectionNumber: number;
  title: string;
  instructions: string;
  audioUrl?: string; // For listening sections
  audioFileName?: string;
  audioDuration?: number; // in seconds
  passageText?: string; // For reading sections
  questions: string[]; // Array of question IDs
  timeLimit?: number; // Section-specific time limit in minutes
  createdAt: number;
  updatedAt?: number;
}

// Question Structure
export interface Question {
  id: string;
  sectionId: string;
  testId: string;
  questionNumber: number;
  type: QuestionType;
  questionText: string;
  imageUrl?: string;
  audioUrl?: string; // For listening questions
  
  // Multiple Choice Fields
  options?: string[];
  correctAnswers?: string[] | number[]; // Array for multiple selection, single for single selection
  
  // Fill in the Blank Fields
  blankPositions?: number[]; // Positions in text where blanks are
  acceptedAnswers?: string[][]; // Multiple acceptable answers for each blank
  
  // Matching Fields
  leftItems?: string[];
  rightItems?: string[];
  correctMatches?: { [key: string]: string };
  
  // True/False/Not Given Fields
  correctAnswer?: 'true' | 'false' | 'not-given';
  
  // Writing Fields
  wordLimit?: number;
  sampleAnswer?: string;
  scoringCriteria?: string[];
  
  // Speaking Fields
  preparationTime?: number; // in seconds
  responseTime?: number; // in seconds
  sampleResponse?: string;
  
  points: number; // Points awarded for correct answer
  explanation?: string; // Explanation for the answer
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt: number;
  updatedAt?: number;
}

// Student Answer Structure
export interface StudentAnswer {
  id: string;
  questionId: string;
  testAttemptId: string;
  studentId: string;
  
  // Different answer types
  selectedOptions?: string[] | number[];
  textAnswer?: string;
  matches?: { [key: string]: string };
  booleanAnswer?: 'true' | 'false' | 'not-given';
  essayAnswer?: string;
  audioResponseUrl?: string; // For speaking responses
  
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
  submittedAt: number;
}

// Test Attempt Structure
export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  status: 'in-progress' | 'completed' | 'abandoned';
  
  startedAt: number;
  completedAt?: number;
  totalTimeSpent: number; // in seconds
  
  // Scores
  listeningScore?: number;
  readingScore?: number;
  writingScore?: number;
  speakingScore?: number;
  overallScore: number;
  bandScore: number; // IELTS band score (0-9)
  
  answers: string[]; // Array of StudentAnswer IDs
  
  // Progress tracking
  currentSection?: number;
  sectionsCompleted: number[];
  
  createdAt: number;
  updatedAt?: number;
}

// File Upload Structure for audio/images
export interface MediaFile {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedBy: string; // Admin user ID
  associatedWith: 'question' | 'section' | 'test';
  associatedId: string;
  uploadedAt: number;
}

// Admin Upload Session (for tracking bulk uploads)
export interface UploadSession {
  id: string;
  adminId: string;
  testId?: string;
  sessionType: 'single-question' | 'section-bulk' | 'complete-test';
  status: 'in-progress' | 'completed' | 'failed';
  totalItems: number;
  completedItems: number;
  failedItems: number;
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

// Test Template (for reusable test structures)
export interface TestTemplate {
  id: string;
  name: string;
  description: string;
  testType: TestType;
  sections: {
    sectionNumber: number;
    title: string;
    questionTypes: QuestionType[];
    questionCount: number;
    timeLimit?: number;
  }[];
  createdBy: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: number;
}

// Validation and Upload Interfaces
export interface QuestionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UploadProgress {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  progress: number; // 0-100
  isComplete: boolean;
  hasErrors: boolean;
}

// ============== EXAM BUILDER SYSTEM ==============
// Comprehensive exam builder that combines tracks from all sections

export interface ExamTrackSelection {
  listeningTrackId?: string;
  readingTrackId?: string;
  writingTrackId?: string;
  speakingTrackId?: string;
}

export interface ExamConfiguration {
  id: string;
  title: string;
  description: string;
  testType: 'academic' | 'general';
  duration: number; // Total exam duration in minutes
  trackSelection: ExamTrackSelection;
  isPublished: boolean;
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
  tags?: string[];
  
  // Timing configuration
  timing: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };

  // Break configuration
  breaks: {
    afterListening: number; // minutes
    afterReading: number; // minutes
    afterWriting: number; // minutes
  };

  // Instructions
  instructions: {
    general: string;
    listening: string;
    reading: string;
    writing: string;
    speaking: string;
  };
}

export interface ExamFormData {
  title: string;
  description: string;
  testType: 'academic' | 'general';
  tags?: string[];
}

export interface ExamSummary {
  id: string;
  title: string;
  testType: 'academic' | 'general';
  isPublished: boolean;
  createdAt: number;
  totalDuration: number;
  tracksCount: number;
  tags?: string[];
  hasListening: boolean;
  hasReading: boolean;
  hasWriting: boolean;
  hasSpeaking: boolean;
}

// Track reference interfaces for exam builder
export interface TrackReference {
  id: string;
  title: string;
  testType: 'academic' | 'general';
  duration: number;
  isPublished: boolean;
  createdAt: number;
}

export interface ListeningTrackReference extends TrackReference {
  sectionsCount: number;
  totalQuestions: number;
  hasAudio: boolean;
}

export interface ReadingTrackReference extends TrackReference {
  passagesCount: number;
  totalQuestions: number;
  questionTypes: string[];
}

export interface WritingTrackReference extends TrackReference {
  hasTask1: boolean;
  hasTask2: boolean;
  task1Type?: string;
}

export interface SpeakingTrackReference extends TrackReference {
  part1TopicsCount: number;
  part2HasTask: boolean;
  part3QuestionsCount: number;
}

// Exam validation
export interface ExamValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Default timing configurations
export const DEFAULT_EXAM_TIMING = {
  academic: {
    listening: 30,
    reading: 60,
    writing: 60,
    speaking: 12
  },
  general: {
    listening: 30,
    reading: 60,
    writing: 60,
    speaking: 12
  }
};

export const DEFAULT_BREAK_TIMING = {
  afterListening: 10,
  afterReading: 10,
  afterWriting: 10
};

export const DEFAULT_INSTRUCTIONS = {
  general: "Welcome to the IELTS practice test. Please read all instructions carefully and manage your time effectively.",
  listening: "You will hear each recording only once. Write your answers on the answer sheet as you listen.",
  reading: "Read the passages carefully and answer all questions. You have 60 minutes to complete this section.",
  writing: "Complete both writing tasks. Task 1 should be at least 150 words, Task 2 should be at least 250 words.",
  speaking: "This speaking test consists of three parts. Speak clearly and express your ideas fully."
};