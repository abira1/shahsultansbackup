import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  BookOpenIcon, 
  PlusIcon,
  FileTextIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  ArrowLeftIcon,
  XCircleIcon,
  LinkIcon
} from 'lucide-react';
import { readingService } from '../../../services/readingService';
import { ReadingTrack, ReadingPassage } from '../../../types/reading';

const PassageManagement: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  
  const [track, setTrack] = useState<ReadingTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPassage, setEditingPassage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  
  // Form states for editing passages
  const [passageForm, setPassageForm] = useState({
    title: '',
    content: '',
    contentType: 'text' as 'text' | 'html',
    contentUrl: ''
  });

  useEffect(() => {
    if (trackId) {
      loadTrack();
    }
  }, [trackId]);

  const loadTrack = async () => {
    if (!trackId) return;
    
    try {
      setLoading(true);
      const trackData = await readingService.getTrack(trackId);
      if (trackData) {
        setTrack(trackData);
      }
    } catch (error) {
      console.error('Error loading track:', error);
      alert('Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassage = () => {
    if (!track) return;
    
    if (track.passages.length >= 3) {
      alert('Maximum 3 passages allowed per reading track');
      return;
    }

    const newPassage: ReadingPassage = {
      id: `passage_${Date.now()}`,
      title: `Passage ${track.passages.length + 1}`,
      content: '',
      contentType: 'text',
      contentUrl: '',
      questions: []
    };

    setTrack({
      ...track,
      passages: [...track.passages, newPassage]
    });

    setEditingPassage(newPassage.id);
    setPassageForm({
      title: newPassage.title,
      content: newPassage.content,
      contentType: newPassage.contentType,
      contentUrl: newPassage.contentUrl || ''
    });
  };

  const handleEditPassage = (passage: ReadingPassage) => {
    setEditingPassage(passage.id);
    setPassageForm({
      title: passage.title,
      content: passage.content,
      contentType: passage.contentType,
      contentUrl: passage.contentUrl || ''
    });
  };

  const handleSavePassage = async () => {
    if (!track || !editingPassage || !trackId) return;

    try {
      const updatedPassages = track.passages.map(passage =>
        passage.id === editingPassage
          ? {
              ...passage,
              title: passageForm.title,
              content: passageForm.content,
              contentType: passageForm.contentType,
              contentUrl: passageForm.contentUrl
            }
          : passage
      );

      const updatedTrack = { ...track, passages: updatedPassages };
      
      await readingService.updateTrack(trackId, updatedTrack);
      setTrack(updatedTrack);
      setEditingPassage(null);
      setPassageForm({ title: '', content: '', contentType: 'text', contentUrl: '' });
      
      alert('Passage saved successfully!');
    } catch (error) {
      console.error('Error saving passage:', error);
      alert('Failed to save passage');
    }
  };

  const handleDeletePassage = async (passageId: string) => {
    if (!track || !trackId) return;
    
    const passage = track.passages.find(p => p.id === passageId);
    if (!passage) return;

    if (!window.confirm(`Are you sure you want to delete "${passage.title}"? This will also delete all questions in this passage.`)) {
      return;
    }

    try {
      const updatedPassages = track.passages.filter(p => p.id !== passageId);
      const updatedTrack = { ...track, passages: updatedPassages };
      
      await readingService.updateTrack(trackId, updatedTrack);
      setTrack(updatedTrack);
      
      if (editingPassage === passageId) {
        setEditingPassage(null);
      }
      
      alert('Passage deleted successfully!');
    } catch (error) {
      console.error('Error deleting passage:', error);
      alert('Failed to delete passage');
    }
  };

  const handleFileUpload = async (passageId: string, file: File) => {
    if (!trackId) return;
    
    try {
      setUploading(passageId);
      const uploadResult = await readingService.uploadFile(
        file, 
        trackId, 
        `passage_${passageId}_${file.name}`
      );
      
      if (track) {
        const updatedPassages = track.passages.map(passage =>
          passage.id === passageId
            ? {
                ...passage,
                contentUrl: uploadResult.url,
                contentType: file.type.includes('html') ? 'html' as const : 'text' as const
              }
            : passage
        );

        const updatedTrack = { ...track, passages: updatedPassages };
        await readingService.updateTrack(trackId, updatedTrack);
        setTrack(updatedTrack);
      }
      
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPassage(null);
    setPassageForm({ title: '', content: '', contentType: 'text', contentUrl: '' });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!track) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <XCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track not found</h3>
            <p className="text-gray-600 mb-4">The requested reading track could not be found.</p>
            <button
              onClick={() => navigate('/admin/reading/tracks')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Tracks
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/reading/tracks')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Passages</h1>
              <p className="text-gray-600">{track.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/admin/reading/tracks/${trackId}/questions`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <FileTextIcon className="h-4 w-4" />
              Manage Questions
            </button>
            
            <button
              onClick={handleCreatePassage}
              disabled={track.passages.length >= 3}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                track.passages.length >= 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <PlusIcon className="h-4 w-4" />
              Add Passage
            </button>
          </div>
        </div>

        {/* Track Info */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpenIcon className="h-4 w-4" />
              <span>{track.passages.length}/3 Passages</span>
            </div>
            <div className="flex items-center gap-1">
              <FileTextIcon className="h-4 w-4" />
              <span>{track.passages.reduce((total, p) => total + p.questions.length, 0)} Questions</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${
              track.testType === 'academic'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {track.testType}
            </div>
          </div>
        </div>

        {/* Passages */}
        <div className="space-y-6">
          {track.passages.map((passage) => (
            <div key={passage.id} className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {passage.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {passage.questions.length} questions
                    </span>
                    <button
                      onClick={() => handleEditPassage(passage)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePassage(passage.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {editingPassage === passage.id ? (
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passage Title *
                      </label>
                      <input
                        type="text"
                        value={passageForm.title}
                        onChange={(e) => setPassageForm({...passageForm, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter passage title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content Type
                      </label>
                      <select
                        value={passageForm.contentType}
                        onChange={(e) => setPassageForm({...passageForm, contentType: e.target.value as 'text' | 'html'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="text">Plain Text</option>
                        <option value="html">HTML Content</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passage Content *
                      </label>
                      <textarea
                        value={passageForm.content}
                        onChange={(e) => setPassageForm({...passageForm, content: e.target.value})}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter the reading passage content..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or Upload Content File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".txt,.html,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(passage.id, file);
                            }
                          }}
                          className="hidden"
                          id={`file-upload-${passage.id}`}
                          disabled={uploading === passage.id}
                        />
                        <label
                          htmlFor={`file-upload-${passage.id}`}
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {uploading === passage.id ? 'Uploading...' : 'Click to upload or drag and drop'}
                          </span>
                          <span className="text-xs text-gray-500">
                            TXT, HTML, PDF files up to 10MB
                          </span>
                        </label>
                      </div>
                      
                      {passageForm.contentUrl && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                          <LinkIcon className="h-4 w-4" />
                          <span>File uploaded successfully</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={handleSavePassage}
                        disabled={!passageForm.title.trim() || (!passageForm.content.trim() && !passageForm.contentUrl)}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SaveIcon className="h-4 w-4" />
                        Save Passage
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {passage.content || passage.contentUrl ? (
                    <div className="text-gray-700">
                      {passage.contentUrl ? (
                        <div className="flex items-center gap-2 text-blue-600 mb-3">
                          <LinkIcon className="h-4 w-4" />
                          <span>Content loaded from uploaded file</span>
                        </div>
                      ) : null}
                      <div className="prose max-w-none">
                        {passage.contentType === 'html' ? (
                          <div dangerouslySetInnerHTML={{ __html: passage.content }} />
                        ) : (
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                            {passage.content.substring(0, 500)}
                            {passage.content.length > 500 && '...'}
                          </pre>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No content added yet</p>
                      <button
                        onClick={() => handleEditPassage(passage)}
                        className="mt-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        Add content
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {track.passages.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No passages created yet</h3>
              <p className="text-gray-600 mb-4">
                Create up to 3 reading passages for this track
              </p>
              <button
                onClick={handleCreatePassage}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Create First Passage
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PassageManagement;