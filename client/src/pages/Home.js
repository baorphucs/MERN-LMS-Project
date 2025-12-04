// FILE_PATH: client\src\pages\Home.js (ĐÃ SẮP XẾP LẠI THỨ TỰ ĐÚNG VÀ KHÔI PHỤC HOÀN TOÀN PHẦN BENEFITS)
import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  XIcon,
  StarIcon,
  ThumbUpIcon
} from '@heroicons/react/outline';
import Footer from '../components/layout/Footer';
import { Tab } from '@headlessui/react';

// ==============================================================
// DỮ LIỆU CỐ ĐỊNH CHO CÁC PHẦN (Modal/Marquee)
// ==============================================================
const ALL_STUDENTS_DATA = [
  // Dữ liệu mô phỏng từ ảnh 83ea95.jpg và 83ea59.jpg
  { id: 1, name: "Hằng Thị Giang Thu", score: "6.5", type: "IELTS", imgSrc: "https://i.ibb.co/3WqP49g/s1.jpg" },
  { id: 2, name: "Nguyễn Hữu Minh Duy", score: "6.5", type: "IELTS", imgSrc: "https://i.ibb.co/9vB220P/s2.jpg" },
  { id: 3, name: "Nông Thị Trang Nhung", score: "7.0", type: "IELTS", imgSrc: "https://i.ibb.co/VTHq9H1/s3.jpg" },
  { id: 4, name: "Bùi Phương Thảo", score: "6.5", type: "IELTS", imgSrc: "https://i.ibb.co/6yqTj5Y/s4.jpg" },
  { id: 5, name: "Trường Hoàng Dũng", score: "710", type: "TOEIC", imgSrc: "https://i.ibb.co/wJvB0zR/s5.jpg" },
  { id: 6, name: "Nguyễn Quốc Thắng", score: "7.0", type: "IELTS", imgSrc: "https://i.ibb.co/1Kk2W0W/s6.jpg" },
  { id: 7, name: "Phạm Thị Nhật Ngân", score: "7.0", type: "IELTS", imgSrc: "https://i.ibb.co/YjVq0W2/s7.jpg" },
  { id: 8, name: "Phạm Thùy Dương", score: "6.5", type: "IELTS", imgSrc: "https://i.ibb.co/F83Q8Jm/s8.jpg" },
  { id: 9, name: "Lê Ánh Thư", score: "7.0", type: "IELTS", imgSrc: "https://i.ibb.co/tZ5W25w/s9.jpg" },
  { id: 10, name: "Nguyễn Khánh Vân", score: "7.5", type: "IELTS", imgSrc: "https://i.ibb.co/f2P617B/s10.jpg" },
];

const REVIEWS_DATA = [
    { id: 1, author: "Phạm Tra My", quote: "Em thấy Prep siêu tiện luôn ạ! Bình thường viết bài xong trong 2 ngày là Prep đã gửi feedback cho rùi nên siêu siêu có ích! PREP giảng giải chi tiết nên giúp em hiểu được vấn đề sâu và học ngoại ngữ hiệu quả hơn.", likes: 188, avatar: "" },
    { id: 2, author: "Hằng Lê", quote: "Em học HSK của PREP từ tháng 6, theo Study Plan. Mới 1/3 khóa HSK 1 nhưng phát âm ổn hơn, biết giới thiệu bản thân. Nhờ AI chấm bài, em nhận ra lỗi sai và cải thiện khả năng học tiếng Trung hiệu quả hơn.", likes: 122, avatar: "" },
    { id: 3, author: "Phương Uyên", quote: "Đã từng đi học tiếng Anh ở các trung tâm nhưng hướng nói nên mình chưa bao giờ nói nhiều đến vậy. Prep cho mình tự tin hơn nhiều!", likes: 154, avatar: "" },
    { id: 4, author: "Hoàng Nguyễn", quote: "Học IELTS tại PREP, em tự tin hơn, biết áp dụng kiến thức vào bài và tiến bộ rõ rệt. Em sẽ chăm chỉ, duy trì thái độ học tiếng Anh nghiêm túc cùng PREP, hy vọng đạt band 7.5+.", likes: 122, avatar: "" },
    { id: 5, author: "Hương Giang", quote: "Thật sự tuyệt vời. Tôi đã thử nhiều khóa học online khác nhưng đây là nơi tôi cảm thấy được hỗ trợ tốt nhất.", likes: 98, avatar: "" },
    { id: 6, author: "Tuấn Anh", quote: "Giao diện đẹp, dễ sử dụng, tôi có thể học bất cứ khi nào rảnh. Rất phù hợp với người đi làm bận rộn như tôi.", likes: 210, avatar: "" },
];
// Lặp lại dữ liệu để tạo hiệu ứng cuộn vô tận cho Reviews
const INFINITE_REVIEWS = [...REVIEWS_DATA, ...REVIEWS_DATA, ...REVIEWS_DATA];

