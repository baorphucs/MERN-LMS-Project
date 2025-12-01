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
  UsersIcon,        // THÊM ICON NÀY
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
    return location.pathname === pathname || location.pathname.startsWith(`${pathname}/`);
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
              <p className="text-base font-semibold text-text-dark">{user?.name}</p>
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

          {/* Courses - có submenu cho Teacher */}
          <div>
            <button
              onClick={() => toggleSubmenu('courses')}
              className={`flex items-center justify-between w-full px-3 py-3 text-base font-semibold rounded-xl transition-all duration-200 focus:outline-none backdrop-blur-md ${
                isActive('/courses') || location.pathname.startsWith('/teacher/courses')
                  ? 'bg-primary-100 text-primary-700 shadow-lg'
                  : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-3" />
                Khóa Học
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
                        ? 'bg-primary-100 text-primary-700 shadow'
                        : 'text-text-medium hover:bg-primary-50 hover:text-primary-500'
                    }`}
                  >
                    Tất cả khóa học
                  </Link>
                  <Link
                    to="/teacher/create-course"
                    className={`block px-3 py-2 text-base rounded-lg transition-all duration-200 ${
                      location.pathname.startsWith('/teacher/create-course')
                        ? 'bg-primary-100 text-primary-700 shadow'
                        : 'text-text-medium hover:bg-primary-50 hover:text-primary-500'
                    }`}
                  >
                    Tạo khóa học mới
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Link chung cho Student */}
            {!isTeacher && (
              <Link
                to="/courses"
                className={`flex items-center px-3 py-3 text-base font-semibold rounded-xl transition-all duration-200 backdrop-blur-md ml-10 ${
                  isActive('/courses')
                    ? 'bg-primary-100 text-primary-700 shadow-lg'
                    : 'text-text-dark hover:bg-primary-50 hover:text-primary-500'
                }`}
              >
                Xem tất cả khóa học
              </Link>
            )}
          </div>

          {/* 2 MENU MỚI CHỈ DÀNH CHO TEACHER */}
          {isTeacher && (
            <>
              {/* Quản lý tất cả khóa học (mới) */}
              <Link
                to="/teacher/courses"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith('/teacher/courses') && location.pathname !== '/teacher/courses/create'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'hover:bg-primary-100 text-text-dark'
                }`}
              >
                <BookOpenIcon className="w-ml-1 w-6 h-6" />
                <span className="font-medium">Quản Lý Tất Cả Khóa Học</span>
              </Link>

              {/* Quản lý người dùng */}
              <Link
                to="/teacher/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/teacher/users'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'hover:bg-primary-100 text-text-dark'
                }`}
              >
                <UsersIcon className="w-6 h-6" />
                <span className="font-medium">Quản Lý Người Dùng</span>
              </Link>
            </>
          )}

          {/* Các menu khác bạn có thể thêm sau nếu muốn */}
          {/* Ví dụ: Assignments, Quizzes, Materials, Notices... */}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;