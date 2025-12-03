import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusIcon, UserAddIcon, XIcon } from '@heroicons/react/outline'; // XIcon cho nút đóng

// Component Modal đơn giản để chọn sinh viên
const StudentSelectModal = ({ isOpen, onClose, allStudents, onStudentAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lọc danh sách sinh viên dựa trên tìm kiếm
  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-xl font-bold text-gray-900">Select Student to Add</h3>
          <button onClick={onClose}>
            <XIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-gray-100 border rounded-md">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student._id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
                <button
                  onClick={() => onStudentAdd(student._id, student.name)}
                  className="text-primary-600 hover:text-primary-800 text-sm font-semibold"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="p-3 text-center text-sm text-gray-500">No students found.</p>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


const ManageStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // NEW: Danh sách tất cả sinh viên
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // NEW: State quản lý Modal

  // Hàm fetch data được cập nhật để sử dụng cho cả khởi tạo và làm mới
  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data.course);
      // Danh sách sinh viên hiện tại trong khóa học
      setStudents(res.data.students || []); 
    } catch (err) {
      toast.error('Failed to load course details');
      navigate('/teacher/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);
  
  // NEW: Hàm fetch tất cả sinh viên từ hệ thống
  const fetchAllStudents = async () => {
    try {
      // Gọi API lấy users và lọc theo vai trò student
      const res = await axios.get(`/api/users?role=student`); 
      
      // Lấy ID của các sinh viên ĐÃ có trong khóa học này
      const enrolledStudentIds = new Set(students.map(s => s._id));
      
      // Lọc ra các sinh viên CHƯA được thêm vào khóa học
      const unenrolledStudents = res.data.users.filter(user => 
        !enrolledStudentIds.has(user._id)
      );
      
      setAllStudents(unenrolledStudents);
    } catch (err) {
      toast.error('Failed to load all students list');
      console.error('Error fetching all students:', err);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);
  
  // Tải danh sách tất cả sinh viên sau khi có danh sách sinh viên trong khóa học
  useEffect(() => {
      if (!loading && course) {
          fetchAllStudents();
      }
  }, [loading, course, students]);


  // ==================================================
  // FIX: Triển khai logic Thêm Sinh viên từ Modal
  // ==================================================
  const handleAddStudent = async (studentId, studentName) => {
      setIsModalOpen(false); // Đóng modal ngay lập tức
      
      try {
        const res = await axios.put(`/api/courses/${id}/add-student`, { 
          studentId: studentId // Gửi studentId chính xác lên server
        });

        if (res.data.success) {
          toast.success(`${studentName || 'Student'} added successfully!`);
          await fetchCourseDetails(); // Refresh list course students
        }
      } catch (err) {
        console.error('Error adding student:', err.response || err);
        // Hiển thị thông báo lỗi chi tiết từ server
        toast.error(err.response?.data?.message || 'Failed to add student. Please ensure a valid Student ID is provided.');
      }
  };

  // ==================================================
  // FIX: Triển khai logic Xóa Sinh viên
  // ==================================================
  const handleRemoveStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove student ${studentName || studentId} from this course?`)) {
      return;
    }

    try {
      const res = await axios.put(`/api/courses/${id}/remove-student`, { 
        studentId: studentId 
      });

      if (res.data.success) {
        toast.success(`${studentName || 'Student'} removed successfully!`);
        await fetchCourseDetails(); // Refresh list
      }
    } catch (err) {
      console.error('Error removing student:', err.response || err);
      toast.error(err.response?.data?.message || 'Failed to remove student.');
    }
  };

  // ==================================================
  // HIỂN THỊ
  // ==================================================
  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  if (!course) return <div className="text-center py-20 text-xl">Course not found.</div>;
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Manage Students for: {course.title} ({course.code})</h1>
      <p className="mb-6 text-gray-600">Total enrolled students: {students.length}</p>

      {/* Button mở Modal */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mb-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 inline-flex items-center gap-2"
      >
        <UserAddIcon className="h-5 w-5" />
        Add Student
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {students.map(student => (
            <li key={student._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
              <button 
                onClick={() => handleRemoveStudent(student._id, student.name)} 
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        {students.length === 0 && (
          <p className="p-4 text-gray-500 text-center">No students currently enrolled.</p>
        )}
      </div>
      
      {/* Modal chọn sinh viên */}
      <StudentSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // Danh sách sinh viên chưa được thêm vào
        allStudents={allStudents} 
        onStudentAdd={handleAddStudent}
      />
    </div>
  );
};

export default ManageStudents;