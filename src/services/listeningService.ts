import { database, storage } from '../config/firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';
import { ref as storageRef, getDownloadURL, deleteObject, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { 
  ListeningTrack, 
  ListeningQuestion, 
  ListeningTrackFormData,
  ListeningTrackSummary,
  ListeningQuestionFormData,
  CreateQuestionData
} from '../types/listening';

class ListeningService {
  private readonly tracksPath = 'listeningTracks';
  private readonly audioStoragePath = 'listening-audio';

  // Audio Upload with Progress
  async uploadAudio(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; fileName: string; size: number; duration?: number }> {
    try {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        throw new Error('Please select a valid audio file (MP3, WAV, etc.)');
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Audio file must be smaller than 100MB');
      }

      const fileName = `${Date.now()}_${file.name}`;
      const audioRef = storageRef(storage, `${this.audioStoragePath}/${fileName}`);
      
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(audioRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
          },
          (error) => {
            reject(new Error(`Upload failed: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Try to get audio duration (browser-only)
              let duration: number | undefined;
              try {
                duration = await this.getAudioDuration(file);
              } catch (e) {
                console.warn('Could not get audio duration:', e);
              }
              
              resolve({
                url: downloadURL,
                fileName: fileName,
                size: file.size,
                duration
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      throw new Error(`Failed to upload audio: ${error}`);
    }
  }

  // Get audio duration from file
  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectURL = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(objectURL);
        resolve(audio.duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectURL);
        reject(new Error('Could not load audio metadata'));
      });
      
      audio.src = objectURL;
    });
  }

  // Create new listening track
  async createTrack(trackData: ListeningTrackFormData): Promise<string> {
    try {
      const tracksRef = ref(database, this.tracksPath);
      const newTrackRef = push(tracksRef);
      const trackId = newTrackRef.key!;

      const track: Omit<ListeningTrack, 'id' | 'audioUrl' | 'audioFileName' | 'sections'> = {
        title: trackData.title,
        description: trackData.description || '',
        audioDuration: 0,
        audioSize: 0,
        totalQuestions: 0,
        createdAt: Date.now(),
        createdBy: 'admin', // TODO: Get from auth context
        isPublished: false,
        difficulty: trackData.difficulty,
        tags: trackData.tags || []
      };

      await set(newTrackRef, {
        ...track,
        id: trackId,
        audioUrl: '', // Will be set when audio is uploaded
        audioFileName: '',
        sections: {
          section1: { sectionNumber: 1, title: 'Section 1', questions: [] },
          section2: { sectionNumber: 2, title: 'Section 2', questions: [] },
          section3: { sectionNumber: 3, title: 'Section 3', questions: [] },
          section4: { sectionNumber: 4, title: 'Section 4', questions: [] }
        }
      });

      return trackId;
    } catch (error) {
      throw new Error(`Failed to create track: ${error}`);
    }
  }

  // Update track with audio
  async updateTrackAudio(trackId: string, audioData: {
    url: string;
    fileName: string;
    size: number;
    duration?: number;
  }): Promise<void> {
    try {
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      await update(trackRef, {
        audioUrl: audioData.url,
        audioFileName: audioData.fileName,
        audioSize: audioData.size,
        audioDuration: audioData.duration || 0,
        updatedAt: Date.now()
      });
    } catch (error) {
      throw new Error(`Failed to update track audio: ${error}`);
    }
  }

  // Add question to section
  async addQuestionToSection(
    trackId: string, 
    sectionNumber: 1 | 2 | 3 | 4, 
    questionData: ListeningQuestionFormData
  ): Promise<string> {
    try {
      const sectionRef = ref(database, `${this.tracksPath}/${trackId}/sections/section${sectionNumber}/questions`);
      const newQuestionRef = push(sectionRef);
      const questionId = newQuestionRef.key!;

      // Get current questions to determine question number
      const sectionSnapshot = await get(ref(database, `${this.tracksPath}/${trackId}/sections/section${sectionNumber}`));
      const currentQuestions = sectionSnapshot.val()?.questions || {};
      const questionNumber = Object.keys(currentQuestions).length + 1;

      const question: ListeningQuestion = {
        id: questionId,
        questionNumber,
        type: questionData.type,
        text: questionData.text,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        timeStamp: questionData.timeStamp,
        points: questionData.points,
        difficulty: questionData.difficulty,
        keywords: questionData.keywords
      };

      await set(newQuestionRef, question);

      // Update total questions count
      await this.updateTotalQuestions(trackId);

      return questionId;
    } catch (error) {
      throw new Error(`Failed to add question: ${error}`);
    }
  }

  // Update total questions count
  private async updateTotalQuestions(trackId: string): Promise<void> {
    try {
      const sectionsRef = ref(database, `${this.tracksPath}/${trackId}/sections`);
      const sectionsSnapshot = await get(sectionsRef);
      const sections = sectionsSnapshot.val() || {};

      let totalQuestions = 0;
      Object.values(sections).forEach((section: any) => {
        if (section.questions) {
          totalQuestions += Object.keys(section.questions).length;
        }
      });

      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      await update(trackRef, {
        totalQuestions,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Failed to update total questions:', error);
    }
  }

  // Get all tracks
  async getAllTracks(): Promise<ListeningTrack[]> {
    try {
      const tracksRef = ref(database, this.tracksPath);
      const snapshot = await get(tracksRef);
      const tracksData = snapshot.val() || {};

      return Object.values(tracksData).map((track: any) => ({
        ...track,
        sections: {
          section1: { ...track.sections?.section1, questions: Object.values(track.sections?.section1?.questions || {}) },
          section2: { ...track.sections?.section2, questions: Object.values(track.sections?.section2?.questions || {}) },
          section3: { ...track.sections?.section3, questions: Object.values(track.sections?.section3?.questions || {}) },
          section4: { ...track.sections?.section4, questions: Object.values(track.sections?.section4?.questions || {}) }
        }
      }));
    } catch (error) {
      throw new Error(`Failed to get tracks: ${error}`);
    }
  }

  // Get track summaries (for listing)
  async getTrackSummaries(): Promise<ListeningTrackSummary[]> {
    try {
      const tracksRef = ref(database, this.tracksPath);
      const snapshot = await get(tracksRef);
      const tracksData = snapshot.val() || {};

      return Object.values(tracksData).map((track: any) => ({
        id: track.id,
        title: track.title,
        totalQuestions: track.totalQuestions || 0,
        duration: track.audioDuration,
        difficulty: track.difficulty,
        createdAt: track.createdAt,
        isPublished: track.isPublished
      }));
    } catch (error) {
      throw new Error(`Failed to get track summaries: ${error}`);
    }
  }

  // Get single track
  async getTrackById(trackId: string): Promise<ListeningTrack> {
    try {
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      const snapshot = await get(trackRef);
      const trackData = snapshot.val();

      if (!trackData) {
        throw new Error('Track not found');
      }

      // Convert questions objects to arrays
      const sections = {
        section1: { 
          ...trackData.sections?.section1, 
          questions: Object.values(trackData.sections?.section1?.questions || {})
        },
        section2: { 
          ...trackData.sections?.section2, 
          questions: Object.values(trackData.sections?.section2?.questions || {})
        },
        section3: { 
          ...trackData.sections?.section3, 
          questions: Object.values(trackData.sections?.section3?.questions || {})
        },
        section4: { 
          ...trackData.sections?.section4, 
          questions: Object.values(trackData.sections?.section4?.questions || {})
        }
      };

      return {
        ...trackData,
        sections
      };
    } catch (error) {
      throw new Error(`Failed to get track: ${error}`);
    }
  }

  // Update section details
  async updateSection(
    trackId: string, 
    sectionNumber: 1 | 2 | 3 | 4, 
    sectionData: { title: string; description?: string; timeStamp?: { start: number; end: number } }
  ): Promise<void> {
    try {
      const sectionRef = ref(database, `${this.tracksPath}/${trackId}/sections/section${sectionNumber}`);
      await update(sectionRef, {
        ...sectionData,
        sectionNumber
      });
    } catch (error) {
      throw new Error(`Failed to update section: ${error}`);
    }
  }

  // Update question
  async updateQuestion(
    trackId: string,
    sectionNumber: 1 | 2 | 3 | 4,
    questionId: string,
    questionData: Partial<ListeningQuestionFormData>
  ): Promise<void> {
    try {
      const questionRef = ref(database, `${this.tracksPath}/${trackId}/sections/section${sectionNumber}/questions/${questionId}`);
      await update(questionRef, questionData);
      
      // Update track timestamp
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      await update(trackRef, { updatedAt: Date.now() });
    } catch (error) {
      throw new Error(`Failed to update question: ${error}`);
    }
  }

  // Delete question
  async deleteQuestion(trackId: string, sectionNumber: 1 | 2 | 3 | 4, questionId: string): Promise<void> {
    try {
      const questionRef = ref(database, `${this.tracksPath}/${trackId}/sections/section${sectionNumber}/questions/${questionId}`);
      await remove(questionRef);
      
      // Update total questions count
      await this.updateTotalQuestions(trackId);
    } catch (error) {
      throw new Error(`Failed to delete question: ${error}`);
    }
  }

  // Publish/unpublish track
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
      // Get track data to find audio file
      const trackData = await this.getTrackById(trackId);
      
      // Delete audio file from storage
      if (trackData.audioFileName) {
        try {
          const audioRef = storageRef(storage, `${this.audioStoragePath}/${trackData.audioFileName}`);
          await deleteObject(audioRef);
        } catch (error) {
          console.warn('Failed to delete audio file:', error);
        }
      }

      // Delete track from database
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      await remove(trackRef);
    } catch (error) {
      throw new Error(`Failed to delete track: ${error}`);
    }
  }

  // Get questions by section
  async getQuestionsBySection(trackId: string, sectionNumber: 1 | 2 | 3 | 4): Promise<ListeningQuestion[]> {
    try {
      const questionsRef = ref(database, `${this.tracksPath}/${trackId}/sections/section${sectionNumber}/questions`);
      const snapshot = await get(questionsRef);
      const questionsData = snapshot.val() || {};
      
      return Object.values(questionsData).sort((a: any, b: any) => a.questionNumber - b.questionNumber) as ListeningQuestion[];
    } catch (error) {
      throw new Error(`Failed to get section questions: ${error}`);
    }
  }

  // Validate track completeness (for publishing)
  async validateTrackForPublishing(trackId: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const track = await this.getTrackById(trackId);
      const errors: string[] = [];

      // Check if audio is uploaded
      if (!track.audioUrl) {
        errors.push('Audio file is required');
      }

      // Check if track has questions
      if (track.totalQuestions === 0) {
        errors.push('At least one question is required');
      }

      // Check each section has proper setup
      Object.entries(track.sections).forEach(([, section]) => {
        if (section.questions.length > 0) {
          section.questions.forEach((question, index) => {
            if (!question.text.trim()) {
              errors.push(`Section ${section.sectionNumber}, Question ${index + 1}: Question text is required`);
            }
            if (!question.correctAnswer) {
              errors.push(`Section ${section.sectionNumber}, Question ${index + 1}: Correct answer is required`);
            }
          });
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

  // Add question to a section (alias for compatibility)
  async addQuestion(trackId: string, sectionNumber: 1 | 2 | 3 | 4, questionData: CreateQuestionData): Promise<void> {
    await this.addQuestionToSection(trackId, sectionNumber, {
      type: questionData.type,
      text: questionData.text,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer || '',
      points: questionData.points,
      difficulty: questionData.difficulty,
      timeStamp: questionData.timeStamp,
      keywords: questionData.keywords,
      explanation: questionData.instructions
    });
  }
}

export const listeningService = new ListeningService();