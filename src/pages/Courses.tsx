import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { Clock, BookOpen, DollarSign, Star, Loader2 } from 'lucide-react';
import { useCoursesData } from '../hooks/useCustomization';

const Courses: React.FC = () => {
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', course: '' });
  const [showContactForm, setShowContactForm] = useState(false);

  // Get real-time courses data
  const { courses, loading, error } = useCoursesData();

  const handleEnroll = (courseTitle: string) => {
    setContactInfo({ ...contactInfo, course: courseTitle });
    setShowContactForm(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the contact info to your backend
    console.log('Contact info:', contactInfo);
    setShowContactForm(false);
    setContactInfo({ name: '', phone: '', course: '' });
    alert('Thank you for your interest! We will contact you soon.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error loading courses: {error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="container px-4 sm:px-6">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              IELTS Preparation Courses
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto">
              Choose from our comprehensive range of IELTS courses designed to help you achieve your target score
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 sm:py-20">
        <div className="container px-4 sm:px-6">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Courses Available</h3>
              <p className="text-gray-600">Our course offerings will be available soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {course.title}
                      </h3>
                      {course.level && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {course.duration && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-blue-600 text-lg font-semibold">
                        <DollarSign className="w-5 h-5 mr-1" />
                        <span>{course.price} BDT</span>
                      </div>
                    </div>
                    
                    {course.features && course.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                        <div className="space-y-1">
                          {course.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <Star className="w-3 h-3 mr-2 text-yellow-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {course.features.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{course.features.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={() => handleEnroll(course.title)}
                      className="mt-4"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Enroll in {contactInfo.course}
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    Submit
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowContactForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;