import { db, storage } from '../config/firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Track Types
export type ExamType = 'listening' | 'reading' | 'writing';
export type ListeningType = 'academic' | 'general';
export type ReadingType = 'academic' | 'general';
export type WritingTaskType = 'task1' | 'task2';

export interface QuestionData {
  id: string;
  type: 'multipleChoice' | 'multipleChoiceMultiple' | 'matching' | 'fillInBlank' | 
        'sentenceCompletion' | 'summaryCompletion' | 'diagramLabeling' | 'shortAnswer';
  questionText: string;
  options?: string[];
  answer: string | string[];
  points?: number;
  explanation?: string;
}

export interface SectionData {
  sectionNumber: number;
  title?: string;
  instructions?: string;
  passageText?: string; // For reading sections
  questions: QuestionData[];
}

export interface TrackData {
  id: string;
  title: string;
  examType: ExamType;
  subType?: ListeningType | ReadingType | WritingTaskType;
  audioUrl?: string; // For listening tracks
  audioFileName?: string;
  passageImageUrl?: string; // For reading/writing tracks
  sections: SectionData[];
  createdAt: number;
  updatedAt: number;
  createdBy: string; // Admin user ID
  isActive: boolean;
}

export interface ExamData {
  id: string;
  title: string;
  tracks: {
    listening?: string; // track ID
    reading?: string;   // track ID
    writing?: string;   // track ID
  };
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  duration: number; // in minutes
  isActive: boolean;
}

class TrackManagementService {
  
  // TRACK OPERATIONS
  
  async createTrack(trackData: Omit<TrackData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const tracksRef = ref(db, `tracks/${trackData.examType}`);
      const newTrackRef = push(tracksRef);
      const trackId = newTrackRef.key!;
      
      const completeTrackData: TrackData = {
        ...trackData,
        id: trackId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await set(newTrackRef, completeTrackData);
      console.log(`✅ Track created: ${trackId}`);
      return trackId;
      
    } catch (error) {
      console.error('❌ Error creating track:', error);
      throw error;
    }
  }
  
  async getTrack(examType: ExamType, trackId: string): Promise<TrackData | null> {
    try {
      const trackRef = ref(db, `tracks/${examType}/${trackId}`);
      const snapshot = await get(trackRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('❌ Error getting track:', error);
      throw error;
    }
  }
  
  async getAllTracks(examType: ExamType): Promise<Record<string, TrackData>> {
    try {
      const tracksRef = ref(db, `tracks/${examType}`);
      const snapshot = await get(tracksRef);
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('❌ Error getting tracks:', error);
      throw error;
    }
  }
  
  async updateTrack(examType: ExamType, trackId: string, updates: Partial<TrackData>): Promise<void> {
    try {
      const trackRef = ref(db, `tracks/${examType}/${trackId}`);
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };
      await update(trackRef, updateData);
      console.log(`✅ Track updated: ${trackId}`);
    } catch (error) {
      console.error('❌ Error updating track:', error);
      throw error;
    }
  }
  
  async deleteTrack(examType: ExamType, trackId: string): Promise<void> {
    try {
      // Get track data first to check for files to delete
      const track = await this.getTrack(examType, trackId);
      
      if (track) {
        // Delete associated files from storage
        if (track.audioUrl) {
          await this.deleteAudioFile(track.audioFileName || `${trackId}.mp3`);
        }
        if (track.passageImageUrl) {
          await this.deleteImageFile(`${trackId}_passage`);
        }
      }
      
      // Delete track from database
      const trackRef = ref(db, `tracks/${examType}/${trackId}`);
      await remove(trackRef);
      console.log(`✅ Track deleted: ${trackId}`);
      
    } catch (error) {
      console.error('❌ Error deleting track:', error);
      throw error;
    }
  }
  
  // AUDIO FILE OPERATIONS
  
