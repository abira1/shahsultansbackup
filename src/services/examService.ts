import { ref, push, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';
import { database, storage } from '../config/firebase';
import { 
  Test, 
  Section, 
  Question, 
  StudentAnswer, 
  TestAttempt, 
  MediaFile, 
  UploadSession,
  TestTemplate,
  QuestionValidation,
  TestType,
  QuestionType
} from '../types/exam';

// Test Management Service
export const testService = {
  // Create a new test
  create: async (testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const testsRef = ref(database, 'tests');
      const newTestRef = push(testsRef);
      const testId = newTestRef.key!;
      
      const test: Test = {
        ...testData,
        id: testId,
        createdAt: Date.now(),
        sections: []
      };
      
      await set(newTestRef, test);
      return testId;
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  },

  // Get all tests
  getAll: async (): Promise<Test[]> => {
    try {
      const testsRef = ref(database, 'tests');
      const snapshot = await get(testsRef);
      
      if (snapshot.exists()) {
        const tests = snapshot.val();
        return Object.values(tests) as Test[];
      }
      return [];
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  },

  // Get test by ID
  getById: async (testId: string): Promise<Test | null> => {
    try {
      const testRef = ref(database, `tests/${testId}`);
      const snapshot = await get(testRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as Test;
      }
      return null;
    } catch (error) {
      console.error('Error fetching test:', error);
      throw error;
    }
  },

  // Update test
  update: async (testId: string, updates: Partial<Test>): Promise<void> => {
    try {
      const testRef = ref(database, `tests/${testId}`);
      await update(testRef, { ...updates, updatedAt: Date.now() });
    } catch (error) {
      console.error('Error updating test:', error);
      throw error;
    }
  },

  // Delete test (and all associated sections/questions)
  delete: async (testId: string): Promise<void> => {
    try {
      // First delete all sections and questions
      const sections = await sectionService.getByTestId(testId);
      for (const section of sections) {
        await sectionService.delete(section.id);
      }
      
      // Then delete the test
      const testRef = ref(database, `tests/${testId}`);
      await remove(testRef);
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  },

  // Publish/Unpublish test
  togglePublish: async (testId: string, isPublished: boolean): Promise<void> => {
    try {
      await testService.update(testId, { isPublished });
    } catch (error) {
      console.error('Error toggling test publish status:', error);
      throw error;
    }
  }
};

// Section Management Service
export const sectionService = {
  // Create a new section
  create: async (sectionData: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const sectionsRef = ref(database, 'sections');
      const newSectionRef = push(sectionsRef);
      const sectionId = newSectionRef.key!;
      
      const section: Section = {
        ...sectionData,
        id: sectionId,
        createdAt: Date.now(),
        questions: []
      };
      
      await set(newSectionRef, section);
      
      // Update the test to include this section
      const testRef = ref(database, `tests/${sectionData.testId}`);
      const testSnapshot = await get(testRef);
      if (testSnapshot.exists()) {
        const test = testSnapshot.val() as Test;
        const updatedSections = [...(test.sections || []), sectionId];
        await update(testRef, { sections: updatedSections });
      }
      
      return sectionId;
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  },

  // Get sections by test ID
  getByTestId: async (testId: string): Promise<Section[]> => {
    try {
      const sectionsRef = ref(database, 'sections');
      const sectionsQuery = query(sectionsRef, orderByChild('testId'), equalTo(testId));
      const snapshot = await get(sectionsQuery);
      
      if (snapshot.exists()) {
        const sections = snapshot.val();
        return Object.values(sections) as Section[];
      }
      return [];
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  },

  // Get section by ID
  getById: async (sectionId: string): Promise<Section | null> => {
    try {
      const sectionRef = ref(database, `sections/${sectionId}`);
      const snapshot = await get(sectionRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as Section;
      }
      return null;
    } catch (error) {
      console.error('Error fetching section:', error);
      throw error;
    }
  },

  // Update section
  update: async (sectionId: string, updates: Partial<Section>): Promise<void> => {
    try {
      const sectionRef = ref(database, `sections/${sectionId}`);
      await update(sectionRef, { ...updates, updatedAt: Date.now() });
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  },

  // Delete section (and all associated questions)
  delete: async (sectionId: string): Promise<void> => {
    try {
      // First get the section to know its test ID
      const section = await sectionService.getById(sectionId);
      if (!section) return;
      
      // Delete all questions in this section
      const questions = await questionService.getBySectionId(sectionId);
      for (const question of questions) {
        await questionService.delete(question.id);
      }
      
      // Remove section from test's sections array
      const testRef = ref(database, `tests/${section.testId}`);
      const testSnapshot = await get(testRef);
      if (testSnapshot.exists()) {
        const test = testSnapshot.val() as Test;
        const updatedSections = (test.sections || []).filter(id => id !== sectionId);
        await update(testRef, { sections: updatedSections });
      }
      
      // Delete the section
      const sectionRef = ref(database, `sections/${sectionId}`);
      await remove(sectionRef);
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  }
};

// Question Management Service
export const questionService = {
  // Create a new question
  create: async (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const questionsRef = ref(database, 'questions');
      const newQuestionRef = push(questionsRef);
      const questionId = newQuestionRef.key!;
      
      const question: Question = {
        ...questionData,
        id: questionId,
        createdAt: Date.now()
      };
      
      await set(newQuestionRef, question);
      
      // Update the section to include this question
      const sectionRef = ref(database, `sections/${questionData.sectionId}`);
      const sectionSnapshot = await get(sectionRef);
      if (sectionSnapshot.exists()) {
        const section = sectionSnapshot.val() as Section;
        const updatedQuestions = [...(section.questions || []), questionId];
        await update(sectionRef, { questions: updatedQuestions });
      }
      
      return questionId;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  // Get questions by section ID
  getBySectionId: async (sectionId: string): Promise<Question[]> => {
    try {
      const questionsRef = ref(database, 'questions');
      const questionsQuery = query(questionsRef, orderByChild('sectionId'), equalTo(sectionId));
      const snapshot = await get(questionsQuery);
      
      if (snapshot.exists()) {
        const questions = snapshot.val();
        return Object.values(questions) as Question[];
      }
      return [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Get question by ID
  getById: async (questionId: string): Promise<Question | null> => {
    try {
      const questionRef = ref(database, `questions/${questionId}`);
      const snapshot = await get(questionRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as Question;
      }
      return null;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },

  // Update question
  update: async (questionId: string, updates: Partial<Question>): Promise<void> => {
    try {
      const questionRef = ref(database, `questions/${questionId}`);
      await update(questionRef, { ...updates, updatedAt: Date.now() });
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  // Delete question
  delete: async (questionId: string): Promise<void> => {
    try {
      // First get the question to know its section ID
      const question = await questionService.getById(questionId);
      if (!question) return;
      
      // Remove question from section's questions array
      const sectionRef = ref(database, `sections/${question.sectionId}`);
      const sectionSnapshot = await get(sectionRef);
      if (sectionSnapshot.exists()) {
        const section = sectionSnapshot.val() as Section;
        const updatedQuestions = (section.questions || []).filter(id => id !== questionId);
        await update(sectionRef, { questions: updatedQuestions });
      }
      
      // Delete associated media files
      if (question.imageUrl) {
        await mediaService.deleteByUrl(question.imageUrl);
      }
      if (question.audioUrl) {
        await mediaService.deleteByUrl(question.audioUrl);
      }
      
      // Delete the question
      const questionRef = ref(database, `questions/${questionId}`);
      await remove(questionRef);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  // Validate question data
  validate: (questionData: Partial<Question>): QuestionValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!questionData.questionText?.trim()) {
      errors.push('Question text is required');
    }
    
    if (!questionData.type) {
      errors.push('Question type is required');
    }
    
    if (questionData.points === undefined || questionData.points <= 0) {
      errors.push('Points must be greater than 0');
    }
    
    // Type-specific validations
    switch (questionData.type) {
      case 'multiple-choice-single':
      case 'multiple-choice-multiple':
        if (!questionData.options || questionData.options.length < 2) {
          errors.push('Multiple choice questions must have at least 2 options');
        }
        if (!questionData.correctAnswers || questionData.correctAnswers.length === 0) {
          errors.push('Correct answers must be specified');
        }
        break;
        
      case 'fill-in-blank':
        if (!questionData.acceptedAnswers || questionData.acceptedAnswers.length === 0) {
          errors.push('Accepted answers must be specified for fill-in-blank questions');
        }
        break;
        
      case 'matching':
        if (!questionData.leftItems || !questionData.rightItems) {
          errors.push('Both left and right items must be specified for matching questions');
        }
        if (!questionData.correctMatches) {
          errors.push('Correct matches must be specified');
        }
        break;
        
      case 'true-false-not-given':
        if (!questionData.correctAnswer) {
          errors.push('Correct answer must be specified');
        }
        break;
        
      case 'writing-task-1':
      case 'writing-task-2':
        if (!questionData.wordLimit || questionData.wordLimit <= 0) {
          warnings.push('Word limit should be specified for writing tasks');
        }
        break;
        
      case 'speaking-part-1':
      case 'speaking-part-2':
      case 'speaking-part-3':
        if (!questionData.preparationTime && !questionData.responseTime) {
          warnings.push('Time limits should be specified for speaking questions');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
};

// Media File Management Service
export const mediaService = {
  // Upload file to Firebase Storage
  upload: async (
    file: File, 
    folder: string, 
    onProgress?: (progress: number) => void
  ): Promise<MediaFile> => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, `${folder}/${fileName}`);
      
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              const mediaFile: MediaFile = {
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                fileName,
                originalName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                url: downloadURL,
                uploadedBy: '', // Will be set by the calling function
                associatedWith: 'question', // Default, will be updated
                associatedId: '',
                uploadedAt: Date.now()
              };
              
              // Save media file record to database
              const mediaRef = ref(database, `mediaFiles/${mediaFile.id}`);
              await set(mediaRef, mediaFile);
              
              resolve(mediaFile);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Delete file from storage and database
  deleteByUrl: async (url: string): Promise<void> => {
    try {
      // Delete from storage
      const fileRef = storageRef(storage, url);
      await deleteObject(fileRef);
      
      // Find and delete from database
      const mediaRef = ref(database, 'mediaFiles');
      const snapshot = await get(mediaRef);
      
      if (snapshot.exists()) {
        const mediaFiles = snapshot.val();
        const fileEntry = Object.entries(mediaFiles).find(([, file]: [string, any]) => file.url === url);
        
        if (fileEntry) {
          const [fileId] = fileEntry;
          const fileDbRef = ref(database, `mediaFiles/${fileId}`);
          await remove(fileDbRef);
        }
      }
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw error;
    }
  }
};

// Upload Session Management
export const uploadSessionService = {
  // Create upload session
  create: async (sessionData: Omit<UploadSession, 'id' | 'startedAt'>): Promise<string> => {
    try {
      const sessionsRef = ref(database, 'uploadSessions');
      const newSessionRef = push(sessionsRef);
      const sessionId = newSessionRef.key!;
      
      const session: UploadSession = {
        ...sessionData,
        id: sessionId,
        startedAt: Date.now()
      };
      
      await set(newSessionRef, session);
      return sessionId;
    } catch (error) {
      console.error('Error creating upload session:', error);
      throw error;
    }
  },

  // Update session progress
  updateProgress: async (
    sessionId: string, 
    completedItems: number, 
    failedItems: number, 
    errors: string[]
  ): Promise<void> => {
    try {
      const sessionRef = ref(database, `uploadSessions/${sessionId}`);
      await update(sessionRef, {
        completedItems,
        failedItems,
        errors
      });
    } catch (error) {
      console.error('Error updating upload session:', error);
      throw error;
    }
  },

  // Complete session
  complete: async (sessionId: string, status: 'completed' | 'failed'): Promise<void> => {
    try {
      const sessionRef = ref(database, `uploadSessions/${sessionId}`);
      await update(sessionRef, {
        status,
        completedAt: Date.now()
      });
    } catch (error) {
      console.error('Error completing upload session:', error);
      throw error;
    }
  }
};

// Test Attempt Service
export const testAttemptService = {
  // Create new test attempt
  create: async (attemptData: Omit<TestAttempt, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const attemptsRef = ref(database, 'testAttempts');
      const newAttemptRef = push(attemptsRef);
      const attemptId = newAttemptRef.key!;
      
      const attempt: TestAttempt = {
        ...attemptData,
        id: attemptId,
        createdAt: Date.now()
      };
      
      await set(newAttemptRef, attempt);
      return attemptId;
    } catch (error) {
      console.error('Error creating test attempt:', error);
      throw error;
    }
  },

  // Get student's attempts
  getByStudentId: async (studentId: string): Promise<TestAttempt[]> => {
    try {
      const attemptsRef = ref(database, 'testAttempts');
      const attemptsQuery = query(attemptsRef, orderByChild('studentId'), equalTo(studentId));
      const snapshot = await get(attemptsQuery);
      
      if (snapshot.exists()) {
        const attempts = snapshot.val();
        return Object.values(attempts) as TestAttempt[];
      }
      return [];
    } catch (error) {
      console.error('Error fetching test attempts:', error);
      throw error;
    }
  }
};

// Utility functions
export const examUtils = {
  // Calculate band score based on raw score and test type
  calculateBandScore: (rawScore: number, maxScore: number, testType: TestType): number => {
    const percentage = (rawScore / maxScore) * 100;
    
    // IELTS band score conversion (simplified)
    if (percentage >= 90) return 9;
    if (percentage >= 80) return 8;
    if (percentage >= 70) return 7;
    if (percentage >= 60) return 6;
    if (percentage >= 50) return 5;
    if (percentage >= 40) return 4;
    if (percentage >= 30) return 3;
    if (percentage >= 20) return 2;
    if (percentage >= 10) return 1;
    return 0;
  },

  // Generate question number automatically
  generateQuestionNumber: async (sectionId: string): Promise<number> => {
    try {
      const questions = await questionService.getBySectionId(sectionId);
      return questions.length + 1;
    } catch (error) {
      console.error('Error generating question number:', error);
      return 1;
    }
  },

  // Validate audio file
  validateAudioFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only MP3 and WAV files are allowed' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 50MB' };
    }
    
    return { isValid: true };
  },

  // Validate image file
  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and GIF files are allowed' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }
    
    return { isValid: true };
  }
};