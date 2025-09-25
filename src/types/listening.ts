// IELTS Listening Test System Types

export type ListeningQuestionType = 
  | 'multiple-choice-single'
  | 'multiple-choice-multiple'
  | 'matching'
  | 'form-completion'
  | 'note-completion'
  | 'table-completion'
  | 'sentence-completion'
  | 'short-answer'
  | 'diagram-labeling'
  | 'flow-chart-completion'
  | 'map-plan-diagram';

// Aliases for compatibility
export type QuestionType = ListeningQuestionType;
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface ListeningQuestion {
  id: string;
  type: ListeningQuestionType;
  questionNumber: number;
  text: string;
  options?: string[]; // For MCQ, matching
  correctAnswer: string | string[] | { [key: string]: string };
  correctAnswers?: string[]; // For multiple choice multiple
  explanation?: string;
  timeStamp?: number; // When in audio this question appears (in seconds)
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  keywords?: string[]; // Help students identify key listening points
  instructions?: string; // Special instructions for this question
  maxWords?: number; // For completion questions
}

export interface CreateQuestionData {
  type: ListeningQuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  points: number;
  difficulty: QuestionDifficulty;
  timeStamp?: number;
  keywords?: string[];
  instructions?: string;
  maxWords?: number;
}

export interface ListeningSection {
  sectionNumber: 1 | 2 | 3 | 4;
  title: string;
  description?: string;
  questions: ListeningQuestion[];
  timeStamp?: {
    start: number; // Start time in seconds
    end: number;   // End time in seconds
  };
}

export interface ListeningTrack {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  audioFileName: string;
  audioDuration?: number; // Total duration in seconds
  audioSize?: number; // File size in bytes
  sections: {
    section1: ListeningSection;
    section2: ListeningSection;
    section3: ListeningSection;
    section4: ListeningSection;
  };
  totalQuestions: number;
  createdAt: number;
  updatedAt?: number;
  createdBy: string; // Admin user ID
  isPublished: boolean;
  tags?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ListeningTrackFormData {
  title: string;
  description?: string;
  audioFile?: File;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface ListeningQuestionFormData {
  type: ListeningQuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[] | { [key: string]: string };
  explanation?: string;
  timeStamp?: number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  keywords?: string[];
}

// For exam creation - selecting existing tracks
export interface ExamListeningComponent {
  trackId: string;
  trackTitle: string;
  audioUrl: string;
  sectionsUsed: (1 | 2 | 3 | 4)[]; // Which sections to include in this exam
}

export interface ListeningTrackSummary {
  id: string;
  title: string;
  totalQuestions: number;
  duration?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: number;
  isPublished: boolean;
}