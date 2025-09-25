import React, { useState } from 'react';
import { Calendar, Download, Edit2, Save, Upload, User, Mail, Phone, Building, Target, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const [profileData, setProfileData] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (234) 567-890',
    institution: 'University of Technology',
    targetScore: '7.5',
    examDate: '2023-08-15',
    address: '123 Student Street, Education City',
    bio: "I am preparing for IELTS to pursue my master's degree in Business Administration in Canada, have been studying English for 5 years, and aim to achieve a band score of 7:5."
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to a backend
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
        {isEditing ? <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button> : <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>}
      </div>
      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Profile Header */}
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100">
          <div className="relative">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
            </div>
            {isEditing && <label className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 cursor-pointer shadow-sm">
                <Upload className="h-3.5 w-3.5 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-primary">
              {profileData.name}
            </h2>
            <p className="text-sm text-text-tertiary mb-2">
              Student ID: ST12345
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Joined: March 2023
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                Target: Band {profileData.targetScore}
              </span>
            </div>
          </div>
        </div>
        {/* Profile Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">
                    Full Name
                  </label>
                  {isEditing ? <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <div className="flex items-center">
                      <User className="h-4 w-4 text-text-tertiary mr-2" />
                      <p>{profileData.name}</p>
                    </div>}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">
                    Email
                  </label>
                  {isEditing ? <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <div className="flex items-center">
                      <Mail className="h-4 w-4 text-text-tertiary mr-2" />
                      <p>{profileData.email}</p>
                    </div>}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">
                    Phone Number
                  </label>
                  {isEditing ? <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <div className="flex items-center">
                      <Phone className="h-4 w-4 text-text-tertiary mr-2" />
                      <p>{profileData.phone}</p>
                    </div>}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">
                    Institution
                  </label>
                  {isEditing ? <input type="text" name="institution" value={profileData.institution} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <div className="flex items-center">
                      <Building className="h-4 w-4 text-text-tertiary mr-2" />
                      <p>{profileData.institution}</p>
                    </div>}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">
                    Target Score
                  </label>
                  {isEditing ? <input type="text" name="targetScore" value={profileData.targetScore} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <div className="flex items-center">
                      <Target className="h-4 w-4 text-text-tertiary mr-2" />
                      <p>Band {profileData.targetScore}</p>
                    </div>}
                </div>
                <div>
                  <label className="text-xs text-text-tertiary block mb-1">
                    Exam Date
                  </label>
                  {isEditing ? <input type="date" name="examDate" value={profileData.examDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-text-tertiary mr-2" />
                      <p>
                        {new Date(profileData.examDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                      </p>
                    </div>}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-xs text-text-tertiary block mb-1">
              Address
            </label>
            {isEditing ? <input type="text" name="address" value={profileData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <div className="flex items-center">
                <MapPin className="h-4 w-4 text-text-tertiary mr-2" />
                <p>{profileData.address}</p>
              </div>}
          </div>
          <div className="mt-6">
            <label className="text-xs text-text-tertiary block mb-1">Bio</label>
            {isEditing ? <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" /> : <p className="text-text-secondary text-sm leading-relaxed">
                {profileData.bio}
              </p>}
          </div>
        </div>
        {/* Documents Section */}
        <div className="p-6 border-t border-gray-100">
          <h3 className="text-sm font-medium mb-4">Documents & Certificates</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-medium">
                  IELTS Practice Certificate
                </p>
                <p className="text-xs text-text-tertiary">May 15, 2023</p>
              </div>
              <Button variant="outline" size="xs">
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-medium">Course Completion</p>
                <p className="text-xs text-text-tertiary">April 10, 2023</p>
              </div>
              <Button variant="outline" size="xs">
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-medium">Progress Report</p>
                <p className="text-xs text-text-tertiary">June 1, 2023</p>
              </div>
              <Button variant="outline" size="xs">
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Account Security */}
      {!isEditing && <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-sm font-medium mb-1">Account Security</h2>
              <p className="text-xs text-text-tertiary">
                Update your password and security preferences
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
        </div>}
    </div>;
};
export default Profile;