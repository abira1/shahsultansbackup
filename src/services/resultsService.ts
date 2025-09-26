import { ref, get, update } from 'firebase/database';
import { database } from '../config/firebase';

// Extended Result interface for admin management
export interface AdminExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  answers: Record<string, any>;
  submittedAt: number;
  status: 'submitted' | 'in-review' | 'scored' | 'published';
  scores?: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
    overall?: number;
  };
  bandScore?: number;
  published: boolean;
  reviewedBy?: string;
  reviewedAt?: number;
  notes?: string;
  examTitle?: string;
  examType?: string;
}

// Detailed answer structure for admin review
export interface DetailedAnswer {
  questionId: string;
  questionText: string;
  questionType: string;
  studentAnswer: any;
  correctAnswer?: any;
  isCorrect?: boolean;
  points?: number;
  maxPoints: number;
  feedback?: string;
  sectionTitle?: string;
}

export const resultsService = {
  // Get all exam results for admin
  getAllResults: async (): Promise<AdminExamResult[]> => {
    try {
      const resultsRef = ref(database, 'results');
      const snapshot = await get(resultsRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const resultsData = snapshot.val();
      const allResults: AdminExamResult[] = [];

      // Iterate through each exam
      for (const examId in resultsData) {
        const examResults = resultsData[examId];
        
        // Get exam details
        const examRef = ref(database, `tests/${examId}`);
        const examSnapshot = await get(examRef);
        const examData = examSnapshot.exists() ? examSnapshot.val() : null;

        // Iterate through each student result
        for (const studentId in examResults) {
          const result = examResults[studentId];
          
          // Get student details
          const userRef = ref(database, `users/${studentId}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.exists() ? userSnapshot.val() : null;

          allResults.push({
            id: `${examId}_${studentId}`,
            examId,
            studentId,
            studentName: userData ? `${userData.firstName} ${userData.lastName}` : 'Unknown Student',
            studentEmail: userData?.email || 'No email',
            examTitle: examData?.title || 'Unknown Exam',
            examType: examData?.type || 'Unknown Type',
            ...result
          });
        }
      }

      // Sort by submission time (newest first)
      return allResults.sort((a, b) => b.submittedAt - a.submittedAt);
    } catch (error) {
      console.error('Error fetching all results:', error);
      throw error;
    }
  },

  // Get results for a specific exam
  getExamResults: async (examId: string): Promise<AdminExamResult[]> => {
    try {
      const resultsRef = ref(database, `results/${examId}`);
      const snapshot = await get(resultsRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const resultsData = snapshot.val();
      const examResults: AdminExamResult[] = [];

      // Get exam details
      const examRef = ref(database, `tests/${examId}`);
      const examSnapshot = await get(examRef);
      const examData = examSnapshot.exists() ? examSnapshot.val() : null;

      for (const studentId in resultsData) {
        const result = resultsData[studentId];
        
        // Get student details
        const userRef = ref(database, `users/${studentId}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.exists() ? userSnapshot.val() : null;

        examResults.push({
          id: `${examId}_${studentId}`,
          examId,
          studentId,
          studentName: userData ? `${userData.firstName} ${userData.lastName}` : 'Unknown Student',
          studentEmail: userData?.email || 'No email',
          examTitle: examData?.title || 'Unknown Exam',
          examType: examData?.type || 'Unknown Type',
          ...result
        });
      }

      return examResults.sort((a, b) => b.submittedAt - a.submittedAt);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      throw error;
    }
  },

  // Get detailed result for admin review
  getDetailedResult: async (examId: string, studentId: string): Promise<{
    result: AdminExamResult;
    detailedAnswers: DetailedAnswer[];
  }> => {
    try {
      // Get the result
      const resultRef = ref(database, `results/${examId}/${studentId}`);
      const resultSnapshot = await get(resultRef);
      
      if (!resultSnapshot.exists()) {
        throw new Error('Result not found');
      }

      const resultData = resultSnapshot.val();

      // Get student details
      const userRef = ref(database, `users/${studentId}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.exists() ? userSnapshot.val() : null;

      // Get exam details
      const examRef = ref(database, `tests/${examId}`);
      const examSnapshot = await get(examRef);
      const examData = examSnapshot.exists() ? examSnapshot.val() : null;

      const result: AdminExamResult = {
        id: `${examId}_${studentId}`,
        examId,
        studentId,
        studentName: userData ? `${userData.firstName} ${userData.lastName}` : 'Unknown Student',
        studentEmail: userData?.email || 'No email',
        examTitle: examData?.title || 'Unknown Exam',
        examType: examData?.type || 'Unknown Type',
        ...resultData
      };

      // Get detailed answers
      const detailedAnswers: DetailedAnswer[] = [];
      
      if (examData && examData.sections) {
        for (const sectionId of examData.sections) {
          // Get section details
          const sectionRef = ref(database, `sections/${sectionId}`);
          const sectionSnapshot = await get(sectionRef);
          const sectionData = sectionSnapshot.exists() ? sectionSnapshot.val() : null;

          if (sectionData && sectionData.questions) {
            for (const questionId of sectionData.questions) {
              // Get question details
              const questionRef = ref(database, `questions/${questionId}`);
              const questionSnapshot = await get(questionRef);
              const questionData = questionSnapshot.exists() ? questionSnapshot.val() : null;

              if (questionData) {
                const studentAnswer = resultData.answers[questionId];
                
                detailedAnswers.push({
                  questionId,
                  questionText: questionData.questionText,
                  questionType: questionData.type,
                  studentAnswer: studentAnswer?.answer || 'No answer provided',
                  correctAnswer: questionData.correctAnswers || questionData.correctAnswer,
                  isCorrect: studentAnswer?.isCorrect || false,
                  points: studentAnswer?.points || 0,
                  maxPoints: questionData.points || 1,
                  feedback: studentAnswer?.feedback || '',
                  sectionTitle: sectionData.title
                });
              }
            }
          }
        }
      }

      return { result, detailedAnswers };
    } catch (error) {
      console.error('Error fetching detailed result:', error);
      throw error;
    }
  },

  // Update result scores and status
  updateResult: async (examId: string, studentId: string, updates: {
    scores?: {
      listening?: number;
      reading?: number;
      writing?: number;
      speaking?: number;
      overall?: number;
    };
    bandScore?: number;
    status?: 'submitted' | 'in-review' | 'scored' | 'published';
    notes?: string;
    reviewedBy?: string;
  }): Promise<void> => {
    try {
      const resultRef = ref(database, `results/${examId}/${studentId}`);
      const updateData = {
        ...updates,
        reviewedAt: Date.now()
      };

      await update(resultRef, updateData);
    } catch (error) {
      console.error('Error updating result:', error);
      throw error;
    }
  },

  // Publish result (make it visible to student)
  publishResult: async (examId: string, studentId: string): Promise<void> => {
    try {
      const resultRef = ref(database, `results/${examId}/${studentId}`);
      await update(resultRef, {
        published: true,
        status: 'published',
        publishedAt: Date.now()
      });
    } catch (error) {
      console.error('Error publishing result:', error);
      throw error;
    }
  },

  // Unpublish result (hide from student)
  unpublishResult: async (examId: string, studentId: string): Promise<void> => {
    try {
      const resultRef = ref(database, `results/${examId}/${studentId}`);
      await update(resultRef, {
        published: false,
        status: 'scored'
      });
    } catch (error) {
      console.error('Error unpublishing result:', error);
      throw error;
    }
  },

  // Get published results for a student
  getStudentResults: async (studentId: string): Promise<AdminExamResult[]> => {
    try {
      const resultsRef = ref(database, 'results');
      const snapshot = await get(resultsRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const resultsData = snapshot.val();
      const studentResults: AdminExamResult[] = [];

      // Iterate through each exam
      for (const examId in resultsData) {
        const examResults = resultsData[examId];
        
        // Check if student has result for this exam
        if (examResults[studentId] && examResults[studentId].published) {
          const result = examResults[studentId];
          
          // Get exam details
          const examRef = ref(database, `tests/${examId}`);
          const examSnapshot = await get(examRef);
          const examData = examSnapshot.exists() ? examSnapshot.val() : null;

          studentResults.push({
            id: `${examId}_${studentId}`,
            examId,
            studentId,
            examTitle: examData?.title || 'Unknown Exam',
            examType: examData?.type || 'Unknown Type',
            ...result
          });
        }
      }

      // Sort by submission time (newest first)
      return studentResults.sort((a, b) => b.submittedAt - a.submittedAt);
    } catch (error) {
      console.error('Error fetching student results:', error);
      throw error;
    }
  },

  // Update individual answer score/feedback
  updateAnswerScore: async (
    examId: string, 
    studentId: string, 
    questionId: string, 
    points: number, 
    feedback?: string
  ): Promise<void> => {
    try {
      const answerRef = ref(database, `results/${examId}/${studentId}/answers/${questionId}`);
      await update(answerRef, {
        points,
        feedback: feedback || '',
        manuallyScored: true,
        scoredAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating answer score:', error);
      throw error;
    }
  },

  // Get statistics for admin dashboard
  getResultsStatistics: async (): Promise<{
    totalSubmissions: number;
    pendingReview: number;
    published: number;
    averageScores: {
      listening: number;
      reading: number;
      writing: number;
      speaking: number;
      overall: number;
    };
  }> => {
    try {
      const resultsRef = ref(database, 'results');
      const snapshot = await get(resultsRef);
      
      if (!snapshot.exists()) {
        return {
          totalSubmissions: 0,
          pendingReview: 0,
          published: 0,
          averageScores: {
            listening: 0,
            reading: 0,
            writing: 0,
            speaking: 0,
            overall: 0
          }
        };
      }

      const resultsData = snapshot.val();
      let totalSubmissions = 0;
      let pendingReview = 0;
      let published = 0;
      const scores = {
        listening: [] as number[],
        reading: [] as number[],
        writing: [] as number[],
        speaking: [] as number[],
        overall: [] as number[]
      };

      // Count statistics
      for (const examId in resultsData) {
        const examResults = resultsData[examId];
        
        for (const studentId in examResults) {
          const result = examResults[studentId];
          totalSubmissions++;
          
          if (result.published) {
            published++;
          } else if (result.status === 'submitted') {
            pendingReview++;
          }

          // Collect scores for average calculation
          if (result.scores) {
            if (result.scores.listening) scores.listening.push(result.scores.listening);
            if (result.scores.reading) scores.reading.push(result.scores.reading);
            if (result.scores.writing) scores.writing.push(result.scores.writing);
            if (result.scores.speaking) scores.speaking.push(result.scores.speaking);
            if (result.scores.overall) scores.overall.push(result.scores.overall);
          }
        }
      }

      // Calculate averages
      const averageScores = {
        listening: scores.listening.length > 0 ? scores.listening.reduce((a, b) => a + b, 0) / scores.listening.length : 0,
        reading: scores.reading.length > 0 ? scores.reading.reduce((a, b) => a + b, 0) / scores.reading.length : 0,
        writing: scores.writing.length > 0 ? scores.writing.reduce((a, b) => a + b, 0) / scores.writing.length : 0,
        speaking: scores.speaking.length > 0 ? scores.speaking.reduce((a, b) => a + b, 0) / scores.speaking.length : 0,
        overall: scores.overall.length > 0 ? scores.overall.reduce((a, b) => a + b, 0) / scores.overall.length : 0,
      };

      return {
        totalSubmissions,
        pendingReview,
        published,
        averageScores
      };
    } catch (error) {
      console.error('Error fetching results statistics:', error);
      throw error;
    }
  }
};