const PARTNERS_DATA = [
    { name: "IDP", logo: "/img/partner-idp.png" },
    { name: "British Council", logo: "/img/partner-bc.png" },
    { name: "IELTS", logo: "/img/partner-ielts.png" },
];
// Lặp lại dữ liệu để tạo hiệu ứng cuộn vô tận cho Partners
const INFINITE_PARTNERS = [...PARTNERS_DATA, ...PARTNERS_DATA, ...PARTNERS_DATA, ...PARTNERS_DATA];

// Dữ liệu cho Three-Step Slider
const STEP_DATA = [
    {
        step: 1,
        title: "Thiết kế lộ trình học cá nhân hóa",
        description: "Prep sẽ luôn đồng hành cùng bạn xuyên suốt hành trình khổ luyện cho đến ngày 'hái quả ngọt'.",
        substep: "Bước 1: Thiết kế lộ trình học cá nhân hóa",
        imgSrc: "/img/step1.jpg", // Placeholder
    },
    {
        step: 2,
        title: "Học và theo dõi tiến bộ",
        description: "Học tập, thực hành, chấm chữa toàn diện và phản tích, theo dõi sự tiến bộ qua từng ngày.",
        substep: "Bước 2: Học và theo dõi tiến bộ",
        imgSrc: "/img/step2.jpg", // Placeholder
    },
    {
        step: 3,
        title: "Hỗ trợ đăng ký thi, báo điểm, nhận quà vinh danh siêu xịn",
        description: "Prep sẵn sàng hỗ trợ học viên đăng ký thi với ưu đãi tốt nhất. Bạn còn nhận được những phần quà siêu xịn khi đủ điều kiện là học viên điểm cao và được Vinh danh trên cộng đồng Preppies.",
        substep: "Bước 3: Hỗ trợ đăng ký thi, báo điểm, nhận quà vinh danh siêu xịn",
        imgSrc: "/img/step3.jpg", // Placeholder
    },
];


