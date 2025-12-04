// FILE_PATH: client\src\pages\FAQ.js (TẠO MỚI FILE NÀY)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tab, Disclosure } from '@headlessui/react';
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/outline';
import Footer from '../components/layout/Footer';
// Bạn cần đảm bảo có hàm helper này hoặc import từ thư viện khác
// Dùng hàm classNames để tiện quản lý classes TailwindCSS
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


// ==============================================================
// 1. DỮ LIỆU CỐ ĐỊNH CHO TRANG FAQ (Dựa trên hình ảnh bạn cung cấp)
// ==============================================================

const FAQ_DATA = {
    // Tab 1
    'Dịch vụ sau thi': [
        { 
            q: 'Cách phục khảo bài thi CFA (lĩnh vực tài chính)', 
            a: 'Thông tin về quy trình và lệ phí phục khảo sẽ được cung cấp trên website chính thức của CFA Institute hoặc liên hệ trực tiếp với IIG Việt Nam.'
        },
        { 
            q: 'Cách phục khảo lại điểm thi GRE', 
            a: 'Bạn cần gửi yêu cầu đến ETS (Educational Testing Service) theo quy trình phục khảo của họ. Lệ phí phục khảo có thể áp dụng.'
        },
        { 
            q: 'Thí sinh muốn phục tra lại điểm số sẽ đăng ký như thế nào? Thời gian nhận kết quả trong bao lâu?', 
            a: 'Liên hệ trung tâm khảo thí hoặc tổ chức cấp chứng chỉ (như IIG) để biết thủ tục. Thời gian thường kéo dài từ 4-6 tuần.'
        },
        { 
            q: 'Để nhận Giấy xác nhận kết quả thi TOEFL ITP cần thủ tục gì?', 
            a: 'Thường chỉ cần mang CMND/CCCD/Hộ chiếu đến địa điểm đăng ký thi hoặc liên hệ qua email. Vui lòng kiểm tra thông báo từ IIG.'
        },
        { 
            q: 'Cấp lại chứng chỉ Autodesk cần làm gì?', 
            a: 'Đăng nhập vào tài khoản Certiport của bạn. Tìm mục lịch sử thi và tải lại chứng chỉ. Nếu không được, liên hệ bộ phận hỗ trợ của Certiport.'
        },
        { 
            q: 'Cấp lại chứng chỉ MTA/MCE cần thủ tục gì?', 
            a: 'Đăng nhập vào tài khoản Certiport của bạn. Tìm mục lịch sử thi và tải lại chứng chỉ. Nếu không được, liên hệ bộ phận hỗ trợ của Certiport.'
        },
        { 
            q: 'Hiệu lực của chứng chỉ MCE?', 
            a: 'Chứng chỉ MCE thường không có hiệu lực hết hạn, nhưng các yêu cầu về công nghệ có thể thay đổi, dẫn đến cần cập nhật chứng chỉ.'
        },
        { 
            q: 'Số hiệu chứng chỉ ACPro?', 
            a: 'Liên hệ trung tâm khảo thí hoặc tổ chức cấp chứng chỉ để tra cứu thông tin số hiệu chứng chỉ của bạn.'
        },
        { 
            q: 'Cấp lại chứng chỉ ACPro?', 
            a: 'Liên hệ trực tiếp với trung tâm khảo thí để được hỗ trợ thủ tục cấp lại. Có thể áp dụng phí và yêu cầu cung cấp thông tin cá nhân/lịch sử thi.'
        },
        { 
            q: 'Thủ tục nhận ủy quyền nhận kết quả?', 
            a: 'Người được ủy quyền cần có thư ủy quyền có chữ ký của thí sinh và các giấy tờ tùy thân của cả hai bên (bản gốc & bản sao).'
        },
    ],
    // Tab 2
    'Đăng ký': [
        { 
            q: 'Cách đăng ký thi SAT', 
            a: 'Đăng ký qua trang web của College Board. Bạn cần tạo tài khoản, chọn ngày thi, địa điểm và thanh toán lệ phí.' 
        },
        { 
            q: 'Cách đăng ký thi SSAT', 
            a: 'Đăng ký trực tuyến trên website chính thức của SSAT. Chọn ngày thi và trung tâm khảo thí.'
        },
        { 
            q: 'Cách đăng ký thi CFA (lĩnh vực tài chính)', 
            a: 'Đăng ký trên website chính thức của CFA Institute. Yêu cầu có tài khoản và đáp ứng các tiêu chuẩn về học thuật/kinh nghiệm.'
        },
        { 
            q: 'Cách thức đăng ký thi TOEFL IBT', 
            a: 'Đăng ký trực tuyến qua tài khoản ETS. Chọn trung tâm khảo thí và ngày thi phù hợp.'
        },
        { 
            q: 'Thủ tục đăng ký thi Autodesk?', 
            a: 'Đăng ký tại các trung tâm ủy quyền của Certiport hoặc IIG Việt Nam. Chuẩn bị CMND/CCCD/Hộ chiếu và lệ phí.'
        },
        { 
            q: 'Thủ tục đăng ký thi MTA/MCE?', 
            a: 'Đăng ký tại các trung tâm ủy quyền của Certiport hoặc IIG Việt Nam. Chuẩn bị CMND/CCCD/Hộ chiếu và lệ phí.'
        },
        { 
            q: 'Thủ tục đăng ký thi ACPro?', 
            a: 'Đăng ký tại các trung tâm ủy quyền của Certiport hoặc IIG Việt Nam. Chuẩn bị CMND/CCCD/Hộ chiếu và lệ phí.'
        },
        { 
            q: 'Thủ tục đăng ký thi IC3 Spark?', 
            a: 'Liên hệ IIG Việt Nam hoặc trung tâm được ủy quyền để đăng ký trực tiếp. Thường cần nộp đơn đăng ký và lệ phí.'
        },
        { 
            q: 'Thủ tục đăng ký thi MOS/IC3?', 
            a: 'Đăng ký trực tiếp tại các trung tâm ủy quyền của Certiport hoặc IIG Việt Nam. Chuẩn bị CMND/CCCD/Hộ chiếu và lệ phí.'
        },
        { 
            q: 'Thủ tục đăng ký thi TOEFL ITP?', 
            a: 'Đăng ký tại IIG Việt Nam hoặc các đơn vị đối tác được ủy quyền. Cần CMND/CCCD/Hộ chiếu gốc và lệ phí.'
        },
    ],
    // Tab 3
    'Hướng dẫn thi': [
        { 
            q: 'Đồ dùng được mang vào phòng thi SAT?', 
            a: 'Chỉ được phép mang theo CMND/CCCD/Hộ chiếu, phiếu báo danh, bút chì 2B (không dùng bút mực), tẩy, máy tính được cho phép (nếu có).'
        },
        { 
            q: 'Đồ dùng được mang vào phòng thi SSAT?', 
            a: 'Chỉ mang theo CMND/CCCD, phiếu báo danh và 2-3 cây bút chì đã gọt.'
        },
        { 
            q: 'Cách thay đổi lịch thi, địa điểm thi SSAT?', 
            a: 'Bạn cần đăng nhập vào tài khoản SSAT để yêu cầu thay đổi. Có thể áp dụng phí đổi lịch/địa điểm và phải thực hiện trước ngày hết hạn.'
        },
        { 
            q: 'Thời gian và giấy tờ dự thi SSAT?', 
            a: 'Giấy tờ tùy thân (CMND/CCCD/Hộ chiếu), phiếu báo danh. Thời gian thi có thể khác nhau tùy theo cấp độ (Middle, Upper, Lower).'
        },
        { 
            q: 'Dụng cụ được mang vào phòng thi CFA (lĩnh vực tài chính)', 
            a: 'Chỉ được mang các vật dụng được quy định nghiêm ngặt, bao gồm máy tính được cho phép, CMND/CCCD và Vé vào phòng thi.'
        },
        { 
            q: 'Thời gian và giấy tờ dự thi CFA (lĩnh vực tài chính)', 
            a: 'Giấy tờ tùy thân (CMND/CCCD/Hộ chiếu), vé vào phòng thi. Thời gian thi được công bố rõ trong thông báo thi.'
        },
        { 
            q: 'Thí sinh sẽ được mang những đồ vật gì vào phòng thi TOEFL IBT và GRE', 
            a: 'CMND/CCCD/Hộ chiếu, phiếu báo danh. Không mang theo giấy nháp, bút, điện thoại hay đồng hồ thông minh.'
        },
        { 
            q: 'Thời gian và giấy tờ dự thi GRE?', 
            a: 'CMND/CCCD/Hộ chiếu gốc hợp lệ. Thời gian thi khoảng 3 giờ 45 phút, bao gồm các phần thi và nghỉ giải lao.'
        },
        { 
            q: 'Văn phòng IIG Việt Nam ở đâu?', 
            a: 'Vui lòng kiểm tra trên trang web chính thức của IIG Việt Nam để biết các địa chỉ văn phòng và chi nhánh trên toàn quốc.'
        },
        { 
            q: 'Trường hợp bị quên mật khẩu đăng nhập?', 
            a: 'Sử dụng chức năng "Quên mật khẩu" trên trang đăng nhập của hệ thống đăng ký thi (ví dụ: ETS, Certiport, College Board) hoặc liên hệ hỗ trợ.'
        },
    ],
    // Tab 4
    'Lịch thi': [
        { 
            q: 'Khi nào được thi lại bài Autodesk?', 
            a: 'Thí sinh cần đợi một khoảng thời gian nhất định (thường là 24 giờ sau lần thi thứ nhất) trước khi được đăng ký thi lại.' 
        },
        { 
            q: 'Cách đổi lịch thi Autodesk?', 
            a: 'Đăng nhập vào tài khoản Certiport hoặc liên hệ trực tiếp với trung tâm đăng ký thi. Có thể áp dụng phí và phải thực hiện trước thời hạn.'
        },
        { 
            q: 'Khi nào được thi lại bài MTA/MCE?', 
            a: 'Thí sinh cần đợi một khoảng thời gian nhất định (thường là 24 giờ sau lần thi thứ nhất) trước khi được đăng ký thi lại.'
        },
        { 
            q: 'Khi nào được thi lại bài ACPro?', 
            a: 'Thí sinh cần đợi một khoảng thời gian nhất định (thường là 24 giờ sau lần thi thứ nhất) trước khi được đăng ký thi lại.'
        },
        { 
            q: 'Đổi lịch thi ACPro như thế nào?', 
            a: 'Đăng nhập vào tài khoản Certiport hoặc liên hệ trực tiếp với trung tâm đăng ký thi. Có thể áp dụng phí và phải thực hiện trước thời hạn.'
        },
        { 
            q: 'Khi nào được thi lại bài IC3?', 
            a: 'Thí sinh cần đợi một khoảng thời gian nhất định (thường là 24 giờ sau lần thi thứ nhất) trước khi được đăng ký thi lại.'
        },
        { 
            q: 'Khi nào được thi lại MOS?', 
            a: 'Thí sinh cần đợi một khoảng thời gian nhất định (thường là 24 giờ sau lần thi thứ nhất) trước khi được đăng ký thi lại.'
        },
        { 
            q: 'Đổi lịch thi MOS/IC3 như thế nào?', 
            a: 'Liên hệ trung tâm đăng ký thi để yêu cầu đổi lịch. Việc này phải được thực hiện trước ngày thi theo quy định và có thể phát sinh phí.'
        },
        { 
            q: 'Khoảng cách giữa các lần thi TOEFL ITP là bao lâu?', 
            a: 'Không có giới hạn về khoảng cách thời gian giữa các lần thi TOEFL ITP, bạn có thể đăng ký thi lại ngay khi có lịch.'
        },
        { 
            q: 'Lịch thi mở tiếp theo là ngày nào?', 
            a: 'Kiểm tra trên trang web chính thức của IIG Việt Nam hoặc các trung tâm khảo thí được ủy quyền.'
        },
    ],
    // Tab 5
    'Trả kết quả': [
        { 
            q: 'Tra cứu kết quả thi tại IIG Việt Nam như thế nào?', 
            a: 'Đối với một số bài thi trên máy tính (TOEIC, MOS,...) thí sinh sẽ biết điểm ngay sau khi hoàn thành bài thi. Chứng chỉ được gửi trực tiếp cho thí sinh.'
        },
        { 
            q: 'Tra cứu kết quả các bài thi tiếng Nhật (JLFW) như thế nào?', 
            a: 'Liên hệ trực tiếp với tổ chức tổ chức thi tiếng Nhật tại Việt Nam để biết thông tin chính xác về thời gian và cách tra cứu kết quả.'
        },
        { 
            q: 'Tra cứu kết quả thi bài thi tiếng Hàn (TOPIK và TOPIK IBT) bằng cách nào?', 
            a: 'Tra cứu trực tuyến trên website của TOPIK. Cần nhập số báo danh và ngày sinh để xem kết quả. Thời gian có kết quả thường được thông báo cụ thể.'
        },
        { 
            q: 'Tra cứu kết quả bài thi tin học (MOS, IC3, IC3 Spark, ACPro,...) bằng cách nào?', 
            a: 'Đăng nhập vào tài khoản Certiport/IIG để tra cứu. Đối với thi trên máy, kết quả thường có ngay. Chứng chỉ sẽ được gửi sau đó.'
        },
        { 
            q: 'Tra cứu kết quả các bài thi tiếng anh (TOEIC LR trên máy tính, TOEIC LR trên giấy, TOEIC Speaking&Writing, TOEFL ITP,...) bằng cách nào?', 
            a: 'Tra cứu trên website IIG Việt Nam hoặc tài khoản ETS/Certiport tương ứng. Thời gian có kết quả có thể khác nhau tùy loại hình thi.'
        },
        { 
            q: 'Bao giờ có kết quả thi SAT?', 
            a: 'Kết quả SAT thường có sau khoảng 2-4 tuần kể từ ngày thi. Bạn có thể xem trên tài khoản College Board của mình.'
        },
        { 
            q: 'Được gửi kết quả thi SSAT miễn phí tối đa bao nhiêu trường?', 
            a: 'Thường là 3-5 trường tùy thuộc vào loại hình đăng ký của bạn. Bạn có thể mua thêm báo cáo điểm cho các trường khác.'
        },
        { 
            q: 'Thời gian có kết quả thi SSAT?', 
            a: 'Khoảng 2-3 tuần sau ngày thi (đối với hình thức thông thường).'
        },
        { 
            q: 'Thời gian có kết quả thi CFA (lĩnh vực tài chính)', 
            a: 'Kết quả thi CFA thường được thông báo sau khoảng 60 ngày kể từ khi kết thúc kỳ thi.'
        },
        { 
            q: 'Thời gian có kết quả thi GRE?', 
            a: 'Kết quả chính thức của GRE thường có sau 10-15 ngày kể từ ngày thi và được gửi qua email/tài khoản ETS.'
        },
    ],
};

