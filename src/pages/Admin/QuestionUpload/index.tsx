import React, { useState, Fragment } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { FileTextIcon, BookOpenIcon, PencilIcon, HeadphonesIcon, ArrowLeftIcon, SaveIcon, EyeIcon, CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ModuleSelection from './ModuleSelection';
import SectionSelection from '../../../components/admin/question-upload/SectionSelection';
import QuestionTypeSelection from '../../../components/admin/question-upload/QuestionTypeSelection';
import ListeningQuestionForm from '../../../components/admin/question-upload/forms/ListeningQuestionForm';
import ReadingQuestionForm from '../../../components/admin/question-upload/forms/ReadingQuestionForm';
import WritingQuestionForm from '../../../components/admin/question-upload/forms/WritingQuestionForm';
import SearchFilter from '../../../components/admin/question-upload/SearchFilter';
import { questionService } from '../../../services/databaseService';
// Enum for tracking current step in the question upload process
enum UploadStep {
  SelectExamType,
  SelectModule,
  SelectSection,
  SelectQuestionType,
  FillQuestionDetails,
}
const QuestionUpload: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<UploadStep>(UploadStep.SelectExamType);
  const [examType, setExamType] = useState<'complete' | 'individual' | null>(null);
  const [selectedModule, setSelectedModule] = useState<'listening' | 'reading' | 'writing' | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  // Function to handle exam type selection
  const handleExamTypeSelect = (type: 'complete' | 'individual') => {
    setExamType(type);
    setCurrentStep(UploadStep.SelectModule);
  };
  // Function to handle module selection
  const handleModuleSelect = (module: 'listening' | 'reading' | 'writing') => {
    setSelectedModule(module);
    setCurrentStep(UploadStep.SelectSection);
  };
  // Function to handle section selection
  const handleSectionSelect = (section: number) => {
    setSelectedSection(section);
    setCurrentStep(UploadStep.SelectQuestionType);
  };
  // Function to handle question type selection
  const handleQuestionTypeSelect = (type: string) => {
    setSelectedQuestionType(type);
    setCurrentStep(UploadStep.FillQuestionDetails);
  };
  // Function to handle form data changes
  const handleFormChange = (data: any) => {
    setFormData({
      ...formData,
      ...data
    });
    // Auto-save functionality would be implemented here
  };
  // Function to save the question
  const handleSave = async (isDraft: boolean = true) => {
    if (!selectedModule || !selectedSection || !selectedQuestionType) return;

    setIsSaving(true);
    try {
      const questionData = {
        module: selectedModule,
        section: selectedSection,
        questionType: selectedQuestionType,
        content: formData,
        difficulty: formData.difficulty || 'medium',
        tags: formData.tags || [],
        isActive: !isDraft
      };

      await questionService.create(questionData);
      
      if (!isDraft) {
        // Reset to select new question type for the same section
        setSelectedQuestionType(null);
        setFormData({});
        setCurrentStep(UploadStep.SelectQuestionType);
        alert('Question published successfully!');
      } else {
        alert('Question saved as draft!');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  // Function to toggle preview mode
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };
  // Function to go back to previous step
  const handleBack = () => {
    if (currentStep === UploadStep.SelectModule) {
      setExamType(null);
      setCurrentStep(UploadStep.SelectExamType);
    } else if (currentStep === UploadStep.SelectSection) {
      setSelectedModule(null);
      setCurrentStep(UploadStep.SelectModule);
    } else if (currentStep === UploadStep.SelectQuestionType) {
      setSelectedSection(null);
      setCurrentStep(UploadStep.SelectSection);
    } else if (currentStep === UploadStep.FillQuestionDetails) {
      setSelectedQuestionType(null);
      setCurrentStep(UploadStep.SelectQuestionType);
    }
  };
  // Get step label
  const getStepLabel = (step: UploadStep): string => {
    switch (step) {
      case UploadStep.SelectExamType:
        return 'Select Exam Type';
      case UploadStep.SelectModule:
        return 'Select Module';
      case UploadStep.SelectSection:
        return 'Select Section';
      case UploadStep.SelectQuestionType:
        return 'Select Question Type';
      case UploadStep.FillQuestionDetails:
        return 'Fill Question Details';
      default:
        return '';
    }
  };
  return <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Question Upload</h1>
          <div className="flex space-x-4">
            {currentStep !== UploadStep.SelectExamType && <button onClick={handleBack} className="flex items-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>}
            <Link to="/admin/questions" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-light transition-colors">
              View All Questions
            </Link>
          </div>
        </div>
        {/* Search and filter - only shown when viewing questions */}
        {currentStep === UploadStep.SelectExamType && <SearchFilter />}
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            {[UploadStep.SelectExamType, UploadStep.SelectModule, UploadStep.SelectSection, UploadStep.SelectQuestionType, UploadStep.FillQuestionDetails].map((step, index) => <Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep > step ? 'bg-accent text-white' : currentStep === step ? 'bg-primary text-white' : 'bg-secondary-dark text-text-secondary'}`}>
                    {currentStep > step ? <CheckIcon className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1 ${currentStep >= step ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                    {getStepLabel(step)}
                  </span>
                </div>
                {index < 4 && <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-accent' : 'bg-secondary-dark'}`}></div>}
              </Fragment>)}
          </div>
        </div>
        {/* Content based on current step */}
        {currentStep === UploadStep.SelectExamType && <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-primary mb-6">
              Select Exam Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => handleExamTypeSelect('complete')} className="flex flex-col items-center p-8 border-2 border-secondary-dark rounded-lg hover:border-primary hover:bg-secondary transition-colors">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <BookOpenIcon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  Complete Mock Test
                </h3>
                <p className="text-sm text-text-secondary text-center">
                  Create a full IELTS mock test with all modules and sections
                </p>
              </button>
              <button onClick={() => handleExamTypeSelect('individual')} className="flex flex-col items-center p-8 border-2 border-secondary-dark rounded-lg hover:border-primary hover:bg-secondary transition-colors">
                <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <FileTextIcon className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  Individual Module
                </h3>
                <p className="text-sm text-text-secondary text-center">
                  Create questions for a specific module (Listening, Reading, or
                  Writing)
                </p>
              </button>
            </div>
          </div>}
        {currentStep === UploadStep.SelectModule && <ModuleSelection onSelect={handleModuleSelect} />}
        {currentStep === UploadStep.SelectSection && selectedModule && <SectionSelection module={selectedModule} onSelect={handleSectionSelect} />}
        {currentStep === UploadStep.SelectQuestionType && selectedModule && selectedSection && <QuestionTypeSelection module={selectedModule} section={selectedSection} onSelect={handleQuestionTypeSelect} />}
        {currentStep === UploadStep.FillQuestionDetails && selectedModule && selectedQuestionType && <div className="bg-white rounded-lg shadow-md">
              {/* Question form based on module and question type */}
              {selectedModule === 'listening' && <div className="bg-info/10 border border-info/30 rounded-lg p-4 mb-6">
                  <h3 className="flex items-center text-sm font-medium text-primary mb-2">
                    <HeadphonesIcon className="h-4 w-4 mr-2" />
                    IELTS Listening Format
                  </h3>
                  <p className="text-sm text-text-secondary mb-2">
                    In the IELTS Listening test, there is a single continuous
                    audio recording (30-35 minutes) that contains all 4
                    sections:
                  </p>
                  <ul className="text-sm text-text-secondary list-disc list-inside ml-2 mb-2">
                    <li>Section 1: A casual conversation</li>
                    <li>Section 2: A monologue on a general topic</li>
                    <li>Section 3: An academic conversation (3-4 speakers)</li>
                    <li>Section 4: An academic lecture</li>
                  </ul>
                  <p className="text-sm text-text-secondary">
                    The audio plays without stopping, and test takers must
                    answer questions for each section as the audio continues.
                    For each question, you'll need to specify which part of the
                    audio recording it relates to.
                  </p>
                </div>}
              {selectedModule === 'listening' && <ListeningQuestionForm questionType={selectedQuestionType} section={selectedSection || 1} onChange={handleFormChange} formData={formData} isPreviewMode={isPreviewMode} />}
              {selectedModule === 'reading' && <ReadingQuestionForm questionType={selectedQuestionType} section={selectedSection || 1} onChange={handleFormChange} formData={formData} isPreviewMode={isPreviewMode} />}
              {selectedModule === 'writing' && <WritingQuestionForm taskNumber={selectedSection || 1} onChange={handleFormChange} formData={formData} isPreviewMode={isPreviewMode} />}
              {/* Footer actions */}
              <div className="p-4 border-t border-gray-200 flex justify-between">
                <div>
                  <button onClick={togglePreview} className="flex items-center px-4 py-2 mr-4 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => handleSave(true)} disabled={isSaving} className="flex items-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button onClick={() => handleSave(false)} disabled={isSaving} className="flex items-center px-4 py-2 rounded-md bg-accent text-white hover:bg-accent-light transition-colors">
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isSaving ? 'Submitting...' : 'Submit Question'}
                  </button>
                </div>
              </div>
            </div>}
      </div>
    </AdminLayout>;
};
export default QuestionUpload;