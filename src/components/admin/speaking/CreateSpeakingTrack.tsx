import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { speakingService } from '../../../services/speakingService';
import { 
  SpeakingTrack, 
  SpeakingTrackFormData,
  SpeakingPart1FormData,
  SpeakingPart2FormData,
  SpeakingPart3FormData
} from '../../../types/speaking';
import Button from '../../ui/Button';

export const CreateSpeakingTrack: React.FC = () => {
  const navigate = useNavigate();
  const { trackId } = useParams<{ trackId: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [track, setTrack] = useState<SpeakingTrack | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'part1' | 'part2' | 'part3'>('info');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Form States
  const [trackForm, setTrackForm] = useState<SpeakingTrackFormData>({
    title: '',
    description: '',
    testType: 'general',
    tags: []
  });

  const [part1Form, setPart1Form] = useState<SpeakingPart1FormData>({
    introduction: '',
    topics: [{ title: '', questions: ['', '', ''] }],
    duration: 5
  });

  const [part2Form, setPart2Form] = useState<SpeakingPart2FormData>({
    taskCard: '',
    preparationTime: 1,
    speakingTime: 2,
    followUpQuestions: ['']
  });

  const [part3Form, setPart3Form] = useState<SpeakingPart3FormData>({
    discussion: '',
    questions: ['', '', '', '', ''],
    duration: 5
  });

  // Load existing track if editing
  useEffect(() => {
    if (trackId) {
      loadTrack();
    }
  }, [trackId]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const trackData = await speakingService.getTrack(trackId!);
      if (trackData) {
        setTrack(trackData);
        setTrackForm({
          title: trackData.title,
          description: trackData.description,
          testType: trackData.testType,
          tags: trackData.tags || []
        });

        setPart1Form({
          introduction: trackData.part1.introduction,
          topics: trackData.part1.topics.length > 0 
            ? trackData.part1.topics.map(topic => ({
                title: topic.title,
                questions: topic.questions
              }))
            : [{ title: '', questions: ['', '', ''] }],
          duration: trackData.part1.duration
        });

        setPart2Form({
          taskCard: trackData.part2.taskCard,
          preparationTime: trackData.part2.preparationTime,
          speakingTime: trackData.part2.speakingTime,
          followUpQuestions: (trackData.part2.followUpQuestions && trackData.part2.followUpQuestions.length > 0)
            ? trackData.part2.followUpQuestions 
            : ['']
        });

        setPart3Form({
          discussion: trackData.part3.discussion,
          questions: trackData.part3.questions.length > 0 
            ? trackData.part3.questions 
            : ['', '', '', '', ''],
          duration: trackData.part3.duration
        });
      }
    } catch (error) {
      console.error('Error loading track:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrack = async () => {
    try {
      setSaving(true);
      if (!trackForm.title.trim()) {
        setValidationErrors(['Track title is required']);
        return;
      }

      const newTrackId = await speakingService.createTrack(trackForm);
      navigate(`/admin/speaking/create/${newTrackId}`);
    } catch (error) {
      console.error('Error creating track:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTrackInfo = async () => {
    if (!trackId) return;
    
    try {
      setSaving(true);
      await speakingService.updateTrack(trackId, {
        title: trackForm.title,
        description: trackForm.description,
        testType: trackForm.testType,
        tags: trackForm.tags
      });
      await loadTrack(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating track info:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePart1 = async () => {
    if (!trackId) return;
    
    try {
      setSaving(true);
      await speakingService.updatePart1(trackId, part1Form);
      await loadTrack(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving Part 1:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePart2 = async () => {
    if (!trackId) return;
    
    try {
      setSaving(true);
      await speakingService.updatePart2(trackId, part2Form);
      await loadTrack(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving Part 2:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePart3 = async () => {
    if (!trackId) return;
    
    try {
      setSaving(true);
      await speakingService.updatePart3(trackId, part3Form);
      await loadTrack(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving Part 3:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleValidateAndPublish = async () => {
    if (!trackId) return;

    try {
      setSaving(true);
      const validation = await speakingService.validateTrack(trackId);
      
      if (validation.isValid) {
        await speakingService.togglePublish(trackId, true);
        await loadTrack();
        setValidationErrors([]);
      } else {
        setValidationErrors(validation.errors);
      }
    } catch (error) {
      console.error('Error validating track:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTopic = () => {
    setPart1Form(prev => ({
      ...prev,
      topics: [...prev.topics, { title: '', questions: ['', '', ''] }]
    }));
  };

  const removeTopic = (index: number) => {
    setPart1Form(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const updateTopic = (index: number, field: string, value: string) => {
    setPart1Form(prev => ({
      ...prev,
      topics: prev.topics.map((topic, i) => 
        i === index ? { ...topic, [field]: value } : topic
      )
    }));
  };

  const updateTopicQuestion = (topicIndex: number, questionIndex: number, value: string) => {
    setPart1Form(prev => ({
      ...prev,
      topics: prev.topics.map((topic, i) => 
        i === topicIndex ? {
          ...topic,
          questions: topic.questions.map((q, qi) => qi === questionIndex ? value : q)
        } : topic
      )
    }));
  };

  const addFollowUpQuestion = () => {
    setPart2Form(prev => ({
      ...prev,
      followUpQuestions: [...(prev.followUpQuestions || []), '']
    }));
  };

  const removeFollowUpQuestion = (index: number) => {
    setPart2Form(prev => ({
      ...prev,
      followUpQuestions: prev.followUpQuestions?.filter((_, i) => i !== index) || []
    }));
  };

  const updateFollowUpQuestion = (index: number, value: string) => {
    setPart2Form(prev => ({
      ...prev,
      followUpQuestions: prev.followUpQuestions?.map((q, i) => i === index ? value : q) || []
    }));
  };

  const addPart3Question = () => {
    setPart3Form(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const removePart3Question = (index: number) => {
    setPart3Form(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updatePart3Question = (index: number, value: string) => {
    setPart3Form(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? value : q)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading track...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {trackId ? 'Edit Speaking Track' : 'Create Speaking Track'}
          </h1>
          {track && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                track.isPublished 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {track.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {track.testType.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {trackId && (
            <Button
              onClick={handleValidateAndPublish}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {track?.isPublished ? 'Update & Republish' : 'Validate & Publish'}
            </Button>
          )}
          <Button
            onClick={() => navigate('/admin/speaking')}
            variant="outline"
          >
            Back to Tracks
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">Validation Errors:</h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'info', label: 'Track Info', icon: '📝' },
            { id: 'part1', label: 'Part 1: Introduction', icon: '👋' },
            { id: 'part2', label: 'Part 2: Individual Long Turn', icon: '🎤' },
            { id: 'part3', label: 'Part 3: Discussion', icon: '💬' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Track Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Track Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    value={trackForm.title}
                    onChange={(e) => setTrackForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., General Speaking Track 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Type
                  </label>
                  <select
                    value={trackForm.testType}
                    onChange={(e) => setTrackForm(prev => ({ ...prev, testType: e.target.value as 'academic' | 'general' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="general">General Training</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={trackForm.description}
                  onChange={(e) => setTrackForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of this speaking track..."
                />
              </div>

              <div className="mt-6 flex justify-end">
                {trackId ? (
                  <Button
                    onClick={handleUpdateTrackInfo}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {saving ? 'Updating...' : 'Update Track Info'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateTrack}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {saving ? 'Creating...' : 'Create Track'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Part 1 Tab */}
        {activeTab === 'part1' && trackId && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Part 1: Introduction & Interview</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Introduction Script
                  </label>
                  <textarea
                    value={part1Form.introduction}
                    onChange={(e) => setPart1Form(prev => ({ ...prev, introduction: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Good morning/afternoon. My name is... and I am your examiner for today's speaking test. Can you tell me your full name please? Thank you. And what shall I call you? Thank you. Can you tell me where you're from? Thank you..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={part1Form.duration}
                    onChange={(e) => setPart1Form(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">Topics & Questions</h3>
                    <Button onClick={addTopic} variant="outline" size="sm">
                      Add Topic
                    </Button>
                  </div>

                  {part1Form.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Topic {topicIndex + 1}</h4>
                        {part1Form.topics.length > 1 && (
                          <button
                            onClick={() => removeTopic(topicIndex)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="mb-3">
                        <input
                          type="text"
                          value={topic.title}
                          onChange={(e) => updateTopic(topicIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Topic title (e.g., Your hometown, Your work/studies)"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Questions:</label>
                        {topic.questions.map((question, questionIndex) => (
                          <input
                            key={questionIndex}
                            type="text"
                            value={question}
                            onChange={(e) => updateTopicQuestion(topicIndex, questionIndex, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={`Question ${questionIndex + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSavePart1}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? 'Saving...' : 'Save Part 1'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Part 2 Tab */}
        {activeTab === 'part2' && trackId && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Part 2: Individual Long Turn</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Card
                  </label>
                  <textarea
                    value={part2Form.taskCard}
                    onChange={(e) => setPart2Form(prev => ({ ...prev, taskCard: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe a place you have visited that you particularly enjoyed.

You should say:
• where this place was
• what you did there
• who you went with
• and explain why you enjoyed visiting this place so much.

You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say. You can make some notes to help you if you wish."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="2"
                      value={part2Form.preparationTime}
                      onChange={(e) => setPart2Form(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speaking Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={part2Form.speakingTime}
                      onChange={(e) => setPart2Form(prev => ({ ...prev, speakingTime: parseInt(e.target.value) || 2 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Follow-up Questions (Optional)
                    </label>
                    <Button onClick={addFollowUpQuestion} variant="outline" size="sm">
                      Add Question
                    </Button>
                  </div>

                  {part2Form.followUpQuestions?.map((question, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => updateFollowUpQuestion(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Follow-up question ${index + 1}`}
                      />
                      {(part2Form.followUpQuestions?.length || 0) > 1 && (
                        <button
                          onClick={() => removeFollowUpQuestion(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSavePart2}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? 'Saving...' : 'Save Part 2'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Part 3 Tab */}
        {activeTab === 'part3' && trackId && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Part 3: Two-way Discussion</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discussion Topic/Theme
                  </label>
                  <textarea
                    value={part3Form.discussion}
                    onChange={(e) => setPart3Form(prev => ({ ...prev, discussion: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="We've been talking about a place you enjoyed visiting, and I'd like to discuss with you one or two more general questions related to this. Let's consider first of all different types of tourist attractions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="7"
                    value={part3Form.duration}
                    onChange={(e) => setPart3Form(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Discussion Questions
                    </label>
                    <Button onClick={addPart3Question} variant="outline" size="sm">
                      Add Question
                    </Button>
                  </div>

                  {part3Form.questions.map((question, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => updatePart3Question(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Discussion question ${index + 1}`}
                      />
                      {part3Form.questions.length > 1 && (
                        <button
                          onClick={() => removePart3Question(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSavePart3}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? 'Saving...' : 'Save Part 3'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};