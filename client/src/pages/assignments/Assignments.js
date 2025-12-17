import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { 
  SearchIcon, 
  BookOpenIcon, 
  BadgeCheckIcon, 
  UsersIcon, 
  XIcon, 
  CheckIcon 
} from '@heroicons/react/outline';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State cho Modal quản lý danh sách học sinh
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy đúng endpoint dựa trên vai trò
        const endpoint = isTeacher ? '/api/assignments/teacher' : '/api/assignments/student';
        const res = await axios.get(endpoint);
        setAssignments(res.data.assignments || []);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu bài học:", err);
        setLoading(false); 
      }
    };
    fetchData();
  }, [isTeacher, location.key]);

  // Hàm xử lý khi bấm vào nút QUẢN LÝ
  const handleOpenManage = (assignment) => {
    setSelectedAssignment(assignment);
    setShowManageModal(true);
  };

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-10 font-bold">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight flex items-center">
          <BookOpenIcon className="h-8 w-8 mr-3 text-primary-600" />
          Hệ thống bài học
        </h1>
        <div className="relative w-64">
           <input 
             type="text" 
             placeholder="Tìm tên bài học..." 
             className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-500 transition-all" 
             onChange={(e) => setSearchTerm(e.target.value)} 
           />
           <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Danh sách thẻ bài học */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAssignments.map((assignment, index) => {
          // Kiểm tra xem student đã hoàn thành chưa (kiểm tra từ database)
          const studentSubmission = assignment.submissions?.find(s => s.student?._id === user?._id || s.student === user?._id);
          const isDone = isStudent && studentSubmission;

          return (
            <div 
              key={assignment._id} 
              className={`bg-white rounded-2xl p-5 border flex justify-between items-center shadow-sm transition-all ${
                isDone ? 'border-green-200 bg-green-50/20' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                  isDone ? 'bg-green-500 text-white' : 'bg-primary-50 text-primary-600'
                }`}>
                  {isDone ? <BadgeCheckIcon className="h-7 w-7" /> : index + 1}
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-extrabold text-gray-800 uppercase tracking-tight">
                      {assignment.title}
                    </h2>
                    
                    {/* NÚT QUẢN LÝ DÀNH RIÊNG CHO TEACHER */}
                    {isTeacher && (
                      <button 
                        onClick={() => handleOpenManage(assignment)} 
                        className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black hover:bg-indigo-600 hover:text-white border border-indigo-100 transition-all shadow-sm"
                      >
                        <UsersIcon className="h-3.5 w-3.5" /> QUẢN LÝ
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-medium italic">
                    Khóa học: {assignment.courseId?.title || 'General'}
                  </p>
                </div>
              </div>

              <Link 
                to={`/assignments/${assignment._id}`} 
                className={`px-8 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 ${
                  isDone 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100'
                }`}
              >
                {isTeacher ? 'Xem nội dung' : (isDone ? 'Xem lại bài' : 'Vào học ngay')}
              </Link>
            </div>
          );
        })}
      </div>

      {/* MODAL QUẢN LÝ TIẾN ĐỘ (TEACHER ONLY) */}
      <AnimatePresence>
        {showManageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowManageModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl p-7 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tight">Tiến độ bài học</h3>
                  <p className="text-sm text-primary-600 font-bold">{selectedAssignment?.title}</p>
                </div>
                <button 
                  onClick={() => setShowManageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedAssignment?.submissions?.length > 0 ? (
                  selectedAssignment.submissions.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                          {sub.student?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-800 leading-tight">{sub.student?.name}</p>
                          <p className="text-[11px] text-gray-500">{sub.student?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-700 font-black text-[10px] bg-white px-3 py-1.5 rounded-full border border-green-200 uppercase tracking-tighter shadow-sm">
                        <CheckIcon className="h-3 w-3" /> DONE
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <UsersIcon className="h-14 w-14 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold italic">Chưa có học sinh nào hoàn thành bài học này.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-end">
                <button 
                  onClick={() => setShowManageModal(false)}
                  className="px-8 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-black transition-all"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
