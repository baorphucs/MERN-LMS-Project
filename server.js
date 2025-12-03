// FILE_PATH: server/server.js (CẬP NHẬT HOÀN TOÀN)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// NEW IMPORTS FOR CHAT
const http = require('http'); 
const { Server } = require('socket.io'); 
const { handleSocketMessage } = require('./controllers/chat.controller'); 

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const noticeRoutes = require('./routes/notice.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const quizRoutes = require('./routes/quiz.routes');
const materialRoutes = require('./routes/material.routes');
const submissionRoutes = require('./routes/submission.routes');
const activityRoutes = require('./routes/activity.routes'); 
const notificationRoutes = require('./routes/notification.routes');
// NEW IMPORT
const chatRoutes = require('./routes/chat.routes'); 

const app = express();
// Tạo HTTP server từ app Express
const server = http.createServer(app); 

// Cấu hình Socket.IO
const io = new Server(server, {
  cors: {
    // Đảm bảo khớp với frontend port
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '*', 
    methods: ["GET", "POST"]
  }
});

// Disable caching for all API responses
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_new';

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Server still runs, but DB is not connected
  });

// Add debug logging middleware to catch API errors
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.error(`Error response: ${data}`);
    }
    return originalSend.call(this, data);
  };
  next();
});

// Add a debug middleware for content routes
app.use(['/api/materials', '/api/assignments', '/api/quizzes', '/api/notices'], (req, res, next) => {
  console.log(`DEBUG: ${req.method} ${req.originalUrl}`);
  console.log('Query params:', req.query);
  console.log('URL params:', req.params);
  console.log('Body:', req.body);
  next();
});

// KẾT NỐI SOCKET.IO LOGIC
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // 1. User tham gia phòng chat của chính họ (User ID)
  socket.on('join_room', (userId) => {
    socket.join(userId); 
    console.log(`User ${userId} joined room ${userId}`);
  });
  
  // 2. Admin tham gia phòng hỗ trợ chung
  socket.on('join_admin_room', () => {
    socket.join('admin_support_room');
    console.log(`Admin joined admin_support_room`);
  });

  // 3. Nhận tin nhắn và gửi lại cho người nhận (Real-time)
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message } = data;

    // Lưu tin nhắn vào DB (sử dụng logic từ controller)
    const savedMessage = await handleSocketMessage({ senderId, receiverId, message }); 
    
    if (savedMessage) {
        // Data để gửi đi, bao gồm cả timestamp từ DB
        const responseData = { 
            ...data, 
            messageId: savedMessage._id,
            createdAt: savedMessage.createdAt,
            // Gửi đối tượng sender đầy đủ
            sender: { 
              _id: savedMessage.sender._id.toString(),
              name: savedMessage.sender.name,
              role: savedMessage.sender.role
            },
        };

        // *** FIX BACKEND: Chỉ gửi tin nhắn đến room ID của Student và Admin Room. ***
        // *** Frontend (Student/Admin) sẽ tự xử lý hiển thị tin nhắn đã gửi (Optimistic Update) ***
        
        // Gửi tin nhắn đến phòng chat của Student (luôn là chatRoomId)
        io.to(savedMessage.chatRoomId.toString()).emit('receive_message', responseData);

        // Nếu người gửi là Student, gửi đến Admin Room
        if (savedMessage.sender.role === 'student') {
             io.to('admin_support_room').emit('new_chat_notification', { 
                chatRoomId: savedMessage.chatRoomId, 
                message: message 
            });
        }
        
        // Nếu người gửi là Teacher/Admin, gửi tin nhắn trực tiếp đến phòng của Student
        if (savedMessage.sender.role === 'teacher') {
             io.to(savedMessage.chatRoomId.toString()).emit('receive_message', responseData);
        }

        // Gửi self-update đến chính người gửi (để đồng bộ hóa messageId/createdAt)
        io.to(senderId).emit('receive_message', responseData);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/activities', activityRoutes); 
app.use('/api/notifications', notificationRoutes);
// NEW ROUTE
app.use('/api/chat', chatRoutes); 

// Global error handler for any uncaught errors in the routes
app.use('/api/*', (error, req, res, next) => {
  console.error('API Error caught by middleware:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, '../client/public')));

  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next(); // Let API routes be handled above
    }
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'This email is already registered'
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong on the server'
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error('Error:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Start server (Sử dụng server.listen thay vì app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));