  async uploadAudioFile(file: File, trackId: string): Promise<{ url: string; fileName: string }> {
    try {
      const fileName = `${trackId}_${Date.now()}.mp3`;
      const audioRef = storageRef(storage, `audio/${fileName}`);
      
      await uploadBytes(audioRef, file);
      const downloadURL = await getDownloadURL(audioRef);
      
      console.log(`✅ Audio uploaded: ${fileName}`);
      return { url: downloadURL, fileName };
      
    } catch (error) {
      console.error('❌ Error uploading audio:', error);
      throw error;
    }
  }
  
  async deleteAudioFile(fileName: string): Promise<void> {
    try {
      const audioRef = storageRef(storage, `audio/${fileName}`);
      await deleteObject(audioRef);
      console.log(`✅ Audio deleted: ${fileName}`);
    } catch (error) {
      console.error('❌ Error deleting audio:', error);
      // Don't throw - file might not exist
    }
  }
  
  // IMAGE FILE OPERATIONS
  
  async uploadImageFile(file: File, trackId: string, type: 'passage' | 'diagram'): Promise<string> {
    try {
      const fileName = `${trackId}_${type}_${Date.now()}.${file.name.split('.').pop()}`;
      const imageRef = storageRef(storage, `images/${fileName}`);
      
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      console.log(`✅ Image uploaded: ${fileName}`);
      return downloadURL;
      
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  }
  
  async deleteImageFile(fileName: string): Promise<void> {
    try {
      const imageRef = storageRef(storage, `images/${fileName}`);
      await deleteObject(imageRef);
      console.log(`✅ Image deleted: ${fileName}`);
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      // Don't throw - file might not exist
    }
  }
  
  // EXAM OPERATIONS
  
  async createExam(examData: Omit<ExamData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const examsRef = ref(db, 'exams');
      const newExamRef = push(examsRef);
      const examId = newExamRef.key!;
      
      const completeExamData: ExamData = {
        ...examData,
        id: examId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await set(newExamRef, completeExamData);
      console.log(`✅ Exam created: ${examId}`);
      return examId;
      
    } catch (error) {
      console.error('❌ Error creating exam:', error);
      throw error;
    }
  }
  
  async getExam(examId: string): Promise<ExamData | null> {
    try {
      const examRef = ref(db, `exams/${examId}`);
      const snapshot = await get(examRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('❌ Error getting exam:', error);
      throw error;
    }
  }
  
  async getAllExams(): Promise<Record<string, ExamData>> {
    try {
      const examsRef = ref(db, 'exams');
      const snapshot = await get(examsRef);
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('❌ Error getting exams:', error);
      throw error;
    }
  }
  
  async updateExam(examId: string, updates: Partial<ExamData>): Promise<void> {
    try {
      const examRef = ref(db, `exams/${examId}`);
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };
      await update(examRef, updateData);
      console.log(`✅ Exam updated: ${examId}`);
    } catch (error) {
      console.error('❌ Error updating exam:', error);
      throw error;
    }
  }
  
  async publishExam(examId: string): Promise<void> {
    await this.updateExam(examId, { status: 'published' });
  }
  
  async unpublishExam(examId: string): Promise<void> {
    await this.updateExam(examId, { status: 'draft' });
  }
  
  async deleteExam(examId: string): Promise<void> {
    try {
      const examRef = ref(db, `exams/${examId}`);
      await remove(examRef);
      console.log(`✅ Exam deleted: ${examId}`);
    } catch (error) {
      console.error('❌ Error deleting exam:', error);
      throw error;
    }
  }
  
  // PUBLISHED EXAMS (for student access)
  
  async getPublishedExams(): Promise<Record<string, ExamData>> {
    try {
      const exams = await this.getAllExams();
      const publishedExams: Record<string, ExamData> = {};
      
      Object.entries(exams).forEach(([id, exam]) => {
        if (exam.status === 'published' && exam.isActive) {
          publishedExams[id] = exam;
        }
      });
      
      return publishedExams;
    } catch (error) {
      console.error('❌ Error getting published exams:', error);
      throw error;
    }
  }
}

export const trackManagementService = new TrackManagementService();