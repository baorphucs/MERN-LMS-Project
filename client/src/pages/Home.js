import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  ArrowRightIcon 
} from '@heroicons/react/outline';
import Footer from '../components/layout/Footer';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Parallax state (giữ nguyên như cũ)
  const [parallaxY, setParallaxY] = useState(0);
  const [parallaxY2, setParallaxY2] = useState(0);
  const [parallaxY3, setParallaxY3] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);

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
        const rect = benefitsRef.current.getBoundingClientRect();
        setParallaxY3(Math.max(0, -rect.top * 0.1));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants (giữ nguyên)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    { icon: <BookOpenIcon className="h-6 w-6" />, title: 'Digital Course Materials', description: 'Access all your learning resources in one place, from any device, anywhere.' },
    { icon: <UserGroupIcon className="h-6 w-6" />, title: 'Collaborative Learning', description: 'Stay connected with classmates and instructors through announcements and updates.' },
    { icon: <AcademicCapIcon className="h-6 w-6" />, title: 'Real-time Quizzes', description: 'Test your knowledge with interactive quizzes and get instant results.' },
    { icon: <UserGroupIcon className="h-6 w-6" />, title: 'Collaborative Learning', description: 'Stay connected with classmates and instructors through announcements and updates.' },
  ];

  const testimonials = [
    { quote: "This LMS platform has completely transformed how I manage my courses. It's intuitive and saves me so much time!", author: "Dr. Sarah Johnson", role: "Professor of Computer Science" },
    { quote: "As a student, I love how easy it is to access all my course materials and submit assignments in one place.", author: "Michael Chen", role: "Engineering Student" }
  ];

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
    className="relative z-20 text-center px-6 max-w-4xl mx-auto"
    style={{ y: parallaxY * 0.2 }}
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2 }}
  >
    {/* GIẢM CỠ CHỮ TẠI ĐÂY */}
    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-2xl">
      Hi there!, <span className="text-yellow-400">I'm PhamNgocBaoPhuc</span>
    </h1>

    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
      We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
    </p>

    <a
      href={isAuthenticated ? "/dashboard" : "/login"}
      className="inline-block px-8 py-4 text-lg font-semibold bg-white text-primary-700 rounded-full shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
    >
      {isAuthenticated ? "Go to Dashboard" : "Get Started"}
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


      {/* ==================== TỪ ĐÂY TRỞ XUỐNG GIỮ NGUYÊN 100% CỦA BẠN ==================== */}
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Designed for Modern Learning</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Our platform provides all the tools you need for effective teaching and engaging learning experiences.
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

      <motion.section className="bg-gray-50 py-16 md:py-24" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Benefits for Everyone</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Whether you're a teacher or a student, our platform enhances the learning experience.
            </p>
          </motion.div>
          
          <div className="md:flex md:items-center md:justify-between">
            <motion.div className="md:w-1/2 mb-10 md:mb-0" variants={itemVariants}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Teachers</h3>
              <ul className="space-y-4">
                {['Create and manage courses with ease','Share materials in various formats','Design assessments and quizzes','Track student progress and engagement','Communicate effectively with students'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div className="md:w-1/2" variants={itemVariants}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Students</h3>
              <ul className="space-y-4">
                {['Access all course materials in one place','Submit assignments digitally','Take quizzes and get instant feedback','Track your grades and progress','Stay updated with course announcements'].map((item, i) => (
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

      <motion.section
        className="py-16 md:py-24 bg-white relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="absolute -top-24 right-1/4 w-80 h-80 bg-gradient-to-br from-accent-green to-primary-100 rounded-full blur-3xl opacity-30 z-0"
          style={{ y: parallaxY3 * 0.7 }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            What Our Users Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-primary-50 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                style={{ y: parallaxY3 * (0.1 + idx * 0.08) }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + idx * 0.1 }}
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 border-4 border-primary-100" /> {/* placeholder avatar */}
                <p className="text-gray-700 mb-4 italic">“{testimonial.quote}”</p>
                <div className="font-semibold text-primary-700">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

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
            to={isAuthenticated ? (user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard') : '/register'}
            className="inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started For Free'}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.section>

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
    </div>
  );
};

export default Home;