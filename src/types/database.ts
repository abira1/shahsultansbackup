// User types
export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  institution?: string;
  role: 'student' | 'teacher' | 'admin';
  profileImage?: string;
  createdAt: number;
  updatedAt?: number;
  isActive: boolean;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  duration?: string;
  schedule?: string;
  fee: string;
  syllabus: string[];
  features: string[];
  popular: boolean;
  image?: string;
  category: 'full-courses' | 'practice-tests' | 'specialized';
  location?: string;
  contact?: string;
  createdAt: number;
  updatedAt?: number;
  isActive: boolean;
}

// Question types
export interface Question {
  id: string;
  module: 'listening' | 'reading' | 'writing' | 'speaking';
  section: number;
  questionType: string;
  questionNumber: number;
  title?: string;
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: number;
  updatedAt?: number;
  isActive: boolean;
}

// Mock Test types
export interface MockTest {
  id: string;
  title: string;
  description: string;
  modules: ('listening' | 'reading' | 'writing' | 'speaking')[];
  duration: number; // in minutes
  totalQuestions: number;
  isActive: boolean;
  createdAt: number;
  updatedAt?: number;
}

// Test Attempt types
export interface TestAttempt {
  id: string;
  userId: string;
  mockTestId: string;
  startedAt: number;
  completedAt?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  answers: Record<string, any>;
  scores: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
    overall?: number;
  };
  timeSpent: number; // in seconds
}

// Exam Results types
export interface ExamResult {
  id: string;
  userId: string;
  testAttemptId: string;
  mockTestId: string;
  scores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    overall: number;
  };
  bandScore: number;
  feedback?: string;
  createdAt: number;
}

// Notification types
export interface Notification {
  id: string;
  userId?: string; // If null, it's a global notification
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: number;
}

// Settings types
export interface AppSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  testSettings: {
    listeningDuration: number;
    readingDuration: number;
    writingDuration: number;
    speakingDuration: number;
    breakDuration: number;
  };
  emailSettings: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
  };
  updatedAt: number;
}

// Database structure interface
export interface DatabaseSchema {
  users: Record<string, User>;
  courses: Record<string, Course>;
  questions: Record<string, Question>;
  mockTests: Record<string, MockTest>;
  testAttempts: Record<string, TestAttempt>;
  examResults: Record<string, ExamResult>;
  notifications: Record<string, Notification>;
  settings: AppSettings;
}