import React, { useState } from 'react';
import { 
  Image, 
  Upload, 
  Save, 
  Loader2, 
  X, 
  Eye 
} from 'lucide-react';
import { customizationService, HeroData } from '../../../services/customizationService';

interface HeroTabProps {
  heroData: HeroData;
  onHeroUpdate: (heroData: HeroData) => void;
  onError: (error: string | null) => void;
}

const HeroTab: React.FC<HeroTabProps> = ({ heroData, onHeroUpdate, onError }) => {
  const [formData, setFormData] = useState<HeroData>(heroData);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

  // Handle text input changes
  const handleInputChange = (field: keyof HeroData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file: File, type: 'main' | 'background') => {
    try {
      setUploading(true);
      onError(null);

      const imageUrl = await customizationService.uploadHeroImage(file, type);
      
      if (type === 'main') {
        setFormData(prev => ({ ...prev, imageUrl }));
        setImagePreview(imageUrl);
      } else {
        setFormData(prev => ({ ...prev, backgroundImageUrl: imageUrl }));
        setBackgroundPreview(imageUrl);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      onError(`Failed to upload ${type} image. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        onError('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onError('Image size should be less than 5MB.');
        return;
      }

      handleImageUpload(file, type);
    }
  };

  // Save hero data
  const handleSave = async () => {
    try {
      setSaving(true);
      onError(null);

      if (!formData.title.trim()) {
        onError('Title is required.');
        return;
      }

      if (!formData.subtitle.trim()) {
        onError('Subtitle is required.');
        return;
      }

      await customizationService.updateHeroData(formData);
      onHeroUpdate(formData);
    } catch (err) {
      console.error('Error saving hero data:', err);
      onError('Failed to save hero data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to original data
  const handleReset = () => {
    setFormData(heroData);
    setImagePreview(null);
    setBackgroundPreview(null);
    onError(null);
  };

  // Check if form has changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(heroData);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Image className="w-5 h-5 mr-2 text-blue-600" />
          Hero Section
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Customize the main hero section that appears on your homepage
        </p>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="hero-title" className="block text-sm font-medium text-gray-700 mb-2">
            Hero Title
          </label>
          <input
            id="hero-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter hero title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Subtitle Input */}
        <div>
          <label htmlFor="hero-subtitle" className="block text-sm font-medium text-gray-700 mb-2">
            Hero Subtitle
          </label>
          <textarea
            id="hero-subtitle"
            value={formData.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            placeholder="Enter hero subtitle"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Main Hero Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {(formData.imageUrl || imagePreview) ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Hero"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imageUrl: undefined }));
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-center">
                  <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'main')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Hero Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'main')}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {(formData.backgroundImageUrl || backgroundPreview) ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={backgroundPreview || formData.backgroundImageUrl}
                    alt="Background"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, backgroundImageUrl: undefined }));
                      setBackgroundPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-center">
                  <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Background
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'background')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Image className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <label className="cursor-pointer bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Background
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'background')}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Optional background image
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </label>
          <div 
            className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg overflow-hidden"
            style={formData.backgroundImageUrl || backgroundPreview ? {
              backgroundImage: `url(${backgroundPreview || formData.backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            {(formData.backgroundImageUrl || backgroundPreview) && (
              <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
            )}
            <div className="relative z-10 text-center">
              <h1 className="text-3xl font-bold mb-4">
                {formData.title || 'Hero Title'}
              </h1>
              <p className="text-xl opacity-90">
                {formData.subtitle || 'Hero subtitle goes here'}
              </p>
              {(formData.imageUrl || imagePreview) && (
                <div className="mt-6">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Hero"
                    className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          disabled={!hasChanges || saving || uploading}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Changes
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving || uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {uploading && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-3" />
            <p className="text-sm text-blue-800">
              Uploading image...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroTab;