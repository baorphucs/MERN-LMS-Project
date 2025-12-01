// src/pages/courses/Courses.js (THAY THẾ HOÀN TOÀN FILE CŨ)
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';

const Courses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      toast.error('Không tải được danh sách khóa học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa khóa học này? Toàn bộ dữ liệu sẽ mất!')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Xóa khóa học thành công!');
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      toast.error('Không thể xóa khóa học');
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          {user?.role === 'teacher' ? 'Quản Lý Tất Cả Khóa Học' : 'Danh Sách Khóa Học'}
        </h1>
        {user?.role === 'teacher' && (
          <Link
            to="/teacher/create-course"
            className="flex items-center gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition font-semibold"
          >
            <PlusCircleIcon className="w-6 h-6" />
            Tạo Khóa Học Mới
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <p className="text-2xl text-gray-500">Chưa có khóa học nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <motion.div
              key={course._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${course.coverImageUrl || '/img/default-course.jpg'})`
                }}
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">Mã: <strong>{course.code}</strong></p>
                <p className="text-sm text-gray-600 mb-4">GV: {course.teacher?.name || 'N/A'}</p>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/courses/${course._id}`}
                    className="text-primary-600 font-medium hover:underline"
                  >
                    Xem chi tiết
                  </Link>

                  {user?.role === 'teacher' && (
                    <div className="flex gap-3">
                      <Link
                        to={`/teacher/edit-course/${course._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Sửa"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;