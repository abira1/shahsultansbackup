import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase';

// Service to handle exam submissions and create results
export const examSubmissionService = {
  // Submit exam answers and create result record
  submitExam: async (
    examId: string, 
    studentId: string, 
    answers: Record<string, any>,
    examData?: any
  ): Promise<void> => {
    try {
      // Get exam details if not provided
      let exam = examData;
      if (!exam) {
        const examRef = ref(database, `tests/${examId}`);
        const examSnapshot = await get(examRef);
        exam = examSnapshot.exists() ? examSnapshot.val() : null;
      }

      // Calculate automatic scores for objective questions
      const processedAnswers = await processAnswers(examId, answers);
      
      // Create result record
      const resultData = {
        examId,
        studentId,
        answers: processedAnswers,
        submittedAt: Date.now(),
        status: 'submitted',
        published: false,
        examTitle: exam?.title || 'Unknown Exam',
        examType: exam?.type || 'unknown'
      };

      // Save to results/{examId}/{studentId}
      const resultRef = ref(database, `results/${examId}/${studentId}`);
      await set(resultRef, resultData);

      console.log('Exam submitted successfully:', resultData);
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw error;
    }
  },

  // Process and score answers automatically where possible
  processAnswers: async (examId: string, rawAnswers: Record<string, any>) => {
    const processedAnswers: Record<string, any> = {};
    
    try {
      // Get exam structure to access questions
      const examRef = ref(database, `tests/${examId}`);
      const examSnapshot = await get(examRef);
      
      if (!examSnapshot.exists()) {
        throw new Error('Exam not found');
      }
      
      const examData = examSnapshot.val();
      
      // Process each section
      if (examData.sections) {
        for (const sectionId of examData.sections) {
          const sectionRef = ref(database, `sections/${sectionId}`);
          const sectionSnapshot = await get(sectionRef);
          
          if (sectionSnapshot.exists()) {
            const sectionData = sectionSnapshot.val();
            
            // Process each question in the section
            if (sectionData.questions) {
              for (const questionId of sectionData.questions) {
                const questionRef = ref(database, `questions/${questionId}`);
                const questionSnapshot = await get(questionRef);
                
                if (questionSnapshot.exists()) {
                  const questionData = questionSnapshot.val();
                  const studentAnswer = rawAnswers[questionId];
                  
                  if (studentAnswer) {
                    const processedAnswer = await scoreAnswer(questionData, studentAnswer);
                    processedAnswers[questionId] = processedAnswer;
                  }
                }
              }
            }
          }
        }
      }
      
      return processedAnswers;
    } catch (error) {
      console.error('Error processing answers:', error);
      // Return raw answers if processing fails
      return rawAnswers;
    }
  }
};

// Score individual answers based on question type
const processAnswers = async (examId: string, rawAnswers: Record<string, any>) => {
  return examSubmissionService.processAnswers(examId, rawAnswers);
};

const scoreAnswer = async (questionData: any, studentAnswer: any) => {
  const result = {
    answer: studentAnswer.answer || studentAnswer,
    submittedAt: Date.now(),
    isCorrect: false,
    points: 0,
    maxPoints: questionData.points || 1,
    feedback: ''
  };

  try {
    switch (questionData.type) {
      case 'multiple-choice-single':
        result.isCorrect = checkMultipleChoiceSingle(questionData, studentAnswer.answer);
        break;
        
      case 'multiple-choice-multiple':
        result.isCorrect = checkMultipleChoiceMultiple(questionData, studentAnswer.answer);
        break;
        
      case 'fill-in-blank':
        result.isCorrect = checkFillInBlank(questionData, studentAnswer.answer);
        break;
        
      case 'true-false-not-given':
        result.isCorrect = checkTrueFalseNotGiven(questionData, studentAnswer.answer);
        break;
        
      case 'matching':
        result.isCorrect = checkMatching(questionData, studentAnswer.answer);
        break;
        
      // Writing and speaking tasks require manual scoring
      case 'writing-task-1':
      case 'writing-task-2':
      case 'speaking-part-1':
      case 'speaking-part-2':
      case 'speaking-part-3':
        result.feedback = 'Requires manual scoring by instructor';
        break;
        
      default:
        result.feedback = 'Unknown question type';
    }
    
    // Award points if correct
    if (result.isCorrect) {
      result.points = result.maxPoints;
    }
    
  } catch (error) {
    console.error('Error scoring answer:', error);
    result.feedback = 'Error occurred during scoring';
  }
  
  return result;
};

// Scoring functions for each question type
const checkMultipleChoiceSingle = (questionData: any, studentAnswer: any): boolean => {
  if (!questionData.correctAnswers || !Array.isArray(questionData.correctAnswers)) {
    return false;
  }
  return questionData.correctAnswers.includes(studentAnswer);
};

const checkMultipleChoiceMultiple = (questionData: any, studentAnswer: any): boolean => {
  if (!questionData.correctAnswers || !Array.isArray(questionData.correctAnswers) || !Array.isArray(studentAnswer)) {
    return false;
  }
  
  // Check if student selected all correct answers and no incorrect ones
  const correctSet = new Set(questionData.correctAnswers);
  const studentSet = new Set(studentAnswer);
  
  return correctSet.size === studentSet.size && 
         [...correctSet].every(answer => studentSet.has(answer));
};

const checkFillInBlank = (questionData: any, studentAnswer: any): boolean => {
  if (!questionData.acceptedAnswers || !Array.isArray(questionData.acceptedAnswers)) {
    return false;
  }
  
  // For fill-in-blank, check if student answers match any of the accepted answers
  if (Array.isArray(studentAnswer)) {
    return studentAnswer.every((answer, index) => {
      const acceptedForPosition = questionData.acceptedAnswers[index];
      if (!acceptedForPosition) return false;
      
      return acceptedForPosition.some((accepted: string) => 
        answer.toLowerCase().trim() === accepted.toLowerCase().trim()
      );
    });
  }
  
  // Single answer
  return questionData.acceptedAnswers.flat().some((accepted: string) =>
    studentAnswer.toLowerCase().trim() === accepted.toLowerCase().trim()
  );
};

const checkTrueFalseNotGiven = (questionData: any, studentAnswer: any): boolean => {
  return questionData.correctAnswer === studentAnswer;
};

const checkMatching = (questionData: any, studentAnswer: any): boolean => {
  if (!questionData.correctMatches || typeof studentAnswer !== 'object') {
    return false;
  }
  
  // Check if all matches are correct
  for (const [key, value] of Object.entries(questionData.correctMatches)) {
    if (studentAnswer[key] !== value) {
      return false;
    }
  }
  
  return true;
};

export default examSubmissionService;