import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Instructions from './Instructions';
import Listening from './Listening';
import Reading from './Reading';
import Writing from './Writing';
import Speaking from './Speaking';
import Confirmation from './Confirmation';
import Break from './Break';
const MockTest: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('instructions');
  const startTest = () => {
    setCurrentSection('listening');
    navigate('/mock-test/listening');
  };
  const completeListening = () => {
    setCurrentSection('break-1');
    navigate('/mock-test/break/1');
  };
  const startReading = () => {
    setCurrentSection('reading');
    navigate('/mock-test/reading');
  };
  const completeReading = () => {
    setCurrentSection('break-2');
    navigate('/mock-test/break/2');
  };
  const startWriting = () => {
    setCurrentSection('writing');
    navigate('/mock-test/writing');
  };
  const completeWriting = () => {
    setCurrentSection('break-3');
    navigate('/mock-test/break/3');
  };
  const startSpeaking = () => {
    setCurrentSection('speaking');
    navigate('/mock-test/speaking');
  };
  const completeTest = () => {
    setCurrentSection('confirmation');
    navigate('/mock-test/confirmation');
  };
  return <div className="min-h-screen bg-secondary">
      <Routes>
        <Route path="/" element={<Instructions onStart={startTest} />} />
        <Route path="/listening" element={<Listening onComplete={completeListening} />} />
        <Route path="/break/1" element={<Break nextSection="Reading" onComplete={startReading} duration={120} />} />
        <Route path="/reading" element={<Reading onComplete={completeReading} />} />
        <Route path="/break/2" element={<Break nextSection="Writing" onComplete={startWriting} duration={120} />} />
        <Route path="/writing" element={<Writing onComplete={completeWriting} />} />
        <Route path="/break/3" element={<Break nextSection="Speaking" onComplete={startSpeaking} duration={120} />} />
        <Route path="/speaking" element={<Speaking onComplete={completeTest} />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </div>;
};
export default MockTest;