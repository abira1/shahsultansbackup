import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/Home';
import TeachersPage from './pages/Teachers';
import CoursesPage from './pages/Courses';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import MockTest from './pages/MockTest/MockTest';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import AdminDashboard from './pages/Admin/Dashboard';
import QuestionUpload from './pages/Admin/QuestionUpload';
import CreateTest from './pages/Admin/CreateTest';
import SectionManagement from './pages/Admin/SectionManagement';
import AdvancedQuestionUpload from './pages/Admin/QuestionUpload/AdvancedQuestionUpload';

// Reading system imports
import ReadingTracks from './pages/Admin/Reading/ReadingTracks';
import CreateReadingTrack from './pages/Admin/Reading/CreateReadingTrack';
import EditReadingTrack from './pages/Admin/Reading/EditReadingTrack';
import PassageManagement from './pages/Admin/Reading/PassageManagement';

// Writing system imports
import WritingTracks from './pages/Admin/Writing/WritingTracks';
import CreateWritingTrack from './pages/Admin/Writing/CreateWritingTrack';
import EditWritingTrack from './pages/Admin/Writing/EditWritingTrack';
import TaskManagement from './pages/Admin/Writing/TaskManagement';

// Speaking system imports
import SpeakingAdmin from './pages/Admin/SpeakingAdmin';

// New centralized admin imports
import UploadTracks from './pages/Admin/UploadTracks';
import ManageExams from './pages/Admin/ManageExams_new';
import StudentManagement from './pages/Admin/StudentManagement';
import ResultsManagement from './pages/Admin/ResultsManagement';
import ResultDetail from './pages/Admin/ResultDetail';
import AdminSettings from './pages/Admin/AdminSettings';
import Reports from './pages/Admin/Reports';
import Profile from './pages/Admin/Profile';
import Customization from './pages/Admin/Customization';
import SystemMonitor from './pages/Admin/SystemMonitor';

// Professional exam interfaces
import Listening from './pages/MockTest/Listening';
import Reading from './pages/MockTest/Reading';
import Writing from './pages/MockTest/Writing';

