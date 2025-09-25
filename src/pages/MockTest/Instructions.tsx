import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Headphones, Monitor, Wifi } from 'lucide-react';
import Button from '../../components/ui/Button';
interface InstructionsProps {
  onStart: () => void;
}
const Instructions: React.FC<InstructionsProps> = ({
  onStart
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [systemChecked, setSystemChecked] = useState(false);
  const [systemCheckStatus, setSystemCheckStatus] = useState<{
    internet: boolean | null;
    audio: boolean | null;
    browser: boolean | null;
  }>({
    internet: null,
    audio: null,
    browser: null
  });
  const runSystemCheck = () => {
    // Simulate system check
    setSystemCheckStatus({
      internet: null,
      audio: null,
      browser: null
    });
    // Check internet
    setTimeout(() => {
      setSystemCheckStatus(prev => ({
        ...prev,
        internet: true
      }));
      // Check audio
      setTimeout(() => {
        setSystemCheckStatus(prev => ({
          ...prev,
          audio: true
        }));
        // Check browser
        setTimeout(() => {
          setSystemCheckStatus(prev => ({
            ...prev,
            browser: true
          }));
          setSystemChecked(true);
        }, 1000);
      }, 1000);
    }, 1000);
  };
  return <div className="container max-w-4xl mx-auto py-8 md:py-16 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            IELTS Mock Test Instructions
          </h1>
          <p className="text-center mt-2 text-white/80">
            Please read all instructions carefully before starting
          </p>
        </div>
        <div className="p-6 md:p-8">
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-text-secondary">
                This mock test simulates the real IELTS exam conditions and will
                help you prepare for the actual test. Your responses will be
                evaluated by our teachers, and you will receive detailed
                feedback within 48 hours.
              </p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center mr-2">
                1
              </span>
              Test Format
            </h2>
            <p className="mb-4 text-text-secondary">
              This mock test consists of four sections: Listening, Reading,
              Writing, and Speaking. You will need to complete each section in
              the given time limit.
            </p>
            <div className="space-y-4 mb-6">
              <div className="bg-secondary p-4 rounded-lg border-l-4 border-accent">
                <h3 className="font-semibold mb-2">Listening (30 minutes)</h3>
                <p className="text-text-secondary">
                  You will listen to four recordings and answer questions for
                  each. The audio will be played only once. After the listening
                  section, you will have 10 minutes to transfer your answers to
                  the answer sheet.
                </p>
              </div>
              <div className="bg-secondary p-4 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold mb-2">Reading (60 minutes)</h3>
                <p className="text-text-secondary">
                  You will be presented with three reading passages and answer
                  40 questions. You must complete this section within the time
                  limit.
                </p>
              </div>
              <div className="bg-secondary p-4 rounded-lg border-l-4 border-accent">
                <h3 className="font-semibold mb-2">Writing (60 minutes)</h3>
                <p className="text-text-secondary">
                  You will complete two writing tasks:
                </p>
                <ul className="list-disc list-inside text-text-secondary ml-4 space-y-1 mt-2">
                  <li>
                    Task 1 (20 minutes): Describe a graph, chart, or diagram
                  </li>
                  <li>
                    Task 2 (40 minutes): Write an essay in response to a prompt
                  </li>
                </ul>
              </div>
              <div className="bg-secondary p-4 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold mb-2">Speaking (11-14 minutes)</h3>
                <p className="text-text-secondary">
                  You will join a video call with an examiner who will assess
                  your speaking skills through a series of questions and tasks.
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center mr-2">
                2
              </span>
              Important Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  Each section has a specific time limit and will automatically
                  submit when time expires.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  You will have short breaks between sections.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  For the speaking section, ensure your camera and microphone
                  are working properly.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  Do not use any external resources or assistance during the
                  test.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  Copy-paste functionality will be disabled during the test.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  Your responses will be evaluated by our teachers within 48
                  hours.
                </span>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="inline-block w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center mr-2">
                3
              </span>
              System Check
            </h2>
            <p className="mb-4 text-text-secondary">
              Please run a system check to ensure your device meets the
              requirements for the test.
            </p>
            <div className="bg-secondary p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-md bg-white">
                  <Wifi className="h-8 w-8 mb-2 text-primary" />
                  <p className="font-medium mb-1">Internet Connection</p>
                  <p className="text-sm text-text-secondary mb-3">
                    Stable connection required
                  </p>
                  {systemCheckStatus.internet === null ? <span className="text-text-tertiary text-sm">
                      Not checked
                    </span> : systemCheckStatus.internet ? <span className="text-success font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Passed
                    </span> : <span className="text-error font-medium flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Failed
                    </span>}
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-md bg-white">
                  <Headphones className="h-8 w-8 mb-2 text-primary" />
                  <p className="font-medium mb-1">Audio System</p>
                  <p className="text-sm text-text-secondary mb-3">
                    Headphones recommended
                  </p>
                  {systemCheckStatus.audio === null ? <span className="text-text-tertiary text-sm">
                      Not checked
                    </span> : systemCheckStatus.audio ? <span className="text-success font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Passed
                    </span> : <span className="text-error font-medium flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Failed
                    </span>}
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-md bg-white">
                  <Monitor className="h-8 w-8 mb-2 text-primary" />
                  <p className="font-medium mb-1">Browser Compatibility</p>
                  <p className="text-sm text-text-secondary mb-3">
                    Chrome/Firefox recommended
                  </p>
                  {systemCheckStatus.browser === null ? <span className="text-text-tertiary text-sm">
                      Not checked
                    </span> : systemCheckStatus.browser ? <span className="text-success font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Passed
                    </span> : <span className="text-error font-medium flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Failed
                    </span>}
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={runSystemCheck} disabled={Object.values(systemCheckStatus).every(val => val === true)}>
                  {Object.values(systemCheckStatus).every(val => val === true) ? 'All Checks Passed' : 'Run System Check'}
                </Button>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex items-start p-4 bg-secondary rounded-lg">
              <input type="checkbox" id="agreeTerms" className="h-5 w-5 text-primary rounded mt-0.5" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} />
              <label htmlFor="agreeTerms" className="ml-2 text-text-secondary">
                I have read and understood the instructions. I agree to follow
                the rules and complete the test under exam conditions. I
                understand that my responses will be evaluated by the academy's
                teachers.
              </label>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="outline" to="/dashboard/mock-tests">
              Return to Dashboard
            </Button>
            <Button variant="primary" onClick={onStart} disabled={!agreedToTerms || !systemChecked} className="px-8">
              Start Mock Test
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Instructions;