// src/pages/teacher/Users.js (TẠO MỚI FILE NÀY)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.users);
      } catch (err) {
        toast.error('Không tải được danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">Quản Lý Người Dùng</h1>
      {loading ? (
        <p className="text-center text-xl">Đang tải...</p>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-primary-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Tên</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Vai trò</th>
                <th className="px-6 py-4 text-left">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 px-3 py-1 rounded-full text-sm font-bold ${
                      u.role === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;