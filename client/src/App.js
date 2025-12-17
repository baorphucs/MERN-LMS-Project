import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Auth Context
import AuthContext, { AuthProvider } from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routing/PrivateRoute'; 
import TeacherRoute from './components/routing/TeacherRoute';
import StudentRoute from './components/routing/StudentRoute';

// NEW IMPORT CHO CHAT
import ChatWidget from './components/common/ChatWidget';
import AdminChat from './pages/teacher/AdminChat';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
// ROADMAP Pages
import RoadmapToeic from './pages/RoadmapToeic'; 
import RoadmapIelts from './pages/RoadmapIelts';
// OTHER Pages
import FAQ from './pages/FAQ'; 
import Contact from './pages/Contact'; 
import About from './pages/About'; 
import Commitment from './pages/Commitment'; 

// Dashboard Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';

// Course Pages
import Courses from './pages/courses/Courses';
import CourseDetails from './pages/courses/CourseDetails';
import CreateCourse from './pages/teacher/CreateCourse';
import EditCourse from './pages/teacher/EditCourse';
import MyEnrolledCourses from './pages/student/MyEnrolledCourses'; // <=== THÊM IMPORT NÀY

// User Management
import Users from './pages/teacher/Users';
import ManageStudents from './pages/teacher/ManageStudents';

// Assignment Pages
import Assignments from './pages/assignments/Assignments';
import AssignmentDetails from './pages/assignments/AssignmentDetails';
import CreateAssignment from './pages/teacher/CreateAssignment';
import SubmitAssignment from './pages/student/SubmitAssignment';

// Quiz Pages
import Quizzes from './pages/quizzes/Quizzes';
import QuizDetails from './pages/quizzes/QuizDetails';
import CreateQuiz from './pages/teacher/CreateQuiz';
import TakeQuiz from './pages/quizzes/TakeQuiz';
import QuizResult from './pages/quizzes/QuizResult'; 
import EditQuiz from './pages/teacher/EditQuiz';

// Material & Notice
import Materials from './pages/materials/Materials';
import CreateMaterial from './pages/teacher/CreateMaterial';
import Notices from './pages/notices/Notices';
import CreateNotice from './pages/teacher/CreateNotice';

const AppContent = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return null;

    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/faq" element={<Layout><FAQ /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} /> 
                <Route path="/about" element={<Layout><About /></Layout>} /> 
                <Route path="/commitment" element={<Layout><Commitment /></Layout>} />
                <Route path="/roadmap/toeic" element={<Layout><RoadmapToeic /></Layout>} />
                <Route path="/roadmap/ielts" element={<Layout><RoadmapIelts /></Layout>} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> 

                {/* Protected Routes - Cả Teacher & Student */}
                <Route element={<PrivateRoute />}>
                    <Route path="/courses" element={<Layout><Courses /></Layout>} />
                    <Route path="/courses/:id" element={<Layout><CourseDetails /></Layout>} /> 
                    <Route path="/notices" element={<Layout><Notices /></Layout>} />
                    <Route path="/materials" element={<Layout><Materials /></Layout>} />
                    <Route path="/assignments" element={<Layout><Assignments /></Layout>} />
                    <Route path="/assignments/:id" element={<Layout><AssignmentDetails /></Layout>} /> 
                    <Route path="/quizzes" element={<Layout><Quizzes /></Layout>} />
                    <Route path="/quizzes/:id" element={<Layout><QuizDetails /></Layout>} />
                    <Route path="/quizzes/:id/result" element={<Layout><QuizResult /></Layout>} />
                </Route>

                {/* Teacher Routes */}
                <Route element={<TeacherRoute />}>
                    <Route path="/teacher/dashboard" element={<Layout><TeacherDashboard /></Layout>} />
                    <Route path="/teacher/create-course" element={<Layout><CreateCourse /></Layout>} />
                    <Route path="/teacher/courses" element={<Layout><Courses /></Layout>} />
                    <Route path="/teacher/edit-course/:id" element={<Layout><EditCourse /></Layout>} /> 
                    <Route path="/teacher/users" element={<Layout><Users /></Layout>} />
                    <Route path="/teacher/courses/:id/manage-students" element={<Layout><ManageStudents /></Layout>} />
                    <Route path="/teacher/chat" element={<Layout><AdminChat /></Layout>} />
                    
                    <Route path="/teacher/assignments/create/:courseId" element={<Layout><CreateAssignment /></Layout>} />
                    <Route path="/teacher/quizzes/create/:courseId" element={<Layout><CreateQuiz /></Layout>} />
                    <Route path="/teacher/materials/create/:courseId" element={<Layout><CreateMaterial /></Layout>} />
                    <Route path="/teacher/notices/create/:courseId" element={<Layout><CreateNotice /></Layout>} /> 
                    <Route path="/quizzes/:id/edit" element={<Layout><EditQuiz /></Layout>} />
                </Route>

                {/* Student Routes */}
                <Route element={<StudentRoute />}>
                    <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
                    
                    {/* NEW ROUTE: Khóa học của bạn */}
                    <Route path="/student/my-courses" element={<Layout><MyEnrolledCourses /></Layout>} />
                    
                    <Route path="/assignments/:id/submit" element={<Layout><SubmitAssignment /></Layout>} />
                    <Route path="/quizzes/:id/take" element={<Layout><TakeQuiz /></Layout>} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            
            {isAuthenticated && <ChatWidget />}
        </Router>
    );
}

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
