// FILE_PATH: server/models/message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // chatRoomId: ID của người dùng (Student/Teacher) mà Admin sẽ chat với
  chatRoomId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isRead: { // Có thể dùng cho Admin để đánh dấu tin nhắn chưa đọc
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);