// ==============================================================
// 2. Component FAQ
// ==============================================================

const FAQ = () => {
    const categories = Object.keys(FAQ_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Lọc tất cả câu hỏi và câu trả lời theo từ khóa
    const filterData = (data) => {
        if (!searchTerm) {
            return data;
        }
        const term = searchTerm.toLowerCase();
        
        // Tạo một cấu trúc dữ liệu mới chỉ chứa các câu hỏi khớp
        const filtered = {};
        for (const [key, questions] of Object.entries(data)) {
            // Lọc các câu hỏi trong từng category
            const filteredQuestions = questions.filter(item => 
                item.q.toLowerCase().includes(term) ||
                item.a.toLowerCase().includes(term)
            );
            // Chỉ thêm category nếu có câu hỏi khớp
            if (filteredQuestions.length > 0) {
                 filtered[key] = filteredQuestions;
            } else {
                 filtered[key] = []; // Giữ cấu trúc để không bị lỗi Tab.Panel
            }
           
        }
        return filtered;
    };
    
    const filteredFAQData = filterData(FAQ_DATA);
    
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
                    Câu Hỏi Thường Gặp (FAQ)
                </h1>
                
                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Câu hỏi FAQ"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Tab/Filter Navigation */}
            <Tab.Group>
                <Tab.List className="flex flex-wrap justify-center space-x-2 md:space-x-4 p-1 mb-8">
                    {categories.map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                // Dùng classNames để có style đồng nhất
                                classNames(
                                    'py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200',
                                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                                    selected
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>

                {/* Tab Content/Answer Accordion */}
                <Tab.Panels className="mt-8">
                    {categories.map((category, index) => (
                        <Tab.Panel
                            key={index}
                            className={classNames(
                                'ring-white ring-opacity-60 focus:outline-none focus:ring-2'
                            )}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {/* SỬ DỤNG DỮ LIỆU ĐÃ LỌC */}
                                {filteredFAQData[category] && filteredFAQData[category].length > 0 ? (
                                    filteredFAQData[category].map((item, qIndex) => (
                                        <Disclosure as="div" key={qIndex} className="bg-white border border-gray-200 rounded-lg shadow-md">
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                                                        <span>{item.q}</span>
                                                        <ChevronDownIcon
                                                            className={classNames(
                                                                'h-6 w-6 text-primary-600 transition-transform duration-200',
                                                                open ? 'rotate-180' : ''
                                                            )}
                                                        />
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel as="dd" className="px-6 pt-2 pb-4 text-base text-gray-700 border-t border-gray-100 bg-gray-50">
                                                        {item.a}
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
                                        Không tìm thấy câu hỏi nào trong mục này.
                                    </div>
                                )}
                            </motion.div>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
            {/* NEW: Footer Section */}
            <Footer />
        </div>
    );
};

export default FAQ;