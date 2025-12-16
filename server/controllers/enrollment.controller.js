const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

exports.requestEnroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Khóa học không tồn tại' });

    // 1. Nếu đã là học viên thì không cho gửi yêu cầu nữa
    if (course.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Bạn đã là học viên khóa này' });
    }

    // 2. Nếu đang có yêu cầu ở trạng thái 'pending', chặn lại
    const existingPending = await Enrollment.findOne({ course: courseId, student: studentId, status: 'pending' });
    if (existingPending) {
      return res.status(400).json({ success: false, message: 'Yêu cầu đang chờ phê duyệt' });
    }

    // 3. Xóa các bản ghi cũ (approved/rejected) để làm sạch dữ liệu
    await Enrollment.deleteMany({ course: courseId, student: studentId });

    // 4. Tạo yêu cầu mới cho giáo viên thấy
    await Enrollment.create({
      course: courseId,
      student: studentId,
      teacher: course.teacher,
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Đã gửi yêu cầu đăng ký' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Teacher lấy danh sách chờ duyệt
exports.getPendingEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId, status: 'pending' })
      .populate('student', 'name email');
    res.json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Teacher phê duyệt/từ chối
exports.handleEnrollment = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' hoặc 'rejected'
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Không tìm thấy yêu cầu' });

    enrollment.status = status;
    await enrollment.save();

    if (status === 'approved') {
      await Course.findByIdAndUpdate(enrollment.course, { $addToSet: { students: enrollment.student } });
      await User.findByIdAndUpdate(enrollment.student, { $addToSet: { courses: enrollment.course } });
    }
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};