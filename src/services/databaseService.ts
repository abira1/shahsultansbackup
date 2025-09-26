import { useFirebaseData, firebaseService } from '../hooks/useFirebase';
import { Course } from '../types/database';

// Course management service
export const courseService = {
  // Get all courses
  getAll: () => useFirebaseData<Record<string, Course>>('courses'),

  // Create new course
  create: async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await firebaseService.create('courses', courseData);
  },

  // Update course
  update: async (courseId: string, courseData: Partial<Course>) => {
    return await firebaseService.update(`courses/${courseId}`, courseData);
  },

  // Delete course
  delete: async (courseId: string) => {
    return await firebaseService.delete(`courses/${courseId}`);
  },

  // Toggle course active status
  toggleActive: async (courseId: string, isActive: boolean) => {
    return await firebaseService.update(`courses/${courseId}`, { isActive });
  }
};

// Question management service
export const questionService = {
  // Get all questions
  getAll: () => useFirebaseData<Record<string, any>>('questions'),

  // Get questions by module
  getByModule: (module: string) => useFirebaseData<Record<string, any>>(`questions/${module}`),

  // Create new question
  create: async (questionData: any) => {
    return await firebaseService.create('questions', questionData);
  },

  // Update question
  update: async (questionId: string, questionData: any) => {
    return await firebaseService.update(`questions/${questionId}`, questionData);
  },

  // Delete question
  delete: async (questionId: string) => {
    return await firebaseService.delete(`questions/${questionId}`);
  }
};

// User management service
export const userService = {
  // Get all users
  getAll: () => useFirebaseData<Record<string, any>>('users'),

  // Get user by ID
  getById: (userId: string) => useFirebaseData<any>(`users/${userId}`),

  // Update user
  update: async (userId: string, userData: any) => {
    return await firebaseService.update(`users/${userId}`, userData);
  },

  // Delete user
  delete: async (userId: string) => {
    return await firebaseService.delete(`users/${userId}`);
  },

  // Update user role
  updateRole: async (userId: string, role: 'student' | 'teacher' | 'admin') => {
    return await firebaseService.update(`users/${userId}`, { role });
  }
};

// Mock test management service
export const mockTestService = {
  // Get all mock tests
  getAll: () => useFirebaseData<Record<string, any>>('mockTests'),

  // Create new mock test
  create: async (testData: any) => {
    return await firebaseService.create('mockTests', testData);
  },

  // Update mock test
  update: async (testId: string, testData: any) => {
    return await firebaseService.update(`mockTests/${testId}`, testData);
  },

  // Delete mock test
  delete: async (testId: string) => {
    return await firebaseService.delete(`mockTests/${testId}`);
  }
};

// Test attempt service
export const testAttemptService = {
  // Get user's test attempts
  getUserAttempts: (userId: string) => useFirebaseData<Record<string, any>>(`testAttempts/${userId}`),

  // Create new test attempt
  create: async (attemptData: any) => {
    return await firebaseService.create('testAttempts', attemptData);
  },

  // Update test attempt
  update: async (attemptId: string, attemptData: any) => {
    return await firebaseService.update(`testAttempts/${attemptId}`, attemptData);
  },

  // Submit test attempt
  submit: async (attemptId: string, answers: any, scores: any) => {
    return await firebaseService.update(`testAttempts/${attemptId}`, {
      answers,
      scores,
      completedAt: Date.now(),
      status: 'completed'
    });
  }
};

// Settings service
export const settingsService = {
  // Get app settings
  get: () => useFirebaseData<any>('settings'),

  // Update settings
  update: async (settings: any) => {
    return await firebaseService.set('settings', { ...settings, updatedAt: Date.now() });
  }
};