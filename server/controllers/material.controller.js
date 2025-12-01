const Material = require('../models/material.model');
const Course = require('../models/course.model');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/notification.model');

// @desc    Get all materials for a course
// @route   GET /api/materials/course/:courseId
// @access  Private
// @desc    Get all materials for a course
exports.getMaterialsForCourse = async (req, res) => {
  try {
    console.log('Getting materials for course:', req.params.courseId);
    const materials = await Material.find({ courseId: req.params.courseId })
      .populate('author', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: materials.length,
      materials: materials
    });
  } catch (error) {
    console.error('Error getting materials:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single material
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('courseId', 'title code');

    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    res.status(200).json({ success: true, material });
  } catch (error) {
    console.error('Error getting material:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// CREATE MATERIAL – ĐÃ XÓA kiểm tra ownership
exports.createMaterial = async (req, res) => {
  try {
    const { title, description, courseId, type, link } = req.body;
    let fileUrl = '', fileName = '', fileType = '', fileSize = 0, originalName = '';

    if (!title || !courseId) {
      return res.status(400).json({ success: false, message: 'Please provide title and course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // ĐÃ XÓA: kiểm tra course.teacher === req.user.id
    // Bây giờ bất kỳ teacher nào cũng tạo được material ở mọi course

    if (req.file) {
      fileUrl = req.file.path;
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
      fileSize = req.file.size;
      originalName = req.file.originalname;
    }

    const material = await Material.create({
      title, description, courseId, author: req.user.id,
      type, fileUrl, fileName, fileType, fileSize, originalName, link
    });

    course.materials.push(material._id);
    await course.save();

    for (const studentId of course.students) {
      await Notification.create({
        user: studentId,
        text: `A new material "${material.title}" has been posted in ${course.title}.`,
        link: `/materials/${material._id}`
      });
    }

    res.status(201).json({ success: true, material });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// UPDATE MATERIAL – ĐÃ XÓA kiểm tra ownership
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    // ĐÃ XÓA: kiểm tra ownership
    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.status(200).json({ success: true, material: updated });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE MATERIAL – ĐÃ XÓA kiểm tra ownership
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    const course = await Course.findById(material.courseId);
    course.materials.pull(material._id);
    await course.save();

    if (material.fileUrl && fs.existsSync(path.join(__dirname, '..', material.fileUrl))) {
      fs.unlinkSync(path.join(__dirname, '..', material.fileUrl));
    }

    await Material.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// Defensive check example for getMaterials and getMaterial
exports.getMaterials = async (req, res) => {
  try {
    let materials;
    if (req.user.role === 'teacher') {
      const teacherCourses = await Course.find({ teacher: req.user.id }).select('_id');
      const courseIds = teacherCourses.map(course => course._id);
      if (!courseIds.length) {
        return res.status(200).json({ success: true, count: 0, materials: [] });
      }
      materials = await Material.find({ course: { $in: courseIds } })
        .populate('course', 'title code')
        .sort('-createdAt');
      if (!materials) {
        return res.status(200).json({ success: true, count: 0, materials: [] });
      }
    } else if (req.user.role === 'student') {
      const studentCourses = await Course.find({ students: req.user.id }).select('_id');
      const courseIds = studentCourses.map(course => course._id);
      materials = await Material.find({ course: { $in: courseIds } })
        .populate('course', 'title code')
        .sort('-createdAt');
      if (!materials) {
        return res.status(200).json({ success: true, count: 0, materials: [] });
      }
    } else {
      materials = await Material.find()
        .populate('course', 'title code')
        .sort('-createdAt');
      if (!materials) {
        return res.status(200).json({ success: true, count: 0, materials: [] });
      }
    }
    res.status(200).json({
      success: true,
      count: materials.length,
      materials: materials
    });
  } catch (error) {
    console.error('Error getting materials:', error);
    if (error && error.stack) console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('course', 'title code teacher');
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error getting material:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching material details',
      error: error.message
    });
  }
};

// Download material by fileName
exports.downloadMaterial = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    // Try assignments first
    let filePath = path.join(__dirname, '..', 'uploads', 'assignments', fileName);
    console.log('Trying to download (assignments):', fileName, 'at', filePath);
    if (!fs.existsSync(filePath)) {
      // Fallback to materials
      filePath = path.join(__dirname, '..', 'uploads', 'materials', fileName);
      console.log('Trying to download (materials):', fileName, 'at', filePath);
      if (!fs.existsSync(filePath)) {
        console.log('File not found:', fileName);
        return res.status(404).json({ success: false, message: 'File not found' });
      }
    }
    res.download(filePath, fileName);
  } catch (error) {
    console.error('Error downloading material:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
    
   