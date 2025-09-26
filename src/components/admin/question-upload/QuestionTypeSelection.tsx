import React from 'react';
import { ListIcon, CheckSquareIcon, CircleIcon, TypeIcon, ImageIcon, FileTextIcon, TableIcon, AlignLeftIcon, ArrowRightIcon, ColumnsIcon, BarChartIcon, FileIcon } from 'lucide-react';
interface QuestionTypeSelectionProps {
  module: 'listening' | 'reading' | 'writing';
  section: number;
  onSelect: (type: string) => void;
}
const QuestionTypeSelection: React.FC<QuestionTypeSelectionProps> = ({
  module,
  section,
  onSelect
}) => {
  // Get question types based on module
  const getQuestionTypes = () => {
    switch (module) {
      case 'listening':
        return [{
          id: 'multiple-choice-single',
          title: 'Multiple Choice (Single)',
          description: 'Select one correct answer from options',
          icon: <CircleIcon className="h-5 w-5" />
        }, {
          id: 'multiple-choice-multiple',
          title: 'Multiple Choice (Multiple)',
          description: 'Select multiple correct answers from options',
          icon: <CheckSquareIcon className="h-5 w-5" />
        }, {
          id: 'matching',
          title: 'Matching',
          description: 'Match items in two lists',
          icon: <ArrowRightIcon className="h-5 w-5" />
        }, {
          id: 'form-completion',
          title: 'Form Completion',
          description: 'Fill in blanks in a form',
          icon: <FileTextIcon className="h-5 w-5" />
        }, {
          id: 'note-completion',
          title: 'Note Completion',
          description: 'Fill in blanks in notes',
          icon: <ListIcon className="h-5 w-5" />
        }, {
          id: 'table-completion',
          title: 'Table Completion',
          description: 'Fill in blanks in a table',
          icon: <TableIcon className="h-5 w-5" />
        }, {
          id: 'sentence-completion',
          title: 'Sentence Completion',
          description: 'Complete sentences with words from the audio',
          icon: <TypeIcon className="h-5 w-5" />
        }, {
          id: 'short-answer',
          title: 'Short Answer',
          description: 'Write short answers to questions',
          icon: <AlignLeftIcon className="h-5 w-5" />
        }, {
          id: 'diagram-labelling',
          title: 'Diagram Labelling',
          description: 'Label parts of a diagram',
          icon: <ImageIcon className="h-5 w-5" />
        }, {
          id: 'flowchart-completion',
          title: 'Flowchart Completion',
          description: 'Fill in blanks in a flowchart',
          icon: <ColumnsIcon className="h-5 w-5" />
        }];
      case 'reading':
        return [{
          id: 'multiple-choice-single',
          title: 'Multiple Choice (Single)',
          description: 'Select one correct answer from options',
          icon: <CircleIcon className="h-5 w-5" />
        }, {
          id: 'multiple-choice-multiple',
          title: 'Multiple Choice (Multiple)',
          description: 'Select multiple correct answers from options',
          icon: <CheckSquareIcon className="h-5 w-5" />
        }, {
          id: 'true-false-not-given',
          title: 'True/False/Not Given',
          description: 'Determine if statements are true, false, or not given',
          icon: <FileTextIcon className="h-5 w-5" />
        }, {
          id: 'yes-no-not-given',
          title: 'Yes/No/Not Given',
          description: 'Determine if information agrees with claims',
          icon: <FileTextIcon className="h-5 w-5" />
        }, {
          id: 'matching-headings',
          title: 'Matching Headings',
          description: 'Match headings to paragraphs',
          icon: <ListIcon className="h-5 w-5" />
        }, {
          id: 'matching-information',
          title: 'Matching Information',
          description: 'Match statements to paragraphs',
          icon: <ArrowRightIcon className="h-5 w-5" />
        }, {
          id: 'matching-features',
          title: 'Matching Features',
          description: 'Match features to options',
          icon: <ArrowRightIcon className="h-5 w-5" />
        }, {
          id: 'matching-sentence-endings',
          title: 'Matching Sentence Endings',
          description: 'Match sentence beginnings with endings',
          icon: <TypeIcon className="h-5 w-5" />
        }, {
          id: 'sentence-completion',
          title: 'Sentence Completion',
          description: 'Complete sentences with words from the text',
          icon: <TypeIcon className="h-5 w-5" />
        }, {
          id: 'note-completion',
          title: 'Note Completion',
          description: 'Fill in blanks in notes',
          icon: <ListIcon className="h-5 w-5" />
        }, {
          id: 'table-completion',
          title: 'Table Completion',
          description: 'Fill in blanks in a table',
          icon: <TableIcon className="h-5 w-5" />
        }, {
          id: 'flowchart-completion',
          title: 'Flowchart Completion',
          description: 'Fill in blanks in a flowchart',
          icon: <ColumnsIcon className="h-5 w-5" />
        }, {
          id: 'diagram-labelling',
          title: 'Diagram Labelling',
          description: 'Label parts of a diagram',
          icon: <ImageIcon className="h-5 w-5" />
        }, {
          id: 'short-answer',
          title: 'Short Answer',
          description: 'Write short answers to questions',
          icon: <AlignLeftIcon className="h-5 w-5" />
        }, {
          id: 'summary-completion',
          title: 'Summary Completion',
          description: 'Complete a summary with words from the text',
          icon: <FileIcon className="h-5 w-5" />
        }];
      case 'writing':
        if (section === 1) {
          return [{
            id: 'task1-chart',
            title: 'Chart/Graph',
            description: 'Describe data presented in a chart or graph',
            icon: <BarChartIcon className="h-5 w-5" />
          }, {
            id: 'task1-diagram',
            title: 'Diagram/Process',
            description: 'Describe a diagram or process',
            icon: <ImageIcon className="h-5 w-5" />
          }, {
            id: 'task1-map',
            title: 'Map',
            description: 'Describe changes shown in maps',
            icon: <ImageIcon className="h-5 w-5" />
          }, {
            id: 'task1-table',
            title: 'Table',
            description: 'Describe data presented in a table',
            icon: <TableIcon className="h-5 w-5" />
          }];
        } else {
          return [{
            id: 'task2-opinion',
            title: 'Opinion Essay',
            description: 'Present and justify an opinion',
            icon: <AlignLeftIcon className="h-5 w-5" />
          }, {
            id: 'task2-argument',
            title: 'Argument Essay',
            description: 'Present an argument with supporting ideas',
            icon: <AlignLeftIcon className="h-5 w-5" />
          }, {
            id: 'task2-problem',
            title: 'Problem-Solution Essay',
            description: 'Present a problem and suggest solutions',
            icon: <AlignLeftIcon className="h-5 w-5" />
          }, {
            id: 'task2-compare',
            title: 'Compare & Contrast Essay',
            description: 'Compare and contrast different viewpoints',
            icon: <AlignLeftIcon className="h-5 w-5" />
          }];
        }
      default:
        return [];
    }
  };
  const questionTypes = getQuestionTypes();
  // Get section title
  const getSectionTitle = () => {
    if (module === 'writing') {
      return `Task ${section}`;
    } else {
      return `Section ${section}`;
    }
  };
  // Get module color class
  const getModuleColorClass = () => {
    switch (module) {
      case 'listening':
        return 'bg-info/10 text-info';
      case 'reading':
        return 'bg-primary/10 text-primary';
      case 'writing':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-gray-100 text-text-secondary';
    }
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <span className={`py-1 px-3 rounded-full mr-3 text-sm ${getModuleColorClass()}`}>
          {getSectionTitle()}
        </span>
        <h2 className="text-xl font-semibold text-primary">
          Select Question Type
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {questionTypes.map(type => <button key={type.id} onClick={() => onSelect(type.id)} className="flex flex-col items-start p-4 border border-secondary-dark rounded-lg hover:border-primary hover:bg-secondary transition-colors text-left h-full">
            <div className={`p-2 rounded-full mb-3 ${module === 'listening' ? 'bg-info/10' : module === 'reading' ? 'bg-primary/10' : 'bg-accent/10'}`}>
              {type.icon}
            </div>
            <h3 className="text-base font-medium text-primary mb-1">
              {type.title}
            </h3>
            <p className="text-xs text-text-secondary">{type.description}</p>
          </button>)}
      </div>
    </div>;
};
export default QuestionTypeSelection;