import React, { useState } from 'react';
import { BookOpenIcon, FileTextIcon, PencilIcon, HeadphonesIcon } from 'lucide-react';
interface SectionSelectionProps {
  module: 'listening' | 'reading' | 'writing';
  onSelect: (section: number) => void;
}
const SectionSelection: React.FC<SectionSelectionProps> = ({
  module,
  onSelect
}) => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  // Get sections based on module
  const getSections = () => {
    switch (module) {
      case 'listening':
        return [{
          number: 1,
          title: 'Section 1',
          description: 'Everyday social context dialog between two speakers'
        }, {
          number: 2,
          title: 'Section 2',
          description: 'Everyday social context monologue'
        }, {
          number: 3,
          title: 'Section 3',
          description: 'Educational or training context dialog between up to four people'
        }, {
          number: 4,
          title: 'Section 4',
          description: 'Educational or training context monologue'
        }];
      case 'reading':
        return [{
          number: 1,
          title: 'Section 1',
          description: 'Academic passage 1'
        }, {
          number: 2,
          title: 'Section 2',
          description: 'Academic passage 2'
        }, {
          number: 3,
          title: 'Section 3',
          description: 'Academic passage 3'
        }];
      case 'writing':
        return [{
          number: 1,
          title: 'Task 1',
          description: 'Chart, graph, diagram or process description (150 words)'
        }, {
          number: 2,
          title: 'Task 2',
          description: 'Essay on a given topic (250 words)'
        }];
      default:
        return [];
    }
  };
  const sections = getSections();
  const handleSelect = (section: number) => {
    setActiveSection(section);
    onSelect(section);
  };
  // Get icon based on module
  const getModuleIcon = () => {
    switch (module) {
      case 'listening':
        return <HeadphonesIcon className="h-6 w-6 text-info" />;
      case 'reading':
        return <BookOpenIcon className="h-6 w-6 text-primary" />;
      case 'writing':
        return <PencilIcon className="h-6 w-6 text-accent" />;
      default:
        return <FileTextIcon className="h-6 w-6 text-text-secondary" />;
    }
  };
  // Get module color class
  const getModuleColorClass = () => {
    switch (module) {
      case 'listening':
        return 'border-info';
      case 'reading':
        return 'border-primary';
      case 'writing':
        return 'border-accent';
      default:
        return 'border-gray-300';
    }
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className={`p-3 rounded-full mr-4 bg-opacity-10 ${module === 'listening' ? 'bg-info' : module === 'reading' ? 'bg-primary' : 'bg-accent'}`}>
          {getModuleIcon()}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-primary">
            {module.charAt(0).toUpperCase() + module.slice(1)} Module
          </h2>
          <p className="text-sm text-text-secondary">
            Select a section to add questions
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map(section => <button key={section.number} onClick={() => handleSelect(section.number)} className={`flex flex-col h-full p-5 rounded-lg border-2 transition-colors ${activeSection === section.number ? getModuleColorClass() : 'border-secondary-dark'} hover:border-primary hover:bg-secondary`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-primary">{section.title}</h3>
              <span className={`text-xs py-1 px-2 rounded-full ${module === 'listening' ? 'bg-info/10 text-info' : module === 'reading' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                {module === 'writing' ? 'Task' : 'Section'} {section.number}
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              {section.description}
            </p>
            <div className="mt-auto text-xs text-text-tertiary">
              {/* This would show actual stats in a real implementation */}0
              questions uploaded
            </div>
          </button>)}
      </div>
    </div>;
};
export default SectionSelection;