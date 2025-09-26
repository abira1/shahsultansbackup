import { 
  ref, 
  push, 
  set, 
  get, 
  remove, 
  update, 
  onValue,
  off 
} from 'firebase/database';
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type TrackType = 'listening' | 'reading' | 'writing';
export type ExamType = 'academic' | 'general';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuestionData {
  id: string;
  type: 'multiple-choice-single' | 'multiple-choice-multiple' | 'matching' | 
        'fill-in-blank' | 'sentence-completion' | 'summary-completion' | 
        'diagram-labeling' | 'short-answer' | 'true-false-not-given';
  questionText: string;
  questionNumber: number;
  
  // Multiple choice fields
  options?: QuestionOption[];
  correctAnswer?: string | string[]; // single string for single choice, array for multiple
  
  // Other question type fields
  acceptedAnswers?: string[]; // For fill-in-blank, short-answer
  matches?: { [key: string]: string }; // For matching questions
  correctValue?: 'true' | 'false' | 'not-given'; // For T/F/NG questions
  
  // Metadata
  marks: number;
  explanation?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface SectionData {
  id: string;
  sectionNumber: number;
  title: string;
  instructions?: string;
  questions: QuestionData[];
  timeLimit?: number; // in minutes
}

export interface TrackData {
  id: string;
  title: string;
  type: TrackType;
  examType: ExamType; // academic or general
  
  // Audio for listening tracks
  audioUrl?: string;
  audioFileName?: string;
  audioDuration?: number;
  
  // Passage for reading tracks
  passageText?: string;
  passageImageUrl?: string;
  passageFileName?: string;
  
  // Writing task information
  taskType?: 'task1' | 'task2';
  taskDescription?: string;
  taskImageUrl?: string; // For charts, graphs, diagrams
  taskFileName?: string;
  sampleAnswer?: string;
  wordLimit?: number;
  
  // Sections and questions
  sections: SectionData[];
  totalQuestions: number;
  totalMarks: number;
  duration: number; // in minutes
  
  // Status and metadata
  status: 'draft' | 'published';
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExamData {
  id: string;
  title: string;
  description?: string;
  
  // Track references
  tracks: {
    listening?: string; // Track ID
    reading?: string;   // Track ID  
    writing?: string;   // Track ID
  };
  
  // Exam metadata
  duration: number; // Total duration in minutes
  totalQuestions: number;
  totalMarks: number;
  
  // Status
  status: 'draft' | 'published';
  isActive: boolean;
  
  // Admin info
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// TRACK MANAGEMENT SERVICE
// ============================================================================

class TrackManagementService {
  private readonly TRACKS_PATH = 'tracks';
  private readonly EXAMS_PATH = 'exams';
  private readonly AUDIO_PATH = 'audio';
  private readonly IMAGES_PATH = 'images';
  private readonly PASSAGES_PATH = 'passages';

  // ========================================================================
  // TRACK OPERATIONS
  // ========================================================================

  /**
   * Create a new track
   */
  async createTrack(trackData: Omit<TrackData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const tracksRef = ref(db, `${this.TRACKS_PATH}/${trackData.type}`);
      const newTrackRef = push(tracksRef);
      
      const fullTrackData: TrackData = {
        ...trackData,
        id: newTrackRef.key!,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await set(newTrackRef, fullTrackData);
      
      console.log(`✅ Track created successfully: ${fullTrackData.id}`);
      return fullTrackData.id;
    } catch (error) {
      console.error('❌ Error creating track:', error);
      throw new Error('Failed to create track');
    }
  }

  /**
   * Update an existing track
   */
  async updateTrack(trackId: string, trackType: TrackType, updates: Partial<TrackData>): Promise<void> {
    try {
      const trackRef = ref(db, `${this.TRACKS_PATH}/${trackType}/${trackId}`);
      
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };
      
      await update(trackRef, updateData);
      console.log(`✅ Track updated successfully: ${trackId}`);
    } catch (error) {
      console.error('❌ Error updating track:', error);
      throw new Error('Failed to update track');
    }
  }

  /**
   * Get a single track by ID and type
   */
  async getTrack(trackId: string, trackType: TrackType): Promise<TrackData | null> {
    try {
      const trackRef = ref(db, `${this.TRACKS_PATH}/${trackType}/${trackId}`);
      const snapshot = await get(trackRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as TrackData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error fetching track:', error);
      throw new Error('Failed to fetch track');
    }
  }

  /**
   * Get all tracks of a specific type
   */
  async getAllTracks(trackType: TrackType): Promise<Record<string, TrackData>> {
    try {
      const tracksRef = ref(db, `${this.TRACKS_PATH}/${trackType}`);
      const snapshot = await get(tracksRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as Record<string, TrackData>;
      }
      
      return {};
    } catch (error) {
      console.error(`❌ Error fetching ${trackType} tracks:`, error);
      throw new Error(`Failed to fetch ${trackType} tracks`);
    }
  }

  /**
   * Delete a track and its associated files
   */
  async deleteTrack(trackId: string, trackType: TrackType): Promise<void> {
    try {
      // Get track data first to clean up files
      const track = await this.getTrack(trackId, trackType);
      
      if (track) {
        // Delete associated files from storage
        if (track.audioUrl) {
          await this.deleteFileFromStorage(track.audioUrl);
        }
        if (track.passageImageUrl) {
          await this.deleteFileFromStorage(track.passageImageUrl);
        }
        if (track.taskImageUrl) {
          await this.deleteFileFromStorage(track.taskImageUrl);
        }
      }
      
      // Delete track from database
      const trackRef = ref(db, `${this.TRACKS_PATH}/${trackType}/${trackId}`);
      await remove(trackRef);
      
      console.log(`✅ Track deleted successfully: ${trackId}`);
    } catch (error) {
      console.error('❌ Error deleting track:', error);
      throw new Error('Failed to delete track');
    }
  }

  /**
   * Publish a track
   */
  async publishTrack(trackId: string, trackType: TrackType): Promise<void> {
    await this.updateTrack(trackId, trackType, { 
      status: 'published',
      isActive: true 
    });
  }

  /**
   * Unpublish a track
   */
  async unpublishTrack(trackId: string, trackType: TrackType): Promise<void> {
    await this.updateTrack(trackId, trackType, { 
      status: 'draft',
      isActive: false 
    });
  }

  // ========================================================================
  // EXAM OPERATIONS
  // ========================================================================

  /**
   * Create a new exam from tracks
   */
  async createExam(examData: Omit<ExamData, 'id' | 'createdAt' | 'updatedAt' | 'totalQuestions' | 'totalMarks'>): Promise<string> {
    try {
      // Calculate total questions and marks from tracks
      let totalQuestions = 0;
      let totalMarks = 0;

      for (const [trackType, trackId] of Object.entries(examData.tracks)) {
        if (trackId) {
          const track = await this.getTrack(trackId, trackType as TrackType);
          if (track) {
            totalQuestions += track.totalQuestions;
            totalMarks += track.totalMarks;
          }
        }
      }

      const examsRef = ref(db, this.EXAMS_PATH);
      const newExamRef = push(examsRef);
      
      const fullExamData: ExamData = {
        ...examData,
        id: newExamRef.key!,
        totalQuestions,
        totalMarks,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await set(newExamRef, fullExamData);
      
      console.log(`✅ Exam created successfully: ${fullExamData.id}`);
      return fullExamData.id;
    } catch (error) {
      console.error('❌ Error creating exam:', error);
      throw new Error('Failed to create exam');
    }
  }

  /**
   * Update an existing exam
   */
  async updateExam(examId: string, updates: Partial<ExamData>): Promise<void> {
    try {
      const examRef = ref(db, `${this.EXAMS_PATH}/${examId}`);
      
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };
      
      await update(examRef, updateData);
      console.log(`✅ Exam updated successfully: ${examId}`);
    } catch (error) {
      console.error('❌ Error updating exam:', error);
      throw new Error('Failed to update exam');
    }
  }

  /**
   * Get all exams
   */
  async getAllExams(): Promise<Record<string, ExamData>> {
    try {
      const examsRef = ref(db, this.EXAMS_PATH);
      const snapshot = await get(examsRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as Record<string, ExamData>;
      }
      
      return {};
    } catch (error) {
      console.error('❌ Error fetching exams:', error);
      throw new Error('Failed to fetch exams');
    }
  }

  /**
   * Get a single exam
   */
  async getExam(examId: string): Promise<ExamData | null> {
    try {
      const examRef = ref(db, `${this.EXAMS_PATH}/${examId}`);
      const snapshot = await get(examRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as ExamData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error fetching exam:', error);
      throw new Error('Failed to fetch exam');
    }
  }

  /**
   * Delete an exam
   */
  async deleteExam(examId: string): Promise<void> {
    try {
      const examRef = ref(db, `${this.EXAMS_PATH}/${examId}`);
      await remove(examRef);
      
      console.log(`✅ Exam deleted successfully: ${examId}`);
    } catch (error) {
      console.error('❌ Error deleting exam:', error);
      throw new Error('Failed to delete exam');
    }
  }

  /**
   * Publish an exam
   */
  async publishExam(examId: string): Promise<void> {
    await this.updateExam(examId, { 
      status: 'published',
      isActive: true 
    });
  }

  /**
   * Unpublish an exam
   */
  async unpublishExam(examId: string): Promise<void> {
    await this.updateExam(examId, { 
      status: 'draft',
      isActive: false 
    });
  }

  // ========================================================================
  // FILE UPLOAD OPERATIONS
  // ========================================================================

  /**
   * Upload audio file for listening tracks
   */
  async uploadAudioFile(file: File, trackId: string): Promise<{ url: string; fileName: string; duration?: number }> {
    try {
      const fileName = `${trackId}_${Date.now()}_${file.name}`;
      const audioRef = storageRef(storage, `${this.AUDIO_PATH}/${fileName}`);
      
      console.log('📤 Uploading audio file:', fileName);
      const snapshot = await uploadBytes(audioRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // TODO: Get audio duration (requires additional library or HTML5 audio)
      const duration = undefined;
      
      console.log('✅ Audio file uploaded successfully:', downloadURL);
      return {
        url: downloadURL,
        fileName: fileName,
        duration: duration
      };
    } catch (error) {
      console.error('❌ Error uploading audio file:', error);
      throw new Error('Failed to upload audio file');
    }
  }

  /**
   * Upload image file for reading passages or writing tasks
   */
  async uploadImageFile(file: File, trackId: string, type: 'passage' | 'task'): Promise<{ url: string; fileName: string }> {
    try {
      const fileName = `${trackId}_${type}_${Date.now()}_${file.name}`;
      const folderPath = type === 'passage' ? this.PASSAGES_PATH : this.IMAGES_PATH;
      const imageRef = storageRef(storage, `${folderPath}/${fileName}`);
      
      console.log('📤 Uploading image file:', fileName);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Image file uploaded successfully:', downloadURL);
      return {
        url: downloadURL,
        fileName: fileName
      };
    } catch (error) {
      console.error('❌ Error uploading image file:', error);
      throw new Error('Failed to upload image file');
    }
  }

  /**
   * Delete file from storage
   */
  private async deleteFileFromStorage(fileUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const fileRef = storageRef(storage, filePath);
        await deleteObject(fileRef);
        console.log('🗑️ File deleted from storage:', filePath);
      }
    } catch (error) {
      console.error('❌ Error deleting file from storage:', error);
      // Don't throw here - file might already be deleted
    }
  }

  // ========================================================================
  // REAL-TIME LISTENERS
  // ========================================================================

  /**
   * Listen to track changes
   */
  onTracksChange(trackType: TrackType, callback: (tracks: Record<string, TrackData>) => void): () => void {
    const tracksRef = ref(db, `${this.TRACKS_PATH}/${trackType}`);
    
    const unsubscribe = onValue(tracksRef, (snapshot) => {
      const tracks = snapshot.exists() ? snapshot.val() : {};
      callback(tracks);
    });

    return () => off(tracksRef, 'value', unsubscribe);
  }

  /**
   * Listen to exam changes
   */
  onExamsChange(callback: (exams: Record<string, ExamData>) => void): () => void {
    const examsRef = ref(db, this.EXAMS_PATH);
    
    const unsubscribe = onValue(examsRef, (snapshot) => {
      const exams = snapshot.exists() ? snapshot.val() : {};
      callback(exams);
    });

    return () => off(examsRef, 'value', unsubscribe);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Generate question ID
   */
  generateQuestionId(): string {
    return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate section ID
   */
  generateSectionId(): string {
    return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate track data before saving
   */
  validateTrackData(track: Partial<TrackData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!track.title?.trim()) {
      errors.push('Track title is required');
    }

    if (!track.type) {
      errors.push('Track type is required');
    }

    if (!track.examType) {
      errors.push('Exam type (academic/general) is required');
    }

    if (!track.sections || track.sections.length === 0) {
      errors.push('At least one section is required');
    }

    // Type-specific validations
    if (track.type === 'listening' && !track.audioUrl) {
      errors.push('Audio file is required for listening tracks');
    }

    if (track.type === 'reading' && !track.passageText && !track.passageImageUrl) {
      errors.push('Passage text or image is required for reading tracks');
    }

    if (track.type === 'writing' && !track.taskDescription) {
      errors.push('Task description is required for writing tracks');
    }

    // Section validations
    track.sections?.forEach((section, index) => {
      if (!section.questions || section.questions.length === 0) {
        errors.push(`Section ${index + 1} must have at least one question`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate track statistics
   */
  calculateTrackStats(track: TrackData): { totalQuestions: number; totalMarks: number } {
    let totalQuestions = 0;
    let totalMarks = 0;

    track.sections.forEach(section => {
      totalQuestions += section.questions.length;
      section.questions.forEach(question => {
        totalMarks += question.marks;
      });
    });

    return { totalQuestions, totalMarks };
  }
}

// Export singleton instance
export const trackManagementService = new TrackManagementService();
export default trackManagementService;
