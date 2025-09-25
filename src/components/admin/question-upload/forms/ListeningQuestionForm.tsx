import React, { useEffect, useState, useRef } from 'react';
import { PlusIcon, MinusIcon, PlayIcon, PauseIcon, CheckIcon, Headphones, Clock } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import PreviewPanel from '../PreviewPanel';
import MediaUpload from '../MediaUpload';
interface ListeningQuestionFormProps {
  questionType: string;
  section: number;
  onChange: (data: any) => void;
  formData: any;
  isPreviewMode: boolean;
}
const ListeningQuestionForm: React.FC<ListeningQuestionFormProps> = ({
  questionType,
  section,
  onChange,
  formData,
  isPreviewMode
}) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [wordLimit, setWordLimit] = useState<number | undefined>(undefined);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Create URL for audio preview
  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);
  // Handle audio metadata loaded
  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Set default end time to the duration of the audio
      if (endTime === 0) {
        setEndTime(audioRef.current.duration);
      }
    }
  };
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange({
      options: newOptions
    });
  };
  // Handle add option
  const handleAddOption = () => {
    setOptions([...options, '']);
  };
  // Handle remove option
  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    // Update correct answers if needed
    const newCorrectAnswers = correctAnswers.filter(answerIndex => answerIndex !== index).map(answerIndex => answerIndex > index ? answerIndex - 1 : answerIndex);
    setCorrectAnswers(newCorrectAnswers);
    onChange({
      options: newOptions,
      correctAnswers: newCorrectAnswers
    });
  };
  // Handle correct answer selection
  const handleCorrectAnswerChange = (index: number) => {
    let newCorrectAnswers = [...correctAnswers];
    // For single choice questions, only one answer can be correct
    if (questionType === 'multiple-choice-single') {
      newCorrectAnswers = [index];
    } else {
      // For multiple choice questions, toggle the selection
      const existingIndex = newCorrectAnswers.indexOf(index);
      if (existingIndex > -1) {
        newCorrectAnswers.splice(existingIndex, 1);
      } else {
        newCorrectAnswers.push(index);
      }
    }
    setCorrectAnswers(newCorrectAnswers);
    onChange({
      correctAnswers: newCorrectAnswers
    });
  };
  // Handle audio file upload
  const handleAudioUpload = (file: File) => {
    setAudioFile(file);
    onChange({
      audioFile: file
    });
  };
  // Toggle audio playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        // Set current time to start time when playing
        audioRef.current.currentTime = startTime;
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };
  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      // Stop playback if we reach the end time
      if (audioRef.current.currentTime >= endTime) {
        audioRef.current.pause();
        setAudioPlaying(false);
      }
    }
  };
  // Handle start time change
  const handleStartTimeChange = (value: string) => {
    const timeInSeconds = parseTimeToSeconds(value);
    setStartTime(timeInSeconds);
    onChange({
      startTime: timeInSeconds
    });
  };
  // Handle end time change
  const handleEndTimeChange = (value: string) => {
    const timeInSeconds = parseTimeToSeconds(value);
    setEndTime(timeInSeconds);
    onChange({
      endTime: timeInSeconds
    });
  };
  // Parse time string (MM:SS) to seconds
  const parseTimeToSeconds = (timeString: string) => {
    const [minutes, seconds] = timeString.split(':').map(part => parseInt(part) || 0);
    return minutes * 60 + seconds;
  };
  // Get section description
  const getSectionDescription = () => {
    switch (section) {
      case 1:
        return 'Social conversation between two speakers';
      case 2:
        return 'Monologue on a general topic';
      case 3:
        return 'Academic conversation (3-4 speakers)';
      case 4:
        return 'Academic lecture';
      default:
        return '';
    }
  };
  // Get question type title
  const getQuestionTypeTitle = () => {
    switch (questionType) {
      case 'multiple-choice-single':
        return 'Multiple Choice (Single Answer)';
      case 'multiple-choice-multiple':
        return 'Multiple Choice (Multiple Answers)';
      case 'matching':
        return 'Matching';
      case 'form-completion':
        return 'Form Completion';
      case 'note-completion':
        return 'Note Completion';
      case 'table-completion':
        return 'Table Completion';
      case 'sentence-completion':
        return 'Sentence Completion';
      case 'short-answer':
        return 'Short Answer Questions';
      case 'diagram-labelling':
        return 'Diagram Labelling';
      case 'flowchart-completion':
        return 'Flowchart Completion';
      default:
        return 'Question';
    }
  };
  // Render form based on question type
  const renderQuestionForm = () => {
    switch (questionType) {
      case 'multiple-choice-single':
      case 'multiple-choice-multiple':
        return <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Question Text
              </label>
              <RichTextEditor value={questionText} onChange={value => {
              setQuestionText(value);
              onChange({
                questionText: value
              });
            }} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {questionType === 'multiple-choice-single' ? <div className={`h-5 w-5 rounded-full border ${correctAnswers.includes(index) ? 'bg-primary border-primary' : 'border-gray-300'} cursor-pointer flex items-center justify-center`} onClick={() => handleCorrectAnswerChange(index)}>
                          {correctAnswers.includes(index) && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div> : <div className={`h-5 w-5 rounded border ${correctAnswers.includes(index) ? 'bg-primary border-primary' : 'border-gray-300'} cursor-pointer flex items-center justify-center`} onClick={() => handleCorrectAnswerChange(index)}>
                          {correctAnswers.includes(index) && <CheckIcon className="h-3 w-3 text-white" />}
                        </div>}
                    </div>
                    <input type="text" value={option} onChange={e => handleOptionChange(index, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + index)}`} className="flex-grow form-input" />
                    {options.length > 2 && <button type="button" onClick={() => handleRemoveOption(index)} className="ml-2 p-1 text-text-tertiary hover:text-error rounded-full hover:bg-error/10 transition-colors">
                        <MinusIcon className="h-4 w-4" />
                      </button>}
                  </div>)}
              </div>
              <button type="button" onClick={handleAddOption} className="mt-2 flex items-center text-sm text-primary hover:text-primary-light">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Option
              </button>
            </div>
          </div>;
      case 'matching':
        return <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Instructions
              </label>
              <RichTextEditor value={instructions} onChange={value => {
              setInstructions(value);
              onChange({
                instructions: value
              });
            }} />
            </div>
            {/* This would be expanded with actual matching items UI */}
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-text-secondary italic">
                The matching question interface would include two columns with
                draggable items to create matches, along with correct answer
                mapping.
              </p>
            </div>
          </div>;
      case 'form-completion':
      case 'note-completion':
      case 'table-completion':
      case 'flowchart-completion':
        return <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Instructions
              </label>
              <RichTextEditor value={instructions} onChange={value => {
              setInstructions(value);
              onChange({
                instructions: value
              });
            }} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Content with Blanks
              </label>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-text-secondary italic">
                  This would include a specialized editor for creating forms,
                  notes, tables or flowcharts with blank fields and their
                  correct answers. You would be able to mark where blanks should
                  appear and specify the correct answers for each blank.
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Word Limit for Answers (Optional)
              </label>
              <input type="number" min="1" value={wordLimit || ''} onChange={e => {
              const limit = e.target.value ? parseInt(e.target.value) : undefined;
              setWordLimit(limit);
              onChange({
                wordLimit: limit
              });
            }} placeholder="Maximum number of words" className="form-input w-full max-w-xs" />
            </div>
          </div>;
      case 'sentence-completion':
      case 'short-answer':
        return <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Instructions
              </label>
              <RichTextEditor value={instructions} onChange={value => {
              setInstructions(value);
              onChange({
                instructions: value
              });
            }} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {questionType === 'sentence-completion' ? 'Sentences with Blanks' : 'Questions'}
              </label>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-text-secondary italic">
                  {questionType === 'sentence-completion' ? 'This would include an editor for creating sentences with blanks and their correct answers.' : 'This would include an editor for creating short answer questions and their correct answers.'}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Word Limit for Answers (Optional)
              </label>
              <input type="number" min="1" value={wordLimit || ''} onChange={e => {
              const limit = e.target.value ? parseInt(e.target.value) : undefined;
              setWordLimit(limit);
              onChange({
                wordLimit: limit
              });
            }} placeholder="Maximum number of words" className="form-input w-full max-w-xs" />
            </div>
          </div>;
      case 'diagram-labelling':
        return <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Instructions
              </label>
              <RichTextEditor value={instructions} onChange={value => {
              setInstructions(value);
              onChange({
                instructions: value
              });
            }} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Diagram Image
              </label>
              <MediaUpload type="image" onFileSelect={file => onChange({
              diagramImage: file
            })} />
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-text-secondary italic">
                This would include an interactive diagram editor where you can
                add labels and mark their correct positions on the uploaded
                image.
              </p>
            </div>
          </div>;
      default:
        return <div className="p-4 bg-secondary rounded-lg">
            <p className="text-text-secondary">
              Form for {questionType} would be implemented here.
            </p>
          </div>;
    }
  };
  return <div className="flex flex-col md:flex-row">
      {/* Left panel - Form */}
      <div className={`${isPreviewMode ? 'hidden md:block md:w-1/3' : 'w-full md:w-2/3'} p-6 border-r border-gray-200`}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              {getQuestionTypeTitle()}
            </h2>
            <span className="text-xs bg-info/10 text-info py-1 px-2 rounded-full">
              Section {section}
            </span>
          </div>
          <div className="bg-info/5 border border-info/20 rounded-lg p-4 mb-6">
            <div className="flex items-start mb-3">
              <Headphones className="h-5 w-5 text-info mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-primary">
                  Listening Section {section}
                </h3>
                <p className="text-xs text-text-secondary">
                  {getSectionDescription()}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Complete Audio File (30-35 minutes)
                  </label>
                  {audioFile ? <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button onClick={toggleAudio} className="p-2 rounded-full bg-info/10 text-info mr-3">
                          {audioPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                        </button>
                        <span className="text-sm truncate max-w-[150px] md:max-w-xs">
                          {audioFile.name}
                        </span>
                      </div>
                      <button onClick={() => setAudioFile(null)} className="text-text-tertiary hover:text-error text-xs">
                        Remove
                      </button>
                    </div> : <MediaUpload type="audio" onFileSelect={handleAudioUpload} accept="audio/mpeg,audio/wav" />}
                  {audioUrl && <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleMetadataLoaded} className="hidden" />}
                </div>
              </div>
              {audioFile && <div className="bg-white p-3 rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-info" />
                    <span className="text-xs font-medium">
                      Question Timing in Audio
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">
                        Start Time (MM:SS)
                      </label>
                      <input type="text" value={formatTime(startTime)} onChange={e => handleStartTimeChange(e.target.value)} placeholder="00:00" pattern="[0-9]{2}:[0-9]{2}" className="form-input text-sm w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">
                        End Time (MM:SS)
                      </label>
                      <input type="text" value={formatTime(endTime)} onChange={e => handleEndTimeChange(e.target.value)} placeholder="00:00" pattern="[0-9]{2}:[0-9]{2}" className="form-input text-sm w-full" />
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full mb-1">
                    <div className="absolute h-full bg-gray-300 rounded-full" style={{
                  left: `${startTime / duration * 100}%`,
                  width: `${(endTime - startTime) / duration * 100}%`
                }}></div>
                    <div className="absolute h-full bg-info rounded-full" style={{
                  left: 0,
                  width: `${currentTime / duration * 100}%`
                }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-text-tertiary">
                    <span>00:00</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-2">
                    Set the timing for when this question should be answered
                    during the audio playback.
                  </p>
                </div>}
              <p className="text-xs text-text-tertiary mt-2">
                In the IELTS Listening test, a single continuous audio recording
                (30-35 minutes) contains all 4 sections and plays without
                stopping.
              </p>
            </div>
          </div>
          {/* Question-specific form */}
          {renderQuestionForm()}
        </div>
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Question Number
              </label>
              <input type="number" min="1" className="form-input" placeholder="e.g., 1" onChange={e => onChange({
              questionNumber: e.target.value
            })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Marks
              </label>
              <input type="number" min="1" className="form-input" placeholder="e.g., 1" onChange={e => onChange({
              marks: e.target.value
            })} />
            </div>
          </div>
        </div>
      </div>
      {/* Right panel - Preview */}
      <div className={`${isPreviewMode ? 'w-full md:w-2/3' : 'hidden md:block md:w-1/3'} bg-secondary p-6`}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-primary mb-2">Preview</h2>
          <p className="text-sm text-text-secondary">
            This is how the question will appear to students.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-240px)] overflow-y-auto">
          <PreviewPanel module="listening" questionType={questionType} data={{
          questionText,
          instructions,
          options,
          correctAnswers,
          wordLimit,
          section,
          audioTiming: {
            startTime,
            endTime,
            formatTime
          }
        }} />
        </div>
      </div>
    </div>;
};
export default ListeningQuestionForm;