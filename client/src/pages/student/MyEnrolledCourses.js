import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyEnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchMyCourses = async () => {
      const res = await axios.get('/api/users/me/courses');
      setCourses(res.data.courses || []);
    };
    fetchMyCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 italic text-primary-600">Khóa Học Của Bạn</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.length > 0 ? courses.map(course => (
          <div key={course._id} className="bg-white rounded-2xl shadow-md p-6 border border-primary-50">
            <h3 className="text-xl font-bold">{course.title}</h3>
            <p className="text-gray-500 mt-2">Mã: {course.code}</p>
            <Link to={`/courses/${course._id}`} className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-xl font-bold">Vào học</Link>
          </div>
        )) : <p>Bạn chưa có khóa học nào được duyệt.</p>}
      </div>
    </div>
  );
};
export default MyEnrolledCourses;