// FILE_PATH: client\src\pages\About.js (TẠO MỚI FILE NÀY)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademicCapIcon } from '@heroicons/react/solid';
import { LocationMarkerIcon, MailIcon, PhoneIcon, ArrowRightIcon } from '@heroicons/react/outline';
import Footer from '../components/layout/Footer';

// ==============================================================
// 1. DỮ LIỆU CỐ ĐỊNH CHO TRANG INTRO
// ==============================================================
const INTRO_DATA = {
    // Phần giới thiệu chung (dùng mẫu từ ảnh 575e01.jpg)
    main: {
        title: "Giới thiệu chung về NTTU HUB",
        description: [
            "Được thành lập vào năm 2024, NTTU HUB hướng đến trở thành Tổ chức Giáo dục hàng đầu trong nước và khu vực về Khảo thí, giải pháp giáo dục và hệ sinh thái giáo dục số.",
            "Tại Việt Nam, với mạng lưới chi nhánh trải dài cả 3 miền đất nước, NTTU HUB ngày càng khẳng định uy tín trong các lĩnh vực hoạt động như: Tổ chức các bài thi tiếng Anh quốc tế (như TOEIC, IELTS), các bài thi Tin học quốc tế (MOS, IC3), và các bài thi khác như SAT, GRE, CFA. Chúng tôi cũng cung cấp giải pháp tiếng Anh, Tin học quốc tế cho các doanh nghiệp, các trường học, cơ quan quản lý giáo dục."
        ],
        // Dùng ảnh văn phòng mô phỏng
        image: "https://images.unsplash.com/photo-1542838132332-ce05b9b660c1?auto=format&fit=crop&w=800&q=80", 
    },
    // 3 cột chính
    cores: [
        {
            title: "Tầm Nhìn",
            icon: "🚩", 
            quote: "Trở thành Tổ chức Giáo dục hàng đầu trong nước và khu vực về giáo dục số.",
            description: "NTTU HUB đặt mục tiêu định hướng trở thành Tổ chức Giáo dục hàng đầu trong nước và khu vực về Khảo thí, giải pháp giáo dục và hệ sinh thái giáo dục số. Chúng tôi cam kết không ngừng đổi mới để mang lại giá trị cao nhất cho học viên và cộng đồng.",
            image: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?auto=format&fit=crop&w=600&q=80" // Tầm nhìn (View)
        },
        {
            title: "Sứ Mệnh",
            icon: "💡",
            quote: "Cung cấp giải pháp giáo dục toàn diện, nâng cao năng lực cạnh tranh cho người học.",
            description: "Sứ mệnh của chúng tôi là cung cấp các giải pháp giáo dục, công cụ luyện thi toàn diện, giúp nâng cao năng lực ngoại ngữ và tin học, từ đó nâng cao năng lực cạnh tranh trong thị trường lao động toàn cầu cho người học.",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80" // Sứ mệnh (Mission)
        },
        {
            title: "Giá Trị Cốt Lõi",
            icon: "💎",
            quote: "Chất lượng, Đổi mới, Tận tâm, và Hợp tác.",
            description: "Chất lượng là ưu tiên hàng đầu, Đổi mới trong công nghệ và phương pháp, Tận tâm phục vụ học viên, và Hợp tác cùng các đối tác để tạo ra hệ sinh thái giáo dục hoàn chỉnh.",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80" // Giá trị cốt lõi (Core Value)
        }
    ]
};

// ==============================================================
// 2. Component AboutCard (Với Hiệu ứng Hover)
// ==============================================================
const AboutCard = ({ data }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Variants cho lớp phủ (overlay)
    const overlayVariants = {
        initial: { opacity: 0, y: 50 },
        hover: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            className="relative h-96 rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background Image */}
            <img 
                src={data.image} 
                alt={data.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Lớp phủ mặc định (Dark Overlay) */}
            <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-primary-900/90"></div>

            {/* Content hiển thị cố định */}
            <motion.div 
                className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 transition-opacity duration-300"
                initial={false}
                animate={{ opacity: isHovered ? 0 : 1 }}
            >
                <h3 className="text-3xl font-extrabold mb-1 drop-shadow-md">
                    {data.title} <span className="text-4xl ml-2">{data.icon}</span>
                </h3>
                <p className="text-lg font-medium italic drop-shadow-md">{data.quote}</p>
            </motion.div>
            
            {/* Content hiển thị khi hover (Hidden Overlay) */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        variants={overlayVariants}
                        initial="initial"
                        animate="hover"
                        exit="initial"
                        className="absolute inset-0 bg-primary-800/90 backdrop-blur-sm flex items-center justify-center p-8 text-white z-20"
                    >
                        <p className="text-center text-lg font-light leading-relaxed">
                            {data.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ==============================================================
// 3. Component ContactInfo (Tái sử dụng từ Contact.js)
// ==============================================================
const CONTACT_INFO = [
    { 
        icon: LocationMarkerIcon, 
        title: 'Address', 
        value: 'Phòng 213, Tòa nhà F, Số 300A Nguyễn Tất Thành, P.13, Q.4, TP.HCM',
        link: 'https://maps.app.goo.gl/r6R5m7xYh1P2qjLNA'
    },
    { 
        icon: MailIcon, 
        title: 'Email', 
        value: 'nttuhub@nttu.edu.vn',
        link: 'mailto:nttuhub@nttu.edu.vn' 
    },
    { 
        icon: PhoneIcon, 
        title: 'Phone', 
        value: '028 7300 2424',
        link: 'tel:02873002424' 
    },
];

// ==============================================================
// 4. Component About Chính
// ==============================================================
const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
                    <AcademicCapIcon className="h-10 w-10 text-primary-600 mx-auto mb-2" />
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Giới Thiệu Về NTTU HUB
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Tầm nhìn, Sứ mệnh và Giá trị cốt lõi của chúng tôi.
                    </p>
                </motion.div>
                
                {/* 1. Giới thiệu chung và Hình ảnh */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount: 0.3 }} 
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{INTRO_DATA.main.title}</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            {INTRO_DATA.main.description.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                        <a href="/contact" className="mt-6 inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md">
                            Liên hệ ngay <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </a>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount: 0.3 }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="rounded-3xl overflow-hidden shadow-2xl h-96"
                    >
                        <img 
                            src={INTRO_DATA.main.image} 
                            alt="NTTU HUB Office" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                {/* 2. Tầm nhìn, Sứ mệnh, Giá trị cốt lõi (3 Cards) */}
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
                    Nền tảng Phát triển của Chúng tôi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {INTRO_DATA.cores.map((core, index) => (
                        <AboutCard key={index} data={core} />
                    ))}
                </div>

                {/* 3. Liên hệ (Contact Info Block) */}
                <div className="mt-20 bg-primary-700 rounded-2xl p-8 md:p-12 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Thông Tin Liên Hệ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {CONTACT_INFO.map((item, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="bg-white p-6 rounded-xl text-center shadow-lg border border-primary-100"
                            >
                                <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                <a href={item.link} className="text-base font-medium text-primary-600 hover:text-primary-700 transition-colors block">
                                    {item.value}
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default About;