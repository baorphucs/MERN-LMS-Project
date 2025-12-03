// FILE_PATH: client/src/pages/teacher/AdminChat.js (ĐÃ SỬA LỖI REAL-TIME ADMIN)
import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshIcon, PaperAirplaneIcon, ChatIcon, ChevronLeftIcon } from '@heroicons/react/outline';
import io from 'socket.io-client';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const socket = io(BACKEND_URL); 

const AdminChat = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null); // chatRoomId của Student
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 1. Fetch Danh sách Hội thoại (Conversations)
    const fetchConversations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/chat/admin/conversations');
            setConversations(res.data.conversations);
            toast.success("Danh sách hội thoại đã được cập nhật.");
        } catch (err) {
            console.error('Error fetching conversations:', err);
            toast.error("Không tải được danh sách hội thoại.");
        } finally {
            setLoading(false);
        }
    };
    
    // 2. Fetch Lịch sử tin nhắn cho phòng đã chọn
    const fetchMessages = async (chatRoomId) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/chat/history/${chatRoomId}`);
            setMessages(res.data.messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };
    
    // 3. Xử lý khi chọn một phòng chat
    const handleSelectRoom = (room) => {
        if (selectedRoom) {
            socket.emit('leave_room', selectedRoom.chatRoomId);
        }
        
        setSelectedRoom(room);
        setMessages([]); 
        fetchMessages(room.chatRoomId);
        
        // Admin join phòng của Student để nghe tin nhắn đến từ Student
        socket.emit('join_room', room.chatRoomId); 
    };

    // 4. Thiết lập Socket.IO và lắng nghe
    useEffect(() => {
        if (!user) return;
        
        socket.emit('join_admin_room');
        // Admin cũng join phòng của chính họ (user._id) để nhận self-update tin nhắn
        socket.emit('join_room', user._id); 

        const handleNewNotification = (data) => {
            toast.info(`Tin nhắn mới từ ${data.chatRoomId}. Cập nhật danh sách.`);
            fetchConversations();
        };

        // Lắng nghe tin nhắn Real-time
        const handleReceiveMessage = (data) => {
            
            // Lấy ID người gửi để so sánh
            const senderId = data.sender?._id || data.sender;

            // Kiểm tra xem tin nhắn này có thuộc phòng đang mở VÀ nó không phải là self-update của Admin đang gửi từ ChatWidget hay không.
            if (selectedRoom && (senderId === selectedRoom.chatRoomId || 
                                data.receiverId === selectedRoom.chatRoomId ||
                                senderId === user._id) 
            ) {
                setMessages(prev => {
                    // Tránh duplicate
                    if (data.messageId && prev.some(m => m.messageId === data.messageId)) return prev;
                    
                    // Nếu là tin nhắn của Admin, ta cần thêm thông tin sender.name
                    // Trong trường hợp này, ta có thể giả định tin nhắn gửi từ user._id (Admin)
                    if (senderId === user._id && !data.sender?.name) {
                        data.sender = { _id: user._id, name: user.name, role: user.role };
                    }
                    
                    return [...prev, data];
                });
            }
            else {
                fetchConversations();
            }
        };

        socket.on('new_chat_notification', handleNewNotification);
        socket.on('receive_message', handleReceiveMessage);
        
        fetchConversations();

        return () => {
            socket.off('new_chat_notification', handleNewNotification);
            socket.off('receive_message', handleReceiveMessage);
            if (selectedRoom) {
                socket.emit('leave_room', selectedRoom.chatRoomId);
            }
        };
    }, [user, selectedRoom]); // Thêm selectedRoom vào dependency array

    // Auto scroll
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedRoom) return;

        // Tự thêm tin nhắn vào danh sách trước khi gửi (optimistic update)
        // Đây là fix tốt nhất cho lỗi Admin không thấy tin nhắn của mình ngay lập tức
        const optimisticMessage = {
            messageId: Date.now().toString(), // ID tạm thời
            sender: { _id: user._id, name: "Admin", role: user.role },
            message: inputMessage.trim(),
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMessage]);

        const messageData = {
            senderId: user._id, // Teacher ID
            receiverId: selectedRoom.chatRoomId, // Student ID
            message: inputMessage.trim(),
        };
        
        socket.emit('send_message', messageData);

        setInputMessage('');
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-extrabold font-heading text-primary-600 mb-6">
                Quản Lý Hỗ Trợ Trực Tuyến (Admin Chat)
            </h1>
            
            <div className="flex h-[70vh] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Conversations List (Left Panel) */}
                <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: selectedRoom ? '30%' : '100%', minWidth: selectedRoom ? '300px' : '100%' }}
                    className="flex-shrink-0 border-r overflow-y-auto transition-all duration-300"
                >
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-gray-800">Hội thoại ({conversations.length})</h2>
                        <button onClick={fetchConversations} disabled={loading} className="p-2 rounded-full hover:bg-gray-200">
                            <RefreshIcon className={`h-5 w-5 text-primary-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {conversations.map((conv) => (
                            <li 
                                key={conv.chatRoomId} 
                                onClick={() => handleSelectRoom(conv)}
                                className={`p-4 cursor-pointer hover:bg-primary-50 transition-colors ${selectedRoom?.chatRoomId === conv.chatRoomId ? 'bg-primary-100/70 border-l-4 border-primary-600' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="truncate">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {conv.student.name}
                                        </p>
                                        <p className={`text-sm mt-1 truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-700' : 'text-gray-500'}`}>
                                            {conv.lastSender}: {conv.lastMessage}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {moment(conv.lastTime).fromNow(true)}
                                        </span>
                                        {conv.unreadCount > 0 && (
                                            <span className="mt-1 px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {conversations.length === 0 && (
                        <p className="text-center text-gray-500 p-5">Không có hội thoại nào.</p>
                    )}
                </motion.div>
                
                {/* Chat Panel (Right Panel) */}
                <div className="flex-1 flex flex-col">
                    {selectedRoom ? (
                        <>
                            {/* Chat Panel Header */}
                            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                <h2 className="text-lg font-bold text-primary-600">
                                    <button 
                                        onClick={() => setSelectedRoom(null)} 
                                        className="mr-3 p-1 rounded-full hover:bg-gray-200"
                                        title="Back to conversations"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    {selectedRoom.student.name}
                                    <span className="text-sm text-gray-500 ml-2">({selectedRoom.student.email})</span>
                                </h2>
                            </div>
                            
                            {/* Message Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/80">
                                {loading ? (
                                    <p className="text-center text-gray-500 mt-5">Đang tải lịch sử...</p>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-5">
                                        <p>Bắt đầu cuộc trò chuyện với {selectedRoom.student.name}.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        // CHECK: Dùng logic kiểm tra sender ID thống nhất
                                        const senderId = msg.sender?._id || msg.sender;
                                        const isMe = senderId === user._id;

                                        // Lấy tên người gửi
                                        const senderName = isMe 
                                            ? 'Admin' 
                                            : (msg.sender?.name || selectedRoom.student.name);

                                        return (
                                            <div 
                                                key={msg.messageId || index}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-md ${
                                                    isMe 
                                                        ? 'bg-primary-400 text-white rounded-br-none' 
                                                        : 'bg-white text-gray-800 rounded-tl-none border'
                                                }`}>
                                                    <p className="font-medium">{senderName}:</p>
                                                    <p className="mt-1">{msg.message}</p>
                                                    <span className={`block text-xs mt-1 ${isMe ? 'text-primary-100' : 'text-gray-500'}`}>
                                                        {moment(msg.createdAt).format('HH:mm - MMM D')}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            
                            {/* Input Footer */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t flex bg-white">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn phản hồi..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white p-2 rounded-r-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                    disabled={!inputMessage.trim()}
                                >
                                    <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <ChatIcon className="h-16 w-16 mb-4" />
                            <p className="text-lg">Chọn một hội thoại để bắt đầu hỗ trợ.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChat;