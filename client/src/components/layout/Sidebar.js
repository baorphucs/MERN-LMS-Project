// FILE_PATH: client/src/components/layout/Sidebar.js

import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
  DocumentTextIcon,
  BellIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  UsersIcon,
  ChatIcon,
  BookmarkIcon, // <=== ĐÃ THÊM IMPORT ICON MỚI
} from '@heroicons/react/outline';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [expanded, setExpanded] = useState({ courses: false });

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const toggleSubmenu = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (pathname) => {
    return location.pathname === pathname || (pathname !== '/' && location.pathname.startsWith(pathname));
  };

  return (
    <aside className="h-screen w-64 bg-white/80 backdrop-blur-md shadow-xl fixed left-0 top-16 hidden md:flex flex-col overflow-y-auto border-r border-neutral-50">
      <div className="py-6 flex-1 flex flex-col">
        {/* User Info */}
        <div className="px-6 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 border-2 border-primary-400 shadow">
              <span className="text-primary-700 font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-base font-semibold text-text-dark truncate w-32">{user?.name}</p>
              <p className="text-xs text-text-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1 flex-1">
          {/* Dashboard */}
          <Link
            to={isTeacher ? '/teacher/dashboard' : '/student/dashboard'}
            className={`flex items-center px-3 py-3 text-base font-semibold rounded-xl transition-all duration-200 backdrop-blur-md ${
              isActive(isTeacher ? '/teacher/dashboard' : '/student/dashboard')
                ? 'bg-primary-100 text-primary-700 shadow-lg'
                : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
            }`}
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>

          {/* === MENU MỚI: KHÓA HỌC CỦA BẠN (CHỈ DÀNH CHO STUDENT) === */}
          {isStudent && (
            <Link
              to="/student/my-courses"
              className={`flex items-center px-3 py-3 text-base font-semibold rounded-xl transition-all duration-200 backdrop-blur-md ${
                isActive('/student/my-courses')
                  ? 'bg-primary-100 text-primary-700 shadow-lg'
                  : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
              }`}
            >
              <BookmarkIcon className="w-5 h-5 mr-3" />
              Khóa học của bạn
            </Link>
          )}

          {/* Courses Section */}
          <div>
            <button
              onClick={() => toggleSubmenu('courses')}
              className={`flex items-center justify-between w-full px-3 py-3 text-base font-semibold rounded-xl transition-all duration-200 focus:outline-none backdrop-blur-md ${
                isActive('/courses') || (isTeacher && location.pathname.startsWith('/teacher/courses'))
                  ? 'bg-primary-100 text-primary-700 shadow-lg'
                  : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-3" />
                {isTeacher ? 'Quản lý khóa học' : 'Khám phá học tập'}
              </div>
              {isTeacher && (
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    expanded.courses ? 'transform rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Submenu cho Teacher */}
            <AnimatePresence>
              {isTeacher && expanded.courses && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-8 mt-1 space-y-1"
                >
                  <Link
                    to="/courses"
                    className={`block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                      location.pathname === '/courses'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-text-medium hover:bg-primary-50'
                    }`}
                  >
                    Xem tất cả (Công khai)
                  </Link>
                  <Link
                    to="/teacher/courses"
                    className={`block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                      location.pathname === '/teacher/courses'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-text-medium hover:bg-primary-50'
                    }`}
                  >
                    Danh sách bài giảng
                  </Link>
                  <Link
                    to="/teacher/create-course"
                    className={`block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                      location.pathname === '/teacher/create-course'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-text-medium hover:bg-primary-50'
                    }`}
                  >
                    Tạo khóa học mới
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Link xem tất cả cho Student (Nằm thụt vào một chút so với Dashboard) */}
            {isStudent && (
              <Link
                to="/courses"
                className={`flex items-center px-3 py-3 text-base font-semibold rounded-xl transition-all duration-200 backdrop-blur-md ml-4 mt-1 ${
                  location.pathname === '/courses'
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
                }`}
              >
                <AcademicCapIcon className="w-5 h-5 mr-3 text-primary-500" />
                Tất cả khóa học
              </Link>
            )}
          </div>

          {/* Quản lý Chat - CHỈ DÀNH CHO TEACHER */}
          {isTeacher && (
            <Link
              to="/teacher/chat"
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive('/teacher/chat')
                  ? 'bg-primary-100 text-primary-700 shadow-lg'
                  : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
              }`}
            >
              <ChatIcon className="w-5 h-5 mr-3" />
              <span className="font-semibold">Hỗ trợ trực tuyến</span>
            </Link>
          )}

          {/* Quản lý người dùng - CHỈ DÀNH CHO TEACHER */}
          {isTeacher && (
            <Link
              to="/teacher/users"
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive('/teacher/users')
                  ? 'bg-primary-100 text-primary-700 shadow-lg'
                  : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
              }`}
            >
              <UsersIcon className="w-5 h-5 mr-3" />
              <span className="font-semibold">Quản lý người dùng</span>
            </Link>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
