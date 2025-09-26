# Shah Sultan's IELTS Academy

A comprehensive IELTS exam preparation platform built with React, TypeScript, and Firebase. This platform provides professional exam interfaces with authentic IELTS branding and comprehensive question types for Listening, Reading, and Writing sections.

## 🌟 Features

### Professional IELTS Interface
- **Authentic 5-logo header**: IELTS, Shah Sultan's IELTS Academy, British Council, IDP, Cambridge Assessment
- **Professional exam environment** with timer, user identification, and volume controls
- **Clean, responsive design** matching official IELTS standards
- **Part-based question navigation** (1-10, 11-20, 21-30, 31-40)

### Exam Modules
- **Listening Test**: Audio integration with volume controls and timed sections
- **Reading Test**: Academic passages with various question types
- **Writing Test**: Task 1 & Task 2 with word count tracking
- **Speaking Test**: Coming soon

### Question Types Supported
- Multiple Choice (Single & Multiple)
- Fill in the Blanks
- True/False/Not Given
- Yes/No/Not Given
- Form Completion
- Summary Completion
- Diagram Labeling
- Matching Headings
- Sentence Completion
- Drag & Drop
- Table Completion
- Flow Chart Completion

### Admin Panel
- **Question Upload**: Bulk upload and individual question creation
- **Track Management**: Organize questions by difficulty and topic
- **Media Upload**: Audio and image integration
- **Test Creation**: Create custom exam sets
- **Student Management**: Monitor progress and results

### Student Dashboard
- **Exam Selection**: Choose from available practice tests
- **Progress Tracking**: Monitor performance across all modules
- **Results Analysis**: Detailed feedback and band score predictions
- **Mock Test History**: Review past attempts

## 🚀 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **Storage**: Firebase Storage
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shahsultansieltsacademy.git
   cd shahsultansieltsacademy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Realtime Database, and Storage
   - Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### For Students
1. **Register/Login** to your account
2. **Navigate to Dashboard** to see available exams
3. **Select an exam type** (Listening, Reading, Writing)
4. **Review instructions** on the clean start page
5. **Take the exam** with professional IELTS interface
6. **Review results** and track progress

### For Administrators
1. **Access Admin Panel** with admin credentials
2. **Upload Questions** using the question upload interface
3. **Create Tracks** to organize questions by difficulty
4. **Manage Exams** and monitor student progress
5. **Upload Media** files for listening and reading sections

## 🚦 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Shah Sultan's IELTS Academy** - Project Owner
- **Development Team** - Full-stack development

---

**Built with ❤️ for IELTS aspirants worldwide**
