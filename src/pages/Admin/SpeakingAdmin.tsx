import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SpeakingTracks } from '../../components/admin/speaking/SpeakingTracks';
import { CreateSpeakingTrack } from '../../components/admin/speaking/CreateSpeakingTrack';

const SpeakingAdmin: React.FC = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<SpeakingTracks />} />
        <Route path="/create" element={<CreateSpeakingTrack />} />
        <Route path="/create/:trackId" element={<CreateSpeakingTrack />} />
      </Routes>
    </div>
  );
};

export default SpeakingAdmin;