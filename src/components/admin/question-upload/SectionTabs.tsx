import React from 'react';
interface SectionTabsProps {
  module: 'listening' | 'reading' | 'writing';
  activeSection: number;
  onSectionChange: (section: number) => void;
}
const SectionTabs: React.FC<SectionTabsProps> = ({
  module,
  activeSection,
  onSectionChange
}) => {
  // Determine the number of sections based on the module
  const getSectionCount = () => {
    switch (module) {
      case 'listening':
        return 4;
      case 'reading':
        return 3;
      case 'writing':
        return 2;
      default:
        return 0;
    }
  };
  const sectionCount = getSectionCount();
  const sections = Array.from({
    length: sectionCount
  }, (_, i) => i + 1);
  return <div className="mb-6">
      <div className="flex border-b border-secondary-dark">
        {sections.map(section => <button key={section} onClick={() => onSectionChange(section)} className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeSection === section ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}>
            {module === 'writing' ? `Task ${section}` : `Section ${section}`}
            {activeSection === section && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
          </button>)}
      </div>
    </div>;
};
export default SectionTabs;