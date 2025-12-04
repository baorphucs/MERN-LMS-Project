// FILE_PATH: client\src\App.js (CẬP NHẬT HOÀN TOÀN)

import React, 
{ useContext } from 'react'; // <=== ĐÃ THÊM useContext VÀO ĐÂY 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Auth Context
import AuthContext, { AuthProvider } from './context/AuthContext';
// Bổ sung AuthContext

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
// NEW: Roadmap Pages
import RoadmapToeic from './pages/RoadmapToeic'; // <=== ĐÃ THÊM IMPORT NÀY
import RoadmapIelts from './pages/RoadmapIelts'; // <=== ĐÃ THÊM IMPORT NÀY
// Dashboard Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';

// Course Pages
import Courses from './pages/courses/Courses';
import CourseDetails from './pages/courses/CourseDetails';
import CreateCourse from './pages/teacher/CreateCourse';
import EditCourse from './pages/teacher/EditCourse';

// NEW: Quản lý người dùng cho Teacher
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

// Material
import Materials from './pages/materials/Materials';
import CreateMaterial from './pages/teacher/CreateMaterial'; 

// Notice
import Notices from './pages/notices/Notices';
import CreateNotice from './pages/teacher/CreateNotice';
const AppContent = () => { // Tách logic ra khỏi App để sử dụng useContext
    const { isAuthenticated, user, loading } = useContext(AuthContext);
// Nếu đang tải, trả về null hoặc loading state 
    if (loading) return null;
return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                
                {/* NEW: Roadmap Public Routes */}
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
                    <Route 
path="/assignments/:id" element={<Layout><AssignmentDetails /></Layout>} /> 
                    <Route path="/quizzes" element={<Layout><Quizzes /></Layout>} />
                    <Route path="/quizzes/:id" element={<Layout><QuizDetails /></Layout>} />
                    <Route path="/quizzes/:id/result" element={<Layout><QuizResult /></Layout>} />
                </Route>

        
        {/* Teacher Routes - Bao gồm cả Super Admin */}
                <Route element={<TeacherRoute />}>
                    <Route path="/teacher/dashboard" element={<Layout><TeacherDashboard /></Layout>} />
                    <Route path="/teacher/create-course" element={<Layout><CreateCourse /></Layout>} />
                 
   
                    {/* MỚI: Quản lý tất cả khóa học */} 
                    <Route path="/teacher/courses" element={<Layout><Courses /></Layout>} />
                    
                    {/* MỚI: Sửa khóa 
học */}
                    <Route path="/teacher/edit-course/:id" element={<Layout><EditCourse /></Layout>} /> 
                    
                    {/* MỚI: Quản lý người dùng */}
                    <Route path="/teacher/users" element={<Layout><Users /></Layout>} />

    
                {/* NEW: Quản lý sinh viên trong khóa học */} 
                    <Route path="/teacher/courses/:id/manage-students" element={<Layout><ManageStudents /></Layout>} />

                    {/* NEW: Chat Admin Route */}
                    <Route path="/teacher/chat" element={<Layout><AdminChat /></Layout>} />

 
                   {/* Các route tạo nội dung */} 
                    <Route path="/teacher/assignments/create/:courseId" element={<Layout><CreateAssignment /></Layout>} />
                    <Route path="/teacher/quizzes/create/:courseId" element={<Layout><CreateQuiz /></Layout>} />
                    <Route path="/teacher/materials/create/:courseId" element={<Layout><CreateMaterial /></Layout>} />
  
                  <Route path="/teacher/notices/create/:courseId" element={<Layout><CreateNotice /></Layout>} /> 
                    
                    {/* Edit Quiz */}
                    <Route path="/quizzes/:id/edit" element={<Layout><EditQuiz /></Layout>} />
          
      </Route>

                {/* Student Routes */}
                <Route element={<StudentRoute />}>
                    <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
                    <Route path="/assignments/:id/submit" element={<Layout><SubmitAssignment /></Layout>} />
         
           <Route path="/quizzes/:id/take" element={<Layout><TakeQuiz /></Layout>} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            
       
     {/* NEW: Ẩn/Hiện Chat Widget tùy thuộc vào trạng thái đăng nhập */} 
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