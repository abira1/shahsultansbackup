import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';
import { HeroData, Teacher, Course } from '../services/customizationService';

// Custom hook to get real-time customization data
export const useCustomization = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Shah Sultan's IELTS Academy",
    subtitle: "Your path to IELTS success"
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const heroRef = ref(database, 'customization/hero');
    const teachersRef = ref(database, 'customization/teachers');
    const coursesRef = ref(database, 'customization/courses');

    setLoading(true);
    setError(null);

    // Hero data listener
    const heroUnsubscribe = onValue(
      heroRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setHeroData(snapshot.val());
        } else {
          // Set default hero data
          setHeroData({
            title: "Shah Sultan's IELTS Academy",
            subtitle: "Your path to IELTS success"
          });
        }
      },
      (error) => {
        console.error('Error fetching hero data:', error);
        setError('Failed to load hero data');
      }
    );

    // Teachers data listener
    const teachersUnsubscribe = onValue(
      teachersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const teachersData = snapshot.val();
          const teachersArray = Object.keys(teachersData).map(key => ({
            id: key,
            ...teachersData[key]
          }));
          setTeachers(teachersArray);
        } else {
          setTeachers([]);
        }
      },
      (error) => {
        console.error('Error fetching teachers data:', error);
        setError('Failed to load teachers data');
      }
    );

    // Courses data listener
    const coursesUnsubscribe = onValue(
      coursesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const coursesData = snapshot.val();
          const coursesArray = Object.keys(coursesData)
            .map(key => ({
              id: key,
              ...coursesData[key]
            }))
            .filter(course => course.isActive); // Only show active courses
          setCourses(coursesArray);
        } else {
          setCourses([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching courses data:', error);
        setError('Failed to load courses data');
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      off(heroRef, 'value', heroUnsubscribe);
      off(teachersRef, 'value', teachersUnsubscribe);
      off(coursesRef, 'value', coursesUnsubscribe);
    };
  }, []);

  return {
    heroData,
    teachers,
    courses,
    loading,
    error
  };
};

// Hook to get only hero data (for pages that only need hero section)
export const useHeroData = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Shah Sultan's IELTS Academy",
    subtitle: "Your path to IELTS success"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const heroRef = ref(database, 'customization/hero');

    const unsubscribe = onValue(
      heroRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setHeroData(snapshot.val());
        } else {
          setHeroData({
            title: "Shah Sultan's IELTS Academy",
            subtitle: "Your path to IELTS success"
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching hero data:', error);
        setError('Failed to load hero data');
        setLoading(false);
      }
    );

    return () => {
      off(heroRef, 'value', unsubscribe);
    };
  }, []);

  return { heroData, loading, error };
};

// Hook to get only teachers data
export const useTeachersData = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const teachersRef = ref(database, 'customization/teachers');

    const unsubscribe = onValue(
      teachersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const teachersData = snapshot.val();
          const teachersArray = Object.keys(teachersData).map(key => ({
            id: key,
            ...teachersData[key]
          }));
          setTeachers(teachersArray);
        } else {
          setTeachers([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching teachers data:', error);
        setError('Failed to load teachers data');
        setLoading(false);
      }
    );

    return () => {
      off(teachersRef, 'value', unsubscribe);
    };
  }, []);

  return { teachers, loading, error };
};

// Hook to get only courses data
export const useCoursesData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const coursesRef = ref(database, 'customization/courses');

    const unsubscribe = onValue(
      coursesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const coursesData = snapshot.val();
          const coursesArray = Object.keys(coursesData)
            .map(key => ({
              id: key,
              ...coursesData[key]
            }))
            .filter(course => course.isActive); // Only show active courses
          setCourses(coursesArray);
        } else {
          setCourses([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching courses data:', error);
        setError('Failed to load courses data');
        setLoading(false);
      }
    );

    return () => {
      off(coursesRef, 'value', unsubscribe);
    };
  }, []);

  return { courses, loading, error };
};