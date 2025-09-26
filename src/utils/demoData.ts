// Demo data initialization for Shah Sultan's IELTS Academy
import { customizationService } from '../services/customizationService';
// import { trackManagementService } from '../services/trackManagementService';

export const initializeDemoData = async () => {
  console.log('🚀 Initializing demo data...');

  try {
    // Initialize Hero Data
    await customizationService.updateHeroData({
      title: "Shah Sultan's IELTS Academy",
      subtitle: "Your path to IELTS success starts here with expert guidance and comprehensive preparation"
    });
    console.log('✅ Hero data initialized');

    // Initialize Sample Teachers
    const sampleTeachers = [
      {
        name: "Dr. Sarah Johnson",
        bio: "IELTS expert with 10+ years of teaching experience. Specialized in Academic Writing and Speaking preparation.",
        specialization: "Academic Writing & Speaking",
        experience: "10+ years",
        qualifications: ["PhD in Applied Linguistics", "IELTS Certified Trainer", "Cambridge CELTA"]
      },
      {
        name: "Prof. Ahmed Khan",
        bio: "Former IELTS examiner with extensive experience in Reading and Listening modules.",
        specialization: "Reading & Listening",
        experience: "8 years",
        qualifications: ["MA in English Literature", "Former IELTS Examiner", "TESOL Certified"]
      },
      {
        name: "Ms. Emily Chen",
        bio: "Young and dynamic teacher specializing in General Training modules and student motivation.",
        specialization: "General Training",
        experience: "5 years",  
        qualifications: ["BA in English", "IELTS Band 8.5", "Online Teaching Specialist"]
      }
    ];

    for (const teacher of sampleTeachers) {
      await customizationService.addTeacher(teacher);
    }
    console.log('✅ Sample teachers added');

    // Initialize Sample Courses
    const sampleCourses = [
      {
        title: "IELTS Academic Complete",
        description: "Comprehensive preparation for IELTS Academic exam covering all four modules with expert guidance.",
        price: 15000,
        duration: "3 months",
        level: "Intermediate" as const,
        features: [
          "All 4 modules covered",
          "Weekly mock tests",
          "Personal feedback",
          "Study materials included",
          "Small class sizes"
        ],
        isActive: true
      },
      {
        title: "IELTS General Training",
        description: "Focused preparation for General Training IELTS with practical approach and real-world examples.",
        price: 12000,
        duration: "2 months",
        level: "Beginner" as const,
        features: [
          "General Training focus",
          "Practical examples",
          "Writing task guidance",
          "Speaking practice sessions"
        ],
        isActive: true
      },
      {
        title: "Speaking & Writing Intensive",
        description: "Intensive course focusing on Speaking and Writing modules for quick score improvement.",
        price: 8000,
        duration: "1 month",
        level: "Advanced" as const,
        features: [
          "Speaking practice",
          "Writing feedback",
          "Individual attention",
          "Quick results"
        ],
        isActive: true
      }
    ];

    for (const course of sampleCourses) {
      await customizationService.addCourse(course);
    }
    console.log('✅ Sample courses added');

    // Initialize Sample Exam (would need tracks first)
    // Note: Exam creation requires existing tracks
    console.log('📝 Sample exam creation skipped (requires tracks first)');

    console.log('🎉 Demo data initialization complete!');
    return true;

  } catch (error) {
    console.error('❌ Error initializing demo data:', error);
    return false;
  }
};

// Add to window for browser console access
(window as any).initDemo = initializeDemoData;

console.log('🔧 Demo data initializer loaded. Available commands:');
console.log('- initDemo() - Initialize demo data');