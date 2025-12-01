// src/pages/teacher/EditCourse.js (THAY THẾ HOÀN TOÀN)
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: '', description: '', code: '', coverImageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          title: res.data.course.title,
          description: res.data.course.description || '',
          code: res.data.course.code || '',
          coverImageUrl: res.data.course.coverImageUrl || ''
        });
        setLoading(false);
      } catch (err) {
        toast.error('Không tải được khóa học');
        navigate('/teacher/courses');
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/courses/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Cập nhật khóa học thành công!');
      navigate('/teacher/courses');
    } catch (err) {
      toast.error('Cập nhật thất bại');
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Sửa Khóa Học</h1>
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <input name="title" value={formData.title} onChange={onChange} placeholder="Tên khóa học" required className="w-full px-4 py-3 border rounded-lg" />
        <input name="code" value={formData.code} onChange={onChange} placeholder="Mã khóa học" required className="w-full px-4 py-3 border rounded-lg" />
        <textarea name="description" value={formData.description} onChange={onChange} placeholder="Mô tả" rows="5" className="w-full px-4 py-3 border rounded-lg" />
        <input name="coverImageUrl" value={formData.coverImageUrl} onChange={onChange} placeholder="URL ảnh bìa" className="w-full px-4 py-3 border rounded-lg" />

        <div className="flex gap-4 justify-center pt-6">
          <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold">
            Lưu Thay Đổi
          </button>
          <button type="button" onClick={() => navigate('/teacher/courses')} className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;