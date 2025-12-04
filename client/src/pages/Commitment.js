// FILE_PATH: client\src\pages\Commitment.js (TẠO MỚI FILE NÀY)

import React from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/outline';
import Footer from '../components/layout/Footer';

// Hàm helper để tạo cấu trúc CSS
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// ==============================================================
// 1. DỮ LIỆU CỐ ĐỊNH CHO TRANG CAM KẾT ĐẦU RA (Dựa trên hình ảnh 56f869.jpg)
// ==============================================================
const COMMITMENT_DATA = {
    header: "CAM KẾT ĐẦU RA LỘ TRÌNH HỌC",
    subHeader: "Cam kết đầu ra là sự đảm bảo về kết quả học tập cho học viên đăng ký các khóa học cam kết tại  (NTTU HUB).",
    sections: [
        {
            title: "I. Điều Kiện Áp Dụng Cam Kết",
            icon: "✅",
            content: [
                { type: 'paragraph', text: 'Học viên cần đáp ứng đầy đủ các điều kiện sau:' },
                { 
                    type: 'list', 
                    items: [
                        'Đã đăng ký và thanh toán khóa học cam kết.',
                        'Hoàn thành các bài kiểm tra đầu vào và đạt chuẩn về điểm số (hoặc được PREP duyệt).',
                        'Tuân thủ nghiêm ngặt lộ trình học tập, hoàn thành tối thiểu 90% bài tập về nhà và bài luyện tập bắt buộc do PREP giao.',
                        'Đạt kết quả tối thiểu 80% trong các bài kiểm tra giữa khóa và cuối khóa.'
                    ] 
                },
                { type: 'paragraph', text: 'Trong thời gian học, học viên không được vi phạm bất kỳ quy định nào của PREP (ví dụ: chia sẻ tài khoản, vi phạm bản quyền) dẫn đến bị đình chỉ học.' }
            ]
        },
        {
            title: "II. Nghĩa Vụ Của Học Viên",
            icon: "📚",
            content: [
                { type: 'paragraph', text: 'Trong thời gian tham gia khóa học, học viên có trách nhiệm:' },
                { 
                    type: 'list', 
                    items: [
                        'Tham gia đầy đủ các buổi học trực tuyến (live session) và các buổi chữa bài tập (feedback session) theo lịch trình đã định.',
                        'Dành đủ thời gian tự học theo Study Plan cá nhân (tối thiểu 4-6 giờ/tuần).',
                        'Báo cáo tiến độ học tập và kết quả bài kiểm tra định kỳ cho đội ngũ giáo viên/tư vấn học tập của PREP.',
                        'Thông báo ngay lập tức cho PREP nếu có bất kỳ vấn đề nào ảnh hưởng đến việc học tập của mình (ví dụ: sự cố kỹ thuật, vấn đề sức khỏe,...).'
                    ] 
                }
            ]
        },
        {
            title: "III. Cam Kết Của Prep",
            icon: "🎯",
            content: [
                { type: 'paragraph', text: 'PREP cam kết cung cấp các dịch vụ sau:' },
                { 
                    type: 'list', 
                    items: [
                        'Lộ trình học tập được thiết kế riêng biệt, phù hợp với trình độ đầu vào và mục tiêu đầu ra của từng học viên.',
                        'Đội ngũ giáo viên và tư vấn viên có chuyên môn cao, nhiệt tình hỗ trợ học viên trong suốt quá trình học.',
                        'Cung cấp đầy đủ các công cụ học tập và luyện thi ảo (PREP AI) với chất lượng tốt nhất.',
                        'Trong trường hợp học viên đã đáp ứng đầy đủ tất cả các điều kiện cam kết nhưng không đạt được mục tiêu đầu ra đã đăng ký, PREP sẽ áp dụng chính sách hoàn tiền hoặc học lại miễn phí.'
                    ] 
                }
            ]
        },
        {
            title: "IV. Quy Trình Hoàn Tiền",
            icon: "💰",
            content: [
                { type: 'paragraph', text: 'Quy trình hoàn tiền được thực hiện theo các bước sau:' },
                { 
                    type: 'list', 
                    items: [
                        'Học viên gửi yêu cầu chính thức (bằng văn bản/email) lên PREP trong vòng 7 ngày kể từ ngày công bố kết quả thi cuối khóa/thi thật.',
                        'PREP tiến hành kiểm tra và xác nhận học viên đã đáp ứng đầy đủ các điều kiện áp dụng cam kết.',
                        'Nếu yêu cầu hợp lệ, PREP sẽ thông báo về phương án hoàn tiền hoặc học lại miễn phí. Thời gian xử lý hoàn tiền là 30 ngày làm việc.'
                    ] 
                }
            ]
        }
    ],
    // Dữ liệu bảng (Table Data) - Dựa trên phụ lục hình ảnh
    table: {
        headers: ["Phạm vi cam kết", "IELTS", "TOEIC L/R", "TOEIC S/W", "Tin học (MOS, IC3)"],
        rows: [
            ["Mục tiêu", "Band Score Overall 6.5+", "Điểm 700+", "Điểm 300+", "Pass các Module đã đăng ký"],
            ["Điều kiện hoàn thành", "Hoàn thành 90% bài tập, thi thử đạt 80%", "Hoàn thành 90% bài tập, thi thử đạt 80%", "Hoàn thành 90% bài tập, thi thử đạt 80%", "Hoàn thành 90% bài tập, thi thử đạt 80%"],
            ["Hình thức bồi hoàn", "Hoàn tiền 100% hoặc học lại miễn phí", "Hoàn tiền 100% hoặc học lại miễn phí", "Hoàn tiền 100% hoặc học lại miễn phí", "Hoàn tiền 100% hoặc học lại miễn phí"],
        ]
    }
};

