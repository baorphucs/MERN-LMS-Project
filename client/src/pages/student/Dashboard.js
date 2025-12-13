// FILE_PATH: client\src\pages\student\Dashboard.js (SỬA LẠI LOGIC TẢI DỮ LIỆU)

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import moment from 'moment';
import AuthContext from '../../context/AuthContext';
import {
  BookOpenIcon,
  ClipboardCheckIcon, // Changed from ClipboardDocumentCheckIcon
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/outline';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // **FIX LOGIC NÀY**: Dùng endpoint dashboard để lấy dữ liệu chính xác
        const res = await axios.get('/api/users/me/dashboard', {
           headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
           setCourses(res.data.courses || []);
           setAssignments(res.data.assignments || []);
           setQuizzes(res.data.quizzes || []);
        } else {
           console.error('Failed to load dashboard data');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  // Defensive: always ensure arrays are defined
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];

  // Calculate upcoming deadlines (logic giữ nguyên)
  const upcomingAssignments = safeAssignments
    .filter(assignment => {
      const submitted = assignment.submissions?.some(
        sub => sub.student.toString() === user?._id
      );
      const deadlinePassed = new Date(assignment.deadline) < new Date();
      return !submitted && !deadlinePassed;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  // Replace the 'Learning Progress' stat with 'Completed Assignments'
  const completedAssignments = safeAssignments.filter(a => a.submissions?.some(sub => sub.student.toString() === user?._id)).length;
  const totalAssignments = safeAssignments.length;
  
  const stats = [
    {
      title: 'Khóa học đã đăng ký',
      value: safeCourses.length,
      icon: <BookOpenIcon className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Nhiệm vụ đang chờ',
      value: upcomingAssignments.length,
      icon: <ClipboardCheckIcon className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-100',
    },
    {
      title: 'Các bài kiểm tra có sẵn',
      value: safeQuizzes.filter(q => !q.submitted).length,
      icon: <DocumentTextIcon className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Bài tập đã hoàn thành',
      value: `${completedAssignments} / ${totalAssignments}`,
      icon: <AcademicCapIcon className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển học tập của bạn</h1>
        <p className="text-gray-600">Chào mừng trở lại, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${stat.color} p-6 rounded-lg shadow-sm`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hạn chót sắp tới</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {upcomingAssignments.length > 0 ?
            (
              <div className="divide-y divide-gray-200">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment._id} className="p-4 hover:bg-gray-50">
                    <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">
                      Khóa học: {assignment.course?.title}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-red-500">
                        Đến hạn: {moment(assignment.deadline).format('MMM D, YYYY')}
                      </span>
                      <Link
                        to={`/assignments/${assignment._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Không có hạn chót sắp tới. Bạn đã hoàn tất tất cả!
              </p>
            )}
        </div>
      </div>

      {/* My Courses */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Các khóa học của tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeCourses.length > 0 ?
            (
              safeCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div
                    className="h-32 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${course.coverImage ? `/uploads/${course.coverImage}` : '/img/default-course.jpg'})`
                    }}
                  ></div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">Instructor: {course.teacher?.name}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Xem Khóa Học
                      </Link>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {course.code}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <p className="text-gray-500 text-center py-8">
                  Bạn chưa đăng ký khóa học nào cả.
                  <Link to="/courses" className="text-primary-600 hover:underline ml-1">
                    Duyệt các khóa học có sẵn
                  </Link>
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Available Quizzes */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Các bài kiểm tra có sẵn</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {safeQuizzes.filter(q => !q.submitted).length > 0 ?
            (
              <div className="divide-y divide-gray-200">
                {safeQuizzes
                  .filter(q => !q.submitted)
                  .map((quiz) => (
                    <div key={quiz._id} className="p-4 hover:bg-gray-50">
                      <h3 className="font-medium text-gray-800">{quiz.title}</h3>
                      <p className="text-sm text-gray-600">
                        Khóa học: {quiz.course?.title}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {quiz.questions?.length || 0} Câu hỏi
                        </span>
                        <Link
                          to={`/quizzes/${quiz._id}/take`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Làm bài kiểm tra
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
               Hiện tại không có bài kiểm tra nào.
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;