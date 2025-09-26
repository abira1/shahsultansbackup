import { database, storage } from '../config/firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';
import { ref as storageRef, getDownloadURL, deleteObject, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { 
  ReadingTrack, 
  ReadingTrackFormData,
  ReadingTrackSummary,
  ReadingPassageFormData,
  CreateReadingQuestionData,
  ReadingQuestion
} from '../types/reading';

export class ReadingService {
  private tracksPath = 'readingTracks';

  // Upload file to Firebase Storage
  async uploadFile(file: File, trackId: string, fileName: string, onProgress?: (progress: number) => void): Promise<{
    url: string;
    fileName: string;
    size: number;
  }> {
    try {
      const fileRef = storageRef(storage, `reading/${trackId}/${fileName}`);
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
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              resolve({
                url: downloadURL,
                fileName: fileName,
                size: file.size
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  // Create new reading track
  async createTrack(trackData: ReadingTrackFormData): Promise<string> {
    try {
      const tracksRef = ref(database, this.tracksPath);
      const newTrackRef = push(tracksRef);
      const trackId = newTrackRef.key!;

      const track: Omit<ReadingTrack, 'id' | 'passages'> = {
        title: trackData.title,
        description: trackData.description || '',
        testType: trackData.testType,
        totalQuestions: 0,
        totalTime: 60, // Standard 60 minutes for reading
        createdAt: Date.now(),
        createdBy: 'admin', // TODO: Get from auth context
        isPublished: false,
        difficulty: trackData.difficulty,
        tags: trackData.tags || []
      };

      await set(newTrackRef, {
        ...track,
        id: trackId,
        passages: {
          passage1: { id: `${trackId}_p1`, passageNumber: 1, title: '', content: '', contentType: 'text', questions: [] },
          passage2: { id: `${trackId}_p2`, passageNumber: 2, title: '', content: '', contentType: 'text', questions: [] },
          passage3: { id: `${trackId}_p3`, passageNumber: 3, title: '', content: '', contentType: 'text', questions: [] }
        }
      });

      return trackId;
    } catch (error) {
      throw new Error(`Failed to create track: ${error}`);
    }
  }

  // Update passage content
  async updatePassage(trackId: string, passageNumber: 1 | 2 | 3, passageData: ReadingPassageFormData): Promise<void> {
    try {
      let fileUrl = '';
      let fileName = '';

      // Upload file if provided
      if (passageData.file && passageData.contentType !== 'text') {
        const uploadResult = await this.uploadFile(
          passageData.file, 
          trackId, 
          `passage${passageNumber}_${passageData.file.name}`
        );
        fileUrl = uploadResult.url;
        fileName = uploadResult.fileName;
      }

      const passageRef = ref(database, `${this.tracksPath}/${trackId}/passages/passage${passageNumber}`);
      const passageUpdate = {
        title: passageData.title,
        content: passageData.content,
        contentType: passageData.contentType,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined,
        topic: passageData.topic,
        wordCount: passageData.contentType === 'text' ? passageData.content.split(' ').length : undefined
      };

      await update(passageRef, passageUpdate);

      // Update track timestamp
      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to update passage: ${error}`);
    }
  }

  // Get all reading tracks
  async getAllTracks(): Promise<ReadingTrackSummary[]> {
    try {
      const tracksRef = ref(database, this.tracksPath);
      const snapshot = await get(tracksRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const tracks = snapshot.val();
      return Object.entries(tracks).map(([id, track]: [string, any]) => ({
        id,
        title: track.title,
        testType: track.testType,
        totalQuestions: track.totalQuestions || 0,
        totalPassages: Object.values(track.passages || {}).filter((p: any) => p.content).length,
        difficulty: track.difficulty,
        createdAt: track.createdAt,
        isPublished: track.isPublished
      }));
    } catch (error) {
      throw new Error(`Failed to get tracks: ${error}`);
    }
  }

  // Get track by ID
  async getTrackById(trackId: string): Promise<ReadingTrack> {
    try {
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      const snapshot = await get(trackRef);
      
      if (!snapshot.exists()) {
        throw new Error('Track not found');
      }

      return snapshot.val() as ReadingTrack;
    } catch (error) {
      throw new Error(`Failed to get track: ${error}`);
    }
  }

  // Add question to a passage
  async addQuestion(trackId: string, passageNumber: 1 | 2 | 3, questionData: CreateReadingQuestionData): Promise<void> {
    try {
      const track = await this.getTrackById(trackId);
      const passageKey = `passage${passageNumber}` as keyof typeof track.passages;
      const passage = track.passages[passageKey];
      
      // Generate question ID and number
      const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const questionNumber = passage.questions.length + 1;
      
      const newQuestion: ReadingQuestion = {
        id: questionId,
        questionNumber,
        type: questionData.type,
        text: questionData.text,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer || '',
        points: questionData.points,
        difficulty: questionData.difficulty,
        keywords: questionData.keywords,
        instructions: questionData.instructions,
        maxWords: questionData.maxWords,
        passageReference: questionData.passageReference
      };

      // Add question to passage
      const questionsRef = ref(database, `${this.tracksPath}/${trackId}/passages/${passageKey}/questions`);
      const newQuestionRef = push(questionsRef);
      await set(newQuestionRef, newQuestion);

      // Update total questions count
      const totalQuestions = Object.values(track.passages).reduce((total, p) => total + p.questions.length, 0) + 1;
      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        totalQuestions,
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to add question: ${error}`);
    }
  }

  // Update question
  async updateQuestion(trackId: string, passageNumber: 1 | 2 | 3, questionId: string, questionData: CreateReadingQuestionData): Promise<void> {
    try {
      const track = await this.getTrackById(trackId);
      const passageKey = `passage${passageNumber}` as keyof typeof track.passages;
      const passage = track.passages[passageKey];
      
      const questionIndex = passage.questions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) {
        throw new Error('Question not found');
      }

      const existingQuestion = passage.questions[questionIndex];
      const updatedQuestion: ReadingQuestion = {
        ...existingQuestion,
        type: questionData.type,
        text: questionData.text,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer || existingQuestion.correctAnswer,
        points: questionData.points,
        difficulty: questionData.difficulty,
        keywords: questionData.keywords,
        instructions: questionData.instructions,
        maxWords: questionData.maxWords,
        passageReference: questionData.passageReference
      };

      // Update question in database
      const questionRef = ref(database, `${this.tracksPath}/${trackId}/passages/${passageKey}/questions/${questionIndex}`);
      await set(questionRef, updatedQuestion);

      // Update track timestamp
      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to update question: ${error}`);
    }
  }

  // Delete question from passage
  async deleteQuestion(trackId: string, passageNumber: 1 | 2 | 3, questionId: string): Promise<void> {
    try {
      const track = await this.getTrackById(trackId);
      const passageKey = `passage${passageNumber}` as keyof typeof track.passages;
      const passage = track.passages[passageKey];
      
      const questionIndex = passage.questions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) {
        throw new Error('Question not found');
      }

      // Remove question from array
      const updatedQuestions = passage.questions.filter((_, index) => index !== questionIndex);
      
      // Renumber remaining questions
      const renumberedQuestions = updatedQuestions.map((question, index) => ({
        ...question,
        questionNumber: index + 1
      }));

      // Update passage questions
      const questionsRef = ref(database, `${this.tracksPath}/${trackId}/passages/${passageKey}/questions`);
      await set(questionsRef, renumberedQuestions);

      // Update total questions count
      const totalQuestions = Object.values(track.passages).reduce((total, p) => {
        if (p.passageNumber === passageNumber) {
          return total + renumberedQuestions.length;
        }
        return total + p.questions.length;
      }, 0);

      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        totalQuestions,
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to delete question: ${error}`);
    }
  }

  // Toggle publish status
  async togglePublish(trackId: string, isPublished: boolean): Promise<void> {
    try {
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      await update(trackRef, {
        isPublished,
        updatedAt: Date.now()
      });
    } catch (error) {
      throw new Error(`Failed to update publish status: ${error}`);
    }
  }

  // Delete entire track
  async deleteTrack(trackId: string): Promise<void> {
    try {
      // Get track data to clean up files
      const track = await this.getTrackById(trackId);
      
      // Delete files from storage if any
      for (const passage of Object.values(track.passages)) {
        if (passage.fileUrl) {
          try {
            const fileRef = storageRef(storage, `reading/${trackId}/${passage.fileName}`);
            await deleteObject(fileRef);
          } catch (error) {
            console.warn(`Failed to delete file: ${error}`);
          }
        }
      }

      // Delete track from database
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      await remove(trackRef);
    } catch (error) {
      throw new Error(`Failed to delete track: ${error}`);
    }
  }

  // Get passage questions
  async getPassageQuestions(trackId: string, passageNumber: 1 | 2 | 3): Promise<ReadingQuestion[]> {
    try {
      const questionsRef = ref(database, `${this.tracksPath}/${trackId}/passages/passage${passageNumber}/questions`);
      const snapshot = await get(questionsRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const questions = snapshot.val();
      return Array.isArray(questions) ? questions : Object.values(questions);
    } catch (error) {
      throw new Error(`Failed to get passage questions: ${error}`);
    }
  }

  // Validate track completeness (for publishing)
  async validateTrackForPublishing(trackId: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const track = await this.getTrackById(trackId);
      const errors: string[] = [];

      // Check if track has at least one passage with content
      const filledPassages = Object.values(track.passages).filter(p => p.content || p.fileUrl);
      if (filledPassages.length === 0) {
        errors.push('At least one passage is required');
      }

      // Check if track has questions
      if (track.totalQuestions === 0) {
        errors.push('At least one question is required');
      }

      // Check each passage has proper setup
      Object.entries(track.passages).forEach(([, passage]) => {
        if (passage.content || passage.fileUrl) {
          if (!passage.title.trim()) {
            errors.push(`Passage ${passage.passageNumber}: Title is required`);
          }
          
          if (passage.questions.length > 0) {
            passage.questions.forEach((question, index) => {
              if (!question.text.trim()) {
                errors.push(`Passage ${passage.passageNumber}, Question ${index + 1}: Question text is required`);
              }
              if (!question.correctAnswer) {
                errors.push(`Passage ${passage.passageNumber}, Question ${index + 1}: Correct answer is required`);
              }
            });
          }
        }
      });

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation failed: ${error}`]
      };
    }
  }

  // Get published tracks for student interface
  async getPublishedTracks(): Promise<ReadingTrackSummary[]> {
    try {
      const allTracks = await this.getAllTracks();
      return allTracks.filter(track => track.isPublished);
    } catch (error) {
      throw new Error(`Failed to get published tracks: ${error}`);
    }
  }

  // Alias methods for compatibility
  async getTrack(trackId: string): Promise<ReadingTrack | null> {
    try {
      return await this.getTrackById(trackId);
    } catch (error) {
      if (error instanceof Error && error.message === 'Track not found') {
        return null;
      }
      throw error;
    }
  }

  // Update track method
  async updateTrack(trackId: string, trackData: Partial<ReadingTrack>): Promise<void> {
    try {
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      await update(trackRef, {
        ...trackData,
        updatedAt: Date.now()
      });
    } catch (error) {
      throw new Error(`Failed to update track: ${error}`);
    }
  }
}

export const readingService = new ReadingService();