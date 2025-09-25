import React, { useEffect, createElement } from 'react';
import { CheckCircle, Calendar, Clock, Download, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
const Confirmation: React.FC = () => {
  // Simulate toast notification
  useEffect(() => {
    // This would be replaced with an actual toast notification library
    const notificationElement = document.getElementById('success-notification');
    if (notificationElement) {
      notificationElement.style.display = 'flex';
      setTimeout(() => {
        notificationElement.style.opacity = '1';
        // Announce success message for screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = 'Your exam has been submitted successfully!';
        document.body.appendChild(announcer);
        setTimeout(() => {
          notificationElement.style.opacity = '0';
          setTimeout(() => {
            notificationElement.style.display = 'none';
            document.body.removeChild(announcer);
          }, 500);
        }, 5000);
      }, 100);
    }
  }, []);
  return <div className="container max-w-2xl mx-auto py-8 md:py-16 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-white text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Exam Completed</h1>
          <p className="text-white/80 mt-2">
            Thank you for completing your IELTS mock test
          </p>
        </div>
        <div className="p-6 md:p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Your exam has been submitted successfully!
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Your responses have been recorded and will be evaluated by our
            teachers. You'll receive your results within 48 hours.
          </p>
          <div className="bg-secondary p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-text-tertiary mb-1">Test Date</p>
                  <p className="font-medium">June 15, 2023</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-text-tertiary mb-1">
                    Completion Time
                  </p>
                  <p className="font-medium">1:45 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <Download className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-text-tertiary mb-1">
                    Reference ID
                  </p>
                  <p className="font-medium">MT23061500123</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-text-tertiary mb-1">Status</p>
                  <p className="font-medium text-success">Completed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="p-4 border border-primary/10 bg-primary/5 rounded-lg text-left">
              <h3 className="font-semibold mb-2 flex items-center">
                <ArrowRight className="h-5 w-5 text-primary mr-2" />
                What happens next?
              </h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <span className="text-accent mr-2">1.</span>
                  <span>Our expert teachers will evaluate your responses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">2.</span>
                  <span>You'll receive detailed feedback on each section</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">3.</span>
                  <span>Your results will be available within 48 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">4.</span>
                  <span>
                    You'll be notified by email when results are ready
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" to="/dashboard" className="flex-1 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 mr-2" />
              Return to Dashboard
            </Button>
            <Button variant="primary" to="/dashboard/results" className="flex-1">
              View Previous Results
            </Button>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      <div id="success-notification" className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border-l-4 border-success p-4 flex items-start max-w-md w-full opacity-0 transition-opacity duration-500 hidden" style={{
      zIndex: 9999
    }} role="alert" aria-live="polite">
        <CheckCircle className="h-6 w-6 text-success mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-success">Success!</p>
          <p className="text-sm text-text-secondary mt-1">
            Your exam has been submitted successfully.
          </p>
        </div>
      </div>
    </div>;
};
export default Confirmation;