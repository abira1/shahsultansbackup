import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Check, Clock, Calendar, BookOpen, MapPin, Phone } from 'lucide-react';
import { courseService } from '../services/databaseService';

type CourseCategory = 'full-courses' | 'practice-tests' | 'specialized' | 'all';
type ActualCourseCategory = 'full-courses' | 'practice-tests' | 'specialized';

interface Course {
  id: string;
  title: string;
  description: string;
  duration?: string;
  schedule?: string;
  fee: string;
  syllabus: string[];
  features: string[];
  popular: boolean;
  image?: string;
  category: ActualCourseCategory;
  location?: string;
  contact?: string;
  createdAt: number;
  updatedAt?: number;
  isActive: boolean;
}

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from Firebase
  const { data: coursesData } = courseService.getAll();

  useEffect(() => {
    if (coursesData) {
      const coursesArray = Object.entries(coursesData)
        .map(([id, course]: [string, any]) => ({ ...course, id }))
        .filter((course: any) => course.isActive);
      setCourses(coursesArray);
      setLoading(false);
    } else {
      // Initialize with default courses if none exist
      initializeDefaultCourses();
    }
  }, [coursesData]);

  const initializeDefaultCourses = async () => {
    const defaultCourses: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'IELTS Mock Test',
        description: 'Experience a real exam simulation for IELTS candidates, available every Wednesday.',
        schedule: 'Every Wednesday',
        fee: '৳500',
        syllabus: ['Complete IELTS Test Simulation', 'Listening Section', 'Reading Section', 'Writing Section', 'Speaking Section'],
        features: ['Real Exam Conditions', 'Available Every Wednesday', 'Detailed Results & Feedback'],
        popular: false,
        category: 'practice-tests',
        location: 'R.B Complex, 6th Floor, East-Zindabazar, Sylhet',
        contact: '01777-476142',
        isActive: true
      },
      {
        title: 'IELTS Main Course',
        description: 'Comprehensive 3-month IELTS preparation course covering all four skills.',
        duration: '3 Months',
        fee: '৳15,000',
        syllabus: ['Listening Skills', 'Reading Comprehension', 'Writing Mastery', 'Speaking Confidence'],
        features: ['Expert Instructors', 'Small Batch Size', 'Regular Mock Tests'],
        popular: true,
        category: 'full-courses',
        location: 'R.B Complex, 6th Floor, East-Zindabazar, Sylhet',
        contact: '01777-476142',
        isActive: true
      }
    ];

    try {
      for (const course of defaultCourses) {
        await courseService.create(course);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error initializing courses:', error);
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'full-courses', name: 'Full Courses' },
    { id: 'practice-tests', name: 'Practice Tests' },
    { id: 'specialized', name: 'Specialized' }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const handleEnrollClick = (courseId: string) => {
    navigate(`/register?course=${courseId}`);
  };

  return (
    <div className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our IELTS Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of IELTS preparation courses and practice tests
            designed to help you achieve your target band score.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as CourseCategory)}
              className={`px-6 py-3 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-primary">{course.title}</h3>
                  {course.popular && (
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-4">
                  {course.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration: {course.duration}
                    </div>
                  )}
                  {course.schedule && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule: {course.schedule}
                    </div>
                  )}
                  {course.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {course.location}
                    </div>
                  )}
                  {course.contact && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {course.contact}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">What You'll Learn:</h4>
                  <ul className="space-y-1">
                    {course.syllabus.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                    {course.syllabus.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{course.syllabus.length - 3} more topics
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">{course.fee}</div>
                  <Button
                    onClick={() => handleEnrollClick(course.id)}
                    className="bg-accent hover:bg-accent-dark text-white"
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {selectedCategory === 'all' 
                ? 'No courses are currently available.' 
                : `No courses found in the ${selectedCategory.replace('-', ' ')} category.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
