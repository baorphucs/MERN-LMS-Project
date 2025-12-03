const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignment,
  createAssignment,
  // Thêm updateAssignment (Hàm này có thể bị thiếu/xóa trong controller)
  updateAssignment, 
  deleteAssignment,
  submitAssignment,
  // Đổi tên gradeSubmission thành gradeSubmissionByAssignmentId để rõ ràng hơn
  // Nhưng vì nó đã có trong controller cũ, ta giữ nguyên tên để không gây nhầm lẫn
  gradeSubmission, 
  getStudentAssignments,
  getAssignmentsForTeacher
} = require('../controllers/assignment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/assignments';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Student specific routes - must be before /:id route
router.get('/student', protect, authorize('student'), getStudentAssignments);

// Teacher specific route - must be before /:id route
router.get('/teacher', protect, authorize('teacher', 'admin'), getAssignmentsForTeacher);

// Basic routes
router.route('/')
  .get(protect, getAssignments)
  .post(protect, authorize('teacher', 'admin'), createAssignment);

// Single assignment routes
router.route('/:id')
  .get(protect, getAssignment)
  .put(protect, authorize('teacher', 'admin'), updateAssignment) // Dòng 50 đã được fix trong Controller
  .delete(protect, authorize('teacher', 'admin'), deleteAssignment);

// Submission routes (Đã sửa lỗi: gradeSubmission đã được chuyển sang submission.routes.js trong các phiên bản trước)
// Tuy nhiên, nếu bạn muốn giữ nó ở đây, ta phải đảm bảo nó được import.
router.post('/:id/submit', protect, authorize('student'), upload.single('file'), submitAssignment);
// XÓA DÒNG NÀY VÀ SỬ DỤNG submission.routes.js để tránh nhầm lẫn route
// router.post('/:id/grade/:submissionId', protect, authorize('teacher', 'admin'), gradeSubmission);

module.exports = router;