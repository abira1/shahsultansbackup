import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Loader2,
  User,
  Award,
  Calendar
} from 'lucide-react';
import { customizationService, Teacher } from '../../../services/customizationService';

interface TeachersTabProps {
  teachers: Teacher[];
  onTeachersUpdate: (teachers: Teacher[]) => void;
  onError: (error: string | null) => void;
}

interface TeacherFormData {
  name: string;
  bio: string;
  specialization: string;
  experience: string;
  qualifications: string[];
  photoUrl?: string;
}

const TeachersTab: React.FC<TeachersTabProps> = ({ teachers, onTeachersUpdate, onError }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    bio: '',
    specialization: '',
    experience: '',
    qualifications: []
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      specialization: '',
      experience: '',
      qualifications: []
    });
    setPhotoPreview(null);
    setShowAddForm(false);
    setEditingTeacher(null);
    onError(null);
  };

  // Handle input changes
  const handleInputChange = (field: keyof TeacherFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle qualifications
  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, '']
    }));
  };

  const updateQualification = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => 
        i === index ? value : qual
      )
    }));
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = async (file: File) => {
    try {
      setUploading(true);
      onError(null);

      // For new teachers, we'll use a temporary ID
      const teacherId = editingTeacher?.id || `temp-${Date.now()}`;
      const photoUrl = await customizationService.uploadTeacherPhoto(file, teacherId);
      
      setFormData(prev => ({ ...prev, photoUrl }));
      setPhotoPreview(photoUrl);
    } catch (err) {
      console.error('Error uploading photo:', err);
      onError('Failed to upload photo. Please try again.');
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

      handlePhotoUpload(file);
    }
  };

  // Start editing
  const startEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      bio: teacher.bio,
      specialization: teacher.specialization || '',
      experience: teacher.experience || '',
      qualifications: teacher.qualifications || [],
      photoUrl: teacher.photoUrl
    });
    setPhotoPreview(null);
    setShowAddForm(true);
  };

  // Save teacher
  const saveTeacher = async () => {
    try {
      setSaving(true);
      onError(null);

      if (!formData.name.trim()) {
        onError('Teacher name is required.');
        return;
      }

      if (!formData.bio.trim()) {
        onError('Teacher bio is required.');
        return;
      }

      const teacherData = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        specialization: formData.specialization.trim(),
        experience: formData.experience.trim(),
        qualifications: formData.qualifications.filter(q => q.trim()),
        photoUrl: photoPreview || formData.photoUrl
      };

      if (editingTeacher) {
        // Update existing teacher
        await customizationService.updateTeacher(editingTeacher.id, teacherData);
        const updatedTeachers = teachers.map(t => 
          t.id === editingTeacher.id 
            ? { ...t, ...teacherData, updatedAt: Date.now() }
            : t
        );
        onTeachersUpdate(updatedTeachers);
      } else {
        // Add new teacher
        const teacherId = await customizationService.addTeacher(teacherData);
        const newTeacher: Teacher = {
          id: teacherId,
          ...teacherData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        onTeachersUpdate([...teachers, newTeacher]);
      }

      resetForm();
    } catch (err) {
      console.error('Error saving teacher:', err);
      onError('Failed to save teacher. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete teacher
  const deleteTeacher = async (teacherId: string) => {
    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }

    try {
      await customizationService.deleteTeacher(teacherId);
      const updatedTeachers = teachers.filter(t => t.id !== teacherId);
      onTeachersUpdate(updatedTeachers);
    } catch (err) {
      console.error('Error deleting teacher:', err);
      onError('Failed to delete teacher. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Teachers Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your teaching staff profiles and information
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
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
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter teacher name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Enter teacher bio"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="e.g., IELTS Speaking Expert"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="e.g., 10+ years of IELTS training"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {(formData.photoUrl || photoPreview) ? (
                    <div className="text-center">
                      <img
                        src={photoPreview || formData.photoUrl}
                        alt="Teacher"
                        className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                      />
                      <div className="mt-3">
                        <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 text-sm">
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center justify-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
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

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications
                </label>
                <div className="space-y-2">
                  {formData.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={qual}
                        onChange={(e) => updateQualification(index, e.target.value)}
                        placeholder="Enter qualification"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeQualification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addQualification}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Qualification
                  </button>
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
              onClick={saveTeacher}
              disabled={saving || uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Teacher'}
            </button>
          </div>

          {uploading && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">Uploading photo...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teachers List */}
      <div className="space-y-4">
        {teachers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Teachers Added</h3>
            <p className="text-gray-600 mb-4">Start by adding your first teacher to showcase your team.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add First Teacher
            </button>
          </div>
        ) : (
          teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                    <p className="text-gray-600 mt-1">{teacher.bio}</p>
                    
                    {teacher.specialization && (
                      <div className="flex items-center mt-2 text-sm text-blue-600">
                        <Award className="w-4 h-4 mr-1" />
                        {teacher.specialization}
                      </div>
                    )}
                    
                    {teacher.experience && (
                      <div className="flex items-center mt-1 text-sm text-green-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {teacher.experience}
                      </div>
                    )}

                    {teacher.qualifications && teacher.qualifications.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {teacher.qualifications.map((qual, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {qual}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(teacher)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit Teacher"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTeacher(teacher.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete Teacher"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeachersTab;