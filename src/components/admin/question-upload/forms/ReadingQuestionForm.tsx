import React, { useState } from 'react';
import { PlusIcon, MinusIcon, CheckIcon } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import PreviewPanel from '../PreviewPanel';
import MediaUpload from '../MediaUpload';
interface ReadingQuestionFormProps {
  questionType: string;
  section: number;
  onChange: (data: any) => void;
  formData: any;
  isPreviewMode: boolean;
}
const ReadingQuestionForm: React.FC<ReadingQuestionFormProps> = ({
  questionType,
  section,
  onChange,
  formData,
  isPreviewMode
}) => {
  const [passage, setPassage] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [statements, setStatements] = useState<Array<{
    text: string;
    answer: string;
  }>>([{
    text: '',
    answer: 'true'
  }]);
  const [wordLimit, setWordLimit] = useState<number | undefined>(undefined);
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
  // Handle statement change
  const handleStatementChange = (index: number, text: string) => {
    const newStatements = [...statements];
    newStatements[index] = {
      ...newStatements[index],
      text
    };
    setStatements(newStatements);
    onChange({
      statements: newStatements
    });
  };
  // Handle statement answer change
  const handleStatementAnswerChange = (index: number, answer: string) => {
    const newStatements = [...statements];
    newStatements[index] = {
      ...newStatements[index],
      answer
    };
    setStatements(newStatements);
    onChange({
      statements: newStatements
    });
  };
  // Handle add statement
  const handleAddStatement = () => {
    setStatements([...statements, {
      text: '',
      answer: 'true'
    }]);
  };
  // Handle remove statement
  const handleRemoveStatement = (index: number) => {
    const newStatements = [...statements];
    newStatements.splice(index, 1);
    setStatements(newStatements);
    onChange({
      statements: newStatements
    });
  };
  // Get question type title
  const getQuestionTypeTitle = () => {
    switch (questionType) {
      case 'multiple-choice-single':
        return 'Multiple Choice (Single Answer)';
      case 'multiple-choice-multiple':
        return 'Multiple Choice (Multiple Answers)';
      case 'true-false-not-given':
        return 'True/False/Not Given';
      case 'yes-no-not-given':
        return 'Yes/No/Not Given';
      case 'matching-headings':
        return 'Matching Headings';
      case 'matching-information':
        return 'Matching Information';
      case 'matching-features':
        return 'Matching Features';
      case 'matching-sentence-endings':
        return 'Matching Sentence Endings';
      case 'sentence-completion':
        return 'Sentence Completion';
      case 'note-completion':
        return 'Note Completion';
      case 'table-completion':
        return 'Table Completion';
      case 'flowchart-completion':
        return 'Flowchart Completion';
      case 'diagram-labelling':
        return 'Diagram Labelling';
      case 'short-answer':
        return 'Short Answer Questions';
      case 'summary-completion':
        return 'Summary Completion';
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
      case 'true-false-not-given':
      case 'yes-no-not-given':
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
                Statements
              </label>
              <div className="space-y-3">
                {statements.map((statement, index) => <div key={index} className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-medium">
                        {index + 1}.
                      </span>
                      <input type="text" value={statement.text} onChange={e => handleStatementChange(index, e.target.value)} placeholder="Enter statement" className="flex-grow form-input" />
                      {statements.length > 1 && <button type="button" onClick={() => handleRemoveStatement(index)} className="ml-2 p-1 text-text-tertiary hover:text-error rounded-full hover:bg-error/10 transition-colors">
                          <MinusIcon className="h-4 w-4" />
                        </button>}
                    </div>
                    <div className="flex ml-6 space-x-4">
                      {questionType === 'true-false-not-given' ? <>
                          <label className="flex items-center">
                            <input type="radio" checked={statement.answer === 'true'} onChange={() => handleStatementAnswerChange(index, 'true')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm">True</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" checked={statement.answer === 'false'} onChange={() => handleStatementAnswerChange(index, 'false')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm">False</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" checked={statement.answer === 'not-given'} onChange={() => handleStatementAnswerChange(index, 'not-given')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm">Not Given</span>
                          </label>
                        </> : <>
                          <label className="flex items-center">
                            <input type="radio" checked={statement.answer === 'yes'} onChange={() => handleStatementAnswerChange(index, 'yes')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" checked={statement.answer === 'no'} onChange={() => handleStatementAnswerChange(index, 'no')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm">No</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" checked={statement.answer === 'not-given'} onChange={() => handleStatementAnswerChange(index, 'not-given')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-2 text-sm">Not Given</span>
                          </label>
                        </>}
                    </div>
                  </div>)}
              </div>
              <button type="button" onClick={handleAddStatement} className="mt-2 flex items-center text-sm text-primary hover:text-primary-light">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Statement
              </button>
            </div>
          </div>;
      case 'matching-headings':
      case 'matching-information':
      case 'matching-features':
      case 'matching-sentence-endings':
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
                mapping. The specific interface would depend on the type of
                matching question.
              </p>
            </div>
          </div>;
      case 'sentence-completion':
      case 'note-completion':
      case 'table-completion':
      case 'flowchart-completion':
      case 'summary-completion':
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
                  This would include a specialized editor for creating{' '}
                  {questionType.split('-')[0]}s with blank fields and their
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
                Questions
              </label>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-text-secondary italic">
                  This would include an editor for creating short answer
                  questions and their correct answers.
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
            <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">
              Section {section}
            </span>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-primary mb-2">
              Reading Passage
            </h3>
            <RichTextEditor value={passage} onChange={value => {
            setPassage(value);
            onChange({
              passage: value
            });
          }} placeholder="Enter the reading passage text here..." minHeight="200px" />
            <p className="text-xs text-text-tertiary mt-2">
              This passage will be displayed to students during the test.
            </p>
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
          <PreviewPanel module="reading" questionType={questionType} data={{
          passage,
          questionText,
          instructions,
          options,
          correctAnswers,
          statements,
          wordLimit,
          section
        }} />
        </div>
      </div>
    </div>;
};
export default ReadingQuestionForm;