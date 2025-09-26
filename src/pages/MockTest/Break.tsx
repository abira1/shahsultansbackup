import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
interface BreakProps {
  nextSection: string;
  onComplete: () => void;
  duration: number; // in seconds
}
const Break: React.FC<BreakProps> = ({
  nextSection,
  onComplete,
  duration
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isResting, setIsResting] = useState(true);
  useEffect(() => {
    if (!isResting) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isResting, onComplete]);
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Calculate progress percentage
  const progressPercentage = (duration - timeLeft) / duration * 100;
  return <div className="container max-w-2xl mx-auto py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Break Time
        </h1>
        <div className="mb-8 text-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative h-40 w-40 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#0a2a66" strokeWidth="8" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={283 - 283 * progressPercentage / 100} transform="rotate(-90 50 50)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl font-bold">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
            <Clock className="h-6 w-6 text-primary mb-2" />
            <h2 className="text-xl font-semibold mb-2">
              Next Section: {nextSection}
            </h2>
            <p className="text-text-secondary mb-6">
              Take a short break before continuing to the next section of your
              IELTS mock test.
            </p>
          </div>
          <div className="bg-secondary p-6 rounded-lg mb-8">
            <h3 className="font-semibold mb-4">
              Tips for the {nextSection} Section
            </h3>
            {nextSection === 'Reading' && <ul className="space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    Skim the passage first to get a general understanding
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    Read the questions carefully before looking for answers
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Pay attention to keywords and synonyms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    Manage your time - spend about 20 minutes per passage
                  </span>
                </li>
              </ul>}
            {nextSection === 'Writing' && <ul className="space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Plan your essay before you start writing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>For Task 1, include an overview paragraph</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    For Task 2, clearly state your position in the introduction
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Proofread your work in the last few minutes</span>
                </li>
              </ul>}
            {nextSection === 'Speaking' && <ul className="space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Speak clearly and at a natural pace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    Use a range of vocabulary and grammatical structures
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    Develop your answers with examples and explanations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    Don't worry about small mistakes - fluency is important
                  </span>
                </li>
              </ul>}
          </div>
          <div className="flex flex-col space-y-4">
            <Button variant="primary" onClick={onComplete}>
              Skip Break & Start {nextSection} Now
            </Button>
            <p className="text-sm text-text-tertiary">
              You will be automatically redirected when the timer ends
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Break;