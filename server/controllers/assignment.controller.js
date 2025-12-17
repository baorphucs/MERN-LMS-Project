const Assignment = require('../models/assignment.model');
const Course = require('../models/course.model');

// @desc    Lấy chi tiết 1 bài học (Quan trọng để Teacher xem danh sách học sinh)
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('courseId', 'title code')
      .populate('submissions.student', 'name email avatar'); // Lấy thông tin học sinh

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    res.status(200).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lấy danh sách cho Teacher (Sửa lỗi crash server)
exports.getTeacherAssignments = async (req, res) => {
  try {
    const teacherCourses = await Course.find({ teacher: req.user.id }).select('_id');
    const assignments = await Assignment.find({ courseId: { $in: teacherCourses } })
      .populate('courseId', 'title code');
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lấy danh sách cho Student (Sửa lỗi crash server)
exports.getStudentAssignments = async (req, res) => {
  try {
    const studentCourses = await Course.find({ students: req.user.id }).select('_id');
    const assignments = await Assignment.find({ courseId: { $in: studentCourses } })
      .populate('courseId', 'title code');
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Học sinh nhấn "Hoàn thành"
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    const isAlreadyDone = assignment.submissions.some(s => s.student.toString() === req.user.id);
    
    if (!isAlreadyDone) {
      assignment.submissions.push({ student: req.user.id, status: 'completed' });
      await assignment.save();
    }
    res.status(200).json({ success: true, message: 'Đã ghi nhận hoàn thành' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lấy tất cả bài tập (Dùng chung cho Route '/')
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('courseId', 'title');
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Tạo bài tập mới
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, videoUrl } = req.body;
    const assignment = await Assignment.create({
      title, description, courseId, videoUrl,
      teacher: req.user.id // Fix lỗi teacher path is required
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Xóa bài tập
exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Đã xóa bài học' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
