import React, { useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import PreviewPanel from '../PreviewPanel';
import MediaUpload from '../MediaUpload';
interface WritingQuestionFormProps {
  taskNumber: number;
  onChange: (data: any) => void;
  formData: any;
  isPreviewMode: boolean;
}
const WritingQuestionForm: React.FC<WritingQuestionFormProps> = ({
  taskNumber,
  onChange,
  formData,
  isPreviewMode
}) => {
  const [instructions, setInstructions] = useState('');
  const [prompt, setPrompt] = useState('');
  const [wordLimit, setWordLimit] = useState<number>(taskNumber === 1 ? 150 : 250);
  const [sampleAnswer, setSampleAnswer] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  // Handle media file upload
  const handleMediaUpload = (file: File) => {
    setMediaFile(file);
    onChange({
      mediaFile: file
    });
  };
  // Get task title
  const getTaskTitle = () => {
    if (taskNumber === 1) {
      return 'Task 1: Report';
    } else {
      return 'Task 2: Essay';
    }
  };
  // Get task description
  const getTaskDescription = () => {
    if (taskNumber === 1) {
      return 'Describe visual information (graph, table, chart, or diagram)';
    } else {
      return 'Write an essay in response to a point of view, argument or problem';
    }
  };
  return <div className="flex flex-col md:flex-row">
      {/* Left panel - Form */}
      <div className={`${isPreviewMode ? 'hidden md:block md:w-1/3' : 'w-full md:w-2/3'} p-6 border-r border-gray-200`}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              {getTaskTitle()}
            </h2>
            <span className="text-xs bg-accent/10 text-accent py-1 px-2 rounded-full">
              Writing Task {taskNumber}
            </span>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            {getTaskDescription()}
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Instructions
            </label>
            <RichTextEditor value={instructions} onChange={value => {
            setInstructions(value);
            onChange({
              instructions: value
            });
          }} placeholder="Enter instructions for the task..." />
          </div>
          {taskNumber === 1 && <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Visual Information
              </label>
              <p className="text-sm text-text-secondary mb-2">
                Upload a chart, graph, diagram, or process that students will
                describe.
              </p>
              {mediaFile ? <div className="mb-4">
                  <div className="border rounded-lg p-2 flex justify-between items-center">
                    <span className="text-sm">{mediaFile.name}</span>
                    <button onClick={() => setMediaFile(null)} className="text-text-tertiary hover:text-error text-sm">
                      Remove
                    </button>
                  </div>
                  {mediaFile.type.startsWith('image/') && <div className="mt-2 border rounded-lg p-2 bg-secondary">
                      <img src={URL.createObjectURL(mediaFile)} alt="Preview" className="max-h-48 mx-auto" />
                    </div>}
                </div> : <MediaUpload type="image" onFileSelect={handleMediaUpload} accept="image/*" />}
            </div>}
          {taskNumber === 2 && <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Essay Prompt
              </label>
              <RichTextEditor value={prompt} onChange={value => {
            setPrompt(value);
            onChange({
              prompt: value
            });
          }} placeholder="Enter the essay prompt or question..." />
            </div>}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Word Limit
            </label>
            <input type="number" min="1" value={wordLimit} onChange={e => {
            const limit = parseInt(e.target.value);
            setWordLimit(limit);
            onChange({
              wordLimit: limit
            });
          }} className="form-input w-full max-w-xs" />
            <p className="text-xs text-text-tertiary mt-1">
              Recommended: {taskNumber === 1 ? '150' : '250'} words
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Sample Answer (Optional)
            </label>
            <RichTextEditor value={sampleAnswer} onChange={value => {
            setSampleAnswer(value);
            onChange({
              sampleAnswer: value
            });
          }} placeholder="Enter a sample answer for reference..." minHeight="150px" />
            <p className="text-xs text-text-tertiary mt-1">
              This will be used for reference and will not be shown to students.
            </p>
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Time Allocation (minutes)
              </label>
              <input type="number" min="1" defaultValue={taskNumber === 1 ? 20 : 40} className="form-input w-full max-w-xs" onChange={e => onChange({
              timeAllocation: e.target.value
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
            This is how the writing task will appear to students.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-240px)] overflow-y-auto">
          <PreviewPanel module="writing" questionType={`task${taskNumber}`} data={{
          instructions,
          prompt,
          wordLimit,
          mediaFile: mediaFile ? URL.createObjectURL(mediaFile) : null,
          taskNumber
        }} />
        </div>
      </div>
    </div>;
};
export default WritingQuestionForm;