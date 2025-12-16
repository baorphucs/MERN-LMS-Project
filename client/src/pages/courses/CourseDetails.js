import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tab } from '@headlessui/react';
import moment from 'moment';
import AuthContext from '../../context/AuthContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardListIcon,
  BellIcon,
  CheckIcon,
  XIcon
} from '@heroicons/react/outline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [notices, setNotices] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]); // State cho danh sách chờ duyệt
  const [loading, setLoading] = useState(true);

  // Phân quyền
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isCourseTeacher = isTeacher && course?.teacher?._id === user?._id;

  // Hàm lấy thông tin chi tiết khóa học
  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data.course);
      setStudents(res.data.students);
      setAssignments(res.data.assignments);
      setQuizzes(res.data.quizzes);
      setNotices(res.data.notices);
      setMaterials(res.data.materials);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  // Effect lấy danh sách sinh viên đang chờ duyệt (Chỉ dành cho giáo viên khóa học)
  useEffect(() => {
    if (isCourseTeacher) {
      fetchPendingEnrollments();
    }
  }, [id, isCourseTeacher]);

  const fetchPendingEnrollments = async () => {
    try {
      const res = await axios.get(`/api/enrollments/pending/${id}`);
      setPendingEnrollments(res.data.enrollments || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách chờ duyệt:", err);
    }
  };

  // Hàm xử lý Duyệt hoặc Từ chối
  const handleApprove = async (enrollId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/enrollments/handle/${enrollId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Cập nhật danh sách chờ duyệt tại chỗ
      setPendingEnrollments(pendingEnrollments.filter(e => e._id !== enrollId));
      
      if (status === 'approved') {
        toast.success('Đã duyệt học sinh vào khóa học');
        // Refresh lại danh sách sinh viên chính thức
        fetchCourseDetails();
      } else {
        toast.info('Đã từ chối yêu cầu đăng ký');
      }
    } catch (err) {
      toast.error('Lỗi xử lý phê duyệt');
      console.error(err);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await axios.delete(`/api/materials/${materialId}`);
        setMaterials(materials.filter((material) => material._id !== materialId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await axios.delete(`/api/assignments/${assignmentId}`);
        setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const response = await axios.delete(`/api/quizzes/${quizId}`);
        if (response.data.success) {
          toast.success('Quiz deleted successfully!');
          setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
        } else {
          toast.error('Failed to delete quiz');
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast.error('Failed to delete quiz');
      }
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`/api/notices/${noticeId}`);
        setNotices(notices.filter((notice) => notice._id !== noticeId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownload = async (fileName, originalName) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/materials/download/${encodeURIComponent(fileName)}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName || fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Download failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <Link to="/" className="text-primary-600 hover:underline">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-screen">
      
      {/* Course Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white/90 shadow-card rounded-2xl p-8 mb-8 border border-primary-50 backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold text-primary-600 mb-2 tracking-tight">
          {course.title}
        </h2>
        <p className="text-lg text-text-medium mb-6">{course.description}</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center bg-white/80 border border-primary-100 rounded-xl shadow px-4 py-2">
            <img
              src={course.teacher?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.teacher?.name || 'T')}`}
              alt={course.teacher?.name}
              className="h-12 w-12 rounded-full mr-3 border-2 border-primary-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-dark">{course.teacher?.name}</span>
                {isCourseTeacher && (
                  <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">You</span>
                )}
              </div>
              <span className="text-xs text-text-medium">{course.teacher?.email}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-700">
              {course.category || 'General'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-50 text-secondary-500">
              {course.level || 'All Levels'}
            </span>
          </div>
        </div>

        {isCourseTeacher && (
          <div className="flex gap-4">
            <Link
              to={`/teacher/courses/${course._id}/manage-students`}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md font-medium text-sm hover:bg-primary-700 shadow-lg transition"
            >
              <UserIcon className="h-4 w-4 mr-2" /> Quản Lý Sinh Viên
            </Link>
          </div>
        )}
      </motion.div>

      <Tab.Group>
        <Tab.List className="sticky top-4 z-10 flex space-x-2 rounded-2xl bg-white/70 shadow-card backdrop-blur-md p-2 mb-8 border border-primary-50">
          {[
            { name: 'Overview', icon: BookOpenIcon },
            { name: 'Materials', icon: DocumentTextIcon },
            { name: 'Assignments', icon: ClipboardListIcon },
            { name: 'Quizzes', icon: AcademicCapIcon },
            { name: 'Notices', icon: BellIcon }
          ].map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'flex-1 flex flex-col items-center py-3 px-2 rounded-xl font-bold text-sm transition-all duration-200',
                  selected 
                    ? 'bg-gradient-to-r from-primary-400 to-secondary-500 text-white shadow-lg scale-105' 
                    : 'text-primary-700 hover:bg-primary-100/60'
                )
              }
            >
              <tab.icon className="h-5 w-5 mb-1" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* 1. OVERVIEW PANEL */}
          <Tab.Panel className="p-6 focus:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                
                {/* HIỆN THỊ DANH SÁCH CHỜ DUYỆT (CHỈ GIÁO VIÊN KHÓA HỌC THẤY) */}
                {isCourseTeacher && pendingEnrollments.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <AcademicCapIcon className="w-6 h-6" /> 
                      Yêu cầu đăng ký chờ duyệt ({pendingEnrollments.length})
                    </h3>
                    <div className="space-y-4">
                      {pendingEnrollments.map(enroll => (
                        <div key={enroll._id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                          <div>
                            <p className="font-bold text-gray-900">{enroll.student?.name}</p>
                            <p className="text-sm text-gray-500">{enroll.student?.email}</p>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleApprove(enroll._id, 'approved')} 
                              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                            >
                              Duyệt
                            </button>
                            <button 
                              onClick={() => handleApprove(enroll._id, 'rejected')} 
                              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition"
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="prose max-w-none text-gray-700 bg-white p-6 rounded-lg border border-gray-100 shadow">
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">About this course</h3>
                  <p className="whitespace-pre-line">{course.description}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                    <span className="block text-xs text-gray-500 uppercase font-bold">Students</span>
                    <span className="text-xl font-bold text-primary-600">{students.length}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                    <span className="block text-xs text-gray-500 uppercase font-bold">Materials</span>
                    <span className="text-xl font-bold text-primary-600">{materials.length}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                    <span className="block text-xs text-gray-500 uppercase font-bold">Assignments</span>
                    <span className="text-xl font-bold text-primary-600">{assignments.length}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                    <span className="block text-xs text-gray-500 uppercase font-bold">Quizzes</span>
                    <span className="text-xl font-bold text-primary-600">{quizzes.length}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar thông tin thời gian */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold mb-4 text-primary-700 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" /> Course Timeline
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-semibold text-gray-900">{moment(course.startDate).format('MMM D, YYYY')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-gray-500">End Date:</span>
                      <span className="font-semibold text-gray-900">{moment(course.endDate).format('MMM D, YYYY')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-500 font-medium">Enrollment Deadline:</span>
                      <span className="font-bold text-red-600">{moment(course.enrollmentDeadline).format('MMM D, YYYY')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* 2. MATERIALS PANEL */}
          <Tab.Panel className="p-6 focus:outline-none">
            {isCourseTeacher && (
              <div className="mb-6 text-right">
                <Link to={`/teacher/materials/create/${course._id}`} className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-md">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add Material
                </Link>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.length > 0 ? materials.map((m) => (
                <div key={m._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                      <DocumentTextIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{m.title}</h3>
                      <p className="text-xs text-gray-500 italic">{m.originalName}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleDownload(m.fileName, m.originalName)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="Download">
                      <AcademicCapIcon className="w-6 h-6 rotate-180" />
                    </button>
                    {isCourseTeacher && (
                      <button onClick={() => handleDeleteMaterial(m._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-10 text-gray-400 italic">No materials available.</div>
              )}
            </div>
          </Tab.Panel>

          {/* 3. ASSIGNMENTS PANEL */}
          <Tab.Panel className="p-6 focus:outline-none">
            {isCourseTeacher && (
              <div className="mb-6 text-right">
                <Link to={`/teacher/assignments/create/${course._id}`} className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-md">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add Assignment
                </Link>
              </div>
            )}
            <div className="space-y-4">
              {assignments.length > 0 ? assignments.map((a) => (
                <div key={a._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                      <ClipboardListIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{a.title}</h3>
                      <p className="text-xs text-red-500 font-bold">Due: {moment(a.deadline).format('MMM D, YYYY - HH:mm')}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link to={`/assignments/${a._id}`} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-bold hover:bg-primary-100 transition">View Details</Link>
                    {isCourseTeacher && (
                      <button onClick={() => handleDeleteAssignment(a._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 italic">No assignments yet.</div>
              )}
            </div>
          </Tab.Panel>

          {/* 4. QUIZZES PANEL */}
          <Tab.Panel className="p-6 focus:outline-none">
            {isCourseTeacher && (
              <div className="mb-6 text-right">
                <Link to={`/teacher/quizzes/create/${course._id}`} className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-md">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add Quiz
                </Link>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.length > 0 ? quizzes.map((q) => (
                <div key={q._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                      <AcademicCapIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-800">{q.title}</h3>
                  </div>
                  <div className="flex gap-3">
                    <Link 
                      to={isTeacher ? `/quizzes/${q._id}` : `/quizzes/${q._id}/take`} 
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
                    >
                      {isTeacher ? 'Results' : 'Take Quiz'}
                    </Link>
                    {isCourseTeacher && (
                      <button onClick={() => handleDeleteQuiz(q._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-10 text-gray-400 italic">No quizzes available.</div>
              )}
            </div>
          </Tab.Panel>

          {/* 5. NOTICES PANEL */}
          <Tab.Panel className="p-6 focus:outline-none">
            {isCourseTeacher && (
              <div className="mb-6 text-right">
                <Link to={`/teacher/notices/create/${course._id}`} className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-md">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add Notice
                </Link>
              </div>
            )}
            <div className="space-y-4">
              {notices.length > 0 ? notices.map((n) => (
                <div 
                  key={n._id} 
                  className={`p-5 rounded-xl border shadow-sm flex justify-between items-start ${
                    n.priority === 'high' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-lg ${n.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      <BellIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${n.priority === 'high' ? 'text-red-800' : 'text-gray-800'}`}>{n.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{n.content}</p>
                      <p className="text-xs text-gray-400 mt-3 italic">{moment(n.createdAt).fromNow()}</p>
                    </div>
                  </div>
                  {isCourseTeacher && (
                    <button onClick={() => handleDeleteNotice(n._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  )}
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 italic">No notices yet.</div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CourseDetails;