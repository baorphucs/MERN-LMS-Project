// FILE_PATH: client\src\pages\RoadmapIelts.js (CẬP NHẬT HOÀN TOÀN MÀU NỀN VÀ DỮ LIỆU PACKAGES)

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/outline';
import Footer from '../components/layout/Footer';
// ==============================================================
// 1. DỮ LIỆU CẤP ĐỘ, MỤC TIÊU & GÓI HỌC PHÍ IELTS (ĐÃ CẬP NHẬT PACKAGES)
// ==============================================================

const ScoreMap = {
    '0-3.5': 0, '4.0-5.0': 40, '5.5-6.5': 55, '7.0+': 70,
};
const TAB_DATA = {
    IELTS: {
        title: 'IELTS Học Thuật (Academic)',
        currentLevels: [
            { label: 'Band 0 - 3.5 (Mất gốc)', value: 'IELTS_0-3.5', minScore: ScoreMap['0-3.5'] },
            { label: 'Band 4.0 - 5.0 (Nền tảng)', value: 'IELTS_4.0-5.0', minScore: ScoreMap['4.0-5.0'] },
            { label: 'Band 5.5 - 6.5 (Trung cấp)', value: 'IELTS_5.5-6.5', minScore: ScoreMap['5.5-6.5'] },
        ],
        goalLevels: [
            { label: 'Mục tiêu Band 5.0+', value: 'IELTS_5.0+', minScore: ScoreMap['4.0-5.0'] },
            { label: 'Mục tiêu Band 6.5+', value: 'IELTS_6.5+', minScore: ScoreMap['5.5-6.5'] },
            { label: 'Mục tiêu Band 7.5+', value: 'IELTS_7.0+', minScore: ScoreMap['7.0+'] },
        ],
        
        packages: {
            // === TRÌNH ĐỘ HIỆN TẠI: Band 0 - 3.5 (Mất gốc) ===
            'IELTS_0-3.5_IELTS_5.0+': { chapter: 'IELTS Nền tảng (Foundation)', priceSelf: '1.200.000', priceFull: '2.990.000', commitment: 'Band 5.0+' },
            'IELTS_0-3.5_IELTS_6.5+': { chapter: 'IELTS Nền tảng & Tăng tốc (Intensive)', priceSelf: '3.500.000', priceFull: '6.990.000', commitment: 'Band 6.5+' },
            'IELTS_0-3.5_IELTS_7.0+': { chapter: 'IELTS Nền tảng & Chuyên sâu (Pro)', priceSelf: '4.800.000', priceFull: '9.990.000', commitment: 'Band 7.5+' },
            
           
            // === TRÌNH ĐỘ HIỆN TẠI: Band 4.0 - 5.0 (Nền tảng) ===
            'IELTS_4.0-5.0_IELTS_5.0+': { chapter: 'IELTS Tăng tốc (Intermediate)', priceSelf: '1.500.000', priceFull: '2.990.000', commitment: 'Band 5.0+' },
            'IELTS_4.0-5.0_IELTS_6.5+': { chapter: 'IELTS Tăng tốc (Intermediate)', priceSelf: '2.500.000', priceFull: '4.990.000', commitment: 'Band 6.5+' },
            'IELTS_4.0-5.0_IELTS_7.0+': { chapter: 'IELTS Chuyên sâu (Advanced)', priceSelf: '3.800.000', priceFull: '7.990.000', commitment: 'Band 7.5+' },
            
        
            // === TRÌNH ĐỘ HIỆN TẠI: Band 5.5 - 6.5 (Trung cấp) ===
            'IELTS_5.5-6.5_IELTS_5.0+': { chapter: 'IELTS Về đích (Goal Setter)', priceSelf: '800.000', priceFull: '1.500.000', commitment: 'Band 5.0+' },
            'IELTS_5.5-6.5_IELTS_6.5+': { chapter: 'IELTS Về đích (Goal Setter)', priceSelf: '1.500.000', priceFull: '2.990.000', commitment: 'Band 6.5+' },
            'IELTS_5.5-6.5_IELTS_7.0+': { chapter: 'IELTS Chuyên sâu (Advanced)', priceSelf: '3.800.000', priceFull: '7.990.000', commitment: 'Band 7.5+' },
        }
    },
};
// ==============================================================
// 2. Component IELTSLevelSelection
// ==============================================================
const IELTSLevelSelection = () => {
    const activeTab = 'IELTS';
    const tabData = TAB_DATA[activeTab];

    const [currentLevel, setCurrentLevel] = useState(tabData.currentLevels[0].value);
    const [goalLevel, setGoalLevel] = useState(tabData.goalLevels[0].value);
    
    const initialPackageKey = `${tabData.currentLevels[0].value}_${tabData.goalLevels[0].value}`;
    const [selectedPackage, setSelectedPackage] = useState(tabData.packages[initialPackageKey] || tabData.packages[Object.keys(tabData.packages)[0]]);

    useEffect(() => {
        const currentLevelInfo = tabData.currentLevels.find(l => l.value === currentLevel);
        const currentMinScore = currentLevelInfo ? currentLevelInfo.minScore : 0;
        
        let newGoalLevel = goalLevel;
        const goalLevelInfo = tabData.goalLevels.find(g => g.value === goalLevel);
    
     const goalMinScore = goalLevelInfo ? goalLevelInfo.minScore : 0;

        if (goalMinScore < currentMinScore) 
        {
            const newGoal = tabData.goalLevels.find(g => g.minScore >= currentMinScore);
            if (newGoal) {
                newGoalLevel = newGoal.value;
                setGoalLevel(newGoalLevel);
            }
 
        }
        
        const packageKey = `${currentLevel}_${newGoalLevel}`;
        const newPackage = tabData.packages[packageKey];
        if (newPackage) {
            setSelectedPackage(newPackage);
        } else {
             const fallbackKey = Object.keys(tabData.packages).find(key => key.startsWith(currentLevel));
             if(fallbackKey) {
                 setSelectedPackage(tabData.packages[fallbackKey]);
                 setGoalLevel(fallbackKey.split('_').slice(-2).join('_'));
             }
   
          }

    }, [currentLevel, goalLevel, tabData.currentLevels, tabData.goalLevels, tabData.packages]);

    const isGoalAvailable = (goalValue) => {
        const goalInfo = tabData.goalLevels.find(g => g.value === goalValue);
        const currentLevelInfo = tabData.currentLevels.find(l => l.value === currentLevel);
        const currentMinScore = currentLevelInfo ? currentLevelInfo.minScore : 0;
        return goalInfo && goalInfo.minScore >= currentMinScore;
    };
    
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

        // CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng primary-400 thay cho secondary-400/700)
        return (
            <motion.button
                key={level.value}
          
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
        // THAY ĐỔI: Thêm id="ielts-selector" để nút CTA cuối trang có thể cuộn tới
        <section className="py-20 bg-[#00429D] text-white" id="ielts-selector"> 
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-2">
   
                  Xây dựng lộ trình IELTS cá nhân hóa
                </h1>
                <p className="text-lg text-white/80">Chọn trình độ hiện tại và mục tiêu Band của bạn.</p>
                
                <div className="flex justify-center space-x-4 bg-white/20 rounded-full p-1 mx-auto max-w-fit mt-6">
  
                   {/* CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng primary-700 thay cho secondary-700) */}
                    <div className='py-2 px-6 rounded-full font-semibold text-sm bg-white text-primary-700 shadow-lg'>
                        {tabData.title}
                    </div>
         
                </div>
    
            </div>
            
            <div className="max-w-6xl mx-auto px-4">
                {/* CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng primary-900/50 thay cho secondary-800/50) */}
                <div className="bg-primary-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10">
          
     
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white/90">Trình độ của 
tôi (Band hiện tại)</h3>
    
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

 
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white/90">Mục tiêu của tôi (Band mong muốn)</h3>
                         
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
                
                    
 <p className="text-center mt-6 text-sm text-white/80">
                        Bạn chưa rõ trình độ Band của mình?
                        <a href="#" className="font-semibold text-accent-yellow hover:underline ml-1">Làm bài Test Đầu vào IELTS</a>
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-12">
 
                <AnimatePresence mode="wait">
         
                    {/* CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng primary-900/50 thay cho secondary-800/50) */}
                    <motion.div 
                        key={currentLevel + goalLevel}
       
                 initial={{ opacity: 0, y: 20 }}
 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
   
              
                        className="bg-primary-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-6">
                    
         <h3 className="text-2xl font-extrabold text-white">Chặng Luyện Thi</h3>
     
                            <div className="flex items-center text-accent-yellow font-bold text-lg">
                                Cam kết mục tiêu đầu ra: {selectedPackage.commitment}
                      
           </div>
      
                        </div>
                        <p className="text-xl font-semibold text-white/90 mb-6">
                            Chinh phục lộ trình **{selectedPackage.chapter}**
               
        
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
 
                  
                            {/* Gói 1: Tự học chủ động (Self-study) */}
                            <motion.div className="bg-white p-6 rounded-xl text-text-dark shadow-xl">
                        
         <h4 className="text-lg font-bold mb-4">⭐ Tự học chủ động</h4>
          
                                {/* CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng primary-600 thay cho secondary-600) */}
                                <p className="text-2xl font-extrabold text-primary-600 mb-4">{selectedPackage.priceSelf} VND</p>
     
                         
                                <a href="/contact" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md font-semibold text-sm">Đăng ký học ngay</a>
                                <div className="mt-4 border-t pt-4 space-y-2">
       
                              <h5 className="font-bold text-gray-700">Quyền lợi:</h5>
          
                                    <ul className="text-sm space-y-2">
                               
          {[
                                
                                            'Sở hữu toàn bộ video bài giảng IELTS chuyên sâu',
                 
                                            'Luyện 4 kỹ năng với Phòng luyện IELTS ảo PREP AI',
                         
                                            'Luyện Writing/Speaking với kho đề độc quyền',
                                            'Hướng dẫn chiến lược làm bài thi hiệu quả',
                       
                                   
                                            'Cá nhân hóa kế hoạch học tập theo Band mục tiêu',
                                        ].map((item, i) => (
                          
                       
                      <li key={i} className="flex items-start">
                                                <CheckCircleIcon className="h-5 w-5 text-accent-yellow mr-2 flex-shrink-0" />
                         
        
                                                 <span>{item}</span>
                                            </li>
                           
       
                                        ))}
                                    </ul>
                             
    </div>
                         
                            </motion.div>
                            
                           
  {/* Gói 2: Học và luyện đề toàn diện (Full Package) */}
                            <motion.div className="bg-white 
p-6 rounded-xl text-text-dark shadow-xl border-4 border-accent-yellow relative">
                                <span className="absolute top-0 right-0 bg-accent-yellow text-text-dark text-xs font-bold px-3 py-1 rounded-bl-lg">Đề xuất</span>
                    
             <h4 className="text-lg font-bold mb-4">🎯 Học và luyện đề toàn diện</h4>
          
                                {/* CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng primary-600 thay cho secondary-600) */}
                                <p className="text-2xl font-extrabold text-primary-600 
mb-4">{selectedPackage.priceFull} VND</p>
                             
                                <a href="/contact" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md font-semibold text-sm">Đăng ký học ngay</a>
                                <div className="mt-4 border-t pt-4 space-y-2">
 
                                    <h5 className="font-bold text-gray-700">Quyền lợi:</h5>
          
                                    <ul className="text-sm space-y-2">
                               
                {[
                                
                                            'TẤT CẢ quyền lợi của Gói Tự học chủ động',
           
                                            'Được chấm chữa Writing/Speaking bởi GIÁO VIÊN',
                             
                                           
                                            'Được giải đáp 1-1 mọi thắc mắc trong quá trình học',
                                            'Lớp học bổ trợ kiến thức hàng tuần',
                        
                         
                                            'Hỗ trợ đăng ký thi IELTS (IDP/BC) với ưu đãi đặc biệt',
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
                    
 </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

// ==============================================================
// 3. Component Step Slider IELTS
// ==============================================================

const IELTS_STEP_DATA = [
    {
        step: 1,
        title: "Xây dựng nền tảng từ A đến Z",
        description: "Bắt đầu với các kiến thức cơ bản nhất về Ngữ pháp, Từ vựng học thuật, và Format bài thi IELTS. Chuẩn bị vững chắc trước khi bước vào luyện đề.",
        substep: "Bước 1: Nền tảng vững chắc (Foundation)",
      
        image: { tag: 'Xây dựng nền tảng từ A đến Z', file: '/lotrinhtoeic_buoc1.gif' }
    },
    {
        step: 2,
        title: "Tối ưu kỹ năng với Phòng luyện IELTS ảo PREP AI",
        description: "Luyện tập Speaking & Writing với AI chấm chữa chi tiết, sửa lỗi phát âm, ngữ pháp và gợi ý nâng cấp từ vựng theo tiêu chí Band Score.",
        // Dòng này đã được FIX LỖI CÚ PHÁP
        substep: "Bước 2: Luyện tập chuyên sâu 4 kỹ năng (Skill Boost)", 
        image: { tag: 'Phòng luyện IELTS ảo PREP AI', file: '/lotrinhtoeic_buoc2.gif' }
    },
    {
        step: 3,
        title: "Thực chiến & Bứt phá điểm số",
        description: "Làm quen với áp lực phòng thi thật qua kho đề thi thử mô phỏng sát đề thi mới nhất.Giáo viên chấm chữa chuyên sâu 1-1 để bứt phá band score mục tiêu.",
        substep: "Bước 3: Thực chiến và Về đích (Exam Simulation)",
        image: { tag: 'Thực chiến & Bứt phá điểm số', file: '/lotrinhtoeic_buoc3.gif' }
    },
];

const IELTSStepSlider = () => {
    const [step, setStep] = useState(0); 
    const sliderRef = useRef(null);
    const debounceTimeout = useRef(null);
    
    const handleWheel = (e) => {
     
       
        if (debounceTimeout.current) return;
        const direction = e.deltaY > 0 ? 1 : -1;
        setStep((prevStep) => {
            let nextStep = prevStep + direction;
            if (nextStep < 0) nextStep = 0;
            if (nextStep >= IELTS_STEP_DATA.length) nextStep = IELTS_STEP_DATA.length - 1;

            if 
(nextStep !== prevStep) {
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
    const currentStep = IELTS_STEP_DATA[step];

    const slideVariants = {
        enter: (direction) => ({
            y: direction > 0 ? 500 : -500,
            opacity: 0
        }),
        center: {
            y: 0,
            opacity: 
 1
       
        
        },
        exit: (direction) => ({
            y: direction < 0 ? 500 : -500,
            opacity: 0
        })
    };
    return (
        <section 
            ref={sliderRef}
            className="py-16 md:py-24 bg-[#00429D] text-white relative overflow-hidden h-[800px] flex items-center" // CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng #00429D thay cho primary-700)
 
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
                        Hành trình Chinh phục IELTS theo 
3 chặng rõ ràng
                    </h2>
                    <p className="text-lg text-primary-100">
                       
  Hệ thống IELTS Prep AI sẽ đồng hành cùng bạn chinh phục mục tiêu Band Score.
                
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
                                    Chặng {currentStep.step}
                      
                   
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
                     
                    
                                        {/* THAY THẾ PLACEHOLDER BẰNG THẺ IMG */}
                                        <img 
    
                                             src={currentStep.image.file} 
                                            alt={currentStep.image.tag} 
                         
                    // Sử dụng object-contain để đảm bảo toàn bộ GIF hiển thị, hoặc object-cover nếu bạn muốn nó lấp đầy khung.
                                            className="w-full h-full object-contain"
                                        />
                             
            
                                    </div>
                                </div>
                            </motion.div>
    
                     </AnimatePresence>
 
                    </div>

                </div>

                 <div className="text-center mt-12 flex justify-center space-x-3">
                    {IELTS_STEP_DATA.map((s, index) => (
         
            
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
// 4. Component RoadmapIelts Chính
// ==============================================================

const RoadmapIelts = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* 1. Hero Section */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 
0, y: 20 }} 
            
                 animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden md:flex"
                >
       
                    {/* Cột 1: Nội dung */}
  
                   {/* CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng bg-[#f0f5ff] thay cho bg-[#f0f5ff] và text-primary-600 thay cho secondary-600) */}
                    <div className="md:w-1/2 p-10 bg-[#f0f5ff] flex flex-col justify-center">
                   
                        <h2 className="text-sm font-bold text-primary-600 uppercase mb-2">KHOÁ HỌC 
IELTS</h2>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-secondary-900 mb-4 leading-tight">
                            Luyện Thi IELTS **Trọn vẹn 4 Kỹ năng**
                       
                       
  </h1>
                        <p className="text-lg text-gray-700 mb-8 max-w-md">
                            Phòng luyện thi IELTS ảo PREP AI – Nền tảng tự học thông minh, cam kết đầu ra Band Score.
                        </p>
                        {/* CHỈNH SỬA MÀU NỀN TẠI ĐÂY (Dùng bg-primary-600 thay 
cho secondary-600) */}
                        <a href="/contact" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold max-w-fit">
                            Thiết kế 
lộ trình học
                        </a>
                   
      <div className="mt-6 flex items-center">
                            <div className="flex -space-x-2 mr-3">
                
                                {/* Dùng primary-400 cho avatars */}
                   
              <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=NV&background=b8cbe0&color=0A3D62" alt="Student 1" />
                                <img className="h-8 w-8 rounded-full ring-2 ring-white" 
src="https://ui-avatars.com/api/?name=PT&background=8dacce&color=0A3D62" alt="Student 2" />
                            </div>
                    
         <p className="text-sm font-medium text-gray-700">
                                <strong>500.000+</strong> học viên đạt IELTS tại 
NTTU HUB
                            </p>
                        </div>
         
            </div>

                    {/* Cột 2: Hình ảnh */}
                    <div className="md:w-1/2 relative bg-[#1E90FF] overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary-900 opacity-20 z-10"></div>
                   
      
                        
                        <img 
                            src="/nguoimau-2.png" 
                            
 alt="IELTS Mockup" 
                            className="relative z-20 w-3/4 h-auto object-contain"
                        />
                        
                    </div>
         
        </motion.div>
            </div>
            
            {/* 2. Phần Step Slider */}
            <IELTSStepSlider />
        
            {/* 3. Phần Lựa 
chọn Trình độ & Mục tiêu */}
            <IELTSLevelSelection />

       
      {/* 4. CTA cuối trang */}
            {/* THAY ĐỔI: Sử dụng anchor link tới phần chọn trình độ */}
            <div 
                className="py-12 text-center bg-[#003885] text-white" 
       
            >
                 <a href="#ielts-selector" className="inline-block px-8 py-3 bg-accent-yellow text-text-dark rounded-full 
font-bold hover:bg-yellow-400 transition-colors">
                    Chọn lộ trình học và Trải nghiệm ngay
                </a>
            </div>
            
 
            {/* 5. Footer */}
            <Footer />
        </div>
    );
 };
export default RoadmapIelts;