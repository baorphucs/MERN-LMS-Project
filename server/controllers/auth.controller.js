const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// Lưu ý: Nếu bạn có hàm sendTokenResponse riêng, hãy đảm bảo nó được import.
// Nếu không, tôi sẽ sử dụng logic gửi response trực tiếp.

// Hàm tạo JWT Token (Được sử dụng lại trong nhiều hàm)
const generateToken = (id) => {
  // Đảm bảo các biến môi trường được thiết lập, nếu không dùng giá trị mặc định
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Hàm gửi phản hồi với token (Thường được sử dụng trong Login/Register)
const sendResponseWithToken = (user, statusCode, res, token) => {
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      // Thêm các trường khác cần thiết ở đây, ví dụ: courses: user.courses
    }
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // TẠO NGƯỜI DÙNG MỚI (FIX TỰ ĐỘNG ĐĂNG KÝ KHÓA HỌC)
    // Trường courses sẽ mặc định là [] theo User Model Schema
    console.log('Creating user with:', { name, email, role });
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student'
      // KHÔNG có logic gán courses: allCourses... ở đây.
    });

    // Generate token
    const token = generateToken(user._id);

    sendResponseWithToken(user, 201, res, token);

  } catch (error) {
    console.error('Registration detailed error:', error);
    // Pass error to global error handler
    return next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches (Giả định user.matchPassword là một method trong User Schema)
    const isMatch = await user.matchPassword(password); 
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    sendResponseWithToken(user, 200, res, token);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Populate courses để lấy thông tin khóa học mà user đó tham gia
    const user = await User.findById(req.user.id).populate('courses'); 
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Please provide your email address.' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'No user found with that email.' });
  }
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 1000 * 60 * 30; // 30 minutes
  await user.save();
  // For demo: log the reset link
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  console.log(`Password reset link for ${email}: ${resetUrl}`);
  res.json({ success: true, message: 'Password reset link sent (check console in demo).' });
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Invalid request.' });
  }
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired.' });
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ success: true, message: 'Password has been reset successfully.' });
};