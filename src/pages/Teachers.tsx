import React, { useState } from 'react';
import { Mail, User, Award, Calendar, Loader2, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useTeachersData } from '../hooks/useCustomization';
import { Teacher } from '../services/customizationService';

const TeachersPage: React.FC = () => {
  const { teachers, loading, error } = useTeachersData();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const openModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const closeModal = () => {
    setSelectedTeacher(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error loading teachers: {error}</p>
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
              Meet Our Expert Instructors
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto">
              Learn from experienced IELTS professionals who are committed to helping you achieve your goals
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16 sm:py-20">
        <div className="container px-4 sm:px-6">
          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Teachers Available</h3>
              <p className="text-gray-600">Our teaching staff information will be available soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => openModal(teacher)}
                >
                  <div className="aspect-w-4 aspect-h-3">
                    {teacher.photoUrl ? (
                      <img
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {teacher.name}
                    </h3>
                    
                    {teacher.specialization && (
                      <div className="flex items-center text-blue-600 mb-2">
                        <Award className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{teacher.specialization}</span>
                      </div>
                    )}
                    
                    {teacher.experience && (
                      <div className="flex items-center text-green-600 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{teacher.experience}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {teacher.bio}
                    </p>
                    
                    {teacher.qualifications && teacher.qualifications.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.qualifications.slice(0, 2).map((qual, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {qual}
                            </span>
                          ))}
                          {teacher.qualifications.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              +{teacher.qualifications.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button variant="outline" fullWidth className="group">
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedTeacher.name}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {selectedTeacher.photoUrl ? (
                  <img
                    src={selectedTeacher.photoUrl}
                    alt={selectedTeacher.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto sm:mx-0"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedTeacher.name}
                  </h4>
                  
                  {selectedTeacher.specialization && (
                    <div className="flex items-center justify-center sm:justify-start text-blue-600 mb-2">
                      <Award className="w-5 h-5 mr-2" />
                      <span className="font-medium">{selectedTeacher.specialization}</span>
                    </div>
                  )}
                  
                  {selectedTeacher.experience && (
                    <div className="flex items-center justify-center sm:justify-start text-green-600 mb-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{selectedTeacher.experience}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">About</h5>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedTeacher.bio}
                  </p>
                </div>
                
                {selectedTeacher.qualifications && selectedTeacher.qualifications.length > 0 && (
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.qualifications.map((qual, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                <Button variant="primary" fullWidth className="sm:flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Teacher
                </Button>
                <Button variant="outline" onClick={closeModal} className="sm:w-auto">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;