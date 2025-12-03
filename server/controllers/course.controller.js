const Course = require('../models/course.model');
const User = require('../models/user.model');
// BƯỚC FIX QUAN TRỌNG: Import model Notification
const Notification = require('../models/notification.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    console.log('Fetching all courses - debug mode');
    const courses = await Course.find({})
      .populate('teacher', 'name email')
      .lean();
    
    console.log(`Found ${courses.length} courses`);
    return res.status(200).json({
      success: true,
      courses: courses || []
    });
  } catch (error) {
    console.error('Error in getCourses controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
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
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Fetch related data
    const [assignments, quizzes, materials, notices] = await Promise.all([
      require('../models/assignment.model').find({ courseId: course._id }),
      require('../models/quiz.model').find({ course: course._id }),
      require('../models/material.model').find({ courseId: course._id }),
      require('../models/notice.model').find({ courseId: course._id })
    ]);
    return res.status(200).json({
      success: true,
      course,
      students: course.students || [],
      assignments: assignments || [],
      quizzes: quizzes || [],
      materials: materials || [],
      notices: notices || []
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching course'
    });
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

    await User.updateMany({ courses: course._id }, { $pull: { courses: course._id } });
    await Course.deleteOne({ _id: course._id });

    return res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ success: false, message: 'Error deleting course' });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if student is already enrolled
    if (course.students.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }
    
    // Add student to course
    course.students.push(req.user.id);
    await course.save();
    
    // Add course to student's courses
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { courses: course._id } },
      { new: true }
    );
    return res.json({
      success: true,
      message: 'Successfully enrolled in course',
      course
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
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
// @desc    Add a student to course
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
    
    // 2. Add course to student's courses (Enrollment logic)
    student.courses.push(course._id); 
    await student.save(); 

    // 3. Gửi thông báo cho học sinh vừa được thêm
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
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const { studentId } = req.body; 
    if (!studentId) return res.status(400).json({ success: false, message: 'Student ID required' }); 

    const course = await Course.findById(req.params.id); 
    const student = await User.findById(studentId); 

    if (!course || !student) return res.status(404).json({ success: false, message: 'Course or Student not found' }); 
    
    // 1. Remove student from course
    course.students.pull(studentId);
    await course.save(); 
    
    // 2. Remove course from student's courses
    student.courses.pull(course._id); 
    await student.save(); 

    res.json({ success: true, message: 'Student removed successfully' });  
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ success: false, message: 'Server error' }); 
  }
};