// Exam system imports
import { ExamProvider } from './context/ExamContext';
// Development utilities
import LandingPage from './pages/Exam/LandingPage';
import ListeningStart from './pages/Exam/ListeningStart';
import ReadingStart from './pages/Exam/ReadingStart';
import WritingStart from './pages/Exam/WritingStart';
import ConfirmDetailsPage from './pages/Exam/ConfirmDetailsPage';
import ExamPage from './pages/Exam/ExamPage';
import ReviewPage from './pages/Exam/ReviewPage';
import TestEndedPage from './pages/Exam/TestEndedPage';
const AppRoutes = () => {
  const {
    isLoggedIn,
    userRole,
    loading
  } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <Routes>
      <Route path="/" element={<Layout isLoggedIn={isLoggedIn} userRole={userRole}>
            <HomePage />
          </Layout>} />
      <Route path="/teachers" element={<Layout isLoggedIn={isLoggedIn} userRole={userRole}>
            <TeachersPage />
          </Layout>} />
      <Route path="/courses" element={<Layout isLoggedIn={isLoggedIn} userRole={userRole}>
            <CoursesPage />
          </Layout>} />
      <Route path="/login" element={<Layout isLoggedIn={isLoggedIn} userRole={userRole}>
            <LoginPage />
          </Layout>} />
      <Route path="/register" element={<Layout isLoggedIn={isLoggedIn} userRole={userRole}>
            <RegisterPage />
          </Layout>} />
      <Route path="/dashboard/*" element={<ProtectedRoute isAuthenticated={isLoggedIn} requiredRole="student" userRole={userRole}>
            <Layout isLoggedIn={true} userRole={userRole}>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>} />
      <Route path="/mock-test/*" element={<ProtectedRoute isAuthenticated={isLoggedIn}>
            <Layout isLoggedIn={true} userRole={userRole} minimal={true}>
              <MockTest />
            </Layout>
          </ProtectedRoute>} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/tests/create" element={<CreateTest />} />
      <Route path="/admin/tests/:testId" element={<SectionManagement />} />
      <Route path="/admin/tests/:testId/sections/:sectionId/questions/new" element={<AdvancedQuestionUpload />} />
      <Route path="/admin/questions/upload" element={<QuestionUpload />} />
      
      {/* Reading system routes */}
      <Route path="/admin/reading/tracks" element={<ReadingTracks />} />
      <Route path="/admin/reading/tracks/new" element={<CreateReadingTrack />} />
      <Route path="/admin/reading/tracks/:trackId/edit" element={<EditReadingTrack />} />
      <Route path="/admin/reading/tracks/:trackId/passages" element={<PassageManagement />} />
      
      {/* Writing system routes */}
      <Route path="/admin/writing/tracks" element={<WritingTracks />} />
      <Route path="/admin/writing/tracks/new" element={<CreateWritingTrack />} />
      <Route path="/admin/writing/tracks/:trackId/edit" element={<EditWritingTrack />} />
      <Route path="/admin/writing/tracks/:trackId/tasks" element={<TaskManagement />} />
      
      {/* Speaking system routes */}
      <Route path="/admin/speaking/*" element={<SpeakingAdmin />} />
      
      {/* New centralized admin routes */}
      <Route path="/admin/upload" element={<UploadTracks />} />
      <Route path="/admin/exams" element={<ManageExams />} />
      <Route path="/admin/students" element={<StudentManagement />} />
      <Route path="/admin/results" element={<ResultsManagement />} />
      <Route path="/admin/results/:examId/:studentId" element={<ResultDetail />} />
      <Route path="/admin/results/:examId/:studentId/edit" element={<ResultDetail />} />
      <Route path="/admin/customization" element={<Customization />} />
      <Route path="/admin/system" element={<SystemMonitor />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/profile" element={<Profile />} />
      
      {/* Professional exam interfaces with 5-logo header */}
      <Route path="/mock-test/listening" element={
        <ProtectedRoute isAuthenticated={isLoggedIn} requiredRole="student" userRole={userRole}>
          <ExamProvider examType="listening">
            <Listening />
          </ExamProvider>
        </ProtectedRoute>
      } />
      <Route path="/mock-test/reading" element={
        <ProtectedRoute isAuthenticated={isLoggedIn} requiredRole="student" userRole={userRole}>
          <ExamProvider examType="reading">
            <Reading />
          </ExamProvider>
        </ProtectedRoute>
      } />
      <Route path="/mock-test/writing" element={
        <ProtectedRoute isAuthenticated={isLoggedIn} requiredRole="student" userRole={userRole}>
          <ExamProvider examType="writing">
            <Writing />
          </ExamProvider>
        </ProtectedRoute>
      } />
      
      {/* Exam start pages - clean landing page design */}
      <Route path="/exam/listening/start" element={<ListeningStart />} />
      <Route path="/exam/reading/start" element={<ReadingStart />} />
      <Route path="/exam/writing/start" element={<WritingStart />} />
      
      {/* Exam system routes */}
      <Route path="/exam/*" element={
        <ProtectedRoute isAuthenticated={isLoggedIn} requiredRole="student" userRole={userRole}>
          <ExamProvider>
            <Routes>
              <Route path="start" element={<LandingPage />} />
              <Route path="confirm-details" element={<ConfirmDetailsPage />} />
              <Route path="test" element={<ExamPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="test-ended" element={<TestEndedPage />} />
            </Routes>
          </ExamProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/logout" element={<LogoutHandler />} />
    </Routes>;
};
// Component to handle logout
const LogoutHandler = () => {
  const {
    logout
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);
  return <div>Logging out...</div>;
};
export function App() {
  return <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>;
}