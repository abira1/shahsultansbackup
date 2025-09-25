import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import Button from '../components/ui/Button';
interface Teacher {
  id: number;
  name: string;
  image: string;
  qualification: string;
  specialization: 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'All Skills';
  experience: number;
  bio: string;
  achievements: string[];
  email: string;
}
const teachers: Teacher[] = [{
  id: 1,
  name: 'Dr. Sarah Johnson',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  qualification: 'PhD in English Literature, Cambridge University',
  specialization: 'Writing',
  experience: 12,
  bio: 'Dr. Sarah Johnson has been teaching IELTS for over 12 years, specializing in academic writing. She completed her PhD at Cambridge University, focusing on English language pedagogy. Her teaching approach emphasizes practical writing techniques and error correction methodologies that have helped students achieve band scores of 7.5 and above.',
  achievements: ["Published author of 'Mastering IELTS Writing Task 2'", 'Trained over 2,000 successful IELTS candidates', 'Former IELTS examiner (2010-2015)', 'Presented at TESOL International Conference 2019'],
  email: 'sarah.johnson@shahsultanielts.com'
}, {
  id: 2,
  name: 'Prof. Michael Chen',
  image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  qualification: 'MA TESOL, University of Manchester',
  specialization: 'Speaking',
  experience: 10,
  bio: 'Professor Michael Chen specializes in IELTS speaking preparation, with particular expertise in helping students overcome anxiety and pronunciation difficulties. With an MA in TESOL from the University of Manchester, he has developed innovative techniques for improving fluency and coherence in spoken English.',
  achievements: ["Created the 'Speak with Confidence' IELTS methodology", 'Conducted over 5,000 mock speaking tests', 'Fluent in English, Mandarin, and Cantonese', '98% success rate for students targeting band 6.5+'],
  email: 'michael.chen@shahsultanielts.com'
}, {
  id: 3,
  name: 'Emma Rodriguez',
  image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  qualification: 'BA in English, CELTA, DELTA',
  specialization: 'Listening',
  experience: 8,
  bio: 'Emma Rodriguez is our listening skills specialist with 8 years of dedicated IELTS teaching experience. Her background in audio engineering combined with her CELTA and DELTA qualifications gives her a unique approach to teaching listening skills. Emma focuses on helping students develop effective note-taking techniques and recognition of signpost language.',
  achievements: ['Developed custom listening materials for different accents', 'Specializes in helping students with hearing impairments', "Created the academy's listening lab program", 'Average student improvement of 1.5 bands in listening'],
  email: 'emma.rodriguez@shahsultanielts.com'
}, {
  id: 4,
  name: 'Dr. Rajiv Patel',
  image: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  qualification: 'PhD in Linguistics, Oxford University',
  specialization: 'Reading',
  experience: 15,
  bio: 'Dr. Rajiv Patel has 15 years of experience teaching IELTS reading skills. With a PhD in Linguistics from Oxford University, he has developed strategic approaches to tackling complex reading passages and identifying key information efficiently. His methods focus on skimming, scanning, and paragraph analysis techniques.',
  achievements: ["Author of 'Strategic Reading for IELTS Success'", 'Former curriculum developer for British Council', 'Reading comprehension specialist for international exams', 'Has trained over 50 IELTS teachers in reading methodology'],
  email: 'rajiv.patel@shahsultanielts.com'
}, {
  id: 5,
  name: 'Olivia Thompson',
  image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  qualification: 'MA in Applied Linguistics, University of Edinburgh',
  specialization: 'All Skills',
  experience: 9,
  bio: 'Olivia Thompson is our all-rounder IELTS trainer with 9 years of experience. Her MA in Applied Linguistics from the University of Edinburgh has equipped her with deep knowledge of language acquisition principles. She specializes in integrated skills teaching and test strategies for all sections of the IELTS exam.',
  achievements: ["Designed our 'IELTS Fast Track' intensive course", 'Certified language coach for diplomatic services', 'Regular contributor to IELTS preparation blogs', 'Specializes in one-on-one coaching for high-stakes test takers'],
  email: 'olivia.thompson@shahsultanielts.com'
}, {
  id: 6,
  name: 'Ahmad Al-Farsi',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
  qualification: 'BA in English Literature, CELTA, TESOL',
  specialization: 'Writing',
  experience: 7,
  bio: 'Ahmad Al-Farsi specializes in IELTS writing, with particular focus on Task 1 data interpretation and Task 2 essay structure. With CELTA and TESOL qualifications complementing his BA in English Literature, Ahmad employs a systematic approach to teaching writing that breaks down complex tasks into manageable components.',
  achievements: ["Created the academy's writing assessment rubric", 'Specializes in technical and academic vocabulary development', "Developed the 'Write Right' methodology for Task 2 essays", 'Has reviewed over 10,000 student essays'],
  email: 'ahmad.alfarsi@shahsultanielts.com'
}];
const TeachersPage: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };
  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  return <div className="bg-secondary min-h-screen">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our Expert IELTS Trainers
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Our team of highly qualified instructors is dedicated to helping you
            achieve your target IELTS score. Each teacher specializes in
            specific sections of the exam to provide you with targeted guidance.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {teachers.map(teacher => <div key={teacher.id} className="bg-white rounded-md border-2 border-primary shadow-[3px_3px_0px_0px_rgba(10,42,102,0.8)] overflow-hidden transition-all duration-300 hover:shadow-[5px_5px_0px_0px_rgba(198,165,69,0.8)] hover:-translate-y-1 hover:border-accent cursor-pointer" onClick={() => openModal(teacher)} onKeyDown={e => handleKeyDown(e, () => openModal(teacher))} tabIndex={0} role="button" aria-label={`View profile of ${teacher.name}, ${teacher.specialization} specialist`}>
              <div className="h-40 overflow-hidden">
                <img src={teacher.image} alt={`${teacher.name}, IELTS ${teacher.specialization} Trainer`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-3">
                <h2 className="text-sm font-semibold mb-1 truncate">
                  {teacher.name}
                </h2>
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                    {teacher.specialization}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
        {/* Teacher Details Modal */}
        {isModalOpen && selectedTeacher && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} role="dialog" aria-labelledby="modal-title" aria-modal="true">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-auto">
                  <img src={selectedTeacher.image} alt={`${selectedTeacher.name}, IELTS ${selectedTeacher.specialization} Trainer`} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 id="modal-title" className="text-2xl font-bold mb-1">
                        {selectedTeacher.name}
                      </h2>
                      <p className="text-accent font-medium mb-1">
                        {selectedTeacher.specialization} Specialist
                      </p>
                      <p className="text-text-secondary text-sm mb-4">
                        {selectedTeacher.qualification}
                      </p>
                    </div>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-md" aria-label="Close modal">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Biography</h3>
                    <p className="text-text-secondary">{selectedTeacher.bio}</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Key Achievements
                    </h3>
                    <ul className="list-disc list-inside text-text-secondary space-y-1">
                      {selectedTeacher.achievements.map((achievement, index) => <li key={index}>{achievement}</li>)}
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="primary" href={`mailto:${selectedTeacher.email}`} className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact {selectedTeacher.name.split(' ')[0]}
                    </Button>
                    <Button variant="outline" onClick={closeModal}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default TeachersPage;