// ==============================================================
// Component Modal Dành Cho Danh Sách Học Viên
// ==============================================================
const StudentListModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl relative"
          >
            <div className="flex justify-between items-center border-b pb-4 mb-4 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Danh sách các học viên</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ALL_STUDENTS_DATA.map(student => (
                <div key={student.id} className="relative rounded-lg overflow-hidden shadow-md">
                  {/* Image Placeholder */}
                  <div className="aspect-w-1 aspect-h-1">
                    {/* Sử dụng ảnh mô phỏng */}
                    <img src={student.imgSrc} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-white">
                    <p className="font-semibold">{student.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${student.type === 'IELTS' ? 'bg-blue-600' : 'bg-orange-600'}`}>
                      {student.score} {student.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// Helper function
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ==============================================================
// Component Three-Step Slider (Sử dụng Scroll Wheel)
// ==============================================================
const ThreeStepSlider = () => {
    const [step, setStep] = useState(0); 
    const sliderRef = useRef(null);
    const debounceTimeout = useRef(null);
    
    const handleWheel = (e) => {
        // Chỉ xử lý nếu đang không trong thời gian chờ (debounce)
        if (debounceTimeout.current) return;

        const direction = e.deltaY > 0 ? 1 : -1; // 1 là cuộn xuống, -1 là cuộn lên

        setStep((prevStep) => {
            let nextStep = prevStep + direction;
            if (nextStep < 0) nextStep = 0; // Giới hạn ở bước 0
            if (nextStep >= STEP_DATA.length) nextStep = STEP_DATA.length - 1; // Giới hạn ở bước cuối

            if (nextStep !== prevStep) {
                // Kích hoạt debounce
                debounceTimeout.current = setTimeout(() => {
                    debounceTimeout.current = null;
                }, 700); // Chờ 700ms giữa các lần chuyển

                // Ngăn chặn cuộn trang chính khi đang chuyển bước
                e.preventDefault(); 
            }
            return nextStep;
        });
    };

    useEffect(() => {
        const sliderElement = sliderRef.current;
        if (sliderElement) {
            sliderElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (sliderElement) {
                sliderElement.removeEventListener('wheel', handleWheel);
            }
            clearTimeout(debounceTimeout.current);
        };
    }, []); // Chỉ chạy một lần khi mount

    const currentStep = STEP_DATA[step];

    // Define motion variants for vertical sliding
    const slideVariants = {
        // Custom direction for smooth transition between steps (positive: slide up, negative: slide down)
        enter: (direction) => ({
            y: direction > 0 ? 500 : -500, // Slide up from bottom or down from top
            opacity: 0
        }),
        center: {
            y: 0,
            opacity: 1
        },
        exit: (direction) => ({
            y: direction < 0 ? 500 : -500, // Slide out to top or bottom
            opacity: 0
        })
    };

    return (
        <section 
            ref={sliderRef}
            className="py-16 md:py-24 bg-blue-900 text-white relative overflow-hidden h-[800px] flex items-center"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                {/* Global Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        Tối ưu hành trình Học & Luyện Thi với 3 bước dễ dàng
                    </h2>
                    <p className="text-lg text-blue-200">
                        Prep sẽ luôn đồng hành cùng bạn xuyên suốt hành trình khổ luyện cho đến ngày "hái quả ngọt".
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Cột 1: Text Content */}
                    <div className="space-y-6 flex flex-col justify-center min-h-[400px] relative">
                         <AnimatePresence initial={false} mode="wait">
                            <motion.div 
                                key={currentStep.step + "text"} // Key để kích hoạt animation
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                custom={1} // custom value for initial/exit variants
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute inset-0 p-4"
                            >
                                <p className="text-6xl md:text-7xl font-extrabold text-blue-500/50 leading-none">
                                    Bước {currentStep.step}
                                </p>
                                <h3 className="text-3xl font-bold text-white mt-4">
                                    {currentStep.title}
                                </h3>
                                <p className="text-lg text-blue-100 mt-4">
                                    {currentStep.description}
                                </p>
                            </motion.div>
                         </AnimatePresence>
                    </div>

                    {/* Cột 2: Image and Motion Container */}
                    <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl bg-blue-800">
                        <AnimatePresence initial={false} mode="wait"> 
                            <motion.div
                                key={currentStep.step + "image"} // Key để kích hoạt animation
                                custom={1} 
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    y: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.3 }
                                }}
                                className="absolute inset-0 p-6 flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-white/70 mb-2">{currentStep.substep}</p>
                                    {/* Placeholder Image for the step */}
                                    <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg flex items-center justify-center border-4 border-blue-400">
                                        [Image for Step {currentStep.step}]
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>

                 {/* Pagination/Step Indicator */}
                 <div className="text-center mt-12 flex justify-center space-x-3">
                    {STEP_DATA.map((s, index) => (
                        <button
                            key={s.step}
                            onClick={() => setStep(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === step ? 'bg-white scale-125' : 'bg-blue-300/50 hover:bg-blue-300'
                            }`}
                            aria-label={`Go to step ${s.step}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};


// ==============================================================
// Component chính Home (Tiếp tục)
// ==============================================================
const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [parallaxY, setParallaxY] = useState(0);
  const [parallaxY2, setParallaxY2] = useState(0);
  const [parallaxY3, setParallaxY3] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State cho Modal

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  
  // Dữ liệu học viên cho phần chuyển động ngang (dùng subset của ALL_STUDENTS_DATA)
  // Row 1: chạy từ phải sang trái (index chẵn)
  const achieversRow1 = [ALL_STUDENTS_DATA[0], ALL_STUDENTS_DATA[2], ALL_STUDENTS_DATA[4], ALL_STUDENTS_DATA[6], ALL_STUDENTS_DATA[8]];
  // Row 2: chạy từ trái sang phải (index lẻ)
  const achieversRow2 = [ALL_STUDENTS_DATA[1], ALL_STUDENTS_DATA[3], ALL_STUDENTS_DATA[5], ALL_STUDENTS_DATA[7], ALL_STUDENTS_DATA[9]];


  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setParallaxY(Math.max(0, -rect.top * 0.3));
      }
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        setParallaxY2(Math.max(0, -rect.top * 0.15));
      }
      if (benefitsRef.current) {
        const 
 rect = benefitsRef.current.getBoundingClientRect();
        setParallaxY3(Math.max(0, -rect.top * 0.1));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  const features = [
    { icon: <BookOpenIcon className="h-6 w-6" />, title: 'Tài liệu Khóa học Số', description: 'Truy cập tất cả tài nguyên học tập ở cùng một nơi, trên mọi thiết bị, tại bất cứ đâu.'
},
    { icon: <UserGroupIcon className="h-6 w-6" />, title: 'Học Tập Cộng Tác', description: 'Luôn kết nối với bạn học và giảng viên thông qua các thông báo và cập nhật.'
},
    { icon: <AcademicCapIcon className="h-6 w-6" />, title: 'Bài Kiểm tra/Đố Vui Trực tiếp', description: 'Kiểm tra kiến thức của bạn bằng các bài đố vui/kiểm tra tương tác và nhận kết quả tức thì.'
},
    { icon: <UserGroupIcon className="h-6 w-6" />, title: 'Học Tập Cộng Tác', description: 'Luôn kết nối với bạn học và giảng viên thông qua các thông báo và cập nhật.'
},
  ];

  const testimonialTabs = {
    TOEIC: [
      { 
        name: "Bảo Trân", 
        age: "28 tuổi", 
        date: "05.08.2024", 
        quote: "Các đề trong Phòng Luyện ảo mình thấy sát với đề thực tế. Mình rất ưng phần chấm chữa chi tiết, phần này rất thích cho mình có những lỗi sai lẫn cần sửa, từ đó mình cải thiện dần cả 2 kỹ năng Listening và Reading.",
        score: "990", 
        type: "TOEIC L&R", 
        subscores: { Listening: "495", Reading: "495" } 
      }
    ],
    IELTS: [
      { 
        name: "Nguyễn Trần Ngân Giang", 
        age: "", 
        date: "", 
        quote: "Em thấy Prep thiết kế bối giảng súc tích, nội dung bài giảng dễ ghi nhớ, em nghĩ sẽ phù hợp với các bạn mới bắt đầu học IELTS. Em có thể học bất cứ lúc nào, nhiều lúc em chỉ mang điện thoại đi cũng có thể học được. Và em đặc biệt rất thích phòng luyện thi ảo PREP AI.",
        score: "8.0", 
        type: "IELTS Overall", 
        subscores: { Listening: "8.5", Reading: "8.0", Speaking: "7.5", Writing: "7.0" } 
      }
    ]
  };
  
  const featureImages = [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80',
  ];
  return (
    <div className="bg-white">

      {/* ==================== HERO SECTION - CÓ LỚP PHỦ XÁM MỜ ==================== */}
<section 
  ref={heroRef}
  className="relative min-h-[60vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden"
>
  <video
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="absolute inset-0 w-full h-full object-cover z-0"
  >
    <source src="/banner-main.mp4" type="video/mp4" />
  </video>

  {/* Lớp phủ màu xám mờ */}
  <div className="absolute inset-0 bg-[#1f1f1f]/60 z-10"></div>

  <motion.div
    className="relative z-20 text-center px-6 
 max-w-4xl mx-auto"
    style={{ y: parallaxY * 0.2 }}
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2 }}
  >
    {/* GIẢM CỠ CHỮ TẠI ĐÂY */}
    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-2xl">
      Chào các bạn!, <span className="text-yellow-400">Chúng tôi là NTTU HUB</span>
    </h1>

    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
      Kết nối bạn với đội ngũ 
 giảng viên hàng đầu, nội dung tương tác và cộng đồng hỗ trợ để cùng bạn chinh phục mục tiêu cá nhân và sự nghiệp.
 </p>

    <a
      href={isAuthenticated ?
 "/dashboard" : "/login"}
      className="inline-block px-8 py-4 text-lg font-semibold bg-white text-primary-700 rounded-full shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
    >
      {isAuthenticated ?
 "Go to Dashboard" : "Get Started"}
    </a>
  </motion.div>

  <motion.div
    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
    animate={{ y: [0, 15, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    <svg className="w-7 h-7 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </motion.div>
</section>

{/* ==================== END HERO ==================== */}

      {/* ==================== THIẾT KẾ CHO VIỆC HỌC HIỆN ĐẠI (FEATURES) ==================== */}
      <motion.section
        ref={featuresRef}
        className="py-16 md:py-24 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="absolute -top-32 left-1/2 w-96 h-96 bg-gradient-to-br from-primary-200 to-accent-yellow rounded-full blur-3xl opacity-30 z-0"
     
      style={{ y: parallaxY2 * 0.5 }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thiết kế cho việc học hiện đại</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Nền 
 tảng của chúng tôi cung cấp tất cả các công cụ bạn cần để giảng dạy hiệu quả và tạo ra những trải nghiệm học tập hấp dẫn.
 </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
     
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)' }}
                className="bg-white/80 backdrop-blur-lg rounded-xl p-8 border border-primary-50 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-6"
                style={{ y: parallaxY2 * (0.1 + index * 0.05) }}
              >
        
         <motion.img
                  src={featureImages[index]}
                  alt={feature.title}
                  className="w-28 h-28 object-cover rounded-2xl shadow-lg mb-4 md:mb-0 md:mr-6"
                  style={{ y: parallaxY2 * 0.15 }}
        
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.7, type: 'spring' }}
                />
                <div>
 
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              
     <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================== LỢI ÍCH DÀNH CHO TẤT CẢ MỌI NGƯỜI (BENEFITS) ==================== */}
      <motion.section className="bg-gray-50 py-16 md:py-24" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-7xl mx-auto 
 px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lợi Ích Dành Cho Tất Cả Mọi Người</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Dù bạn là giáo viên hay học viên, nền tảng của chúng tôi đều nâng cao trải nghiệm học tập.
 </p>
          </motion.div>
          
          <div className="md:flex md:items-center md:justify-between">
            <motion.div className="md:w-1/2 mb-10 md:mb-0" variants={itemVariants}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Lợi Ích Dành Cho Giáo Viên</h3>
              <ul className="space-y-4">
             
    {['Tạo và quản lý khóa học dễ dàng.','Chia sẻ tài liệu dưới nhiều định dạng khác nhau.','Thiết kế các bài đánh giá và bài kiểm tra/đố vui.','Theo dõi tiến độ và mức độ tham gia của học viên.','Giao tiếp hiệu quả với học viên.'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
    
                 <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
           
  <motion.div className="md:w-1/2" variants={itemVariants}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Lợi Ích Dành Cho Học Viên</h3>
              <ul className="space-y-4">
                {['Truy cập tất cả tài liệu khóa học tại một nơi duy nhất.','Nộp bài tập dưới dạng kỹ thuật số.','Làm bài kiểm tra và nhận phản hồi tức thì.','Theo dõi điểm số và tiến độ học tập của bạn.','Luôn cập nhật các thông báo mới nhất của khóa học.'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
      
           ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ==================== TỐI ƯU HÀNH TRÌNH HỌC & LUYỆN THI (3-STEP SLIDER) ==================== */}
      <ThreeStepSlider />
      {/* ==================== END TỐI ƯU HÀNH TRÌNH HỌC & LUYỆN THI (3-STEP SLIDER) ==================== */}


      {/* ==================== CHẤT LƯỢNG ĐƯỢC MINH CHỨNG (TABBED TESTIMONIALS) ==================== */}
      <motion.section
        className="py-16 md:py-24 bg-white relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
      
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
  
            className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-primary-700"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Chất lượng được minh chứng bởi 
            <br />
            <span className="text-primary-400">Hàng nghìn gương mặt xuất sắc</span>
         
          </motion.h2>

          <Tab.Group>
            {/* Tab List: TOEIC / IELTS */}
            <Tab.List className="w-full flex space-x-1 p-1 mb-8 rounded-xl bg-gray-100 max-w-xs mx-auto">
              {Object.keys(testimonialTabs).map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      'w-full py-2.5 text-sm font-bold leading-5 rounded-lg transition-colors',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
                      selected
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white/[0.60] hover:text-primary-700'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>

            {/* Tab Panels: Content */}
            <Tab.Panels className="mt-8">
              {Object.values(testimonialTabs).map((testimonials, index) => (
                <Tab.Panel
                  key={index}
                  className={classNames(
                    'ring-white ring-opacity-60 focus:outline-none focus:ring-2',
                    'p-3'
                  )}
                >
                  {/* Hiện tại chỉ có 1 testimonial cho mỗi tab, nên ta render thẳng nó ra */}
                  {testimonials.map((t, tIndex) => (
                    <motion.div
                      key={tIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-primary-600 rounded-3xl p-6 shadow-2xl mx-auto max-w-xl"
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">
                          Vinh danh học viên xuất sắc nhất tháng 12
                        </h3>
                      </div>
                      
                      <div className="flex bg-white rounded-2xl p-4 items-center">
                        {/* Cột 1: Ảnh, Tên, Điểm */}
                        <div className="w-1/2 flex flex-col items-center">
                          {/* Placeholder cho ảnh */}
                          <div className="w-24 h-24 bg-gray-200 rounded-full mb-3 border-4 border-primary-400">
                             {/* Thực tế sẽ là một component ảnh với mask */}
                          </div>
                          
                          <p className="text-lg font-bold text-gray-900">{t.name}</p>
                          <p className="text-sm text-gray-500">{t.age} {t.date && `- ${t.date}`}</p>
                          
                          <div className="mt-4 text-center">
                            <span className="text-4xl font-extrabold text-primary-600 block leading-none">{t.score}</span>
                            <span className="text-sm font-semibold text-primary-400 block">{t.type}</span>
                            
                            <div className="flex justify-center flex-wrap gap-2 mt-2 text-xs">
                              {Object.entries(t.subscores).map(([skill, score], i) => (
                                <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                  {skill} <span className="font-bold text-primary-600">{score}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Cột 2: Lời nhận xét */}
                        <div className="w-1/2 p-3 text-sm text-gray-700 italic">
                          <p>"{t.quote}"</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

        </div>
      </motion.section>
      {/* ==================== END CHẤT LƯỢNG ĐƯỢC MINH CHỨNG (TABBED TESTIMONIALS) ==================== */}


      {/* ==================== 100.000+ HỌC VIÊN (MARQUEE SECTION) ==================== */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              100.000+ học viên
            </h2>
            <p className="text-lg text-primary-600 font-semibold">
              đạt thành tích cao sau khi học tại NTTU HUB
            </p>
          </motion.div>

          {/* Marquee Row 1 (Right to Left) */}
          <div className="marquee-container overflow-hidden whitespace-nowrap mb-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex gap-4 md:gap-8"
              animate={{ x: ['0%', '-100%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  ease: "linear",
                  duration: 40, // Tốc độ chạy
                },
              }}
            >
              {[...achieversRow1, ...achieversRow1].map((student, index) => (
                <div key={index} className="inline-block w-40 md:w-52 flex-shrink-0">
                  <div className="relative rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <img src={student.imgSrc} alt={student.name} className="w-full h-auto object-cover aspect-[4/5]" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white">
                      <p className="font-semibold text-sm truncate">{student.name}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${student.type === 'IELTS' ? 'bg-blue-600' : 'bg-orange-600'}`}>
                        {student.score} {student.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Marquee Row 2 (Left to Right) */}
          <div className="marquee-container overflow-hidden whitespace-nowrap mb-8 [mask-image:linear-gradient(to_left,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex gap-4 md:gap-8"
              animate={{ x: ['-100%', '0%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  ease: "linear",
                  duration: 40, // Tốc độ chạy
                },
              }}
            >
              {[...achieversRow2, ...achieversRow2].map((student, index) => (
                <div key={index} className="inline-block w-40 md:w-52 flex-shrink-0">
                  <div className="relative rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <img src={student.imgSrc} alt={student.name} className="w-full h-auto object-cover aspect-[4/5]" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white">
                      <p className="font-semibold text-sm truncate">{student.name}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${student.type === 'IELTS' ? 'bg-blue-600' : 'bg-orange-600'}`}>
                        {student.score} {student.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Xem thêm button */}
          <div className="text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors shadow-lg"
            >
              Xem thêm
            </button>
          </div>
        </div>
      </section>
      {/* ==================== END 100.000+ HỌC VIÊN (MARQUEE SECTION) ==================== */}

      {/* ==================== ĐƯỢC ĐÁNH GIÁ CAO BỞI HÀNG TRĂM NGHÌN HỌC VIÊN (REVIEWS MARQUEE) ==================== */}
      <section className="bg-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
          
          {/* Cột 1: Header và Mô tả */}
          <motion.div 
            className="md:w-1/3 text-white text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">
              Được đánh giá cao bởi hàng trăm nghìn học viên đã và đang theo học
            </h2>
            <p className="text-lg text-primary-100 mb-6 font-light">
              Đây chính là sự ghi nhận lớn nhất với Prep (NTTU HUB), nhờ có động lực cải tiến không ngừng nghỉ và đem đến trải nghiệm học tập tuyệt vời nhất cho bạn.
            </p>
          </motion.div>

          {/* Cột 2: Marquee dọc */}
          <div className="md:w-2/3 h-[500px] overflow-hidden relative rounded-2xl shadow-2xl bg-white/10 p-4">
            
            {/* Masking gradients */}
            <div className="absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"></div>
            
            <motion.div
              className="flex flex-col gap-4"
              animate={{ y: ['0%', '-50%'] }} // Cuộn lên 50% (chiều dài của 1 lần lặp lại dữ liệu)
              transition={{
                y: {
                  repeat: Infinity,
                  ease: "linear",
                  duration: 60, // Tốc độ cuộn
                },
              }}
            >
              {/* Lặp lại dữ liệu đánh giá 2 lần để tạo hiệu ứng vô tận */}
              {[...INFINITE_REVIEWS, ...INFINITE_REVIEWS].map((review, index) => (
                <div key={index} className="flex-shrink-0 w-full">
                  <div className="bg-white rounded-lg p-4 shadow-md flex items-start space-x-4">
                    {/* Icon/Avatar */}
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {/* Avatar Placeholder */}
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">{review.author}</p>
                        <p className="text-sm text-gray-600 mt-1 italic">"{review.quote}"</p>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <div className="flex items-center text-yellow-500">
                                <StarIcon className="h-4 w-4 fill-current" />
                                <StarIcon className="h-4 w-4 fill-current" />
                                <StarIcon className="h-4 w-4 fill-current" />
                                <StarIcon className="h-4 w-4 fill-current" />
                                <StarIcon className="h-4 w-4 fill-current" />
                            </div>
                            <span className="text-sm">5 stars</span>
                            <span className="flex items-center text-primary-600 font-medium">
                                <ThumbUpIcon className="h-4 w-4 mr-1" /> {review.likes}
                            </span>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* ==================== END REVIEWS MARQUEE ==================== */}

      {/* ==================== ĐƯỢC ĐỒNG HÀNH BỞI NHỮNG ĐƠN VỊ UY TÍN (PARTNERS MARQUEE) ==================== */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        <motion.div 
            className="text-center mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                Được đồng hành bởi những đơn vị giáo dục uy tín hàng đầu Việt Nam
            </h2>
        </motion.div>

        {/* Marquee Row */}
        <div className="marquee-container overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex gap-10 md:gap-16 items-center"
              animate={{ x: ['0%', '-100%'] }} // Cuộn từ phải sang trái
              transition={{
                x: {
                  repeat: Infinity,
                  ease: "linear",
                  duration: 25, // Tốc độ chạy
                },
              }}
            >
              {[...INFINITE_PARTNERS, ...INFINITE_PARTNERS].map((partner, index) => (
                <div key={index} className="inline-block w-32 md:w-40 flex-shrink-0">
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 flex items-center justify-center h-20 opacity-80 hover:opacity-100 transition-opacity">
                    {/* Placeholder cho Logo */}
                    <span className="text-lg font-bold text-gray-700">{partner.name}</span>
                    {/* Hoặc dùng image tag nếu có ảnh thật */}
                    {/* <img src={partner.logo} alt={partner.name} className="max-h-12 max-w-full object-contain" /> */}
                  </div>
                </div>
              ))}
            </motion.div>
        </div>
      </section>
      {/* ==================== END PARTNERS MARQUEE ==================== */}

      {/* ==================== READY TO TRANSFORM (CTA SECTION) ==================== */}
      <motion.section
        className="bg-primary-700 py-16 md:py-20 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
     
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your learning experience?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teachers and students who are already using our platform to enhance their educational journey.
 </p>
          <Link
            to={isAuthenticated ?
 (user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard') : '/register'}
            className="inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            {isAuthenticated ?
 'Go to Dashboard' : 'Get Started For Free'}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.section>
      {/* ==================== END READY TO TRANSFORM (CTA SECTION) ==================== */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
     
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute left-1/4 top-0 w-96 h-96 bg-gradient-to-br from-accent-yellow to-primary-400 rounded-full blur-3xl opacity-60 animate-pulse"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        
          className="absolute right-1/4 bottom-0 w-96 h-96 bg-gradient-to-tr from-secondary-500 to-primary-600 rounded-full blur-3xl opacity-60 animate-pulse"
        />
      </div>

      <Footer />
      <StudentListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;