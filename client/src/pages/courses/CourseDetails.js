import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  XIcon,
  VideoCameraIcon,
  SaveIcon,
  CollectionIcon
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

  // --- STATE CHO FORM MÔ TẢ CHI TIẾT (LANDING PAGE) ---
  const [showLandingForm, setShowLandingForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [sections, setSections] = useState([{ title: '', content: '' }]);

  // Phân quyền
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isCourseTeacher = isTeacher && course?.teacher?._id === user?._id;

  // Hàm lấy thông tin chi tiết khóa học
  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      const courseData = res.data.course;
      setCourse(courseData);
      setStudents(res.data.students || []);
      setAssignments(res.data.assignments || []);
      setQuizzes(res.data.quizzes || []);
      setNotices(res.data.notices || []);
      setMaterials(res.data.materials || []);

      // Load dữ liệu landing page nếu đã tồn tại vào form
      if (courseData.landingPageConfig) {
        setVideoUrl(courseData.landingPageConfig.videoUrl || '');
        setSections(
          courseData.landingPageConfig.sections?.length > 0 
          ? courseData.landingPageConfig.sections 
          : [{ title: '', content: '' }]
        );
      }

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

  // --- LOGIC XỬ LÝ FORM MÔ TẢ CHI TIẾT ---
  const handleAddSection = () => setSections([...sections, { title: '', content: '' }]);
  
  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const saveLandingPage = async () => {
    try {
      await axios.put(`/api/courses/${id}`, {
        landingPageConfig: { videoUrl, sections }
      });
      toast.success('Đã lưu cấu hình trang giới thiệu thành công!');
      setShowLandingForm(false);
      fetchCourseDetails();
    } catch (err) {
      toast.error('Lỗi khi lưu dữ liệu mô tả chi tiết');
    }
  };

  // --- LOGIC PHÊ DUYỆT HỌC SINH ---
  const handleApprove = async (enrollId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/enrollments/handle/${enrollId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPendingEnrollments(pendingEnrollments.filter(e => e._id !== enrollId));
      
      if (status === 'approved') {
        toast.success('Đã duyệt học sinh vào khóa học');
        fetchCourseDetails();
      } else {
        toast.info('Đã từ chối yêu cầu đăng ký');
      }
    } catch (err) {
      toast.error('Lỗi xử lý phê duyệt');
    }
  };

  // --- CÁC HÀM DELETE KHÁC ---
  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await axios.delete(`/api/materials/${materialId}`);
        setMaterials(materials.filter((material) => material._id !== materialId));
      } catch (err) { console.error(err); }
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await axios.delete(`/api/assignments/${assignmentId}`);
        setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
      } catch (err) { console.error(err); }
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const response = await axios.delete(`/api/quizzes/${quizId}`);
        if (response.data.success) {
          toast.success('Quiz deleted successfully!');
          setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
        }
      } catch (error) { toast.error('Failed to delete quiz'); }
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`/api/notices/${noticeId}`);
        setNotices(notices.filter((notice) => notice._id !== noticeId));
      } catch (err) { console.error(err); }
    }
  };

  const handleDownload = async (fileName, originalName) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/materials/download/${encodeURIComponent(fileName)}`,
        { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName || fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) { alert('Download failed'); }
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
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
        <Link to="/" className="text-primary-600 hover:underline">Go to Homepage</Link>
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
                {isCourseTeacher && <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">You</span>}
              </div>
              <span className="text-xs text-text-medium">{course.teacher?.email}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-700">{course.category || 'General'}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-50 text-secondary-500">{course.level || 'All Levels'}</span>
          </div>
        </div>

        {isCourseTeacher && (
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/teacher/courses/${course._id}/manage-students`}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg transition"
            >
              <UserIcon className="h-4 w-4 mr-2" /> Quản Lý Sinh Viên
            </Link>

            {/* NÚT THIẾT KẾ TRANG GIỚI THIỆU MỚI */}
            <button 
              onClick={() => setShowLandingForm(true)}
              className="inline-flex items-center px-4 py-2 bg-secondary-500 text-white rounded-xl font-bold hover:bg-secondary-600 shadow-lg transition"
            >
              <CollectionIcon className="h-4 w-4 mr-2" />  Chi tiết khóa học
            </button>
          </div>
        )}
      </motion.div>

      {/* MODAL FORM LANDING PAGE (DÀNH CHO TEACHER) */}
      <AnimatePresence>
        {showLandingForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-black text-gray-800 uppercase text-primary-600">Thiết kế chi tiết khóa học</h2>
                <button onClick={() => setShowLandingForm(false)} className="p-2 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"><XIcon className="h-6 w-6"/></button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                {/* Link Video */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <label className="flex items-center text-sm font-black text-blue-700 mb-3 uppercase">
                    <VideoCameraIcon className="h-5 w-5 mr-2"/> Link Video giới thiệu (Youtube URL)
                  </label>
                  <input 
                    className="w-full p-4 rounded-xl border-2 border-white shadow-sm focus:border-primary-500 outline-none transition-all" 
                    placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>

                {/* Các Sections Nội dung */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-gray-700 uppercase flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-500"/> Nội dung trình bày chi tiết
                    </h3>
                    <button onClick={handleAddSection} className="flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-bold hover:bg-primary-200 transition">
                      <PlusIcon className="h-5 w-5 mr-1"/> Thêm đề mục
                    </button>
                  </div>

                  {sections.map((sec, idx) => (
                    <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group animate-fadeIn">
                      <button onClick={() => handleRemoveSection(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="h-6 w-6"/>
                      </button>
                      <input 
                        className="w-full mb-3 p-3 font-bold border rounded-xl outline-none focus:ring-2 focus:ring-primary-400" 
                        placeholder="Tiêu đề mục (Ví dụ: Bạn sẽ học được gì?)" 
                        value={sec.title}
                        onChange={(e) => updateSection(idx, 'title', e.target.value)}
                      />
                      <textarea 
                        className="w-full p-3 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-primary-400" 
                        placeholder="Nội dung chi tiết của mục này..."
                        value={sec.content}
                        onChange={(e) => updateSection(idx, 'content', e.target.value)}
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t bg-white">
                <button onClick={saveLandingPage} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-primary-700 transition flex items-center justify-center">
                  <SaveIcon className="h-6 w-6 mr-2"/> LƯU VÀ HIỂN THỊ TRANG GIỚI THIỆU
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TABS HỆ THỐNG */}
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
                
                {/* PHẦN PHÊ DUYỆT (CHỈ DÀNH CHO GIÁO VIÊN) */}
                {isCourseTeacher && pendingEnrollments.length > 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm">
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
                            <button onClick={() => handleApprove(enroll._id, 'approved')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition">Duyệt</button>
                            <button onClick={() => handleApprove(enroll._id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition">Từ chối</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="prose max-w-none text-gray-700 bg-white p-6 rounded-lg border border-gray-100 shadow">
                  <h3 className="text-xl font-bold mb-4 border-b pb-2 italic text-primary-600">About this course</h3>
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
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><DocumentTextIcon className="w-6 h-6" /></div>
                    <div><h3 className="font-bold text-gray-800">{m.title}</h3><p className="text-xs text-gray-500 italic">{m.originalName}</p></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleDownload(m.fileName, m.originalName)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><AcademicCapIcon className="w-6 h-6 rotate-180" /></button>
                    {isCourseTeacher && <button onClick={() => handleDeleteMaterial(m._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="h-6 w-6" /></button>}
                  </div>
                </div>
              )) : <div className="col-span-full text-center py-10 text-gray-400 italic">No materials available.</div>}
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
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600"><ClipboardListIcon className="w-6 h-6" /></div>
                    <div><h3 className="font-bold text-gray-800">{a.title}</h3><p className="text-xs text-red-500 font-bold">Due: {moment(a.deadline).format('MMM D, YYYY - HH:mm')}</p></div>
                  </div>
                  <div className="flex gap-4">
                    <Link to={`/assignments/${a._id}`} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-bold hover:bg-primary-100 transition">View Details</Link>
                    {isCourseTeacher && <button onClick={() => handleDeleteAssignment(a._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="h-6 w-6" /></button>}
                  </div>
                </div>
              )) : <div className="text-center py-10 text-gray-400 italic">No assignments yet.</div>}
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
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><AcademicCapIcon className="w-6 h-6" /></div>
                    <h3 className="font-bold text-gray-800">{q.title}</h3>
                  </div>
                  <div className="flex gap-3">
                    <Link to={isTeacher ? `/quizzes/${q._id}` : `/quizzes/${q._id}/take`} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition">{isTeacher ? 'Results' : 'Take Quiz'}</Link>
                    {isCourseTeacher && <button onClick={() => handleDeleteQuiz(q._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="h-6 w-6" /></button>}
                  </div>
                </div>
              )) : <div className="col-span-full text-center py-10 text-gray-400 italic">No quizzes available.</div>}
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
                <div key={n._id} className={`p-5 rounded-xl border shadow-sm flex justify-between items-start ${n.priority === 'high' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-lg ${n.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}><BellIcon className="w-6 h-6" /></div>
                    <div>
                      <h3 className={`font-bold ${n.priority === 'high' ? 'text-red-800' : 'text-gray-800'}`}>{n.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{n.content}</p>
                      <p className="text-xs text-gray-400 mt-3 italic">{moment(n.createdAt).fromNow()}</p>
                    </div>
                  </div>
                  {isCourseTeacher && <button onClick={() => handleDeleteNotice(n._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="h-6 w-6" /></button>}
                </div>
              )) : <div className="text-center py-10 text-gray-400 italic">No notices yet.</div>}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CourseDetails;