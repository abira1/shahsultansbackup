import { database } from '../config/firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';
import { 
  SpeakingTrack, 
  SpeakingTrackFormData,
  SpeakingTrackSummary,
  SpeakingPart1FormData,
  SpeakingPart2FormData,
  SpeakingPart3FormData
} from '../types/speaking';

export class SpeakingService {
  private tracksPath = 'speakingTracks';

  // Create new speaking track
  async createTrack(trackData: SpeakingTrackFormData): Promise<string> {
    try {
      const tracksRef = ref(database, this.tracksPath);
      const newTrackRef = push(tracksRef);
      const trackId = newTrackRef.key!;

      const track: Omit<SpeakingTrack, 'id'> = {
        title: trackData.title,
        description: trackData.description || '',
        testType: trackData.testType,
        createdAt: Date.now(),
        createdBy: 'admin', // TODO: Get from auth context
        isPublished: false,
        tags: trackData.tags || [],
        totalDuration: 12, // Default 12 minutes
        part1: {
          introduction: '',
          topics: [],
          duration: 5
        },
        part2: {
          taskCard: '',
          preparationTime: 1,
          speakingTime: 2,
          followUpQuestions: []
        },
        part3: {
          discussion: '',
          questions: [],
          duration: 5
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

  // Update Part 1
  async updatePart1(trackId: string, part1Data: SpeakingPart1FormData): Promise<void> {
    try {
      const part1Ref = ref(database, `${this.tracksPath}/${trackId}/part1`);
      const part1Update = {
        introduction: part1Data.introduction,
        topics: part1Data.topics.map((topic, index) => ({
          id: `topic_${index}`,
          title: topic.title,
          questions: topic.questions.filter(q => q.trim()) // Remove empty questions
        })),
        duration: part1Data.duration
      };

      await update(part1Ref, part1Update);

      // Update track timestamp and total duration
      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        updatedAt: Date.now(),
        totalDuration: part1Data.duration + 3 + 5 // part1 + part2 + part3 default
      });

    } catch (error) {
      throw new Error(`Failed to update Part 1: ${error}`);
    }
  }

  // Update Part 2
  async updatePart2(trackId: string, part2Data: SpeakingPart2FormData): Promise<void> {
    try {
      const part2Ref = ref(database, `${this.tracksPath}/${trackId}/part2`);
      const part2Update = {
        taskCard: part2Data.taskCard,
        preparationTime: part2Data.preparationTime,
        speakingTime: part2Data.speakingTime,
        followUpQuestions: part2Data.followUpQuestions?.filter(q => q.trim()) || []
      };

      await update(part2Ref, part2Update);

      // Update track timestamp
      await update(ref(database, `${this.tracksPath}/${trackId}`), {
        updatedAt: Date.now()
      });

    } catch (error) {
      throw new Error(`Failed to update Part 2: ${error}`);
    }
  }

  // Update Part 3
  async updatePart3(trackId: string, part3Data: SpeakingPart3FormData): Promise<void> {
    try {
      const part3Ref = ref(database, `${this.tracksPath}/${trackId}/part3`);
      const part3Update = {
        discussion: part3Data.discussion,
        questions: part3Data.questions.filter(q => q.trim()), // Remove empty questions
        duration: part3Data.duration
      };

      await update(part3Ref, part3Update);

      // Update track timestamp and total duration
      const track = await this.getTrack(trackId);
      if (track) {
        const totalDuration = track.part1.duration + 3 + part3Data.duration; // part1 + part2 + part3
        await update(ref(database, `${this.tracksPath}/${trackId}`), {
          updatedAt: Date.now(),
          totalDuration
        });
      }

    } catch (error) {
      throw new Error(`Failed to update Part 3: ${error}`);
    }
  }

  // Get all speaking tracks
  async getAllTracks(): Promise<SpeakingTrackSummary[]> {
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
        totalDuration: track.totalDuration || 12,
        part1TopicsCount: track.part1?.topics?.length || 0,
        part2HasTask: !!track.part2?.taskCard,
        part3QuestionsCount: track.part3?.questions?.length || 0,
        tags: track.tags || []
      })).sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      throw new Error(`Failed to get tracks: ${error}`);
    }
  }

  // Get track by ID
  async getTrack(trackId: string): Promise<SpeakingTrack | null> {
    try {
      const trackRef = ref(database, `${this.tracksPath}/${trackId}`);
      const snapshot = await get(trackRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return { id: trackId, ...snapshot.val() } as SpeakingTrack;
    } catch (error) {
      console.error('Error getting track:', error);
      throw error;
    }
  }

  // Update track metadata
  async updateTrack(trackId: string, trackData: Partial<SpeakingTrack>): Promise<void> {
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

      // Validate Part 1
      if (!track.part1.introduction.trim()) {
        errors.push('Part 1 introduction is required');
      }
      if (!track.part1.topics || track.part1.topics.length === 0) {
        errors.push('Part 1 must have at least one topic');
      }
      
      // Validate Part 2
      if (!track.part2.taskCard.trim()) {
        errors.push('Part 2 task card is required');
      }

      // Validate Part 3
      if (!track.part3.discussion.trim()) {
        errors.push('Part 3 discussion topic is required');
      }
      if (!track.part3.questions || track.part3.questions.length === 0) {
        errors.push('Part 3 must have at least one question');
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
  async getPublishedTracks(): Promise<SpeakingTrackSummary[]> {
    try {
      const allTracks = await this.getAllTracks();
      return allTracks.filter(track => track.isPublished);
    } catch (error) {
      throw new Error(`Failed to get published tracks: ${error}`);
    }
  }

  // Duplicate a track (useful for creating variations)
  async duplicateTrack(sourceTrackId: string, newTitle: string): Promise<string> {
    try {
      const sourceTrack = await this.getTrack(sourceTrackId);
      if (!sourceTrack) {
        throw new Error('Source track not found');
      }

      const duplicateData: SpeakingTrackFormData = {
        title: newTitle,
        description: `Copy of ${sourceTrack.description || sourceTrack.title}`,
        testType: sourceTrack.testType,
        tags: [...(sourceTrack.tags || []), 'duplicate']
      };

      const newTrackId = await this.createTrack(duplicateData);
      
      // Copy all parts
      await this.updatePart1(newTrackId, {
        introduction: sourceTrack.part1.introduction,
        topics: sourceTrack.part1.topics.map(topic => ({
          title: topic.title,
          questions: [...topic.questions]
        })),
        duration: sourceTrack.part1.duration
      });

      await this.updatePart2(newTrackId, {
        taskCard: sourceTrack.part2.taskCard,
        preparationTime: sourceTrack.part2.preparationTime,
        speakingTime: sourceTrack.part2.speakingTime,
        followUpQuestions: [...(sourceTrack.part2.followUpQuestions || [])]
      });

      await this.updatePart3(newTrackId, {
        discussion: sourceTrack.part3.discussion,
        questions: [...sourceTrack.part3.questions],
        duration: sourceTrack.part3.duration
      });

      return newTrackId;
    } catch (error) {
      throw new Error(`Failed to duplicate track: ${error}`);
    }
  }

  // Get tracks statistics
  async getTrackStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    academic: number;
    general: number;
  }> {
    try {
      const tracks = await this.getAllTracks();
      return {
        total: tracks.length,
        published: tracks.filter(t => t.isPublished).length,
        draft: tracks.filter(t => !t.isPublished).length,
        academic: tracks.filter(t => t.testType === 'academic').length,
        general: tracks.filter(t => t.testType === 'general').length
      };
    } catch (error) {
      console.error('Error getting track stats:', error);
      return { total: 0, published: 0, draft: 0, academic: 0, general: 0 };
    }
  }
}

export const speakingService = new SpeakingService();