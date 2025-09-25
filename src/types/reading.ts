// IELTS Reading Test System Types

export type ReadingQuestionType = 
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'matching-headings'
  | 'matching-information'
  | 'matching-features'
  | 'matching-sentence-endings'
  | 'sentence-completion'
  | 'summary-completion'
  | 'table-completion'
  | 'diagram-completion'
  | 'short-answer';

// Aliases for compatibility
export type ReadingQuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface ReadingQuestion {
  id: string;
  type: ReadingQuestionType;
  questionNumber: number;
  text: string;
  options?: string[]; // For MCQ, matching questions
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: ReadingQuestionDifficulty;
  keywords?: string[]; // Keywords to help with answers
  instructions?: string; // Special instructions for this question
  maxWords?: number; // For completion questions (e.g., "NO MORE THAN THREE WORDS")
  passageReference?: string; // Reference to specific part of passage
}

export interface ReadingPassage {
  id: string;
  passageNumber?: 1 | 2 | 3;
  title: string;
  content: string; // Rich text content of the passage
  contentType: 'text' | 'html'; // Type of content
  contentUrl?: string; // URL for uploaded files
  fileUrl?: string; // If content is uploaded as file
  fileName?: string;
  wordCount?: number;
  questions: ReadingQuestion[];
  topic?: string; // Topic category (Academic, General, etc.)
}

export interface ReadingTrack {
  id: string;
  title: string;
  description?: string;
  testType: 'academic' | 'general'; // IELTS test type
  passages: ReadingPassage[];
  totalQuestions: number;
  totalTime: number; // Total time in minutes (usually 60)
  createdAt: number;
  updatedAt?: number;
  createdBy: string; // Admin user ID
  isPublished: boolean;
  tags?: string[];
  difficulty: ReadingQuestionDifficulty;
}

export interface ReadingTrackSummary {
  id: string;
  title: string;
  testType: 'academic' | 'general';
  difficulty: ReadingQuestionDifficulty;
  totalQuestions: number;
  totalPassages: number;
  isPublished: boolean;
  createdAt: number;
  tags?: string[];
}

export interface ReadingTrackFormData {
  title: string;
  description?: string;
  testType: 'academic' | 'general';
  difficulty: ReadingQuestionDifficulty;
  tags?: string[];
}

export interface ReadingPassageFormData {
  title: string;
  content: string;
  contentType: 'text' | 'html';
  file?: File;
  topic?: string;
}

export interface CreateReadingQuestionData {
  type: ReadingQuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficulty: ReadingQuestionDifficulty;
  keywords?: string[];
  instructions?: string;
  maxWords?: number;
  passageReference?: string;
}

// For exam creation - selecting existing tracks
export interface ExamReadingComponent {
  trackId: string;
  trackTitle: string;
  passagesUsed: (1 | 2 | 3)[]; // Which passages to include in this exam
  testType: 'academic' | 'general';
}

export interface ReadingTrackSummary {
  id: string;
  title: string;
  testType: 'academic' | 'general';
  totalQuestions: number;
  totalPassages: number;
  difficulty: ReadingQuestionDifficulty;
  createdAt: number;
  isPublished: boolean;
}

// Question type configurations
export interface QuestionTypeConfig {
  type: ReadingQuestionType;
  label: string;
  description: string;
  hasOptions: boolean;
  hasMultipleAnswers: boolean;
  hasWordLimit: boolean;
  allowsPassageReference: boolean;
}

export const READING_QUESTION_TYPES: QuestionTypeConfig[] = [
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    description: 'Choose the correct answer from 4 options (A, B, C, D)',
    hasOptions: true,
    hasMultipleAnswers: false,
    hasWordLimit: false,
    allowsPassageReference: true
  },
  {
    type: 'true-false-not-given',
    label: 'True / False / Not Given',
    description: 'Determine if statements are True, False, or Not Given',
    hasOptions: false,
    hasMultipleAnswers: false,
    hasWordLimit: false,
    allowsPassageReference: true
  },
  {
    type: 'yes-no-not-given',
    label: 'Yes / No / Not Given',
    description: 'Determine if statements are Yes, No, or Not Given',
    hasOptions: false,
    hasMultipleAnswers: false,
    hasWordLimit: false,
    allowsPassageReference: true
  },
  {
    type: 'matching-headings',
    label: 'Matching Headings',
    description: 'Match headings to paragraphs or sections',
    hasOptions: true,
    hasMultipleAnswers: false,
    hasWordLimit: false,
    allowsPassageReference: false
  },
  {
    type: 'matching-information',
    label: 'Matching Information',
    description: 'Match information to paragraphs or sections',
    hasOptions: true,
    hasMultipleAnswers: false,
    hasWordLimit: false,
    allowsPassageReference: true
  },
  {
    type: 'matching-features',
    label: 'Matching Features',
    description: 'Match features to categories or groups',
    hasOptions: true,
    hasMultipleAnswers: true,
    hasWordLimit: false,
    allowsPassageReference: true
  },
  {
    type: 'matching-sentence-endings',
    label: 'Matching Sentence Endings',
    description: 'Complete sentences by matching appropriate endings',
    hasOptions: true,
    hasMultipleAnswers: false,
    hasWordLimit: false,
    allowsPassageReference: true
  },
  {
    type: 'sentence-completion',
    label: 'Sentence Completion',
    description: 'Complete sentences with words from the passage',
    hasOptions: false,
    hasMultipleAnswers: false,
    hasWordLimit: true,
    allowsPassageReference: true
  },
  {
    type: 'summary-completion',
    label: 'Summary Completion',
    description: 'Complete a summary with words from the passage or given options',
    hasOptions: false,
    hasMultipleAnswers: false,
    hasWordLimit: true,
    allowsPassageReference: true
  },
  {
    type: 'table-completion',
    label: 'Table Completion',
    description: 'Complete a table with information from the passage',
    hasOptions: false,
    hasMultipleAnswers: false,
    hasWordLimit: true,
    allowsPassageReference: true
  },
  {
    type: 'diagram-completion',
    label: 'Diagram/Flowchart Completion',
    description: 'Complete diagrams or flowcharts with labels',
    hasOptions: false,
    hasMultipleAnswers: false,
    hasWordLimit: true,
    allowsPassageReference: true
  },
  {
    type: 'short-answer',
    label: 'Short Answer Questions',
    description: 'Answer questions with short phrases or words',
    hasOptions: false,
    hasMultipleAnswers: false,
    hasWordLimit: true,
    allowsPassageReference: true
  }
];