// ==============================================================
// 2. Component Trình bày nội dung (Content Renderer)
// ==============================================================
const ContentRenderer = ({ content }) => (
    <div className="space-y-4 text-gray-700">
        {content.map((block, index) => {
            if (block.type === 'paragraph') {
                return <p key={index} className="leading-relaxed">{block.text}</p>;
            } else if (block.type === 'list') {
                return (
                    // Dùng div thay cho ul và flex để kiểm soát layout tốt hơn
                    <div key={index} className="space-y-2 pl-4">
                        {block.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start">
                                <CheckCircleIcon className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="flex-1">{item}</span>
                            </div>
                        ))}
                    </div>
                );
            }
            return null;
        })}
    </div>
);

// ==============================================================
// 3. Component Commitment Chính
// ==============================================================
const Commitment = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12 bg-white p-8 rounded-xl shadow-lg border border-primary-100">
                    <AcademicCapIcon className="h-10 w-10 text-primary-600 mx-auto mb-2" />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-4">
                        {COMMITMENT_DATA.header}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {COMMITMENT_DATA.subHeader}
                    </p>
                </motion.div>
                
                {/* Nội dung chi tiết */}
                <div className="space-y-12">
                    {COMMITMENT_DATA.sections.map((section, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 30 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
                                <span className="text-3xl text-primary-600">{section.icon}</span>
                                <span>{section.title}</span>
                            </h2>
                            <ContentRenderer content={section.content} />
                        </motion.div>
                    ))}
                </div>

                {/* Bảng Cam Kết Chi Tiết */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6 }}
                    className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto"
                >
                    <h2 className="text-2xl font-bold text-gray-900 p-6 border-b">
                        Phụ lục: Bảng Nghĩa vụ Hoàn thành
                    </h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-primary-600 text-white">
                            <tr>
                                {COMMITMENT_DATA.table.headers.map((header, index) => (
                                    <th 
                                        key={index} 
                                        scope="col" 
                                        className={classNames("px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider", {
                                            "w-1/6": index === 0, // Cột đầu tiên rộng hơn
                                        })}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {COMMITMENT_DATA.table.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                    {row.map((cell, cellIndex) => (
                                        <td 
                                            key={cellIndex} 
                                            className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-800"
                                        >
                                            {cellIndex === 0 ? (
                                                <span className="font-bold text-primary-700">{cell}</span>
                                            ) : (
                                                cell
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
                
                {/* CTA cuối trang */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-12 text-center"
                >
                    <a 
                        href="/contact" 
                        className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full font-extrabold text-lg hover:bg-primary-700 transition-colors shadow-xl"
                    >
                        Đăng ký nhận tư vấn <ArrowRightIcon className="ml-2 h-6 w-6" />
                    </a>
                </motion.div>

            </div>
            <Footer />
        </div>
    );
};

export default Commitment;