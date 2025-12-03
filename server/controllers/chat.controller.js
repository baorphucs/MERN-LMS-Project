// FILE_PATH: server/controllers/chat.controller.js (CẬP NHẬT)
const Message = require('../models/message.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Hàm lưu tin nhắn vào DB
exports.saveMessage = async (data) => {
  try {
    const { senderId, receiverId, message } = data;
    
    // 1. Tìm thông tin người gửi (sender)
    const sender = await User.findById(senderId).select('role');
    if (!sender) {
        console.error('Lỗi: Không tìm thấy người gửi (sender)');
        return null;
    }
    
    let chatRoomId = new mongoose.Types.ObjectId(senderId);

    // 2. Xử lý logic chatRoomId
    // Nếu người gửi là Student, chatRoomId là ID của chính Student đó.
    if (sender.role === 'student') {
        chatRoomId = new mongoose.Types.ObjectId(senderId);
    } 
    // Nếu người gửi là Teacher (Admin), chatRoomId phải là ID của Student mà họ đang chat cùng (receiverId)
    else if (sender.role === 'teacher' && mongoose.Types.ObjectId.isValid(receiverId)) {
        // Kiểm tra xem receiverId có phải là ID User hợp lệ không
        const receiver = await User.findById(receiverId).select('role');
        if (receiver && receiver.role === 'student') {
            chatRoomId = new mongoose.Types.ObjectId(receiverId);
        } else {
            console.error('Lỗi: Teacher đang gửi tin nhắn không hợp lệ đến non-student ID.');
            return null;
        }
    } else {
        // Nếu Teacher/Admin tự gửi tin cho mình, hoặc gửi đến ID không phải User.
        // Ta cần phải có receiverId hợp lệ (ID của Student) để xác định chatRoomId.
        // Nếu không có receiverId hợp lệ, ta sẽ dừng lại.
        // Đây là trường hợp Student dùng ChatWidget, gửi tin mà chưa rõ Admin nào nhận.
        if (receiverId === 'admin_support_room') {
             // Trường hợp Student gửi tin đến Admin chung (backend sẽ lưu với chatRoomId là ID của Student)
             chatRoomId = new mongoose.Types.ObjectId(senderId);
        } else {
             console.error('Lỗi: Không thể xác định chatRoomId hợp lệ.');
             return null;
        }
    }

    const newMessage = await Message.create({
      chatRoomId,
      sender: senderId,
      message,
    });
    
    // Populate sender info để trả về (cần thiết cho socket logic)
    await newMessage.populate('sender', 'name role');
    return newMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};

// @desc    Get chat history for a room (User ID)
// @route   GET /api/chat/history/:chatRoomId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const userId = req.user.id;
    
    // Chỉ cho phép lấy lịch sử nếu user là chủ phòng chat hoặc là Teacher/Admin
    if (chatRoomId !== userId && req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to view this chat history' });
    }

    // Đã sửa: dùng lean() để chuyển thành object thường và tránh lỗi khi gán
    const messages = await Message.find({ chatRoomId })
      .populate('sender', 'name role')
      .sort('createdAt')
      .lean(); // Dùng .lean()
      
    // Đánh dấu tin nhắn là đã đọc (nếu user không phải sender của tin nhắn)
    if (messages.length > 0) {
      await Message.updateMany(
        { chatRoomId, sender: { $ne: userId }, isRead: false },
        { isRead: true }
      );
    }

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get recent conversations for Admin (Teacher)
// @route   GET /api/chat/admin/conversations
// @access  Private/Teacher
exports.getConversations = async (req, res) => {
  try {
    // 1. Nhóm theo chatRoomId và lấy tin nhắn cuối cùng
    const conversations = await Message.aggregate([
      // Lọc các tin nhắn mà Teacher (req.user.id) không phải là người gửi
      // Ta không cần lọc này vì ta coi Teacher chỉ là Admin. Tất cả tin nhắn
      // có chatRoomId là Student ID đều là cuộc hội thoại cần hỗ trợ.
      
      // Nhóm theo chatRoomId (ID của Student)
      {
        $group: {
          _id: '$chatRoomId',
          lastMessage: { $last: '$message' },
          lastSender: { $last: '$sender' },
          lastTime: { $last: '$createdAt' },
          unreadCount: { 
            $sum: { 
              $cond: [
                { $and: [ 
                  { $eq: ['$isRead', false] }, 
                  { $ne: ['$sender', new mongoose.Types.ObjectId(req.user.id)] } 
                ]}, 
                1, 
                0
              ] 
            } 
          }
        }
      },
      // Sắp xếp theo thời gian gửi cuối cùng
      { $sort: { lastTime: -1 } },
      // Populate thông tin người dùng (Student)
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      // Bỏ các cuộc hội thoại không phải Student hoặc không tìm thấy
      { $match: { 'student.role': 'student' } },
      // Unwrap thông tin student
      { $unwind: '$student' },
      // Lấy thông tin người gửi cuối cùng
      {
        $lookup: {
          from: 'users',
          localField: 'lastSender',
          foreignField: '_id',
          as: 'lastSenderInfo'
        }
      },
      { $unwind: '$lastSenderInfo' },
      // Project ra kết quả cuối cùng
      {
        $project: {
          _id: 0,
          chatRoomId: '$_id',
          student: {
            _id: '$student._id',
            name: '$student.name',
            email: '$student.email',
          },
          lastMessage: 1,
          lastTime: 1,
          lastSender: '$lastSenderInfo.name',
          unreadCount: 1,
        }
      }
    ]);

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Hàm được sử dụng bởi Socket.IO để lưu tin nhắn (không phải API)
exports.handleSocketMessage = exports.saveMessage; 
delete exports.saveMessage;