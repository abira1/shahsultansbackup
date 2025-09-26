import { database, storage } from '../config/firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';
import { ref as storageRef, getDownloadURL, deleteObject, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage';
import { 
  WritingTrack, 
  WritingTrackFormData,
  WritingTrackSummary,
  WritingTask1FormData,
  WritingTask2FormData
} from '../types/writing';

export class WritingService {
  private tracksPath = 'writingTracks';

  // Upload image to Firebase Storage
  async uploadImage(file: File, trackId: string, taskType: 'task1', onProgress?: (progress: number) => void): Promise<{
    url: string;
    fileName: string;
    size: number;
  }> {
    try {
      const fileName = `${taskType}_${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, `writing/${trackId}/${fileName}`);
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
      throw new Error(`Failed to upload image: ${error}`);
    }
  }

  // Create new writing track
  async createTrack(trackData: WritingTrackFormData): Promise<string> {
    try {
      const tracksRef = ref(database, this.tracksPath);
      const newTrackRef = push(tracksRef);
      const trackId = newTrackRef.key!;

      const track: Omit<WritingTrack, 'id'> = {
        title: trackData.title,
        description: trackData.description || '',
        testType: trackData.testType,
        createdAt: Date.now(),
        createdBy: 'admin', // TODO: Get from auth context
        isPublished: false,
        tags: trackData.tags || [],
        task1: {
          instruction: '',
          taskType: 'chart',
          passage: ''
        },
        task2: {
          instruction: '',
          essayType: 'opinion',
          passage: ''
        }
      };

      await set(newTrackRef, {
        ...track,
        id: trackId
      });

      return trackId;
    } catch (error) {
      throw new Error(`Failed to create track: ${error}`);
    }
  }

  // Update Task 1
  async updateTask1(trackId: string, task1Data: WritingTask1FormData): Promise<void> {
    try {
      let imageUrl = '';
      let imageName = '';

      // Upload image if provided
      if (task1Data.imageFile) {
        const uploadResult = await this.uploadImage(
          task1Data.imageFile,
          trackId,
          'task1'
        );
        imageUrl = uploadResult.url;
        imageName = uploadResult.fileName;
      }

      const task1Ref = ref(database, `${this.tracksPath}/${trackId}/task1`);
      const task1Update = {
        instruction: task1Data.instruction,
        taskType: task1Data.taskType,
        passage: task1Data.passage || '',
        ...(imageUrl && { imageUrl, imageName })
      };

      await update(task1Ref, task1Update);

      // Update track timestamp
      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to update Task 1: ${error}`);
    }
  }

  // Update Task 2
  async updateTask2(trackId: string, task2Data: WritingTask2FormData): Promise<void> {
    try {
      const task2Ref = ref(database, `${this.tracksPath}/${trackId}/task2`);
      const task2Update = {
        instruction: task2Data.instruction,
        essayType: task2Data.essayType,
        passage: task2Data.passage || ''
      };

      await update(task2Ref, task2Update);

      // Update track timestamp
      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to update Task 2: ${error}`);
    }
  }

  // Get all writing tracks
  async getAllTracks(): Promise<WritingTrackSummary[]> {
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
        isPublished: track.isPublished || false,
        createdAt: track.createdAt,
        hasTask1Image: !!track.task1?.imageUrl,
        task1Type: track.task1?.taskType || 'chart',
        task2Type: track.task2?.essayType || 'opinion',
        tags: track.tags || []
      })).sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      throw new Error(`Failed to get tracks: ${error}`);
    }
  }

  // Get track by ID
  async getTrack(trackId: string): Promise<WritingTrack | null> {
    try {
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      const snapshot = await get(trackRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return { id: trackId, ...snapshot.val() } as WritingTrack;
    } catch (error) {
      console.error('Error getting track:', error);
      throw error;
    }
  }

  // Update track metadata
  async updateTrack(trackId: string, trackData: Partial<WritingTrack>): Promise<void> {
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
      const track = await this.getTrack(trackId);
      
      if (track) {
        // Delete Task 1 image from storage if exists
        if (track.task1.imageUrl && track.task1.imageName) {
          try {
            const fileRef = storageRef(storage, `writing/${trackId}/${track.task1.imageName}`);
            await deleteObject(fileRef);
          } catch (error) {
            console.warn(`Failed to delete image: ${error}`);
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

  // Validate track completeness
  async validateTrack(trackId: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const track = await this.getTrack(trackId);
      
      if (!track) {
        return { isValid: false, errors: ['Track not found'] };
      }

      const errors: string[] = [];

      // Validate Task 1
      if (!track.task1.instruction.trim()) {
        errors.push('Task 1 instruction is required');
      }

      // Validate Task 2
      if (!track.task2.instruction.trim()) {
        errors.push('Task 2 instruction is required');
      }

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
  async getPublishedTracks(): Promise<WritingTrackSummary[]> {
    try {
      const allTracks = await this.getAllTracks();
      return allTracks.filter(track => track.isPublished);
    } catch (error) {
      throw new Error(`Failed to get published tracks: ${error}`);
    }
  }

  // Delete Task 1 image
  async deleteTask1Image(trackId: string, imageName: string): Promise<void> {
    try {
      // Delete from storage
      const fileRef = storageRef(storage, `writing/${trackId}/${imageName}`);
      await deleteObject(fileRef);

      // Remove from database
      const task1Ref = ref(database, `${this.tracksPath}/${trackId}/task1`);
      await update(task1Ref, {
        imageUrl: null,
        imageName: null,
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to delete image: ${error}`);
    }
  }
}

export const writingService = new WritingService();