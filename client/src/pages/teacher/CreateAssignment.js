import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateAssignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '', // Trường mới
    description: '',
    deadline: '',
    totalPoints: 100
  });

  const { title, videoUrl, description, deadline, totalPoints } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/assignments', { ...formData, courseId });
      toast.success('Tạo bài học thành công!');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tạo bài học');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-primary-600">Thêm Bài Học Mới</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Tiêu đề bài học</label>
          <input type="text" name="title" value={title} onChange={onChange} required className="w-full p-2 border rounded-md" />
        </div>

        {/* Ô NHẬP VIDEO URL */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Link Video Youtube (Tùy chọn)</label>
          <input 
            type="text" 
            name="videoUrl" 
            placeholder="Dán link vào đây: https://www.youtube.com/watch?v=..." 
            value={videoUrl} 
            onChange={onChange} 
            className="w-full p-2 border rounded-md border-blue-300 focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Mô tả bài học</label>
          <textarea name="description" value={description} onChange={onChange} required rows="5" className="w-full p-2 border rounded-md" />
        </div>

        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700">Tạo Bài Học</button>
      </form>
    </div>
  );
};

export default CreateAssignment;
