// FILE_PATH: client\src\pages\Contact.js (TẠO MỚI FILE NÀY)

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
// Sử dụng Heroicons thay cho MUI icons
import { LocationMarkerIcon, MailIcon, PhoneIcon, PaperAirplaneIcon, ExternalLinkIcon } from '@heroicons/react/outline'; 
import { AcademicCapIcon } from '@heroicons/react/solid'; 
import Footer from '../components/layout/Footer';

// Hàm helper để gán class
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// ==============================================================
// 1. DỮ LIỆU CỐ ĐỊNH
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
        value: '2200001971@nttu.edu.vn',
        link: 'mailto:2200001971@nttu.edu.vn' 
    },
    { 
        icon: PhoneIcon, 
        title: 'Phone', 
        value: '0399246128',
        link: 'tel:0399246128' 
    },
];

const SOCIAL_LINKS = [
    { 
        label: 'Facebook', 
        icon: 'FB', // Placeholder
        url: 'https://www.facebook.com/DaihocNguyenTatThanh'
    },
    { 
        label: 'GitHub', 
        icon: 'GH', // Placeholder
        url: 'https://github.com/baorphucs' // Sử dụng GitHub link từ mẫu
    },
];

// ==============================================================
// 2. Component Contact
// ==============================================================
export default function Contact() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        // Thay thế bằng Service ID, Template ID, Public Key của EmailJS của bạn
        const serviceID = 'service_odo7xzm'; 
        const templateID = 'template_iy35o7f'; 
        const publicKey = 'BM-yrfjfz0EoLCCPV'; 

        const templateParams = {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            time: new Date().toLocaleString(),
        };

        // Gửi qua emailjs
        emailjs
            .send(serviceID, templateID, templateParams, publicKey)
            .then((response) => {
                toast.success('Your message has been sent successfully!');
                reset(); // clear form
            })
            .catch((err) => {
                console.error('FAILED...', err);
                toast.error('Failed to send message. Please try again or call us.');
            });
    };

    const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 text-gray-800 transition-shadow";
    const errorClasses = "mt-1 text-xs text-red-500 font-medium";

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
                    {/* Dùng AcademicCapIcon làm icon đại diện cho NTTU HUB */}
                    <AcademicCapIcon className="h-10 w-10 text-primary-600 mx-auto mb-2" />
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Liên hệ
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn lòng lắng nghe ý kiến và hỗ trợ bạn. Vui lòng gửi tin nhắn hoặc liên hệ trực tiếp.
                    </p>
                </motion.div>
                
                {/* Contact Content Wrapper */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white shadow-2xl rounded-2xl p-6 md:p-10 border border-primary-50">
                    
                    {/* Cột 1: Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-gray-900">Đăng ký nhận tin</h3>
                        <p className="text-gray-600">
                            Nếu bạn có bất kỳ câu hỏi, góp ý về hệ thống, hoặc muốn biết thêm thông tin về các khóa học, hãy liên hệ với chúng tôi.
                        </p>
                        
                        <ul className="space-y-4">
                            {CONTACT_INFO.map((item, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className="p-2 rounded-full bg-primary-100 text-primary-600 flex-shrink-0 mt-1">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-500 block">{item.title}</span>
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="text-base font-medium text-gray-800 hover:text-primary-600 transition-colors flex items-center"
                                        >
                                            {item.value}
                                            <ExternalLinkIcon className="h-4 w-4 ml-1 text-gray-400" />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Social Links */}
                        <ul className="flex space-x-4 pt-4">
                            {SOCIAL_LINKS.map((social, index) => (
                                <li key={index}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white transition-colors text-lg font-bold"
                                        title={social.label}
                                    >
                                        {social.icon} 
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Cột 2: Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-2"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Name and Email Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        {...register("name", {
                                            required: "Tên không được để trống",
                                            validate: (value) => value.trim() !== "" ? true : "Tên không được để trống",
                                        })}
                                        type="text"
                                        placeholder="TÊN CỦA BẠN"
                                        className={inputClasses}
                                    />
                                    {errors.name && (<span className={errorClasses}>{errors.name?.message}</span>)}
                                </div>
                                <div>
                                    <input
                                        {...register("email", {
                                            required: "Email không được để trống",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: "Địa chỉ email không hợp lệ"
                                            },
                                        })}
                                        type="email"
                                        placeholder="EMAIL"
                                        className={inputClasses}
                                    />
                                    {errors.email && (<span className={errorClasses}>{errors.email?.message}</span>)}
                                </div>
                            </div>
                            
                            {/* Subject Field */}
                            <div>
                                <input
                                    {...register("subject", {
                                        required: "Chủ đề không được để trống",
                                        validate: (value) => value.trim() !== "" ? true : "Chủ đề không được để trống",
                                    })}
                                    type="text"
                                    placeholder="CHỦ ĐỀ"
                                    className={inputClasses}
                                />
                                {errors.subject && (<span className={errorClasses}>{errors.subject?.message}</span>)}
                            </div>
                            
                            {/* Message Field */}
                            <div>
                                <textarea
                                    {...register("message", {
                                        required: "Tin nhắn không được để trống",
                                        validate: (value) => value.trim() !== "" ? true : "Tin nhắn không được để trống",
                                    })}
                                    placeholder="TIN NHẮN CỦA BẠN"
                                    rows="6"
                                    className={inputClasses + " resize-none"}
                                ></textarea>
                                {errors.message && (<span className={errorClasses}>{errors.message?.message}</span>)}
                            </div>
                            
                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow-lg hover:bg-primary-700 transition-colors"
                                >
                                    <span className="btn-text uppercase mr-2">send message</span>
                                    <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}