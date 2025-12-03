const Quiz = require('../models/quiz.model');
const Course = require('../models/course.model');
const Notification = require('../models/notification.model');
const mongoose = require('mongoose');

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private/Teacher
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, course, timeLimit, availableFrom, availableTo, isPublished, questions } = req.body;

    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = await Quiz.create({
      title, description, course, teacher: req.user.id,
      timeLimit: timeLimit || null,
      availableFrom: availableFrom || Date.now(),
      availableTo, isPublished: isPublished || false,
      questions
    });

    await Course.findByIdAndUpdate(course, { $push: { quizzes: quiz._id } });

    // [ĐÃ XÓA LOGIC GỬI THÔNG BÁO TỰ ĐỘNG CHO TẤT CẢ SINH VIÊN]

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all quizzes for a teacher
// @route   GET /api/quizzes/teacher
// @access  Private/Teacher
exports.getTeacherQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacher: req.user.id })
      .populate('course', 'title code')
      .sort('-createdAt');
    if (!quizzes) {
      return res.status(200).json({ success: true, count: 0, quizzes: [] });
    }
    res.json({
      success: true,
      count: quizzes.length,
      quizzes: quizzes,
    });
  } catch (error) {
    console.error('Error in getTeacherQuizzes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all quizzes for a student
// @route   GET /api/quizzes/student
// @access  Private/Student
exports.getStudentQuizzes = async (req, res) => {
  try {
    // Find courses the student is enrolled in
    const courses = await Course.find({ students: req.user.id });
    const courseIds = courses.map(course => course._id);
    
    // Find quizzes for those courses
    const quizzes = await Quiz.find({ 
      course: { $in: courseIds },
      isPublished: true,
      availableFrom: { $lte: new Date() },
      $or: [
        { availableTo: null },
        { availableTo: { $gte: new Date() } }
      ]
    })
      .populate('course', 'title code')
      .sort('-createdAt');
    
    // Add submitted status to each quiz
    const quizzesWithStatus = quizzes.map(quiz => {
      const submitted = quiz.results.some(
        result => result.student.toString() === req.user.id
      );
      
      // Don't send questions/answers to student if not submitted yet
      if (!submitted) {
        quiz = quiz.toObject();
        // Keep the questions array but remove options' isCorrect field
        if (quiz.questions) {
          quiz.questions = quiz.questions.map(q => ({
            ...q,
            options: q.options.map(o => ({
              _id: o._id,
              text: o.text
            }))
          }));
        }
      }
      
      return {
        ...quiz,
        submitted
      };
    });
    
    res.json({
      success: true,
      count: quizzesWithStatus.length,
      quizzes: quizzesWithStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res) => {
  try {
    console.log('Fetching quiz with ID:', req.params.id);
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title code')
      .populate('results.student', 'name email avatar');
    if (!quiz) {
      console.log('Quiz not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    console.log('Quiz found:', quiz.title);
    
    // Ensure questions array exists
    if (!quiz.questions) {
      quiz.questions = [];
      await quiz.save();
    }
    
    // For students, hide answers
    if (req.user.role === 'student') {
      const sanitizedQuiz = quiz.toObject();
      
      if (sanitizedQuiz.questions && Array.isArray(sanitizedQuiz.questions)) {
        sanitizedQuiz.questions = sanitizedQuiz.questions.map(q => {
          const { correctAnswer, explanation, ...rest } = q;
          return rest;
        });
      }
      
      return res.status(200).json({
        success: true,
        data: sanitizedQuiz
      });
    }
    
    // Return full quiz data for teachers/admins
    return res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching quiz details',
      error: error.message
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // ĐÃ XÓA: kiểm tra quiz.teacher === req.user.id

    if (quiz.results && quiz.results.length > 0) {
      return res.status(400).json({ message: 'Cannot update quiz: students have already submitted answers' });
    }

    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, quiz: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher
exports.deleteQuiz = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // ĐÃ XÓA: kiểm tra quiz.teacher === req.user.id

    await Quiz.findByIdAndDelete(req.params.id);

    try {
      await Course.findByIdAndUpdate(quiz.course, { $pull: { quizzes: quiz._id } });
    } catch (e) { /* không crash nếu lỗi */ }

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Submit quiz answers (student)
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, startTime } = req.body;
    
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }
    
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check if student is enrolled in the course
    const course = await Course.findById(quiz.course);
    if (!course.students.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    
    // Check if quiz is published and available
    if (!quiz.isPublished) {
      return res.status(403).json({ message: 'This quiz is not available yet' });
    }
    
    const now = new Date();
    if (quiz.availableFrom > now) {
      return res.status(403).json({ message: 'This quiz is not available yet' });
    }
    
    if (quiz.availableTo && quiz.availableTo < now) {
      return res.status(403).json({ message: 'This quiz is no longer available' });
    }
    
    // Check if student has already taken the quiz
    const alreadySubmitted = quiz.results.some(
      result => result.student.toString() === req.user.id
    );
    
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'You have already submitted this quiz' });
    }
    
    // Calculate time taken if start time is provided
    let timeTaken = null;
    if (startTime) {
      const startDate = new Date(startTime);
      timeTaken = Math.round((now - startDate) / 1000); // Time in seconds
    }
    
    // Calculate score
    let score = 0;
    let totalPossibleScore = 0;
    
    // Process each answer
    const processedAnswers = [];
    
    for (const answer of answers) {
      const question = quiz.questions.id(answer.question);
      
      if (!question) {
        continue; // Skip invalid question IDs
      }
      
      totalPossibleScore += question.points;
      let isCorrect = false;
      
      if (question.type === 'text') {
        // Handle text answer
        const studentAnswer = answer.textAnswer?.trim().toLowerCase();
        if (studentAnswer && question.correctTextAnswers && question.correctTextAnswers.length > 0) {
          isCorrect = question.correctTextAnswers.some(
            correctAnswer => correctAnswer.trim().toLowerCase() === studentAnswer
          );
        }
        
        processedAnswers.push({
          question: answer.question,
          textAnswer: answer.textAnswer,
          isCorrect
        });
      } else {
        // Handle multiple choice questions
        if (question.type === 'multiple') {
          // For multiple choice, check if all selected options are correct and all correct options are selected
          const selectedOptions = answer.selectedOptions || [];
          const correctOptions = question.options.filter(opt => opt.isCorrect);
          
          const allSelectedAreCorrect = selectedOptions.every(selectedId => {
            const option = question.options.id(selectedId);
            return option && option.isCorrect;
          });
          
          const allCorrectAreSelected = correctOptions.every(correctOpt => 
            selectedOptions.includes(correctOpt._id.toString())
          );
          
          isCorrect = allSelectedAreCorrect && allCorrectAreSelected && selectedOptions.length === correctOptions.length;
        } else {
          // For single choice
          const selectedOption = question.options.id(answer.selectedOption);
          isCorrect = selectedOption && selectedOption.isCorrect;
      }
      
      processedAnswers.push({
        question: answer.question,
          selectedOptions: answer.selectedOptions || [answer.selectedOption],
          isCorrect
      });
      }
      
      if (isCorrect) {
        score += question.points;
      }
    }
    
    // Create result
    const result = {
      student: req.user.id,
      answers: processedAnswers,
      score,
      totalPossibleScore,
      submittedAt: now,
      timeTaken
    };
    
    // Add result to quiz
    quiz.results.push(result);
    await quiz.save();
    
    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get student's quiz result
// @route   GET /api/quizzes/:id/result
// @access  Private/Student
exports.getQuizResult = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Find the student's result
    const result = quiz.results.find(
      r => r.student.toString() === req.user.id
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found, you have not taken this quiz yet' });
    }
    
    // Enhance result with question texts and explanations
    const enhancedResult = {
      ...result.toObject(),
      answers: result.answers.map(answer => {
        const question = quiz.questions.id(answer.question);
        
        if (question.type === 'text') {
          return {
            ...answer,
            questionText: question?.questionText,
            textAnswer: answer.textAnswer,
            correctTextAnswers: question?.correctTextAnswers,
            explanation: question?.explanation,
          };
        } else {
          const selectedOptions = answer.selectedOptions || [];
          const selectedOptionTexts = selectedOptions.map(optionId => {
            const option = question?.options.id(optionId);
            return option?.text;
          }).filter(Boolean);
          
          const correctOptions = question?.options.filter(o => o.isCorrect) || [];
        
        return {
          ...answer,
          questionText: question?.questionText,
            selectedOptionTexts,
            correctOptionTexts: correctOptions.map(o => o.text),
          explanation: question?.explanation,
        };
        }
      })
    };
    
    res.json({
      success: true,
      result: enhancedResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all quizzes for a specific course
// @route   GET /api/quizzes/course/:courseId
// @access  Private (Teacher/Student)
exports.getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ course: courseId })
      .populate('course', 'title code')
      .sort('-createdAt');

    res.json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Test endpoint
// @route   GET /api/quizzes/test
// @access  Public
exports.testEndpoint = async (req, res) => {
  try {
    console.log('Test endpoint called');
    res.json({
      success: true,
      message: 'Quiz controller is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ message: 'Test endpoint error' });
  }
};
    