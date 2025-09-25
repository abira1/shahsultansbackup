import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { courseService } from '../../services/databaseService';

interface Course {
  id: string;
  title: string;
  description: string;
  fee: string;
  category: string;
  isActive: boolean;
  createdAt: number;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Fetch courses from Firebase
  const { data: coursesData } = courseService.getAll();

  useEffect(() => {
    if (coursesData) {
      const coursesArray = Object.entries(coursesData)
        .map(([id, course]: [string, any]) => ({ ...course, id }));
      setCourses(coursesArray);
      setLoading(false);
    }
  }, [coursesData]);

  const handleCreateCourse = async (courseData: any) => {
    try {
      await courseService.create({
        ...courseData,
        isActive: true
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleUpdateCourse = async (courseId: string, courseData: any) => {
    try {
      await courseService.update(courseId, courseData);
      setEditingCourse(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(courseId);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleToggleActive = async (courseId: string, isActive: boolean) => {
    try {
      await courseService.toggleActive(courseId, !isActive);
    } catch (error) {
      console.error('Error toggling course status:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Course Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.description?.substring(0, 100)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.fee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(course.id, course.isActive)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {course.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found. Create your first course!</p>
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <CourseFormModal
          course={editingCourse}
          onClose={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
          onSubmit={editingCourse ? 
            (data) => handleUpdateCourse(editingCourse.id, data) : 
            handleCreateCourse
          }
        />
      )}
    </AdminLayout>
  );
};

interface CourseFormModalProps {
  course?: Course | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ course, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    fee: course?.fee || '',
    category: course?.category || 'practice-tests',
    duration: '',
    syllabus: [],
    features: [],
    location: 'R.B Complex, 6th Floor, East-Zindabazar, Sylhet',
    contact: '01777-476142'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {course ? 'Edit Course' : 'Create New Course'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee
            </label>
            <input
              type="text"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="৳500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="practice-tests">Practice Tests</option>
              <option value="full-courses">Full Courses</option>
              <option value="specialized">Specialized</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              {course ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseManagement;