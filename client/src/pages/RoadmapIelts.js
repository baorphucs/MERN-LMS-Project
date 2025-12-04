// FILE_PATH: client\src\pages\RoadmapIelts.js

import React from 'react';
import { motion } from 'framer-motion';

const RoadmapIelts = () => {
    // Dữ liệu từ thiết kế image_68a092.jpg
    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden md:flex"
            >
                {/* Cột 1: Nội dung */}
                <div className="md:w-1/2 p-10 bg-[#f0f5ff] flex flex-col justify-center">
                    <h2 className="text-sm font-bold text-primary-600 uppercase mb-2">KHOÁ HỌC IELTS</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-secondary-900 mb-4 leading-tight">
                        Lộ trình Học & Luyện IELTS toàn diện
                    </h1>
                    <p className="text-lg text-gray-700 mb-8 max-w-md">
                        Phòng luyện thi IELTS ảo PREP AI – Nền tảng tự học có cam kết đầu ra.
                    </p>
                    <a href="#" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold max-w-fit">
                        Thiết kế lộ trình học
                    </a>
                    <div className="mt-6 flex items-center">
                        <div className="flex -space-x-2 mr-3">
                            <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=NV&background=c7d2fe&color=3730a3" alt="" />
                            <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=PT&background=a5b4fc&color=3730a3" alt="" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                            <strong>500.000+</strong> học viên đạt IELTS tại NTTU HUB
                        </p>
                    </div>
                </div>

                {/* Cột 2: Hình ảnh (Thêm tag hình ảnh để minh họa) */}
                <div className="md:w-1/2 relative bg-[#1E90FF] overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary-900 opacity-20"></div>
                    
                </div>
            </motion.div>
        </div>
    );
};

export default RoadmapIelts;