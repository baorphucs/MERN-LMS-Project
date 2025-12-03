const Notice = require('../models/notice.model');
const Course = require('../models/course.model');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/notification.model');

// Helper function
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private/Teacher
exports.createNotice = async (req, res) => {
  try {
    const { title, content, courseId, priority, pinned, attachments } = req.body;

    if (!title || !content || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content and course ID'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // ĐÃ XÓA kiểm tra ownership → Teacher nào cũng tạo được

    let files = [];
    if (req.files && req.files.attachments) {
      const atts = Array.isArray(req.files.attachments)
        ? req.files.attachments
        : [req.files.attachments];

      const uploadsDir = path.join(__dirname, '../uploads/notices');
      ensureDirectoryExists(uploadsDir);

      for (const file of atts) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `notice_${uniqueSuffix}_${file.name.replace(/\s+/g, '_')}`;
        const filepath = path.join(uploadsDir, filename);
        await file.mv(filepath);
        files.push(`notices/${filename}`);
      }
    }

    const notice = await Notice.create({
      title,
      content,
      courseId,
      author: req.user.id,
      priority: priority || 'low',
      pinned: pinned || false,
      attachments: files
    });

    // [ĐÃ XÓA LOGIC GỬI THÔNG BÁO TỰ ĐỘNG CHO TẤT CẢ SINH VIÊN]

    res.status(201).json({ success: true, notice });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// @desc    Update notice
// @route   PUT /api/notices/:id
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(res.status(404).json({ success: false, message: 'Notice not found' }));
    }

    // ĐÃ XÓA kiểm tra ownership → Teacher nào cũng sửa được

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.status(200).json({ success: true, notice: updatedNotice });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    // ĐÃ XÓA kiểm tra ownership → Teacher nào cũng xóa được

    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Các hàm còn lại giữ nguyên (getNotices, getNoticesForCourse, getNotice, getUnreadCount, ...)
exports.getNotices = async (req, res) => {
  try {
    let notices;
    if (req.user.role === 'teacher') {
      const teacherCourses = await Course.find({ teacher: req.user.id }).select('_id');
      const courseIds = teacherCourses.map(c => c._id);
      notices = courseIds.length
        ? await Notice.find({ courseId: { $in: courseIds } })
            .populate('courseId', 'title code')
            .sort('-createdAt')
        : [];
    } else if (req.user.role === 'student') {
      const studentCourses = await Course.find({ students: req.user.id }).select('_id');
      const courseIds = studentCourses.map(c => c._id);
      notices = await Notice.find({ courseId: { $in: courseIds } })
        .populate('courseId', 'title code')
        .sort('-createdAt');
    } else {
      notices = await Notice.find().populate('courseId', 'title code').sort('-createdAt');
    }

    res.status(200).json({
      success: true,
      count: notices.length,
      notices
    });
  } catch (error) {
    console.error('Error getting notices:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getNoticesForCourse = async (req, res) => {
  try {
    const notices = await Notice.find({ courseId: req.params.courseId })
      .populate('author', 'name avatar')
      .sort('-pinned -createdAt');

    res.status(200).json({
      success: true,
      count: notices.length,
      notices
    });
  } catch (error) {
    console.error('Error getting notices for course:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('courseId', 'title code')
      .populate('author', 'name avatar');
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.status(200).json({ success: true, notice });
  } catch (error) {
    console.error('Error getting notice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const courseQuery = req.user.role === 'student'
      ? { students: req.user.id }
      : { teacher: req.user.id };

    const courses = await Course.find(courseQuery).select('_id');
    const courseIds = courses.map(c => c._id);

    const count = await Notice.countDocuments({
      courseId: { $in: courseIds },
      readBy: { $ne: req.user.id }
    });

    res.json({ success: true, unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = exports;