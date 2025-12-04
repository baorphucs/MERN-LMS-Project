// FILE_PATH: client\src\pages\RoadmapToeic.js (CODE HOÀN CHỈNH)

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/outline';
// <=== ĐÃ THÊM IMPORT NÀY
import Footer from '../components/layout/Footer'; 
// ==============================================================
// 1. DỮ LIỆU CẤP ĐỘ, MỤC TIÊU & GÓI HỌC PHÍ
// ==============================================================

// Định nghĩa mã hóa mức điểm số (Min score) để so sánh logic
const ScoreMap = {
    '1-295': 1, '300-595': 300, '600-850': 600, '800+': 800,
    'SW_1-99': 1, 'SW_100-199': 100, 'SW_200-250': 200, 'SW_300+': 300
};
const TAB_DATA = {
    LR: {
        title: 'TOEIC Listening & Reading',
        currentLevels: [
            { label: 'TOEIC LR 1-295', value: 'LR_1-295', minScore: 1 },
            { label: 'TOEIC LR 300-595', value: 'LR_300-595', minScore: 300 },
            { label: 'TOEIC LR 600-850', value: 'LR_600-850', minScore: 600 },
        ],
        goalLevels: [
            { label: 'TOEIC LR 300+', value: 'LR_300+', minScore: 300 },
            { label: 'TOEIC LR 600+', value: 'LR_600+', minScore: 600 },
            { label: 'TOEIC LR 800+', value: 'LR_800+', minScore: 800 },
        ],
        packages: {
            'LR_1-295_LR_300+': { chapter: 'TOEIC Listening - Reading Nền tảng', priceSelf: '500.000', priceFull: '1.250.000', commitment: 'LR 300+' },
            'LR_300-595_LR_600+': { chapter: 'TOEIC Listening - Reading Trung cấp', priceSelf: '1.500.000', priceFull: '2.250.000', commitment: 'LR 600+' },
            'LR_600-850_LR_800+': { chapter: 'TOEIC Listening - Reading Chuyên sâu', priceSelf: '2.000.000', priceFull: '2.750.000', commitment: 'LR 800+' },
        }
    },
    SW: {
        title: 'TOEIC Speaking & Writing',
        currentLevels: [
            { label: 'TOEIC SW 1-99', value: 'SW_1-99', minScore: ScoreMap['SW_1-99'] },
            { label: 'TOEIC SW 100-199', value: 'SW_100-199', minScore: ScoreMap['SW_100-199'] },
            { label: 'TOEIC SW 200-250', value: 'SW_200-250', minScore: ScoreMap['SW_200-250'] },
        ],
        goalLevels: [
            { label: 'TOEIC SW 100+', value: 'SW_100+', minScore: ScoreMap['SW_100-199'] },
            { label: 'TOEIC SW 200+', value: 'SW_200+', minScore: ScoreMap['SW_200-250'] },
            { label: 'TOEIC SW 300+', value: 'SW_300+', minScore: ScoreMap['SW_300+'] },
        ],
        packages: {
            'SW_1-99_SW_100+': { chapter: 'TOEIC Speaking - Writing Nền tảng', priceSelf: '600.000', priceFull: '1.350.000', commitment: 'SW 100+' },
            'SW_100-199_SW_200+': { chapter: 'TOEIC Speaking - Writing Trung cấp', priceSelf: '2.200.000', priceFull: '3.700.000', commitment: 'SW 200+' },
            'SW_200-250_SW_300+': { chapter: 'TOEIC Speaking - Writing Chuyên sâu', priceSelf: '3.800.000', priceFull: '5.300.000', commitment: 'SW 300+' },
        }
    },
    '4K': {
        title: 'TOEIC 4 Kỹ năng',
        currentLevels: [
            { label: 'TOEIC LR 1-295 & SW 1-99', value: '4K_1-99', minScore: ScoreMap['1-295'] },
            { label: 'TOEIC LR 300-595 & SW 100-199', value: '4K_300-100', minScore: ScoreMap['300-595'] },
            { label: 'TOEIC LR 600-850 & SW 200-250', value: '4K_600-200', minScore: ScoreMap['600-850'] },
        ],
        goalLevels: [
            { label: 'TOEIC LR 300+ & SW 100+', value: '4K_300-100+', minScore: ScoreMap['300-595'] },
            { label: 'TOEIC LR 600+ & SW 200+', value: '4K_600-200+', minScore: ScoreMap['600-850'] },
            { label: 'TOEIC LR 800+ & SW 300+', value: '4K_800-300+', minScore: ScoreMap['800+'] },
        ],
        packages: {
            '4K_1-99_4K_300-100+': { chapter: 'TOEIC 4 Kỹ năng Nền tảng', priceSelf: '1.000.000', priceFull: '1.750.000', commitment: 'LR 300+ & SW 100+' },
            '4K_300-100_4K_600-200+': { chapter: 'TOEIC 4 Kỹ năng Trung cấp', priceSelf: '2.500.000', priceFull: '3.500.000', commitment: 'LR 600+ & SW 200+' },
            '4K_600-200_4K_800-300+': { chapter: 'TOEIC 4 Kỹ năng Chuyên sâu', priceSelf: '4.400.000', priceFull: '6.650.000', commitment: 'LR 800+ & SW 300+' },
        }
    },
};
// ==============================================================
// 2. Component TOEICLevelSelection (Component Đa năng MỚI)
// ==============================================================
const TOEICLevelSelection = () => {
    const [activeTab, setActiveTab] = useState('LR');
// Khởi tạo state bằng giá trị mặc định của tab LR
    const [currentLevel, setCurrentLevel] = useState(TAB_DATA.LR.currentLevels[0].value);
    const [goalLevel, setGoalLevel] = useState(TAB_DATA.LR.goalLevels[0].value);
    const [selectedPackage, setSelectedPackage] = useState(TAB_DATA.LR.packages[Object.keys(TAB_DATA.LR.packages)[0]]);
// Cập nhật dữ liệu khi tab thay đổi
    const updateDataForTab = useCallback((tab) => {
        const data = TAB_DATA[tab];
        const defaultCurrentLevel = data.currentLevels[0].value;
        const defaultGoalLevel = data.goalLevels[0].value;
        
        setCurrentLevel(defaultCurrentLevel);
        setGoalLevel(defaultGoalLevel);
        setSelectedPackage(data.packages[`${defaultCurrentLevel}_${defaultGoalLevel}`] || data.packages[Object.keys(data.packages)[0]]);
    }, []);
// Hook để tự động cập nhật goalLevel khi currentLevel thay đổi
    useEffect(() => {
        const tabData = TAB_DATA[activeTab];
        
        const currentLevelInfo = tabData.currentLevels.find(l => l.value === currentLevel);
        const currentMinScore = currentLevelInfo ? currentLevelInfo.minScore : 0;
        
        const goalLevelInfo = tabData.goalLevels.find(g => g.value === goalLevel);
        const goalMinScore = goalLevelInfo ? goalLevelInfo.minScore : 0;

        // LOGIC KIỂM TRA: Nếu mục tiêu thấp hơn trình độ hiện tại, TỰ ĐỘNG nâng mục tiêu
        if (goalMinScore < currentMinScore) {
            const newGoal = tabData.goalLevels.find(g => g.minScore >= currentMinScore);
            if (newGoal) {
                setGoalLevel(newGoal.value);
            }
        }
        
        // Cập nhật gói học phí sau khi Level/Goal đã được đồng bộ
        const packageKey = `${currentLevel}_${goalLevel}`;
        const newPackage = tabData.packages[packageKey];
        if (newPackage) {
            setSelectedPackage(newPackage);
        }

    }, [currentLevel, goalLevel, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        updateDataForTab(tab);
    };
    
    const tabData = TAB_DATA[activeTab];
    const currentLevelInfo = tabData.currentLevels.find(l => l.value === currentLevel);
    const currentMinScore = currentLevelInfo ? currentLevelInfo.minScore : 0;

    // Hàm kiểm tra mục tiêu có hợp lệ hay không (dựa trên currentMinScore)
    const isGoalAvailable = (goalValue) => {
        const goalInfo = tabData.goalLevels.find(g => g.value === goalValue);
// Mục tiêu phải lớn hơn hoặc bằng trình độ hiện tại
        return goalInfo && goalInfo.minScore >= currentMinScore;
    };
    
    // Component hiển thị các tùy chọn trình độ và mục tiêu
    const LevelOption = ({ level, type }) => {
        const isCurrentSelection = (type === 'current' ? currentLevel : goalLevel) === level.value;
        const isDisabled = type === 'goal' && !isGoalAvailable(level.value);
        
        const onClick = () => {
            if (isDisabled) return;
            if (type === 'current') {
                setCurrentLevel(level.value);
            } else {
                setGoalLevel(level.value);
            }
        };

        return (
            <motion.button
                key={level.value} // Dùng key để đảm bảo animation khi level thay đổi
                whileHover={{ scale: isDisabled ? 1 : 1.03 }}
                onClick={onClick}
                disabled={isDisabled}
                className={`w-full py-3 rounded-lg font-bold text-center transition-all border-2 
                    ${isCurrentSelection 
                        ? 'bg-white border-primary-400 text-primary-700 shadow-lg' 
                        : isDisabled 
                            ? 'bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}
            >
                {level.label}
            </motion.button>
        );
    };
    return (
        <section className="py-20 bg-[#00429D] text-white">
            
            {/* Header chung */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-2">
                    Thiết kế lộ trình học dành riêng cho bạn, ngay tại đây!
                </h1>
                
                {/* Tab Navigation */}
                <div className="flex justify-center space-x-4 bg-white/20 rounded-full p-1 mx-auto max-w-fit mt-6">
                    {Object.keys(TAB_DATA).map((tabKey) => (
                         <button 
                             key={tabKey}
                             onClick={() => handleTabChange(tabKey)}
                             className={`py-2 px-6 rounded-full font-semibold text-sm transition-all ${
                                activeTab === tabKey ? 'bg-white text-[#00429D] shadow-lg' : 'text-white/80 hover:bg-white/10'
                            }`}
                         >
                            {TAB_DATA[tabKey].title}
                         </button>
                    ))}
                </div>
            </div>
            
            {/* Vùng Trình độ & Mục tiêu */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-primary-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* 1. Trình độ của tôi */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white/90">Trình độ của tôi</h3>
                            <div className="space-y-3">
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeTab + "current"} 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-3"
                                    >
                                        {tabData.currentLevels.map((level) => (
                                            <LevelOption key={level.value} level={level} type="current" />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* 2. Mục tiêu của tôi */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white/90">Mục tiêu của tôi</h3>
                            <div className="space-y-3">
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeTab + "goal"} 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-3"
                                    >
                                        {tabData.goalLevels.map((goal) => (
                                            <LevelOption key={goal.value} level={goal} type="goal" />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                    
                    {/* Kiểm tra đầu vào */}
                    <p className="text-center mt-6 text-sm text-white/80">
                        Bạn chưa rõ trình độ bản thân?
                        <a href="#" className="font-semibold text-accent-yellow hover:underline ml-1">Kiểm tra đầu vào</a>
                    </p>
                </div>
            </div>

            {/* Vùng Chương trình học & Gói học phí */}
            <div className="max-w-6xl mx-auto px-4 mt-12">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentLevel + goalLevel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-primary-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-extrabold text-white">Chặng 1</h3>
                            <div className="flex items-center text-accent-yellow font-bold text-lg">
                                Cam kết mục tiêu đầu ra: {selectedPackage.commitment}
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-white/90 mb-6">
                            Chinh phục lộ trình **{selectedPackage.chapter}**
                        </p>
                        
                        {/* Gói học phí (Packages) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Gói 1: Tự học chủ động */}
                            <motion.div className="bg-white p-6 rounded-xl text-text-dark shadow-xl">
                                <h4 className="text-lg font-bold mb-4">⭐ Tự học chủ động</h4>
                                <p className="text-2xl font-extrabold text-primary-600 mb-4">{selectedPackage.priceSelf} VND</p>
                                <a href="#" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md font-semibold text-sm">Đăng ký học ngay</a>
                                <div className="mt-4 border-t pt-4 space-y-2">
                                    <h5 className="font-bold text-gray-700">Quyền lợi:</h5>
                                    <ul className="text-sm space-y-2">
                                        {[
                                            'Sở hữu bộ giáo trình tích hợp chuyên sâu',
                                            'Luyện đề Listening & Reading có giải thích đáp án chi tiết',
                                            'Hỗ trợ trọn bộ & chiến lược làm đề TOEIC hiệu quả',
                                            'Thực chiến với bộ đề TOEIC độc quyền, sát đề thi thật',
                                            'Cá nhân hóa kế hoạch học tập một cách chuyên biệt',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <CheckCircleIcon className="h-5 w-5 text-accent-yellow mr-2 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                            
                            {/* Gói 2: Học và luyện đề toàn diện (Đề xuất) */}
                            <motion.div className="bg-white p-6 rounded-xl text-text-dark shadow-xl border-4 border-accent-yellow relative">
                                <span className="absolute top-0 right-0 bg-accent-yellow text-text-dark text-xs font-bold px-3 py-1 rounded-bl-lg">Đề xuất</span>
                                <h4 className="text-lg font-bold mb-4">🎯 Học và luyện đề toàn diện</h4>
                                <p className="text-2xl font-extrabold text-primary-600 mb-4">{selectedPackage.priceFull} VND</p>
                                <a href="#" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md font-semibold text-sm">Đăng ký học ngay</a>
                                <div className="mt-4 border-t pt-4 space-y-2">
                                    <h5 className="font-bold text-gray-700">Quyền lợi:</h5>
                                    <ul className="text-sm space-y-2">
                                        {[
                                            'Sở hữu bộ giáo trình tích hợp chuyên sâu',
                                            'Luyện đề Listening & Reading có giải thích đáp án chi tiết',
                                            'Nắm trọn bộ kỹ & chiến lược làm đề TOEIC hiệu quả',
                                            'Thực chiến với bộ đề TOEIC độc quyền, sát đề thi thật',
                                            'Cá nhân hóa kế hoạch học tập một cách chuyên biệt',
                                            'Luyện speaking & writing hằng ngày với phòng luyện ảo Prep AI',
                                            'Luyện writing ảo hằng ngày với bộ đề độc quyền, sát nhất' 
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <CheckCircleIcon className="h-5 w-5 text-accent-yellow mr-2 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                        
                        <a href="#" className="text-center block mt-6 text-sm text-white/80 hover:underline">
                            Xem chi tiết lộ trình
                        </a>
                        
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};


// ==============================================================
// 3. Component Step Slider (Được giữ nguyên)
// ==============================================================
const TOEIC_STEP_DATA = [
    {
        step: 1,
        title: "Tứ Phòng Luyện Thi TOEIC Ảo Prep AI Đầu Tiên Việt Nam",
        description: "Trải nghiệm luyện thi TOEIC thông minh - toàn diện. Bạn sẽ nhận được điểm số chi tiết và trình độ hiện tại ngay sau khi hoàn thành bài thi thử.",
        substep: "Bước 1: Kiểm tra trình độ & Thiết lập lộ trình",
        image: { tag: 'Kết quả thi thử TOEIC', file: 'image_683e7b.png' }
    },
    {
        step: 2,
        title: "Nói & Viết trôi chảy với Phòng luyện Speaking/Writing ảo",
        description: "AI chấm chữa phát âm chi tiết, sửa từng lỗi ngữ pháp, nâng cấp từ vựng trong bài, giúp bạn cải thiện rõ rệt cả hai kỹ năng.",
        substep: "Bước 2: Luyện tập chuyên sâu 4 kỹ năng",
        image: { tag: 'Phản hồi chấm Speaking/Writing', file: 'image_683e5c.jpg' }
    },
    {
        step: 3,
        title: "Học tập trung cùng video bài giảng tương tác",
        description: "Các câu hỏi tương tác được lồng xuyên suốt bài giảng để kiểm tra kiến thức bạn vừa học, tăng khả năng ghi nhớ và áp dụng nội dung ngay lập tức.",
        substep: "Bước 3: Nắm vững kiến thức qua bài giảng tương tác",
        image: { tag: 'Bài giảng video tương tác', file: 'image_683e26.jpg' }
    },
];
const TOEICStepSlider = () => {
    const [step, setStep] = useState(0); 
    const sliderRef = useRef(null);
    const debounceTimeout = useRef(null);
    
    const handleWheel = (e) => {
        if (debounceTimeout.current) return;
        const direction = e.deltaY > 0 ? 1 : -1;
        setStep((prevStep) => {
            let nextStep = prevStep + direction;
            if (nextStep < 0) nextStep = 0;
            if (nextStep >= TOEIC_STEP_DATA.length) nextStep = TOEIC_STEP_DATA.length - 1;

            if (nextStep !== prevStep) {
                debounceTimeout.current = setTimeout(() => {
                    debounceTimeout.current = null;
                }, 700); 
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
    }, []);
    const currentStep = TOEIC_STEP_DATA[step];

    const slideVariants = {
        enter: (direction) => ({
            y: direction > 0 ? 500 : -500,
            opacity: 0
        }),
        center: {
            y: 0,
            opacity: 1
        },
        exit: (direction) => ({
            y: direction < 0 ? 500 : -500,
            opacity: 0
        })
    };
    return (
        <section 
            ref={sliderRef}
            className="py-16 md:py-24 bg-[#00429D] text-white relative overflow-hidden h-[800px] flex items-center" 
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        Tối ưu hành trình Luyện Thi TOEIC với 3 bước dễ dàng
                    </h2>
                    <p className="text-lg text-primary-100">
                        Hệ thống TOEIC Prep AI sẽ đồng hành cùng bạn chinh phục mục tiêu điểm số.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    <div className="space-y-6 flex flex-col justify-center min-h-[400px] relative">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentStep.step + "text"}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                custom={currentStep.step > (step + 1) ? -1 : 1} 
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute inset-0 p-4"
                            >
                                <p className="text-6xl md:text-7xl font-extrabold text-white/20 leading-none">
                                    Bước {currentStep.step}
                                </p>
                                <h3 className="text-3xl font-bold text-white mt-4">
                                    {currentStep.title}
                                </h3>
                                <p className="text-lg text-primary-100 mt-4">
                                    {currentStep.description}
                                </p>
                            </motion.div>
                         </AnimatePresence>
                    </div>

                    <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl bg-white">
                        <AnimatePresence mode="wait"> 
                            <motion.div
                                key={currentStep.step + "image"}
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
                                <div className="text-center w-full h-full">
                                    <p className="text-sm font-semibold text-gray-500 mb-2">{currentStep.substep}</p>
                                    
                                    <div className="w-full h-[85%] mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-4 border-primary-400 overflow-hidden">
                                        {/* Hiển thị hình ảnh tương ứng */}
                                        <img 
                                            src={currentStep.image.file} 
                                            alt={currentStep.image.tag} 
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                         </AnimatePresence>
                    </div>

                </div>

                 <div className="text-center mt-12 flex justify-center space-x-3">
                    {TOEIC_STEP_DATA.map((s, index) => (
                        <button
                            key={s.step}
                            onClick={() => setStep(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === step ? 'bg-white scale-125' : 'bg-primary-300/50 hover:bg-primary-300'
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
// 4. Component RoadmapToeic Chính
// ==============================================================

const RoadmapToeic = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* 1. Hero Section */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden md:flex"
                >
                    {/* Cột 1: Nội dung */}
                    <div className="md:w-1/2 p-10 bg-[#f0f5ff] flex flex-col justify-center">
                        <h2 className="text-sm font-bold text-primary-600 uppercase mb-2">KHOÁ HỌC TOEIC</h2>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-secondary-900 mb-4 leading-tight">
                            Luyện Thi TOEIC Hiệu Quả!
                        </h1>
                        <p className="text-lg text-gray-700 mb-8 max-w-md">
                            Với Phòng Luyện TOEIC Ảo Prep AI 4 kỹ năng đầu tiên & duy nhất tại Việt Nam
                        </p>
                        <a href="#" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold max-w-fit">
                            Thiết kế lộ trình học
                        </a>
                        <div className="mt-6 flex items-center">
                            <div className="flex -space-x-2 mr-3">
                                <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=NV&background=c7d2fe&color=3730a3" alt="Student 1" />
                                <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=PT&background=a5b4fc&color=3730a3" alt="Student 2" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                <strong>30.000+</strong> học viên đạt được TOEIC tại NTTU HUB
                            </p>
                        </div>
                    </div>

                    {/* Cột 2: Hình ảnh */}
                    <div className="md:w-1/2 relative bg-[#1E90FF] overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary-900 opacity-20"></div>
                        
                    </div>
                </motion.div>
            </div>
            
            {/* 2. Phần Step Slider */}
            <TOEICStepSlider />
            
            {/* 3. Phần Lựa chọn Trình độ & Mục tiêu */}
            <TOEICLevelSelection />

            {/* 4. CTA cuối trang */}
            <div 
                className="py-12 text-center bg-[#003885] text-white"
            >
                 <a href="#" className="inline-block px-8 py-3 bg-accent-yellow text-text-dark rounded-full font-bold hover:bg-yellow-400 transition-colors">
                    Chọn lộ trình học và Trải nghiệm ngay
                </a>
            </div>
            
            {/* 5. Footer */}
            <Footer />
        </div>
    );
};
export default RoadmapToeic;