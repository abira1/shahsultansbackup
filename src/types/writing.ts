// IELTS Writing Test System Types

export interface WritingTask1 {
  instruction: string;
  imageUrl?: string;
  imageName?: string;
  passage?: string; // Optional context/description
  taskType: 'chart' | 'table' | 'graph' | 'process' | 'map'; // Visual types
}

export interface WritingTask2 {
  instruction: string;
  passage?: string; // Optional supporting context
  essayType: 'argument' | 'opinion' | 'problem-solution' | 'discussion'; // Essay types
}

export interface WritingTrack {
  id: string;
  title: string;
  description?: string;
  testType: 'academic' | 'general'; // IELTS test type
  createdAt: number;
  updatedAt?: number;
  createdBy: string; // Admin user ID
  isPublished: boolean;
  tags?: string[];
  task1: WritingTask1;
  task2: WritingTask2;
}

export interface WritingTrackSummary {
  id: string;
  title: string;
  testType: 'academic' | 'general';
  isPublished: boolean;
  createdAt: number;
  hasTask1Image: boolean;
  task1Type: string;
  task2Type: string;
  tags?: string[];
}

export interface WritingTrackFormData {
  title: string;
  description?: string;
  testType: 'academic' | 'general';
  tags?: string[];
}

export interface WritingTask1FormData {
  instruction: string;
  passage?: string;
  taskType: 'chart' | 'table' | 'graph' | 'process' | 'map';
  imageFile?: File;
}

export interface WritingTask2FormData {
  instruction: string;
  passage?: string;
  essayType: 'argument' | 'opinion' | 'problem-solution' | 'discussion';
}

// Configuration options for task types
export const TASK1_TYPES = [
  { value: 'chart', label: 'Chart/Bar Chart', description: 'Describe data from charts or bar graphs' },
  { value: 'table', label: 'Table', description: 'Summarize information from tables' },
  { value: 'graph', label: 'Line Graph', description: 'Describe trends in line graphs' },
  { value: 'process', label: 'Process/Diagram', description: 'Explain a process or diagram' },
  { value: 'map', label: 'Map', description: 'Describe changes shown in maps' }
];

export const TASK2_TYPES = [
  { value: 'argument', label: 'Argument Essay', description: 'Present arguments for/against a topic' },
  { value: 'opinion', label: 'Opinion Essay', description: 'Give your opinion on a topic' },
  { value: 'problem-solution', label: 'Problem/Solution', description: 'Identify problems and suggest solutions' },
  { value: 'discussion', label: 'Discussion Essay', description: 'Discuss both sides of an issue' }
];

// For exam creation - selecting existing tracks
export interface ExamWritingComponent {
  trackId: string;
  trackTitle: string;
  testType: 'academic' | 'general';
}

export interface WritingSubmission {
  id: string;
  trackId: string;
  studentId: string;
  task1Response: string;
  task2Response: string;
  submittedAt: number;
  timeSpent: number; // in minutes
  status: 'draft' | 'submitted';
}