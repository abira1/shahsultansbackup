import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  ArrowLeftIcon, 
  SaveIcon,
  UploadIcon,
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  FileAudioIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { listeningService } from '../../../services/listeningService';
import { ListeningTrackFormData } from '../../../types/listening';

const CreateListeningTrack: React.FC = () => {
  const navigate = useNavigate();
  const audioFileRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  
  const [formData, setFormData] = useState<ListeningTrackFormData>({
    title: '',
    description: '',
    difficulty: 'medium',
    tags: []
  });
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Track title is required';
    }

    if (!audioFile && !audioUrl) {
      newErrors.audio = 'Audio file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ListeningTrackFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAudioUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const result = await listeningService.uploadAudio(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setAudioUrl(result.url);
      setAudioFile(file);
      
      // If we have a current track, update it with audio
      if (currentTrackId) {
        await listeningService.updateTrackAudio(currentTrackId, result);
      }
      
      alert('Audio uploaded successfully!');
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert(`Failed to upload audio: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let trackId = currentTrackId;
      
      // Create track if it doesn't exist
      if (!trackId) {
        trackId = await listeningService.createTrack(formData);
        setCurrentTrackId(trackId);
        
        // Upload audio if provided
        if (audioFile) {
          const audioResult = await listeningService.uploadAudio(audioFile);
          await listeningService.updateTrackAudio(trackId, audioResult);
        }
      }
      
      alert('Listening track created successfully!');
      navigate(`/admin/listening/tracks/${trackId}/sections`);
    } catch (error) {
      console.error('Error creating track:', error);
      alert(`Failed to create track: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Audio player functions
  const togglePlayPause = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setCurrentTime(audioPlayerRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioPlayerRef.current) {
      setDuration(audioPlayerRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags?.includes(newTag)) {
        handleInputChange('tags', [...(formData.tags || []), newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/listening/tracks')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Listening Track</h1>
              <p className="text-gray-600">Upload audio and create IELTS listening test</p>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || isUploading}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <SaveIcon className="h-4 w-4" />
            )}
            Create Track
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Track Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Cambridge IELTS 18 Test 1"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of the listening test..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    onKeyPress={handleTagInput}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Press Enter to add tags"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map((tag, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Upload */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Audio File</h2>
              
              <div className="space-y-4">
                <div>
                  <input
                    ref={audioFileRef}
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleAudioUpload(file);
                      }
                    }}
                    className="hidden"
                  />
                  
                  {!audioUrl ? (
                    <button
                      type="button"
                      onClick={() => audioFileRef.current?.click()}
                      disabled={isUploading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
                    >
                      <UploadIcon className="h-8 w-8 text-gray-400" />
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-900">
                          {isUploading ? 'Uploading...' : 'Upload Audio File'}
                        </p>
                        <p className="text-gray-600">MP3, WAV, or other audio formats (max 100MB)</p>
                      </div>
                    </button>
                  ) : (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <FileAudioIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-gray-900">Audio uploaded successfully</span>
                          </div>
                          <p className="text-sm text-gray-600">{audioFile?.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => audioFileRef.current?.click()}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Change File
                        </button>
                      </div>

                      {/* Audio Player */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <audio
                          ref={audioPlayerRef}
                          src={audioUrl}
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          onEnded={() => setIsPlaying(false)}
                        />
                        
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={togglePlayPause}
                            className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                          >
                            {isPlaying ? (
                              <PauseIcon className="h-5 w-5" />
                            ) : (
                              <PlayIcon className="h-5 w-5" />
                            )}
                          </button>
                          
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                            <input
                              type="range"
                              min="0"
                              max={duration || 0}
                              value={currentTime}
                              onChange={handleSeek}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-600">{formatTime(duration)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <VolumeIcon className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {errors.audio && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.audio}
                    </p>
                  )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading audio file...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            {audioUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
                <p className="text-blue-800 text-sm">
                  After creating the track, you'll be able to add questions for each section (1-4). 
                  Each section can contain various question types like multiple choice, form completion, and more.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateListeningTrack;