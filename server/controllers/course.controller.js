const Course = require('../models/course.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
// BƯỚC FIX QUAN TRỌNG: Import model Enrollment để có thể xóa bản ghi đăng ký
const Enrollment = require('../models/enrollment.model');

// @desc    Get all courses (ĐÃ CHỈNH SỬA LOGIC ẨN/HIỆN THÔNG MINH)
// @route   GET /api/courses
// @access  Public/Private
exports.getCourses = async (req, res) => {
  try {
    let filter = {};

    // Nếu không phải Giáo viên/Admin, chúng ta áp dụng bộ lọc thông minh
    if (!req.user || req.user.role !== 'teacher') {
      const studentId = req.user ? req.user.id : null;

      filter = {
        $or: [
          { isPublished: true }, // Khóa học đang công khai
          { students: studentId } // HOẶC Khóa học đang ẩn nhưng học sinh này đã tham gia
        ]
      };
    }
    // Nếu là Giáo viên, filter = {} (xem được hết để quản lý)

    const courses = await Course.find(filter)
      .populate('teacher', 'name email')
      .lean();
    
    res.status(200).json({
      success: true,
      courses: courses || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Publish/Hide course (HÀM MỚI)
// @route   PUT /api/courses/:id/toggle-publish
// @access  Private/Teacher
exports.togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    // Chỉ giáo viên tạo ra khóa học mới có quyền ẩn/hiện
    if (course.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({ 
      success: true, 
      message: course.isPublished ? 'Khóa học hiện đã hiển thị với học sinh' : 'Khóa học đã được ẩn thành công',
      isPublished: course.isPublished 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const [assignments, quizzes, materials, notices] = await Promise.all([
      require('../models/assignment.model').find({ courseId: course._id }),
      require('../models/quiz.model').find({ course: course._id }),
      require('../models/material.model').find({ courseId: course._id }),
      require('../models/notice.model').find({ courseId: course._id })
    ]);

    res.status(200).json({
      success: true,
      course,
      students: course.students || [],
      assignments: assignments || [],
      quizzes: quizzes || [],
      materials: materials || [],
      notices: notices || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching course' });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Teacher
exports.createCourse = async (req, res) => {
  try {
    const { title, description, code, coverImageUrl } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    const course = await Course.create({
      title,
      description,
      code,
      coverImageUrl,
      teacher: req.user.id
    });
    return res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating course'
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher/Admin
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ success: false, message: 'Error updating course' });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Xóa liên kết khóa học ở User và xóa tất cả Enrollment liên quan đến khóa này
    await Promise.all([
        User.updateMany({ courses: course._id }, { $pull: { courses: course._id } }),
        Enrollment.deleteMany({ course: course._id }),
        Course.deleteOne({ _id: course._id })
    ]);

    return res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ success: false, message: 'Error deleting course' });
  }
};

// @desc    Add a student to course (Directly by Teacher)
// @route   PUT /api/courses/:id/add-student
// @access  Private/Teacher
exports.addStudentToCourse = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ success: false, message: 'Student ID required' }); 

    const course = await Course.findById(req.params.id); 
    const student = await User.findById(studentId); 

    if (!course || !student) return res.status(404).json({ success: false, message: 'Course or Student not found' }); 
    if (student.role !== 'student') return res.status(400).json({ success: false, message: 'User is not a student' }); 
    if (course.students.includes(studentId)) return res.status(400).json({ success: false, message: 'Student already enrolled' }); 
    
    // 1. Add student to course
    course.students.push(studentId);  
    await course.save();  
    
    // 2. Add course to student's courses
    student.courses.push(course._id); 
    await student.save(); 

    // 3. Tạo một bản ghi Enrollment trạng thái 'approved' để đồng bộ dữ liệu
    await Enrollment.findOneAndUpdate(
        { course: course._id, student: studentId },
        { teacher: course.teacher, status: 'approved' },
        { upsert: true, new: true }
    );

    // 4. Gửi thông báo cho học sinh
    await Notification.create({ 
      user: studentId,
      text: `You have been added to the course: ${course.title}`,
      link: `/courses/${course._id}`
    });

    res.json({ success: true, message: 'Student added successfully' }); 
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ success: false, message: 'Server error' }); 
  }
};

// @desc    Remove a student from course
// @route   PUT /api/courses/:id/remove-student
// @access  Private/Teacher
// Hàm xóa học sinh (Như đã hứa ở bước trước để fix lỗi đăng ký lại không được)
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const { studentId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    course.students.pull(studentId);
    await course.save();
    await User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });

    // FIX: Xóa sạch dấu vết Enrollment cũ để học sinh có thể gửi yêu cầu phê duyệt mới
    await Enrollment.findOneAndDelete({ course: courseId, student: studentId });

    res.json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get courses taught by a teacher
// @route   GET /api/courses/teacher
// @access  Private/Teacher
exports.getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id })
      .sort({ createdAt: -1 })
      .populate('teacher', 'name email');
    return res.json({
      success: true,
      courses: courses
    });
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
};
// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// Logic ghi danh trực tiếp
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    
    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }
    
    course.students.push(req.user.id);
    await course.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { courses: course._id } });

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};