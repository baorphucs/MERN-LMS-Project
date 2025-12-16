const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourse, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getTeacherCourses,
  addStudentToCourse,
  removeStudentFromCourse,
  enrollCourse // CHỈ GIỮ DUY NHẤT 1 KHAI BÁO TẠI ĐÂY
} = require('../controllers/course.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// Routes công khai
router.get('/', getCourses);
router.get('/:id', getCourse);

// Routes yêu cầu đăng nhập
router.post('/:id/enroll', protect, enrollCourse);

// Routes dành cho giáo viên
router.post('/', protect, authorize('teacher'), createCourse);
router.get('/teacher/my-courses', protect, authorize('teacher'), getTeacherCourses);
router.put('/:id', protect, authorize('teacher'), updateCourse);
router.delete('/:id', protect, authorize('teacher'), deleteCourse);

// Quản lý sinh viên trong khóa học
router.put('/:id/add-student', protect, authorize('teacher'), addStudentToCourse);
router.put('/:id/remove-student', protect, authorize('teacher'), removeStudentFromCourse);

module.exports = router;