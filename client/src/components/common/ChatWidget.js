// FILE_PATH: client/src/components/common/ChatWidget.js (ĐÃ SỬA LỖI LOẠN/TRÙNG LẶP)
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatIcon, XIcon, PaperAirplaneIcon, RefreshIcon } from '@heroicons/react/outline';
import io from 'socket.io-client';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import moment from 'moment';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const socket = io(BACKEND_URL); 

const ChatWidget = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ID phòng chat của người dùng này (dùng user._id làm room ID)
  const chatRoomId = user?._id; 
  const isStudent = user?.role === 'student';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const fetchMessages = async () => {
    if (!chatRoomId) return;
    setLoading(true);
    try {
      // Đảm bảo API trả về object với sender.name và sender._id
      const res = await axios.get(`/api/chat/history/${chatRoomId}`); 
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Thiết lập Socket và Join Room
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Join room của user hiện tại
    socket.emit('join_room', chatRoomId);
    
    // Admin (Teacher) cũng join phòng chung để nhận thông báo từ Student
    if (user.role === 'teacher') {
        socket.emit('join_admin_room');
    }

    // 2. Lắng nghe tin nhắn
    const handleReceiveMessage = (data) => {
        // ChatRoomId là ID của Student, nên tin nhắn gửi đến Student (receiverId=chatRoomId)
        // hoặc gửi từ Student (senderId=chatRoomId) đều thuộc về phòng này.
        if (data.senderId === chatRoomId || data.receiverId === chatRoomId) {
            
            setMessages(prev => {
                // *** FIX LỖI: Tránh thêm tin nhắn nếu nó đã có (tránh trùng lặp từ socket) ***
                if (data.messageId && prev.some(m => m.messageId === data.messageId)) {
                    return prev; 
                }
                
                return [...prev, data];
            });
        }
    };
    
    socket.on('receive_message', handleReceiveMessage);

    // Dọn dẹp
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [isAuthenticated, user, chatRoomId]);
  
  // Auto scroll khi có tin nhắn mới hoặc mở chat
  useEffect(() => {
      scrollToBottom();
  }, [messages, isOpen]);
  
  // Tải lịch sử khi mở chat lần đầu
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchMessages();
    }
  }, [isOpen]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatRoomId) return;

    const messageData = {
      senderId: chatRoomId,
      // Gửi đến Admin chung, Backend sẽ xử lý
      receiverId: 'admin_support_room', 
      message: inputMessage.trim(),
    };
    
    // Gửi qua Socket.IO
    socket.emit('send_message', messageData);

    setInputMessage('');
  };
  
  const chatButton = (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-primary-700 transition-colors"
    >
      {isOpen ? <XIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
    </motion.button>
  );

  if (user?.role === 'teacher') {
    // Teacher nên dùng trang AdminChat để quản lý nhiều cuộc hội thoại
    return chatButton;
  }
  
  // Chỉ Student mới thấy ChatWidget hỗ trợ
  if (!isStudent) return null;

  return (
    <>
      {chatButton}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-primary-100"
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-primary-600 text-white rounded-t-xl">
              <h3 className="font-bold text-lg">Hỗ trợ Trực tuyến</h3>
              <button onClick={fetchMessages} disabled={loading} className="p-1 rounded-full hover:bg-primary-700">
                  <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-neutral-50/80">
              {loading ? (
                <p className="text-center text-gray-500 mt-5">Đang tải lịch sử...</p>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-5">
                    <p>Chào mừng! Chúng tôi sẵn sàng hỗ trợ bạn.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                    // CHECK: Dùng logic kiểm tra sender ID thống nhất
                    const senderId = msg.sender?._id || msg.sender;
                    const isMe = senderId === chatRoomId; // chatRoomId là user._id

                    return (
                        <div 
                            key={msg.messageId || index}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-2 rounded-lg text-sm shadow-md ${
                                isMe
                                    ? 'bg-primary-400 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border'
                            }`}>
                                <p>{msg.message}</p>
                                <span className={`block text-xs mt-1 ${isMe ? 'text-primary-100' : 'text-gray-500'}`}>
                                    {moment(msg.createdAt).format('HH:mm')}
                                </span>
                            </div>
                        </div>
                    );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t flex bg-white">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white p-2 rounded-r-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                disabled={!inputMessage.trim()}
              >
                <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;