import React from 'react';
import { HeadphonesIcon, BookOpenIcon, PencilIcon } from 'lucide-react';
interface ModuleSelectionProps {
  onSelect: (module: 'listening' | 'reading' | 'writing') => void;
}
const ModuleSelection: React.FC<ModuleSelectionProps> = ({
  onSelect
}) => {
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">Select Module</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => onSelect('listening')} className="flex flex-col items-center p-8 border-2 border-secondary-dark rounded-lg hover:border-primary hover:bg-secondary transition-colors">
          <div className="bg-info/10 p-4 rounded-full mb-4">
            <HeadphonesIcon className="h-10 w-10 text-info" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">Listening</h3>
          <p className="text-sm text-text-secondary text-center">
            Create listening comprehension questions with audio
          </p>
        </button>
        <button onClick={() => onSelect('reading')} className="flex flex-col items-center p-8 border-2 border-secondary-dark rounded-lg hover:border-primary hover:bg-secondary transition-colors">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <BookOpenIcon className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">Reading</h3>
          <p className="text-sm text-text-secondary text-center">
            Create reading comprehension questions with passages
          </p>
        </button>
        <button onClick={() => onSelect('writing')} className="flex flex-col items-center p-8 border-2 border-secondary-dark rounded-lg hover:border-primary hover:bg-secondary transition-colors">
          <div className="bg-accent/10 p-4 rounded-full mb-4">
            <PencilIcon className="h-10 w-10 text-accent" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-2">Writing</h3>
          <p className="text-sm text-text-secondary text-center">
            Create writing tasks with prompts and visuals
          </p>
        </button>
      </div>
    </div>;
};
export default ModuleSelection;