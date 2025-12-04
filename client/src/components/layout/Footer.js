// FILE_PATH: client\src\components\layout\Footer.js (CẬP NHẬT HOÀN CHỈNH - BỐ CỤC 2 CỘT HÀI HÒA)

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailIcon, PhoneIcon, ChevronDownIcon } from '@heroicons/react/outline'; // Sử dụng Heroicons

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="bg-primary-700 text-primary-100 py-10 mt-16 shadow-inner border-t-8 border-primary-800"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ==================== 1. Cột Chính và Logo (Bố cục 3 cột tổng thể: Logo | Links 1 | Links 2) ==================== */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-start gap-8 border-b border-primary-600 pb-8 mb-8">
        
        {/* Cột 1: Logo và Kết nối (Chiều rộng 1/3) */}
        <div className="w-full md:w-1/3 space-y-4">
          <span className="text-3xl font-extrabold font-heading tracking-tight bg-gradient-to-r from-primary-300 to-accent-yellow bg-clip-text text-transparent">
            NTTU HUB
          </span>
          <p className="text-sm text-primary-200">
            © {new Date().getFullYear()} Modern LMS. All rights reserved.
          </p>

          {/* Kết nối với chúng tôi */}
          <div className="pt-4 space-y-2">
            <h5 className="text-sm font-bold uppercase text-white">Kết nối với chúng tôi</h5>
            <div className="flex gap-3">
                <a href="mailto:nttuhub@nttu.edu.vn" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors" aria-label="Email">
                    <MailIcon className="h-4 w-4 text-white" />
                </a>
                <a href="tel:02873002424" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors" aria-label="Phone">
                    <PhoneIcon className="h-4 w-4 text-white" />
                </a>
                <a href="https://www.facebook.com/DaihocNguyenTatThanh" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors text-white text-sm font-bold" aria-label="Facebook">
                    FB
                </a>
            </div>
          </div>
        </div>
        
        {/* Cột 2 & 3: Thông tin chi tiết (Chiều rộng 2/3, chia đều thành 2 cột) */}
        <div className="w-full md:w-2/3 grid grid-cols-2 gap-8">
            
            {/* Cột 2: Chương trình học */}
            <div className="space-y-2">
                <h5 className="text-sm font-bold uppercase text-white mb-3">Chương trình học</h5>
                <Link to="/roadmap/ielts" className="block text-sm hover:text-accent-yellow transition-colors">IELTS</Link>
                <Link to="/roadmap/toeic" className="block text-sm hover:text-accent-yellow transition-colors">TOEIC</Link>
                <a href="#" className="block text-sm hover:text-accent-yellow transition-colors">HSK (coming soon)</a>
                <a href="#" className="block text-sm hover:text-accent-yellow transition-colors">Tiếng Anh Giao tiếp (coming soon)</a>
            </div>

            {/* Cột 3: Về Prep (NTTU HUB) */}
            <div className="space-y-2">
                <h5 className="text-sm font-bold uppercase text-white mb-3">Về NTTU HUB</h5>
                <Link to="/about" className="block text-sm hover:text-accent-yellow transition-colors">Giới thiệu chung</Link>
                <Link to="/commitment" className="block text-sm hover:text-accent-yellow transition-colors">Cam Kết Đầu Ra</Link>
                <a href="#" className="block text-sm hover:text-accent-yellow transition-colors">Tuyển dụng</a>
                <Link to="/faq" className="block text-sm hover:text-accent-yellow transition-colors">FAQ</Link>
                <a href="#" className="block text-sm hover:text-accent-yellow transition-colors">Điều khoản & chính sách</a>
            </div>

            {/* Cột Hướng dẫn sử dụng đã bị loại bỏ */}
            
        </div>
        
      </div>
      
      {/* ==================== 2. Thông tin Công ty/Trung tâm (2 Cột) ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-primary-200">
        
        {/* Cột Thông tin Công ty */}
        <div className="space-y-2">
            <h5 className="font-bold uppercase text-white">Công ty Cổ phần Công nghệ (Mô phỏng)</h5>
            <p><strong>MSDN:</strong> 0109817671</p>
            <p><strong>Địa chỉ liên hệ:</strong> Số 300A Nguyễn Tất Thành, P.13, Q.4, TP.HCM.</p>
            <p><strong>Trụ sở chính:</strong> Lô C1-C2 Khu đô thị Nam Trung Yên, P. Yên Hòa, Q. Cầu Giấy, TP. Hà Nội.</p>
        </div>
        
        {/* Cột Trung tâm Đào tạo */}
        <div className="space-y-2">
            <h5 className="font-bold uppercase text-white">Trung tâm Đào tạo ngoại ngữ NTTU HUB</h5>
            <p><strong>Phòng luyện ảo:</strong> Trải nghiệm thực tế - Công nghệ hàng đầu.</p>
            <p><strong>Hotline:</strong> 028 7300 2424</p>
            <p>Giấy chứng nhận hoạt động giáo dục: Số 1309/QĐ-SGDĐT ngày 31 tháng 07 năm 2023.</p>
        </div>
      </div>
      
    </div>
  </motion.footer>
);

export default Footer;