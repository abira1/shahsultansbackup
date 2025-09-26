import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, Clock, ChevronLeft, ChevronRight, Highlighter, StickyNote } from 'lucide-react';
import Button from '../../components/ui/Button';

interface ReadingProps {
  onComplete: () => void;
}

const Reading: React.FC<ReadingProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [highlightedText, setHighlightedText] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [highlightMenuPosition, setHighlightMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);

  const totalQuestions = 40;
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);
  // Handle answer change
  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      updateCurrentSection(currentQuestion - 1);
    }
  };
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      updateCurrentSection(currentQuestion + 1);
    }
  };
  // Jump to specific question
  const jumpToQuestion = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    updateCurrentSection(questionNumber);
  };
  // Update current section based on question number
  const updateCurrentSection = (questionNumber: number) => {
    if (questionNumber <= 14) {
      setCurrentSection(1);
    } else if (questionNumber <= 27) {
      setCurrentSection(2);
    } else {
      setCurrentSection(3);
    }
  };
  // Check if question is answered
  const isQuestionAnswered = (questionNumber: number) => {
    const answer = answers[`q${questionNumber}`];
    return answer !== undefined && (typeof answer === 'string' ? answer !== '' : answer.length > 0);
  };
  // Increase text size
  const increaseTextSize = () => {
    if (textSize < 24) {
      setTextSize(textSize + 2);
    }
  };
  // Decrease text size
  const decreaseTextSize = () => {
    if (textSize > 12) {
      setTextSize(textSize - 2);
    }
  };
  // Get current passage based on section
  const getCurrentPassage = () => {
    switch (currentSection) {
      case 1:
        return passageOne;
      case 2:
        return passageTwo;
      case 3:
        return passageThree;
      default:
        return passageOne;
    }
  };
  // Render the appropriate question component based on current question
  const renderQuestionComponent = () => {
    // Determine question type based on question number
    let questionType = 'multiple-choice';
    if (currentQuestion <= 7) {
      questionType = 'multiple-choice';
    } else if (currentQuestion <= 14) {
      questionType = 'true-false-not-given';
    } else if (currentQuestion <= 20) {
      questionType = 'matching-headings';
    } else if (currentQuestion <= 27) {
      questionType = 'matching-information';
    } else if (currentQuestion <= 33) {
      questionType = 'summary-completion';
    } else if (currentQuestion <= 40) {
      questionType = 'sentence-completion';
    }
    switch (questionType) {
      case 'multiple-choice':
        return <MultipleChoiceQuestion questionNumber={currentQuestion} value={answers[`q${currentQuestion}`] as string || ''} onChange={value => handleAnswerChange(`q${currentQuestion}`, value)} />;
      case 'true-false-not-given':
        return <TrueFalseNotGivenQuestion questionNumber={currentQuestion} value={answers[`q${currentQuestion}`] as string || ''} onChange={value => handleAnswerChange(`q${currentQuestion}`, value)} />;
      case 'matching-headings':
        return <MatchingHeadingsQuestion questionNumber={currentQuestion} value={answers[`q${currentQuestion}`] as string || ''} onChange={value => handleAnswerChange(`q${currentQuestion}`, value)} />;
      case 'matching-information':
        return <MatchingInformationQuestion questionNumber={currentQuestion} value={answers[`q${currentQuestion}`] as string || ''} onChange={value => handleAnswerChange(`q${currentQuestion}`, value)} />;
      case 'summary-completion':
        return <SummaryCompletionQuestion questionNumber={currentQuestion} value={answers[`q${currentQuestion}`] as string || ''} onChange={value => handleAnswerChange(`q${currentQuestion}`, value)} />;
      case 'sentence-completion':
        return <SentenceCompletionQuestion questionNumber={currentQuestion} value={answers[`q${currentQuestion}`] as string || ''} onChange={value => handleAnswerChange(`q${currentQuestion}`, value)} />;
      default:
        return <div>Question type not implemented</div>;
    }
  };
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white py-3 px-4 sticky top-0 z-10 shadow-md">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">IELTS Academic Reading Test</h1>
          <div className="flex items-center bg-primary-dark px-3 py-1 rounded-full">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>
      <div className="container max-w-7xl mx-auto py-4 px-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Section {currentSection}: Passage {currentSection}
            </h2>
            <p className="text-sm text-text-secondary">
              Questions{' '}
              {currentSection === 1 ? '1-14' : currentSection === 2 ? '15-27' : '28-40'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={decreaseTextSize} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Decrease text size">
              <ZoomOut className="h-4 w-4 text-text-secondary" />
            </button>
            <button onClick={increaseTextSize} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Increase text size">
              <ZoomIn className="h-4 w-4 text-text-secondary" />
            </button>
          </div>
        </div>
        {/* Main content area with split view */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left pane - Passage */}
          <div className="lg:w-1/2 bg-white rounded-lg shadow-md p-6 overflow-y-auto" style={{
          maxHeight: 'calc(100vh - 220px)'
        }}>
            <div style={{
            fontSize: `${textSize}px`
          }} className="prose max-w-none">
              {getCurrentPassage()}
            </div>
          </div>
          {/* Right pane - Questions */}
          <div className="lg:w-1/2 bg-white rounded-lg shadow-md p-6 overflow-y-auto" style={{
          maxHeight: 'calc(100vh - 220px)'
        }}>
            <div className="mb-4">
              <h3 className="font-semibold">Question {currentQuestion}</h3>
            </div>
            {renderQuestionComponent()}
          </div>
        </div>
        {/* Footer Navigation */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between mb-4">
            <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestion === 1} className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant={currentQuestion < totalQuestions ? 'outline' : 'primary'} onClick={currentQuestion < totalQuestions ? goToNextQuestion : onComplete} className="flex items-center">
              {currentQuestion < totalQuestions ? <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </> : 'Complete Test'}
            </Button>
          </div>
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {Array.from({
              length: totalQuestions
            }, (_, i) => i + 1).map(num => <button key={num} onClick={() => jumpToQuestion(num)} className={`w-8 h-8 rounded-full text-sm flex items-center justify-center font-medium transition-colors
                    ${currentQuestion === num ? 'bg-primary text-white' : isQuestionAnswered(num) ? 'bg-gray-200 text-text-primary' : 'bg-white border border-gray-300 text-text-secondary hover:bg-gray-100'}`} aria-label={`Go to question ${num}`}>
                  {num}
                </button>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Multiple Choice Question Component
interface MultipleChoiceQuestionProps {
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
}
const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionNumber,
  value,
  onChange
}) => {
  return <div>
      <p className="text-text-secondary mb-4">
        Choose the correct letter, A, B, C or D.
      </p>
      <p className="mb-4 font-medium">
        {questionNumber === 1 && 'The main purpose of the passage is to'}
        {questionNumber === 2 && 'According to the passage, the traditional view of sleep is that it'}
        {questionNumber === 3 && 'The author suggests that sleep patterns'}
        {questionNumber === 4 && 'Research on animals indicates that sleep'}
        {questionNumber === 5 && 'The study on rats mentioned in the passage shows that'}
        {questionNumber === 6 && 'The passage indicates that dolphins'}
        {questionNumber === 7 && 'According to the passage, humans in pre-industrial times'}
      </p>
      <div className="space-y-2 ml-4">
        <div className="flex items-center">
          <input type="radio" id={`q${questionNumber}a`} name={`q${questionNumber}`} value="A" checked={value === 'A'} onChange={() => onChange('A')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
          <label htmlFor={`q${questionNumber}a`} className="ml-2 block">
            A.{' '}
            {questionNumber === 1 && 'challenge conventional theories about sleep'}
            {questionNumber === 2 && 'is unnecessary for survival'}
            {questionNumber === 3 && 'are universal across all species'}
          </label>
        </div>
        <div className="flex items-center">
          <input type="radio" id={`q${questionNumber}b`} name={`q${questionNumber}`} value="B" checked={value === 'B'} onChange={() => onChange('B')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
          <label htmlFor={`q${questionNumber}b`} className="ml-2 block">
            B.{' '}
            {questionNumber === 1 && 'explain the evolution of sleep across species'}
            {questionNumber === 2 && 'serves a vital biological function'}
            {questionNumber === 3 && 'vary significantly between species'}
          </label>
        </div>
        <div className="flex items-center">
          <input type="radio" id={`q${questionNumber}c`} name={`q${questionNumber}`} value="C" checked={value === 'C'} onChange={() => onChange('C')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
          <label htmlFor={`q${questionNumber}c`} className="ml-2 block">
            C.{' '}
            {questionNumber === 1 && 'present new research findings on sleep disorders'}
            {questionNumber === 2 && 'is primarily for mental restoration'}
            {questionNumber === 3 && 'are determined by environmental factors'}
          </label>
        </div>
        <div className="flex items-center">
          <input type="radio" id={`q${questionNumber}d`} name={`q${questionNumber}`} value="D" checked={value === 'D'} onChange={() => onChange('D')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
          <label htmlFor={`q${questionNumber}d`} className="ml-2 block">
            D.{' '}
            {questionNumber === 1 && 'compare sleep patterns in humans and animals'}
            {questionNumber === 2 && 'varies in importance depending on age'}
            {questionNumber === 3 && 'have remained unchanged throughout history'}
          </label>
        </div>
      </div>
    </div>;
};
// True/False/Not Given Question Component
interface TrueFalseNotGivenQuestionProps {
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
}
const TrueFalseNotGivenQuestion: React.FC<TrueFalseNotGivenQuestionProps> = ({
  questionNumber,
  value,
  onChange
}) => {
  return <div>
      <p className="text-text-secondary mb-4">
        Do the following statements agree with the information given in the
        passage?
      </p>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">TRUE</span> if the statement agrees with
          the information
          <br />
          <span className="font-medium">FALSE</span> if the statement
          contradicts the information
          <br />
          <span className="font-medium">NOT GIVEN</span> if there is no
          information on this
        </p>
      </div>
      <p className="mb-4 font-medium">
        {questionNumber === 8 && 'Sleep deprivation can lead to serious health problems.'}
        {questionNumber === 9 && 'All mammals require the same amount of sleep.'}
        {questionNumber === 10 && 'Dolphins can sleep with half their brain at a time.'}
        {questionNumber === 11 && 'Humans naturally sleep in two distinct periods during the night.'}
        {questionNumber === 12 && 'Modern sleep patterns are superior to pre-industrial sleep patterns.'}
        {questionNumber === 13 && 'The invention of electric lighting has improved human sleep quality.'}
        {questionNumber === 14 && 'Scientists have a complete understanding of why we sleep.'}
      </p>
      <div className="space-y-2">
        <div className="flex items-center">
          <input type="radio" id={`q${questionNumber}true`} name={`q${questionNumber}`} value="TRUE" checked={value === 'TRUE'} onChange={() => onChange('TRUE')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
          <label htmlFor={`q${questionNumber}true`} className="ml-2 block">
            TRUE
          </label>
        </div>
        <div className="flex items-center">
          <input type="radio" id={`q${questionNumber}false`} name={`q${questionNumber}`} value="FALSE" checked={value === 'FALSE'} onChange={() => onChange('FALSE')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
          <label htmlFor={`q${questionNumber}false`} className="ml-2 block">
            FALSE
          </label>
        </div>
        <div className="flex items-center">
          <input type="radio" id={`q${questionNumber}notgiven`} name={`q${questionNumber}`} value="NOT GIVEN" checked={value === 'NOT GIVEN'} onChange={() => onChange('NOT GIVEN')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
          <label htmlFor={`q${questionNumber}notgiven`} className="ml-2 block">
            NOT GIVEN
          </label>
        </div>
      </div>
    </div>;
};
// Matching Headings Question Component
interface MatchingHeadingsQuestionProps {
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
}
const MatchingHeadingsQuestion: React.FC<MatchingHeadingsQuestionProps> = ({
  questionNumber,
  value,
  onChange
}) => {
  const headings = [{
    id: 'i',
    text: "An overview of climate patterns throughout Earth's history"
  }, {
    id: 'ii',
    text: 'The greenhouse effect and its impact on global temperature'
  }, {
    id: 'iii',
    text: 'Human activities contributing to climate change'
  }, {
    id: 'iv',
    text: 'Natural causes of climate fluctuations'
  }, {
    id: 'v',
    text: 'Predicting future climate scenarios'
  }, {
    id: 'vi',
    text: 'The debate among climate scientists'
  }, {
    id: 'vii',
    text: 'Potential solutions to global warming'
  }, {
    id: 'viii',
    text: 'Economic implications of climate change'
  }, {
    id: 'ix',
    text: 'International cooperation on environmental issues'
  }, {
    id: 'x',
    text: 'The role of technology in monitoring climate'
  }];
  return <div>
      <p className="text-text-secondary mb-4">
        Choose the correct heading for paragraphs{' '}
        {questionNumber === 15 ? 'A-E' : 'F-J'} from the list of headings below.
      </p>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">List of Headings</h4>
        <ul className="list-roman pl-6 space-y-1">
          {headings.map(heading => <li key={heading.id} className="text-sm">
              {heading.text}
            </li>)}
        </ul>
      </div>
      <p className="mb-4 font-medium">
        {questionNumber === 15 && 'Paragraph A'}
        {questionNumber === 16 && 'Paragraph B'}
        {questionNumber === 17 && 'Paragraph C'}
        {questionNumber === 18 && 'Paragraph D'}
        {questionNumber === 19 && 'Paragraph E'}
        {questionNumber === 20 && 'Paragraph F'}
      </p>
      <select value={value} onChange={e => onChange(e.target.value)} className="form-input" aria-label={`Question ${questionNumber}`}>
        <option value="">Select a heading</option>
        {headings.map(heading => <option key={heading.id} value={heading.id}>
            {heading.id}
          </option>)}
      </select>
    </div>;
};
// Matching Information Question Component
interface MatchingInformationQuestionProps {
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
}
const MatchingInformationQuestion: React.FC<MatchingInformationQuestionProps> = ({
  questionNumber,
  value,
  onChange
}) => {
  return <div>
      <p className="text-text-secondary mb-4">
        Which paragraph contains the following information? Write the correct
        letter, A-J.
      </p>
      <p className="mb-4 font-medium">
        {questionNumber === 21 && 'A comparison between current and historical CO2 levels'}
        {questionNumber === 22 && 'An explanation of how greenhouse gases trap heat'}
        {questionNumber === 23 && 'Examples of extreme weather events linked to climate change'}
        {questionNumber === 24 && 'A description of how ice cores provide climate data'}
        {questionNumber === 25 && 'Discussion of international climate agreements'}
        {questionNumber === 26 && 'Explanation of how deforestation affects climate'}
        {questionNumber === 27 && 'The impact of climate change on agriculture'}
      </p>
      <select value={value} onChange={e => onChange(e.target.value)} className="form-input" aria-label={`Question ${questionNumber}`}>
        <option value="">Select a paragraph</option>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(letter => <option key={letter} value={letter}>
            {letter}
          </option>)}
      </select>
    </div>;
};
// Summary Completion Question Component
interface SummaryCompletionQuestionProps {
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
}
const SummaryCompletionQuestion: React.FC<SummaryCompletionQuestionProps> = ({
  questionNumber,
  value,
  onChange
}) => {
  return <div>
      <p className="text-text-secondary mb-4">
        Complete the summary below. Choose NO MORE THAN TWO WORDS from the
        passage for each answer.
      </p>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3 text-center">Ocean Acidification</h4>
        <p className="mb-2">
          The world's oceans absorb approximately one-third of the CO2 released
          by human activities, which leads to a process called
          {questionNumber === 28 ? <input type="text" className="form-input mx-2 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} /> : ' ocean acidification'}
          . This occurs when CO2 combines with seawater to form
          {questionNumber === 29 ? <input type="text" className="form-input mx-2 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} /> : ' carbonic acid'}
          . The increasing acidity has a detrimental effect on marine organisms,
          particularly those with
          {questionNumber === 30 ? <input type="text" className="form-input mx-2 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} /> : ' calcium shells'}
          . Coral reefs are especially vulnerable because acidification reduces
          their ability to build
          {questionNumber === 31 ? <input type="text" className="form-input mx-2 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} /> : ' skeletal structures'}
          . Scientists predict that without significant reductions in CO2
          emissions, the
          {questionNumber === 32 ? <input type="text" className="form-input mx-2 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} /> : ' marine ecosystem'}
          could be severely disrupted by the end of this century. This would
          have far-reaching consequences for ocean
          {questionNumber === 33 ? <input type="text" className="form-input mx-2 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} /> : ' biodiversity'}
          and the millions of people who depend on the ocean for their
          livelihoods.
        </p>
      </div>
    </div>;
};
// Sentence Completion Question Component
interface SentenceCompletionQuestionProps {
  questionNumber: number;
  value: string;
  onChange: (value: string) => void;
}
const SentenceCompletionQuestion: React.FC<SentenceCompletionQuestionProps> = ({
  questionNumber,
  value,
  onChange
}) => {
  return <div>
      <p className="text-text-secondary mb-4">
        Complete the sentences below. Write NO MORE THAN THREE WORDS from the
        passage for each answer.
      </p>
      <p className="mb-4">
        {questionNumber === 34 && <>
            The third passage discusses how renewable energy can reduce our
            dependence on{' '}
            <input type="text" className="form-input mx-1 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} />
            .
          </>}
        {questionNumber === 35 && <>
            According to the passage, solar power is most effective in regions
            with high levels of{' '}
            <input type="text" className="form-input mx-1 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} />
            .
          </>}
        {questionNumber === 36 && <>
            Wind turbines are typically located in{' '}
            <input type="text" className="form-input mx-1 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} />{' '}
            where wind speeds are consistently high.
          </>}
        {questionNumber === 37 && <>
            Hydroelectric power generates electricity by harnessing the energy
            of{' '}
            <input type="text" className="form-input mx-1 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} />
            .
          </>}
        {questionNumber === 38 && <>
            Geothermal energy utilizes heat from{' '}
            <input type="text" className="form-input mx-1 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} />
            .
          </>}
        {questionNumber === 39 && <>
            The main challenge for renewable energy adoption is the need for{' '}
            <input type="text" className="form-input mx-1 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} />
            .
          </>}
        {questionNumber === 40 && <>
            The passage concludes that a transition to renewable energy requires
            both technological innovation and{' '}
            <input type="text" className="form-input mx-1 w-40" value={value} onChange={e => onChange(e.target.value)} placeholder="Your answer" aria-label={`Question ${questionNumber}`} />
            .
          </>}
      </p>
    </div>;
};
// Sample passages
const passageOne = <>
    <h3 className="text-lg font-semibold mb-3">The Mystery of Sleep</h3>
    <p className="mb-4">
      <strong>A</strong> Sleep is a universal behavior that has fascinated
      scientists for centuries. Despite its ubiquity across the animal kingdom,
      the fundamental purpose of sleep remains one of biology's greatest
      mysteries. Traditionally, sleep was viewed as a period of inactivity where
      the body and mind rest and recover from the day's exertions. However,
      modern research suggests that sleep is far more than a passive state of
      rest; it is an active process crucial for numerous biological functions.
    </p>
    <p className="mb-4">
      <strong>B</strong> One of the most compelling pieces of evidence for
      sleep's importance comes from studies of sleep deprivation. When animals,
      including humans, are prevented from sleeping, they experience a range of
      negative effects. After just one night without sleep, humans show impaired
      cognitive function, reduced immune response, and altered hormone levels.
      Extended sleep deprivation can lead to hallucinations, severe health
      problems, and, in extreme cases observed in laboratory animals, death.
      These findings strongly suggest that sleep serves vital biological
      functions that cannot be bypassed.
    </p>
    <p className="mb-4">
      <strong>C</strong> Interestingly, sleep patterns vary dramatically across
      species. Large mammals like elephants and giraffes sleep only 3-4 hours
      per day, while bats and opossums may sleep up to 20 hours. This variation
      suggests that sleep has evolved to meet the specific needs of different
      species. A groundbreaking study on rats found that sleep allows the brain
      to clear out toxic waste products that accumulate during wakefulness. This
      "cleaning" function may explain why animals with higher metabolic rates
      and more complex brains often require more sleep.
    </p>
    <p className="mb-4">
      <strong>D</strong> Some animals have evolved remarkable adaptations in
      their sleep patterns. Dolphins, for example, sleep with only half their
      brain at a time, allowing them to remain alert for predators and
      periodically surface to breathe. This unihemispheric sleep demonstrates
      the flexibility of sleep mechanisms and their adaptation to environmental
      pressures. Similarly, migratory birds can sleep while flying, alternating
      which half of their brain is asleep, much like dolphins.
    </p>
    <p className="mb-4">
      <strong>E</strong> Human sleep patterns have also evolved over time and
      vary across cultures. Historical records suggest that before the
      industrial revolution, humans typically slept in two distinct phases
      during the night, with a period of wakefulness in between. This biphasic
      sleep pattern was common until the widespread adoption of artificial
      lighting altered our natural sleep cycles. Today, most industrialized
      societies follow a monophasic sleep pattern of one consolidated sleep
      period, though siesta cultures maintain aspects of biphasic sleep.
    </p>
  </>;
const passageTwo = <>
    <h3 className="text-lg font-semibold mb-3">
      Climate Change: Understanding the Science
    </h3>
    <p className="mb-4">
      <strong>A</strong> Earth's climate has fluctuated throughout its
      4.5-billion-year history, with periods of warming and cooling driven by
      natural factors. However, the rate of warming observed over the past
      century is unprecedented in recent geological history. According to ice
      core data, current atmospheric carbon dioxide (CO2) levels exceed 410
      parts per million, higher than at any point in the past 800,000 years.
      This rapid increase coincides with the industrial revolution and the
      burning of fossil fuels, suggesting a strong link between human activities
      and climate change.
    </p>
    <p className="mb-4">
      <strong>B</strong> The greenhouse effect is a natural process that helps
      maintain Earth's temperature at levels conducive to life. Greenhouse
      gases, including CO2, methane, and water vapor, trap heat in the
      atmosphere that would otherwise escape into space. Without this natural
      greenhouse effect, Earth would be too cold to support most life forms.
      However, human activities have enhanced this effect by increasing the
      concentration of greenhouse gases, particularly CO2, leading to additional
      warming beyond natural variability.
    </p>
    <p className="mb-4">
      <strong>C</strong> The primary human contribution to greenhouse gas
      emissions comes from burning fossil fuels for energy, transportation, and
      industry. When coal, oil, and natural gas are burned, they release CO2
      that has been stored underground for millions of years. Deforestation
      compounds this problem by reducing the number of trees available to absorb
      CO2 through photosynthesis. Agricultural practices, particularly livestock
      farming and rice cultivation, contribute significant amounts of methane,
      another potent greenhouse gas.
    </p>
    <p className="mb-4">
      <strong>D</strong> Scientists gather evidence about past climate
      conditions through various methods. Ice cores extracted from polar regions
      contain trapped air bubbles that reveal atmospheric composition from
      thousands of years ago. Tree rings, ocean sediments, and coral reefs also
      provide valuable climate data. These paleoclimate records help scientists
      understand natural climate variability and place current changes in
      historical context. Computer models then use this information to project
      future climate scenarios based on different emission pathways.
    </p>
    <p className="mb-4">
      <strong>E</strong> The effects of climate change are already observable
      worldwide. Global average temperatures have increased by approximately 1°C
      since pre-industrial times. This warming has contributed to sea level rise
      through thermal expansion of oceans and melting of ice sheets and
      glaciers. Weather patterns are changing, with more frequent and intense
      extreme events such as heatwaves, droughts, floods, and hurricanes. These
      changes affect ecosystems, agriculture, water resources, and human health.
    </p>
    <p className="mb-4">
      <strong>F</strong> International efforts to address climate change
      culminated in the 2015 Paris Agreement, where countries committed to
      limiting global warming to well below 2°C above pre-industrial levels,
      with efforts to limit the increase to 1.5°C. Achieving these targets
      requires significant reductions in greenhouse gas emissions through
      transitions to renewable energy, improved energy efficiency, sustainable
      land management, and potentially carbon capture technologies. The economic
      and social dimensions of these transitions present both challenges and
      opportunities.
    </p>
  </>;
const passageThree = <>
    <h3 className="text-lg font-semibold mb-3">
      Renewable Energy: Powering the Future
    </h3>
    <p className="mb-4">
      <strong>A</strong> The global energy landscape is undergoing a profound
      transformation as societies seek alternatives to fossil fuels. Renewable
      energy sources—including solar, wind, hydroelectric, geothermal, and
      biomass—offer the potential to meet human energy needs while reducing
      greenhouse gas emissions and dependence on finite resources. Unlike
      conventional energy sources, renewables harness naturally replenishing
      processes, providing a sustainable path forward in an increasingly
      carbon-constrained world.
    </p>
    <p className="mb-4">
      <strong>B</strong> Solar power, perhaps the most abundant renewable
      resource, converts sunlight directly into electricity through photovoltaic
      cells or concentrates solar radiation to generate heat for power
      production. Technological advances have dramatically reduced the cost of
      solar panels, making them increasingly competitive with fossil fuels.
      Solar energy is particularly effective in regions with high levels of
      solar radiation, though innovations in storage technology are addressing
      intermittency challenges caused by nighttime and cloudy conditions.
    </p>
    <p className="mb-4">
      <strong>C</strong> Wind energy harnesses the kinetic energy of moving air
      to turn turbine blades, which drive generators to produce electricity.
      Modern wind farms, both onshore and offshore, represent one of the
      fastest-growing energy sectors globally. Wind turbines are typically
      located in coastal areas, mountain passes, and open plains where wind
      speeds are consistently high. Like solar power, wind energy production
      varies with weather conditions, necessitating integration with other
      energy sources or storage systems.
    </p>
    <p className="mb-4">
      <strong>D</strong> Hydroelectric power, the most established form of
      renewable energy, generates electricity by harnessing the energy of
      flowing water. Conventional hydropower plants use dams to create
      reservoirs, releasing water through turbines when electricity is needed.
      Run-of-river systems, which have less environmental impact, generate power
      from the natural flow of rivers without large reservoirs. While hydropower
      provides reliable baseload electricity, its development must balance
      energy benefits against potential ecological and social impacts.
    </p>
    <p className="mb-4">
      <strong>E</strong> Geothermal energy utilizes heat from beneath the
      Earth's surface to generate power or provide direct heating. In geothermal
      power plants, steam or hot water from underground reservoirs drives
      turbines to produce electricity. This energy source is particularly
      valuable because it provides consistent power regardless of weather
      conditions or time of day. While geothermal resources are concentrated in
      tectonically active regions, advances in enhanced geothermal systems may
      expand this technology's geographic reach.
    </p>
    <p className="mb-4">
      <strong>F</strong> Biomass energy converts organic materials—such as
      agricultural residues, forest products, and dedicated energy crops—into
      heat, electricity, or liquid fuels. When sustainably managed, biomass can
      be carbon-neutral, as the CO2 released during combustion equals the amount
      absorbed during plant growth. Bioenergy's versatility makes it valuable
      for applications where other renewables face limitations, though careful
      attention to land use and biodiversity impacts is essential.
    </p>
    <p className="mb-4">
      <strong>G</strong> The transition to renewable energy presents both
      challenges and opportunities. Integrating variable renewables into
      existing grid infrastructure requires sophisticated management systems and
      energy storage solutions. The distributed nature of many renewable
      resources can enhance energy security and provide economic benefits to
      rural communities. However, the intermittent nature of some renewables
      necessitates advancements in energy storage technologies, from batteries
      to pumped hydro storage, to ensure reliable power supply.
    </p>
    <p className="mb-4">
      <strong>H</strong> Despite remarkable progress, renewable energy adoption
      still faces barriers, including initial capital costs, policy uncertainty,
      and entrenched interests in conventional energy systems. Overcoming these
      obstacles requires a combination of technological innovation, market-based
      mechanisms, supportive policy frameworks, and public engagement. As
      renewable technologies continue to improve and economies of scale reduce
      costs, the economic case for clean energy becomes increasingly compelling.
    </p>
    <p className="mb-4">
      <strong>I</strong> The environmental benefits of renewable energy extend
      beyond climate change mitigation. Unlike fossil fuels, most renewable
      sources produce little or no air pollution, reducing public health risks
      from particulate matter and other harmful emissions. Renewables generally
      consume less water than conventional power generation, an important
      consideration in water-stressed regions. Additionally, distributed
      renewable systems can minimize habitat disruption compared to large-scale
      fossil fuel extraction and transportation infrastructure.
    </p>
    <p className="mb-4">
      <strong>J</strong> Looking ahead, the renewable energy transition
      represents not just a technological shift but a fundamental reimagining of
      how societies produce and consume energy. Success will require coordinated
      efforts across sectors, from government and industry to research
      institutions and individual consumers. By embracing innovation while
      ensuring just transitions for communities historically dependent on fossil
      fuel industries, the world can move toward an energy future that is not
      only sustainable but equitable and prosperous.
    </p>
  </>;
export default Reading;