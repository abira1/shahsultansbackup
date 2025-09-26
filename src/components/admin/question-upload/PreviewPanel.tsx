import React from 'react';
import { Clock, Headphones, Volume2 } from 'lucide-react';
interface PreviewPanelProps {
  module: 'listening' | 'reading' | 'writing';
  questionType: string;
  data: any;
}
const PreviewPanel: React.FC<PreviewPanelProps> = ({
  module,
  questionType,
  data
}) => {
  // Render preview based on module and question type
  const renderPreview = () => {
    switch (module) {
      case 'listening':
        return renderListeningPreview();
      case 'reading':
        return renderReadingPreview();
      case 'writing':
        return renderWritingPreview();
      default:
        return <p>Preview not available</p>;
    }
  };
  // Render listening preview
  const renderListeningPreview = () => {
    // Show audio player for listening module
    const audioSection = <div className="mb-4 p-3 bg-info/5 rounded-lg border border-info/10">
        <div className="flex items-center mb-2">
          <Headphones className="h-5 w-5 text-info mr-2" />
          <h3 className="text-sm font-medium">
            Listening Section {data.section}
          </h3>
        </div>
        {data.audioTiming && <div className="flex items-center text-xs text-text-secondary mb-2">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              Question timing:{' '}
              {data.audioTiming.formatTime(data.audioTiming.startTime)} -{' '}
              {data.audioTiming.formatTime(data.audioTiming.endTime)}
            </span>
          </div>}
        <div className="bg-white p-2 rounded border flex items-center">
          <button className="p-1.5 rounded-full bg-info/10 text-info mr-2">
            <Volume2 className="h-4 w-4" />
          </button>
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
            <div className="h-1.5 w-1/4 bg-info rounded-full"></div>
          </div>
        </div>
        <p className="text-xs text-text-tertiary mt-2">
          Audio will play once and cannot be paused during the actual test.
        </p>
      </div>;
    switch (questionType) {
      case 'multiple-choice-single':
      case 'multiple-choice-multiple':
        return <div>
            {audioSection}
            <div className="mb-4">
              {data.questionText ? <div dangerouslySetInnerHTML={{
              __html: data.questionText
            }} /> : <p className="text-text-tertiary italic">
                  Question text will appear here
                </p>}
            </div>
            <div className="space-y-2">
              {data.options && data.options.map((option: string, index: number) => <div key={index} className="flex items-center">
                    {questionType === 'multiple-choice-single' ? <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div> : <div className="h-4 w-4 border border-gray-300 rounded mr-2"></div>}
                    <span>
                      {option || `Option ${String.fromCharCode(65 + index)}`}
                    </span>
                  </div>)}
            </div>
          </div>;
      case 'matching':
      case 'form-completion':
      case 'note-completion':
      case 'table-completion':
      case 'sentence-completion':
      case 'short-answer':
      case 'diagram-labelling':
      case 'flowchart-completion':
        return <div>
            {audioSection}
            <div className="mb-4">
              {data.instructions ? <div dangerouslySetInnerHTML={{
              __html: data.instructions
            }} /> : <p className="text-text-tertiary italic">
                  Instructions will appear here
                </p>}
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-text-secondary">
                {questionType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}{' '}
                preview would be displayed here.
              </p>
            </div>
          </div>;
      default:
        return <p>Preview not available for this question type</p>;
    }
  };
  // Render reading preview
  const renderReadingPreview = () => {
    // Show passage
    const passageSection = <div className="mb-4 p-4 border rounded-lg">
        <h3 className="font-medium mb-2">Reading Passage</h3>
        {data.passage ? <div dangerouslySetInnerHTML={{
        __html: data.passage
      }} /> : <p className="text-text-tertiary italic">
            Reading passage will appear here
          </p>}
      </div>;
    switch (questionType) {
      case 'multiple-choice-single':
      case 'multiple-choice-multiple':
        return <div>
            {passageSection}
            <div className="mb-4">
              {data.questionText ? <div dangerouslySetInnerHTML={{
              __html: data.questionText
            }} /> : <p className="text-text-tertiary italic">
                  Question text will appear here
                </p>}
            </div>
            <div className="space-y-2">
              {data.options && data.options.map((option: string, index: number) => <div key={index} className="flex items-center">
                    {questionType === 'multiple-choice-single' ? <div className="h-4 w-4 border border-gray-300 rounded-full mr-2"></div> : <div className="h-4 w-4 border border-gray-300 rounded mr-2"></div>}
                    <span>
                      {option || `Option ${String.fromCharCode(65 + index)}`}
                    </span>
                  </div>)}
            </div>
          </div>;
      case 'true-false-not-given':
      case 'yes-no-not-given':
        return <div>
            {passageSection}
            <div className="mb-4">
              {data.instructions ? <div dangerouslySetInnerHTML={{
              __html: data.instructions
            }} /> : <p className="text-text-tertiary italic">
                  Instructions will appear here
                </p>}
            </div>
            <div className="space-y-3">
              {data.statements && data.statements.map((statement: any, index: number) => <div key={index} className="mb-2">
                    <p className="mb-1">
                      {index + 1}.{' '}
                      {statement.text || 'Statement will appear here'}
                    </p>
                    <div className="flex space-x-4 ml-4">
                      {questionType === 'true-false-not-given' ? <>
                          <label className="flex items-center">
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-1"></div>
                            <span className="text-sm">True</span>
                          </label>
                          <label className="flex items-center">
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-1"></div>
                            <span className="text-sm">False</span>
                          </label>
                          <label className="flex items-center">
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-1"></div>
                            <span className="text-sm">Not Given</span>
                          </label>
                        </> : <>
                          <label className="flex items-center">
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-1"></div>
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-1"></div>
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center">
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-1"></div>
                            <span className="text-sm">Not Given</span>
                          </label>
                        </>}
                    </div>
                  </div>)}
            </div>
          </div>;
      case 'matching-headings':
      case 'matching-information':
      case 'matching-features':
      case 'matching-sentence-endings':
      case 'sentence-completion':
      case 'note-completion':
      case 'table-completion':
      case 'flowchart-completion':
      case 'diagram-labelling':
      case 'short-answer':
      case 'summary-completion':
        return <div>
            {passageSection}
            <div className="mb-4">
              {data.instructions ? <div dangerouslySetInnerHTML={{
              __html: data.instructions
            }} /> : <p className="text-text-tertiary italic">
                  Instructions will appear here
                </p>}
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-text-secondary">
                {questionType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}{' '}
                preview would be displayed here.
              </p>
              {data.wordLimit && <p className="text-xs text-text-tertiary mt-2">
                  Word limit: {data.wordLimit}{' '}
                  {data.wordLimit === 1 ? 'word' : 'words'}
                </p>}
            </div>
          </div>;
      default:
        return <p>Preview not available for this question type</p>;
    }
  };
  // Render writing preview
  const renderWritingPreview = () => {
    const isTask1 = data.taskNumber === 1 || questionType.includes('task1');
    return <div>
        <div className="mb-4">
          <h3 className="font-medium">{isTask1 ? 'Task 1' : 'Task 2'}</h3>
          <p className="text-sm text-text-secondary">
            {isTask1 ? 'You should spend about 20 minutes on this task.' : 'You should spend about 40 minutes on this task.'}
          </p>
        </div>
        <div className="mb-4">
          {data.instructions ? <div dangerouslySetInnerHTML={{
          __html: data.instructions
        }} /> : <p className="text-text-tertiary italic">
              Task instructions will appear here
            </p>}
        </div>
        {isTask1 && data.mediaFile && <div className="mb-4 p-2 border rounded-lg">
            <img src={data.mediaFile} alt="Visual information" className="max-h-48 mx-auto" />
          </div>}
        {!isTask1 && data.prompt && <div className="mb-4">
            <div dangerouslySetInnerHTML={{
          __html: data.prompt
        }} />
          </div>}
        <p className="text-sm mb-4">
          Write at least {data.wordLimit || (isTask1 ? 150 : 250)} words.
        </p>
        <div className="border rounded-lg p-3 bg-white min-h-[200px]">
          <p className="text-text-tertiary italic">
            Answer area will appear here for students to type their response
          </p>
        </div>
      </div>;
  };
  return <div className="preview-panel">{renderPreview()}</div>;
};
export default PreviewPanel;