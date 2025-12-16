import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { 
  PlusCircleIcon, SearchIcon, AcademicCapIcon, 
  UserGroupIcon, CheckCircleIcon, InformationCircleIcon,
  XIcon, EyeOffIcon, EyeIcon, TrashIcon 
} from '@heroicons/react/outline';

const Courses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);

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

  const handleTogglePublish = async (courseId) => {
    try {
      const res = await axios.put(`/api/courses/${courseId}/toggle-publish`);
      toast.success(res.data.message);
      // Cập nhật state tại chỗ
      setCourses(courses.map(c => 
        c._id === courseId ? { ...c, isPublished: res.data.isPublished } : c
      ));
    } catch (err) {
      toast.error('Thao tác thất bại');
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('/api/enrollments/register', { courseId });
      toast.success('Đã gửi yêu cầu đăng ký!');
      setPendingRequests(prev => [...prev, courseId]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        toast.success('Đã xóa khóa học thành công');
        setCourses(courses.filter(c => c._id !== courseId));
      } catch (err) {
        toast.error('Lỗi khi xóa khóa học');
      }
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
          <p className="mt-2 text-gray-600 font-medium">Hệ thống học tập trực tuyến LMS.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user?.role === 'teacher' && (
            <Link to="/teacher/create-course" className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition shadow-lg">
              <PlusCircleIcon className="w-6 h-6" /> Tạo mới
            </Link>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => {
          const isEnrolled = course.students?.includes(user?._id);
          const isWaiting = pendingRequests.includes(course._id);
          const isTeacherOwner = user?.role === 'teacher' && user._id === course.teacher?._id;

          return (
            <motion.div
              key={course._id}
              whileHover={{ y: -8 }}
              className={`bg-white rounded-3xl shadow-xl overflow-hidden border flex flex-col h-full transition-all duration-300 ${
                !course.isPublished ? 'opacity-60 grayscale border-red-200' : 'border-gray-100'
              }`}
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {course.code || 'LMS'}
                  </span>
                  {!course.isPublished && (
                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Đang ẩn</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 uppercase">
                  {course.title}
                </h3>
                <div className="flex items-center text-gray-500">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-primary-400" />
                  <span className="text-sm">Giảng viên: <span className="text-gray-900 font-semibold">{course.teacher?.name}</span></span>
                </div>
              </div>

              <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-2">
                
                {/* ROLE BASED NAVIGATION */}
                {user?.role === 'teacher' ? (
                  <Link to={`/courses/${course._id}`} className="text-primary-600 font-bold hover:text-primary-700 transition-colors text-sm underline">
                    Xem chi tiết
                  </Link>
                ) : (
                  <button onClick={() => setSelectedCourseForModal(course)} className="flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors text-sm">
                    <InformationCircleIcon className="h-5 w-5 mr-1" /> Mô tả
                  </button>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2">
                  {user?.role === 'student' && (
                    isEnrolled ? (
                      <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-xl font-bold text-xs">Vào lớp</button>
                    ) : isWaiting ? (
                      <button disabled className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs animate-pulse">Chờ duyệt</button>
                    ) : (
                      <button onClick={() => handleEnroll(course._id)} className="bg-primary-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-700 text-xs">Đăng ký</button>
                    )
                  )}

                  {isTeacherOwner && (
                    <>
                      {/* NÚT ẨN/HIỆN */}
                      <button 
                        onClick={() => handleTogglePublish(course._id)}
                        className={`p-2 rounded-xl transition ${course.isPublished ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
                        title={course.isPublished ? "Ẩn với học sinh" : "Hiện với học sinh"}
                      >
                        {course.isPublished ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                      </button>

                      <Link to={`/teacher/edit-course/${course._id}`} className="p-2 bg-white border border-orange-500 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition">
                        <XIcon className="h-5 w-5 rotate-45"/> {/* Thay bằng PencilIcon nếu muốn */}
                      </Link>

                      <button onClick={() => handleDelete(course._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition">
                        <TrashIcon className="h-5 w-5"/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL MÔ TẢ CHI TIẾT (GIỮ NGUYÊN TỪ BƯỚC TRƯỚC) */}
      <AnimatePresence>
        {selectedCourseForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
             {/* ... Nội dung Modal đã viết ở bước trước ... */}
             <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 flex justify-between items-center border-b bg-gray-50">
                <h2 className="text-2xl font-black text-primary-600 uppercase">{selectedCourseForModal.title}</h2>
                <button onClick={() => setSelectedCourseForModal(null)} className="p-2 bg-white rounded-full shadow-sm hover:text-red-500 transition-all"><XIcon className="h-7 w-7"/></button>
              </div>
              <div className="p-10 overflow-y-auto">
                 {/* Nội dung video và sections của selectedCourseForModal.landingPageConfig */}
                 {selectedCourseForModal.landingPageConfig?.videoUrl && (
                    <div className="aspect-video rounded-3xl overflow-hidden mb-8 border-8 border-gray-100 shadow-lg">
                       <iframe width="100%" height="100%" src={selectedCourseForModal.landingPageConfig.videoUrl.replace("watch?v=", "embed/")} frameBorder="0" allowFullScreen></iframe>
                    </div>
                 )}
                 {selectedCourseForModal.landingPageConfig?.sections?.map((s, i) => (
                    <div key={i} className="mb-6 p-6 bg-blue-50 rounded-2xl">
                       <h4 className="font-bold text-xl text-blue-800 mb-2">{s.title}</h4>
                       <p className="text-gray-700 whitespace-pre-line">{s.content}</p>
                    </div>
                 ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;