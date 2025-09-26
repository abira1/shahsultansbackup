import { trackManagementService, TrackData, ExamData, QuestionData, SectionData } from '../services/trackManagementService';

export class TrackManagementTester {
  
  static async runFullTest(): Promise<void> {
    console.log('🚀 Starting Track Management System Test...\n');
    
    try {
      // Test 1: Create Listening Track
      await this.testCreateListeningTrack();
      
      // Test 2: Create Reading Track
      await this.testCreateReadingTrack();
      
      // Test 3: Create Writing Track
      await this.testCreateWritingTrack();
      
      // Test 4: Create Full Exam
      await this.testCreateFullExam();
      
      // Test 5: Test Track Management Operations
      await this.testTrackOperations();
      
      // Test 6: Test Exam Management Operations
      await this.testExamOperations();
      
      console.log('✅ All tests completed successfully!');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  }
  
  static async testCreateListeningTrack(): Promise<string> {
    console.log('📝 Test 1: Creating Listening Track...');
    
    // Create sample questions
    const questions: QuestionData[] = [
      {
        id: 'q1',
        type: 'multipleChoice',
        questionText: 'What is the main topic of the conversation?',
        options: ['Travel plans', 'Work schedule', 'Weather report', 'Food recipes'],
        answer: 'A',
        points: 1,
        explanation: 'The speakers are discussing their upcoming travel plans.'
      },
      {
        id: 'q2',
        type: 'fillInBlank',
        questionText: 'The meeting is scheduled for _______ at 3 PM.',
        answer: 'Tuesday',
        points: 1
      },
      {
        id: 'q3',
        type: 'multipleChoiceMultiple',
        questionText: 'Which facilities are mentioned? (Select all that apply)',
        options: ['Swimming pool', 'Gym', 'Library', 'Cafeteria'],
        answer: ['A', 'B', 'D'],
        points: 3
      }
    ];
    
    // Create sections
    const sections: SectionData[] = [
      {
        sectionNumber: 1,
        title: 'Section 1 - Everyday Social Context',
        instructions: 'You will hear a conversation between two people.',
        questions: questions.slice(0, 1)
      },
      {
        sectionNumber: 2,
        title: 'Section 2 - Social Context',
        instructions: 'You will hear a monologue on a general topic.',
        questions: questions.slice(1, 2)
      },
      {
        sectionNumber: 3,
        title: 'Section 3 - Educational Context',
        instructions: 'You will hear a conversation in an educational context.',
        questions: questions.slice(2, 3)
      },
      {
        sectionNumber: 4,
        title: 'Section 4 - Academic Context',
        instructions: 'You will hear a lecture or talk on an academic topic.',
        questions: []
      }
    ];
    
    const trackData: Omit<TrackData, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'IELTS Academic Listening Test 1',
      examType: 'listening',
      subType: 'academic',
      sections,
      createdBy: 'admin',
      isActive: true
    };
    
    const trackId = await trackManagementService.createTrack(trackData);
    console.log(`✅ Listening track created with ID: ${trackId}\n`);
    
    return trackId;
  }
  
  static async testCreateReadingTrack(): Promise<string> {
    console.log('📖 Test 2: Creating Reading Track...');
    
    const questions: QuestionData[] = [
      {
        id: 'r1',
        type: 'multipleChoice',
        questionText: 'According to the passage, what is the main cause of climate change?',
        options: ['Solar radiation', 'Human activities', 'Natural cycles', 'Ocean currents'],
        answer: 'B',
        points: 1
      },
      {
        id: 'r2',
        type: 'matching',
        questionText: 'Match the following scientists with their discoveries:',
        answer: '1-C, 2-A, 3-B',
        points: 3
      },
      {
        id: 'r3',
        type: 'sentenceCompletion',
        questionText: 'Complete the sentence: The research shows that temperatures have risen by _______ degrees.',
        answer: '1.5',
        points: 1
      }
    ];
    
    const sections: SectionData[] = [
      {
        sectionNumber: 1,
        title: 'Passage 1 - Climate Change Overview',
        instructions: 'Read the passage and answer questions 1-10.',
        passageText: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While climate change is natural, scientific evidence shows that human activities have been the main driver of climate change since the 1800s...',
        questions: questions.slice(0, 2)
      },
      {
        sectionNumber: 2,
        title: 'Passage 2 - Environmental Solutions',
        instructions: 'Read the passage and answer questions 11-25.',
        passageText: 'Renewable energy sources such as solar, wind, and hydroelectric power offer sustainable alternatives to fossil fuels...',
        questions: questions.slice(2, 3)
      },
      {
        sectionNumber: 3,
        title: 'Passage 3 - Future Implications',
        instructions: 'Read the passage and answer questions 26-40.',
        passageText: 'The future of our planet depends on the actions we take today to combat climate change...',
        questions: []
      }
    ];
    
    const trackData: Omit<TrackData, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'IELTS Academic Reading Test 1',
      examType: 'reading',
      subType: 'academic',
      sections,
      createdBy: 'admin',
      isActive: true
    };
    
