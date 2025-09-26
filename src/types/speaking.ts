// IELTS Speaking Test System Types

export interface SpeakingPart1 {
  introduction: string; // General introduction prompt
  topics: SpeakingTopic[]; // 3-4 familiar topics
  duration: number; // Usually 4-5 minutes
}

export interface SpeakingPart2 {
  taskCard: string; // Long-turn task card
  preparationTime: number; // Usually 1 minute
  speakingTime: number; // Usually 1-2 minutes
  followUpQuestions?: string[]; // Optional follow-up questions
}

export interface SpeakingPart3 {
  discussion: string; // Main discussion topic
  questions: string[]; // Abstract discussion questions
  duration: number; // Usually 4-5 minutes
}

export interface SpeakingTopic {
  id: string;
  title: string;
  questions: string[]; // 3-4 questions per topic
}

export interface SpeakingTrack {
  id: string;
  title: string;
  description?: string;
  testType: 'academic' | 'general'; // IELTS test type
  createdAt: number;
  updatedAt?: number;
  createdBy: string; // Admin user ID
  isPublished: boolean;
  tags?: string[];
  
  // Three parts of IELTS Speaking
  part1: SpeakingPart1;
  part2: SpeakingPart2;
  part3: SpeakingPart3;
  
  // Total duration
  totalDuration: number; // Usually 11-14 minutes
}

export interface SpeakingTrackSummary {
  id: string;
  title: string;
  testType: 'academic' | 'general';
  isPublished: boolean;
  createdAt: number;
  totalDuration: number;
  part1TopicsCount: number;
  part2HasTask: boolean;
  part3QuestionsCount: number;
  tags?: string[];
}

export interface SpeakingTrackFormData {
  title: string;
  description?: string;
  testType: 'academic' | 'general';
  tags?: string[];
}

export interface SpeakingPart1FormData {
  introduction: string;
  topics: {
    title: string;
    questions: string[];
  }[];
  duration: number;
}

export interface SpeakingPart2FormData {
  taskCard: string;
  preparationTime: number;
  speakingTime: number;
  followUpQuestions?: string[];
}

export interface SpeakingPart3FormData {
  discussion: string;
  questions: string[];
  duration: number;
}

// Common Speaking Topics for Part 1
export const COMMON_PART1_TOPICS = [
  { value: 'hometown', label: 'Hometown', questions: [
    'Where do you come from?',
    'What do you like about your hometown?',
    'How has your town changed over the years?',
    'What would you like to change about your hometown?'
  ]},
  { value: 'work_study', label: 'Work/Study', questions: [
    'Do you work or are you a student?',
    'What do you do for work?',
    'Do you enjoy your job?',
    'What are your plans for the future?'
  ]},
  { value: 'family', label: 'Family', questions: [
    'Tell me about your family',
    'Who are you closest to in your family?',
    'Do you prefer spending time with family or friends?',
    'Are people in your country generally close to their families?'
  ]},
  { value: 'hobbies', label: 'Hobbies & Interests', questions: [
    'What do you like to do in your free time?',
    'How did you become interested in this hobby?',
    'Do you think hobbies are important?',
    'What hobbies are popular in your country?'
  ]},
  { value: 'food', label: 'Food & Cooking', questions: [
    'What is your favorite food?',
    'Do you like to cook?',
    'What is a popular food in your country?',
    'Do you prefer eating at home or in restaurants?'
  ]},
  { value: 'technology', label: 'Technology', questions: [
    'Do you use technology a lot?',
    'What technology do you find most useful?',
    'How has technology changed your life?',
    'Do you think technology makes life easier?'
  ]}
];

// Sample Part 2 Task Cards
export const SAMPLE_PART2_TASKS = [
  {
    title: 'Describe a person you admire',
    taskCard: `Describe a person you admire.
    
You should say:
• Who this person is
• How you know this person
• What this person has done
• And explain why you admire this person`
  },
  {
    title: 'Describe a place you would like to visit',
    taskCard: `Describe a place you would like to visit.
    
You should say:
• Where this place is
• How you know about this place
• What you would do there
• And explain why you want to visit this place`
  },
  {
    title: 'Describe a memorable event',
    taskCard: `Describe a memorable event in your life.
    
You should say:
• What the event was
• When it happened
• Who was involved
• And explain why it was memorable`
  }
];

// Part 3 Discussion Topics
export const SAMPLE_PART3_TOPICS = [
  {
    title: 'Education',
    questions: [
      'How has education changed in your country?',
      'What role should technology play in education?',
      'Do you think higher education is necessary for success?',
      'How can education systems be improved?'
    ]
  },
  {
    title: 'Environment',
    questions: [
      'What are the main environmental problems in your country?',
      'What can individuals do to protect the environment?',
      'Should governments prioritize economic growth or environmental protection?',
      'How might climate change affect future generations?'
    ]
  },
  {
    title: 'Technology and Society',
    questions: [
      'How has technology changed the way people communicate?',
      'What are the advantages and disadvantages of social media?',
      'Do you think artificial intelligence will replace human jobs?',
      'How can society ensure technology is used responsibly?'
    ]
  }
];

// For exam creation - selecting existing tracks
export interface ExamSpeakingComponent {
  trackId: string;
  trackTitle: string;
  testType: 'academic' | 'general';
  totalDuration: number;
}

export interface SpeakingSubmission {
  id: string;
  trackId: string;
  studentId: string;
  recordings: {
    part1: string[]; // Audio file URLs for each topic
    part2: {
      preparation?: string; // Optional preparation recording
      mainTask: string; // Main 2-minute task
      followUp?: string[]; // Follow-up question responses
    };
    part3: string[]; // Audio file URLs for each question
  };
  submittedAt: number;
  timeSpent: number; // in minutes
  status: 'draft' | 'submitted';
  scores?: {
    fluency: number;
    lexical: number;
    grammar: number;
    pronunciation: number;
    overall: number;
  };
}