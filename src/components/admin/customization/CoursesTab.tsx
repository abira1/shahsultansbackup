import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Loader2,
  DollarSign,
  Clock,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { customizationService, Course } from '../../../services/customizationService';

interface CoursesTabProps {
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
  onError: (error: string | null) => void;
}

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
  imageUrl?: string;
  isActive: boolean;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ courses, onCoursesUpdate, onError }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Beginner',
    features: [],
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      duration: '',
      level: 'Beginner',
      features: [],
      isActive: true
    });
    setImagePreview(null);
    setShowAddForm(false);
    setEditingCourse(null);
    onError(null);
  };

  // Handle input changes
  const handleInputChange = (field: keyof CourseFormData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle features
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? value : feature
      )
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      onError(null);

      // For new courses, we'll use a temporary ID
      const courseId = editingCourse?.id || `temp-${Date.now()}`;
      const imageUrl = await customizationService.uploadCourseImage(file, courseId);
      
      setFormData(prev => ({ ...prev, imageUrl }));
      setImagePreview(imageUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      onError('Failed to upload course image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onError('Please select a valid image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onError('Image size should be less than 5MB.');
        return;
      }

      handleImageUpload(file);
    }
  };

  // Start editing
  const startEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      duration: course.duration || '',
      level: course.level || 'Beginner',
      features: course.features || [],
      imageUrl: course.imageUrl,
      isActive: course.isActive
    });
    setImagePreview(null);
    setShowAddForm(true);
  };

  // Save course
  const saveCourse = async () => {
    try {
      setSaving(true);
      onError(null);

      if (!formData.title.trim()) {
        onError('Course title is required.');
        return;
      }

      if (!formData.description.trim()) {
        onError('Course description is required.');
        return;
      }

      if (formData.price <= 0) {
        onError('Course price must be greater than 0.');
        return;
      }

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price,
        duration: formData.duration.trim(),
        level: formData.level,
        features: formData.features.filter(f => f.trim()),
        imageUrl: imagePreview || formData.imageUrl,
        isActive: formData.isActive
      };

      if (editingCourse) {
        // Update existing course
        await customizationService.updateCourse(editingCourse.id, courseData);
        const updatedCourses = courses.map(c => 
          c.id === editingCourse.id 
            ? { ...c, ...courseData, updatedAt: Date.now() }
            : c
        );
        onCoursesUpdate(updatedCourses);
      } else {
        // Add new course
        const courseId = await customizationService.addCourse(courseData);
        const newCourse: Course = {
          id: courseId,
          ...courseData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        onCoursesUpdate([...courses, newCourse]);
      }

      resetForm();
    } catch (err) {
      console.error('Error saving course:', err);
      onError('Failed to save course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete course
  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await customizationService.deleteCourse(courseId);
      const updatedCourses = courses.filter(c => c.id !== courseId);
      onCoursesUpdate(updatedCourses);
    } catch (err) {
      console.error('Error deleting course:', err);
      onError('Failed to delete course. Please try again.');
    }
  };

  // Toggle course active status
  const toggleCourseStatus = async (courseId: string, isActive: boolean) => {
    try {
      await customizationService.updateCourse(courseId, { isActive });
      const updatedCourses = courses.map(c => 
        c.id === courseId ? { ...c, isActive, updatedAt: Date.now() } : c
      );
      onCoursesUpdate(updatedCourses);
    } catch (err) {
      console.error('Error updating course status:', err);
      onError('Failed to update course status.');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Courses Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your course offerings and pricing
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter course description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (BDT) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 8 weeks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Level and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center h-10">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Enter course feature"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Course Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {(formData.imageUrl || imagePreview) ? (
                    <div className="text-center">
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="Course"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="mt-3">
                        <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 text-sm">
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => {
                            setFormData(prev => ({ ...prev, imageUrl: undefined }));
                            setImagePreview(null);
                          }}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center justify-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  {(formData.imageUrl || imagePreview) && (
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Course"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {formData.title || 'Course Title'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {formData.description || 'Course description goes here...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(formData.level)}`}>
                        {formData.level}
                      </span>
                      {formData.duration && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formData.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {formData.price || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={resetForm}
              disabled={saving}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={saveCourse}
              disabled={saving || uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Course'}
            </button>
          </div>

          {uploading && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">Uploading image...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Added</h3>
            <p className="text-gray-600 mb-4">Start by adding your first course to showcase your offerings.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${!course.isActive ? 'opacity-60' : ''}`}>
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleCourseStatus(course.id, !course.isActive)}
                      className={`p-1 rounded ${course.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                      title={course.isActive ? 'Active' : 'Inactive'}
                    >
                      {course.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(course)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit Course"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level || 'Beginner')}`}>
                      {course.level || 'Beginner'}
                    </span>
                    {course.duration && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {course.price}
                  </div>
                </div>

                {course.features && course.features.length > 0 && (
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex flex-wrap gap-1">
                      {course.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {feature}
                        </span>
                      ))}
                      {course.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{course.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesTab;