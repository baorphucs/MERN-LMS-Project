import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { 
  PlusCircleIcon, 
  SearchIcon, 
  AcademicCapIcon, 
  UserGroupIcon, 
  CheckCircleIcon 
} from '@heroicons/react/outline';

const Courses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // State để theo dõi các khóa học vừa bấm đăng ký thành công
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data.courses || []);
    } catch (err) {
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('/api/enrollments/register', { courseId });
      toast.success('Đã gửi yêu cầu đăng ký!');
      // Thêm ID khóa học vào danh sách chờ để cập nhật UI ngay lập tức
      setPendingRequests(prev => [...prev, courseId]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {user?.role === 'teacher' ? 'Quản lý khóa học' : 'Khám phá khóa học'}
          </h1>
          <p className="mt-2 text-gray-600 font-medium">Nâng cao kỹ năng của bạn với các khóa học chất lượng.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tên khóa học hoặc mã..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user?.role === 'teacher' && (
            <Link to="/teacher/create-course" className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition shadow-lg shadow-primary-100">
              <PlusCircleIcon className="w-6 h-6" /> Tạo mới
            </Link>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => {
          const isEnrolled = course.students?.includes(user?._id);
          // Kiểm tra xem khóa học này có nằm trong danh sách vừa bấm đăng ký không
          const isWaiting = pendingRequests.includes(course._id);

          return (
            <motion.div
              key={course._id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50 flex flex-col h-full"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {course.code || 'LMS-COURSE'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 uppercase group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <AcademicCapIcon className="h-5 w-5 mr-2 text-primary-400" />
                    <span className="text-sm font-medium">Giảng viên: <span className="text-gray-900">{course.teacher?.name}</span></span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-primary-400" />
                    <span className="text-sm font-medium">{course.students?.length || 0} học viên đã tham gia</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                <Link 
                  to={`/courses/${course._id}`}
                  className="text-primary-600 font-bold hover:text-primary-700 transition-colors text-sm"
                >
                  Xem chi tiết
                </Link>

                {user?.role === 'student' && (
                  isEnrolled ? (
                    <button
                      disabled
                      className="bg-gray-400 text-white px-5 py-2 rounded-xl font-bold cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      Bạn đã vào lớp
                    </button>
                  ) : isWaiting ? (
                    /* NÚT KHI ĐANG CHỜ XÉT DUYỆT (MÀU XANH LÁ + ICON DẤU TÍCH) */
                    <button
                      disabled
                      className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-emerald-100 animate-pulse"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      Đang chờ xét duyệt
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="bg-primary-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-primary-700 transition transform active:scale-95 shadow-lg shadow-primary-200 text-sm"
                    >
                      Đăng ký ngay
                    </button>
                  )
                )}
                
                {user?.role === 'teacher' && user._id === course.teacher?._id && (
                  <Link
                    to={`/teacher/edit-course/${course._id}`}
                    className="bg-white border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all text-sm"
                  >
                    Chỉnh sửa
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">Không tìm thấy khóa học nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;