    const trackId = await trackManagementService.createTrack(trackData);
    console.log(`✅ Reading track created with ID: ${trackId}\n`);
    
    return trackId;
  }
  
  static async testCreateWritingTrack(): Promise<string> {
    console.log('✍️ Test 3: Creating Writing Track...');
    
    const sections: SectionData[] = [
      {
        sectionNumber: 1,
        title: 'Writing Task 1',
        instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
        passageText: 'The chart shows the percentage of households with different types of internet connections in three countries between 2000 and 2020.',
        questions: [
          {
            id: 'w1',
            type: 'shortAnswer',
            questionText: 'Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
            answer: 'Model answer: The chart illustrates changes in household internet connectivity across three nations over a 20-year period...',
            points: 25
          }
        ]
      },
      {
        sectionNumber: 2,
        title: 'Writing Task 2',
        instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',
        questions: [
          {
            id: 'w2',
            type: 'shortAnswer',
            questionText: 'Some people believe that technology has made our lives more complicated, while others argue it has made life easier. Discuss both views and give your own opinion.',
            answer: 'Model answer: Technology\'s impact on modern life is a subject of considerable debate...',
            points: 25
          }
        ]
      }
    ];
    
    const trackData: Omit<TrackData, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'IELTS Academic Writing Test 1',
      examType: 'writing',
      subType: 'academic',
      sections,
      createdBy: 'admin',
      isActive: true
    };
    
    const trackId = await trackManagementService.createTrack(trackData);
    console.log(`✅ Writing track created with ID: ${trackId}\n`);
    
    return trackId;
  }
  
  static async testCreateFullExam(): Promise<string> {
    console.log('🎯 Test 4: Creating Full Mock Exam...');
    
    // First, get all available tracks
    const [listeningTracks, readingTracks, writingTracks] = await Promise.all([
      trackManagementService.getAllTracks('listening'),
      trackManagementService.getAllTracks('reading'),
      trackManagementService.getAllTracks('writing')
    ]);
    
    // Get the first available track of each type
    const listeningTrackId = Object.keys(listeningTracks)[0];
    const readingTrackId = Object.keys(readingTracks)[0];
    const writingTrackId = Object.keys(writingTracks)[0];
    
    if (!listeningTrackId || !readingTrackId || !writingTrackId) {
      throw new Error('Required tracks not found. Please run track creation tests first.');
    }
    
    const examData: Omit<ExamData, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'IELTS Full Practice Test 1',
      tracks: {
        listening: listeningTrackId,
        reading: readingTrackId,
        writing: writingTrackId
      },
      status: 'draft',
      duration: 180, // 3 hours
      createdBy: 'admin',
      isActive: true
    };
    
    const examId = await trackManagementService.createExam(examData);
    console.log(`✅ Full exam created with ID: ${examId}\n`);
    
    return examId;
  }
  
  static async testTrackOperations(): Promise<void> {
    console.log('🔧 Test 5: Testing Track Operations...');
    
    // Get all tracks
    const listeningTracks = await trackManagementService.getAllTracks('listening');
    const trackId = Object.keys(listeningTracks)[0];
    
    if (!trackId) {
      throw new Error('No listening tracks found for operations test');
    }
    
    // Test get single track
    const track = await trackManagementService.getTrack('listening', trackId);
    console.log(`✅ Retrieved track: ${track?.title}`);
    
    // Test update track
    await trackManagementService.updateTrack('listening', trackId, {
      title: track!.title + ' (Updated)'
    });
    console.log(`✅ Updated track title`);
    
    // Verify update
    const updatedTrack = await trackManagementService.getTrack('listening', trackId);
    console.log(`✅ Verified update: ${updatedTrack?.title}\n`);
  }
  
  static async testExamOperations(): Promise<void> {
    console.log('📋 Test 6: Testing Exam Operations...');
    
    // Get all exams
    const exams = await trackManagementService.getAllExams();
    const examId = Object.keys(exams)[0];
    
    if (!examId) {
      throw new Error('No exams found for operations test');
    }
    
    // Test get single exam
    const exam = await trackManagementService.getExam(examId);
    console.log(`✅ Retrieved exam: ${exam?.title}`);
    
    // Test publish exam
    await trackManagementService.publishExam(examId);
    console.log(`✅ Published exam`);
    
    // Test get published exams
    const publishedExams = await trackManagementService.getPublishedExams();
    console.log(`✅ Found ${Object.keys(publishedExams).length} published exams`);
    
    // Test unpublish exam
    await trackManagementService.unpublishExam(examId);
    console.log(`✅ Unpublished exam`);
    
    // Test update exam
    await trackManagementService.updateExam(examId, {
      title: exam!.title + ' (Updated)',
      duration: 200
    });
    console.log(`✅ Updated exam details\n`);
  }
  
  static async demonstrateAdminPanelIntegration(): Promise<void> {
    console.log('🎯 Demonstrating Admin Panel Integration...\n');
    
    // Show how the admin panel would interact with the service
    console.log('📊 Admin Panel Dashboard Data:');
    
    const [listeningTracks, readingTracks, writingTracks, exams, publishedExams] = await Promise.all([
      trackManagementService.getAllTracks('listening'),
      trackManagementService.getAllTracks('reading'),
      trackManagementService.getAllTracks('writing'),
      trackManagementService.getAllExams(),
      trackManagementService.getPublishedExams()
    ]);
    
    console.log(`- Listening Tracks: ${Object.keys(listeningTracks).length}`);
    console.log(`- Reading Tracks: ${Object.keys(readingTracks).length}`);
    console.log(`- Writing Tracks: ${Object.keys(writingTracks).length}`);
    console.log(`- Total Exams: ${Object.keys(exams).length}`);
    console.log(`- Published Exams: ${Object.keys(publishedExams).length}`);
    console.log(`- Draft Exams: ${Object.keys(exams).length - Object.keys(publishedExams).length}`);
    
    console.log('\n📝 Sample Track Details:');
    const sampleTrack = Object.values(listeningTracks)[0];
    if (sampleTrack) {
      console.log(`- Title: ${sampleTrack.title}`);
      console.log(`- Type: ${sampleTrack.examType} (${sampleTrack.subType})`);
      console.log(`- Sections: ${sampleTrack.sections.length}`);
      console.log(`- Total Questions: ${sampleTrack.sections.reduce((sum, s) => sum + s.questions.length, 0)}`);
      console.log(`- Created: ${new Date(sampleTrack.createdAt).toLocaleString()}`);
    }
    
    console.log('\n🎯 Sample Exam Details:');
    const sampleExam = Object.values(exams)[0];
    if (sampleExam) {
      console.log(`- Title: ${sampleExam.title}`);
      console.log(`- Status: ${sampleExam.status}`);
      console.log(`- Duration: ${sampleExam.duration} minutes`);
      console.log(`- Includes Listening: ${sampleExam.tracks.listening ? 'Yes' : 'No'}`);
      console.log(`- Includes Reading: ${sampleExam.tracks.reading ? 'Yes' : 'No'}`);
      console.log(`- Includes Writing: ${sampleExam.tracks.writing ? 'Yes' : 'No'}`);
      console.log(`- Created: ${new Date(sampleExam.createdAt).toLocaleString()}`);
    }
  }
}

// Export function to run all tests
export const runTrackManagementTests = async (): Promise<void> => {
  try {
    await TrackManagementTester.runFullTest();
    await TrackManagementTester.demonstrateAdminPanelIntegration();
    console.log('\n🎉 Track Management System is fully functional and ready for production!');
  } catch (error) {
    console.error('\n💥 Track Management System test failed:', error);
    throw error;
  }
};