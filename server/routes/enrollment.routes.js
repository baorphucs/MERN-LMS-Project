const express = require('express');
const router = express.Router();
// Đảm bảo tên file là auth.middleware.js như bạn đã nói
const { protect, authorize } = require('../middleware/auth.middleware'); 
const { requestEnroll, getPendingEnrollments, handleEnrollment } = require('../controllers/enrollment.controller');

router.post('/register', protect, requestEnroll);
router.get('/pending/:courseId', protect, authorize('teacher'), getPendingEnrollments);
router.put('/handle/:id', protect, authorize('teacher'), handleEnrollment);

module.exports = router;