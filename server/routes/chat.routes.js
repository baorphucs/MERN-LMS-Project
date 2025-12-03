// FILE_PATH: server/routes/chat.routes.js
const express = require('express');
const router = express.Router();
const { getMessages, getConversations } = require('../controllers/chat.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Route lấy lịch sử chat cho cả 2 bên (User ID là chatRoomId)
router.get('/history/:chatRoomId', protect, getMessages);

// Route lấy danh sách hội thoại cho Admin (Teacher)
router.get('/admin/conversations', protect, authorize('teacher'), getConversations);

// API dự phòng để gửi tin nhắn (có thể bị bỏ qua nếu chỉ dùng socket)
// router.post('/', protect, async (req, res) => {
//     // ... logic gọi saveMessage ...
// }); 

module.exports = router;