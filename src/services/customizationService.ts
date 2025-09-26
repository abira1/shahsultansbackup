import { ref, get, set, push, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database, storage } from '../config/firebase';

// Types for customization data
export interface HeroData {
  title: string;
  subtitle: string;
  imageUrl?: string;
  backgroundImageUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  bio: string;
  photoUrl?: string;
  specialization?: string;
  experience?: string;
  qualifications?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  features?: string[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CustomizationData {
  hero: HeroData;
  teachers: Teacher[];
  courses: Course[];
  lastUpdated: number;
}

export const customizationService = {
  // ===== HERO SECTION =====
  
  // Get hero data
  getHeroData: async (): Promise<HeroData> => {
    try {
      const heroRef = ref(database, 'customization/hero');
      const snapshot = await get(heroRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        // Return default hero data
        const defaultHero: HeroData = {
          title: "Shah Sultan's IELTS Academy",
          subtitle: "Your path to IELTS success"
        };
        await set(heroRef, defaultHero);
        return defaultHero;
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      throw error;
    }
  },

  // Update hero data
  updateHeroData: async (heroData: HeroData): Promise<void> => {
    try {
      const heroRef = ref(database, 'customization/hero');
      await set(heroRef, {
        ...heroData,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating hero data:', error);
      throw error;
    }
  },

  // Upload hero image
  uploadHeroImage: async (file: File, type: 'main' | 'background' = 'main'): Promise<string> => {
    try {
      const fileName = `hero-${type}-${Date.now()}.${file.name.split('.').pop()}`;
      const imageRef = storageRef(storage, `customization/hero/${fileName}`);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading hero image:', error);
      throw error;
    }
  },

  // ===== TEACHERS SECTION =====

  // Get all teachers
  getTeachers: async (): Promise<Teacher[]> => {
    try {
      const teachersRef = ref(database, 'customization/teachers');
      const snapshot = await get(teachersRef);
      
      if (snapshot.exists()) {
        const teachersData = snapshot.val();
        return Object.keys(teachersData).map(key => ({
          id: key,
          ...teachersData[key]
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },

  // Add new teacher
  addTeacher: async (teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const teachersRef = ref(database, 'customization/teachers');
      const newTeacherRef = push(teachersRef);
      const teacherId = newTeacherRef.key!;
      
      const teacher: Teacher = {
        id: teacherId,
        ...teacherData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await set(newTeacherRef, teacher);
      return teacherId;
    } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
    }
  },

  // Update teacher
  updateTeacher: async (teacherId: string, teacherData: Partial<Omit<Teacher, 'id' | 'createdAt'>>): Promise<void> => {
    try {
      const teacherRef = ref(database, `customization/teachers/${teacherId}`);
      await update(teacherRef, {
        ...teacherData,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },

  // Delete teacher
  deleteTeacher: async (teacherId: string): Promise<void> => {
    try {
      // First get teacher data to delete photo if it exists
      const teacherRef = ref(database, `customization/teachers/${teacherId}`);
      const snapshot = await get(teacherRef);
      
      if (snapshot.exists()) {
        const teacherData = snapshot.val();
        
        // Delete photo from storage if it exists
        if (teacherData.photoUrl) {
          try {
            const photoRef = storageRef(storage, teacherData.photoUrl);
            await deleteObject(photoRef);
          } catch (storageError) {
            console.warn('Could not delete teacher photo from storage:', storageError);
          }
        }
      }
      
      // Delete teacher from database
      await remove(teacherRef);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  },

  // Upload teacher photo
  uploadTeacherPhoto: async (file: File, teacherId: string): Promise<string> => {
    try {
      const fileName = `teacher-${teacherId}-${Date.now()}.${file.name.split('.').pop()}`;
      const photoRef = storageRef(storage, `customization/teachers/${fileName}`);
      
      const snapshot = await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading teacher photo:', error);
      throw error;
    }
  },

  // ===== COURSES SECTION =====

  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    try {
      const coursesRef = ref(database, 'customization/courses');
      const snapshot = await get(coursesRef);
      
      if (snapshot.exists()) {
        const coursesData = snapshot.val();
        return Object.keys(coursesData).map(key => ({
          id: key,
          ...coursesData[key]
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Add new course
  addCourse: async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const coursesRef = ref(database, 'customization/courses');
      const newCourseRef = push(coursesRef);
      const courseId = newCourseRef.key!;
      
      const course: Course = {
        id: courseId,
        ...courseData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await set(newCourseRef, course);
      return courseId;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },

  // Update course
  updateCourse: async (courseId: string, courseData: Partial<Omit<Course, 'id' | 'createdAt'>>): Promise<void> => {
    try {
      const courseRef = ref(database, `customization/courses/${courseId}`);
      await update(courseRef, {
        ...courseData,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (courseId: string): Promise<void> => {
    try {
      // First get course data to delete image if it exists
      const courseRef = ref(database, `customization/courses/${courseId}`);
      const snapshot = await get(courseRef);
      
      if (snapshot.exists()) {
        const courseData = snapshot.val();
        
        // Delete image from storage if it exists
        if (courseData.imageUrl) {
          try {
            const imageRef = storageRef(storage, courseData.imageUrl);
            await deleteObject(imageRef);
          } catch (storageError) {
            console.warn('Could not delete course image from storage:', storageError);
          }
        }
      }
      
      // Delete course from database
      await remove(courseRef);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Upload course image
  uploadCourseImage: async (file: File, courseId: string): Promise<string> => {
    try {
      const fileName = `course-${courseId}-${Date.now()}.${file.name.split('.').pop()}`;
      const imageRef = storageRef(storage, `customization/courses/${fileName}`);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading course image:', error);
      throw error;
    }
  },

  // ===== GENERAL METHODS =====

  // Get all customization data
  getAllCustomizationData: async (): Promise<CustomizationData> => {
    try {
      const [hero, teachers, courses] = await Promise.all([
        customizationService.getHeroData(),
        customizationService.getTeachers(),
        customizationService.getCourses()
      ]);

      return {
        hero,
        teachers,
        courses,
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Error fetching all customization data:', error);
      throw error;
    }
  },

  // Initialize default data
  initializeDefaultData: async (): Promise<void> => {
    try {
      const customizationRef = ref(database, 'customization');
      const snapshot = await get(customizationRef);
      
      if (!snapshot.exists()) {
        const defaultData = {
          hero: {
            title: "Shah Sultan's IELTS Academy",
            subtitle: "Your path to IELTS success",
            updatedAt: Date.now()
          },
          teachers: {},
          courses: {},
          lastUpdated: Date.now()
        };
        
        await set(customizationRef, defaultData);
        console.log('Default customization data initialized');
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
      throw error;
    }
  },

  // Real-time listener for customization changes
  onCustomizationChange: (_callback: (data: any) => void) => {
    // This would typically use Firebase's onValue listener
    // For now, return a no-op unsubscribe function
    return () => {
      // Cleanup listener would go here
    };
  }
};