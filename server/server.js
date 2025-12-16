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
const chatRoutes = require('./routes/chat.routes'); 
// NEW IMPORT FOR ENROLLMENT
const enrollmentRoutes = require('./routes/enrollment.routes');

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
  });

// Debug logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    return originalSend.call(this, data);
  };
  next();
});

// KẾT NỐI SOCKET.IO LOGIC
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_room', (userId) => {
    socket.join(userId); 
    console.log(`User ${userId} joined room ${userId}`);
  });
  
  socket.on('join_admin_room', () => {
    socket.join('admin_support_room');
    console.log(`Admin joined admin_support_room`);
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message } = data;
    const savedMessage = await handleSocketMessage({ senderId, receiverId, message }); 
    
    if (savedMessage) {
        const responseData = { 
            ...data, 
            messageId: savedMessage._id,
            createdAt: savedMessage.createdAt,
            sender: savedMessage.sender.toString(),
        };
        io.to(senderId).emit('receive_message', responseData);
        io.to(savedMessage.chatRoomId.toString()).emit('receive_message', responseData);

        if (senderId === savedMessage.chatRoomId.toString()) {
            io.to('admin_support_room').emit('new_chat_notification', { 
                chatRoomId: savedMessage.chatRoomId, 
                message: message 
            });
        }
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
app.use('/api/chat', chatRoutes); 
// NEW ROUTE FOR ENROLLMENT
app.use('/api/enrollments', enrollmentRoutes);

// Global API error handler
app.use('/api/*', (error, req, res, next) => {
  console.error('API Error:', error);
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
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({ success: false, message: 'This email is already registered' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => process.exit(1));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));