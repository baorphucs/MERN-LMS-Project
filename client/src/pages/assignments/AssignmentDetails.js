import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { ArrowLeftIcon, CheckCircleIcon, BadgeCheckIcon } from '@heroicons/react/outline';

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const isStudent = user?.role === 'student';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/assignments/${id}`);
        const data = res.data.assignment;
        setAssignment(data);

        // Kiểm tra xem học sinh này đã hoàn thành bài này trong database chưa
        if (isStudent && data.submissions.some(sub => sub.student?._id === user._id)) {
          setIsCompleted(true);
        }
        setLoading(false);
      } catch (err) { setLoading(false); }
    };
    fetchDetails();
  }, [id, user._id, isStudent]);

  const handleComplete = async () => {
    try {
      // Gửi yêu cầu lên server để lưu trạng thái hoàn thành
      await axios.post(`/api/assignments/${id}/submit`);
      
      setIsCompleted(true);
      localStorage.setItem(`status_assign_${id}`, 'completed');
      toast.success("🎉 Chúc mừng! Bạn đã hoàn thành bài học này!");
    } catch (err) {
      toast.error("Không thể ghi nhận trạng thái hoàn thành.");
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading || !assignment) return <div className="text-center p-10">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-6 font-bold">
        <ArrowLeftIcon className="h-5 w-5 mr-1" /> Quay lại
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8 border">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h1 className="text-3xl font-black text-primary-600 uppercase">{assignment.title}</h1>
          
          {isStudent && (
            isCompleted ? (
              <div className="flex items-center bg-green-500 text-white px-6 py-2 rounded-2xl font-bold shadow-lg">
                <BadgeCheckIcon className="h-6 w-6 mr-2" /> ĐÃ HOÀN THÀNH
              </div>
            ) : (
              <button onClick={handleComplete} className="flex items-center bg-primary-600 text-white px-6 py-2 rounded-2xl font-bold shadow-lg hover:bg-primary-700">
                <CheckCircleIcon className="h-6 w-6 mr-2" /> HOÀN THÀNH BÀI HỌC
              </button>
            )
          )}
        </div>

        {getEmbedUrl(assignment.videoUrl) ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-10 bg-black">
            <iframe width="100%" height="100%" src={getEmbedUrl(assignment.videoUrl)} title="Lesson" frameBorder="0" allowFullScreen></iframe>
          </div>
        ) : (
          <div className="bg-gray-100 p-10 rounded-2xl text-center italic mb-10">Bài học này không có video.</div>
        )}

        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-4">Nội dung bài học:</h3>
          <div className="text-gray-700 whitespace-pre-line bg-blue-50 p-6 rounded-2xl border border-blue-100">
            {assignment.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;

