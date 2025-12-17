const express = require('express');
const router = express.Router();
const { 
  getAssignments, 
  getAssignment, 
  createAssignment, 
  deleteAssignment,
  submitAssignment,
  getTeacherAssignments, // Đảm bảo hàm này tồn tại trong controller
  getStudentAssignments  // Đảm bảo hàm này tồn tại trong controller
} = require('../controllers/assignment.controller');

// FIX: Sửa đường dẫn auth thành auth.middleware theo cấu trúc file của bạn
const { protect, authorize } = require('../middleware/auth.middleware');

// Routes cho danh sách bài học theo Role
router.get('/teacher', protect, authorize('teacher'), getTeacherAssignments);
router.get('/student', protect, authorize('student'), getStudentAssignments);

// Route cơ bản
router.route('/')
  .get(protect, getAssignments)
  .post(protect, authorize('teacher'), createAssignment);

router.route('/:id')
  .get(protect, getAssignment)
  .delete(protect, authorize('teacher'), deleteAssignment);

// Route cho học sinh nhấn "Hoàn thành"
router.post('/:id/submit', protect, authorize('student'), submitAssignment);

module.exports = router;
