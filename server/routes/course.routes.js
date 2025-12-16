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
  togglePublishCourse, // THÊM: Import hàm ẩn/hiện khóa học
  enrollCourse 
} = require('../controllers/course.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// Routes công khai (Lưu ý: getCourses giờ đã có logic lọc isPublished)
router.get('/', protect, getCourses); 
router.get('/:id', getCourse);

// Routes yêu cầu đăng nhập (Học sinh)
router.post('/:id/enroll', protect, enrollCourse);

// Routes dành cho giáo viên (Quản lý khóa học)
router.post('/', protect, authorize('teacher'), createCourse);
router.get('/teacher/my-courses', protect, authorize('teacher'), getTeacherCourses);
router.put('/:id', protect, authorize('teacher'), updateCourse);
router.delete('/:id', protect, authorize('teacher'), deleteCourse);

// Route mới: Ẩn/Hiện khóa học
// Chỉ giáo viên sở hữu khóa học mới có quyền gọi route này
router.put('/:id/toggle-publish', protect, authorize('teacher'), togglePublishCourse);

// Quản lý sinh viên trong khóa học
router.put('/:id/add-student', protect, authorize('teacher'), addStudentToCourse);
router.put('/:id/remove-student', protect, authorize('teacher'), removeStudentFromCourse);

module.exports = router;