const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Helper to generate JWT
const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'fallback_jwt_secret_123456',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res, next) => {
  const { name, email, password, branch, cgpa, graduationYear } = req.body;

  try {
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      res.status(400);
      return next(new Error('Student already registered with this email'));
    }

    const student = await Student.create({
      name,
      email,
      password,
      branch: branch || '',
      cgpa: cgpa || 0,
      graduationYear: graduationYear || new Date().getFullYear(),
      skills: [],
      certifications: [],
      resumeUrl: ''
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: 'student',
      token: generateToken(student._id, 'student', student.email)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth student & get token
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (student && (await student.comparePassword(password))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        token: generateToken(student._id, 'student', student.email)
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth coordinator & get token
// @route   POST /api/auth/coordinator/login
// @access  Public
const loginCoordinator = async (req, res, next) => {
  const { email, password } = req.body;

  const coordEmail = process.env.COORDINATOR_EMAIL || 'coordinator@pjms.com';
  const coordPassword = process.env.COORDINATOR_PASSWORD || 'admin123';

  if (email === coordEmail && password === coordPassword) {
    res.json({
      _id: 'coordinator-admin-id',
      name: 'Placement Coordinator',
      email: coordEmail,
      role: 'coordinator',
      token: generateToken('coordinator-admin-id', 'coordinator', coordEmail)
    });
  } else {
    res.status(401);
    return next(new Error('Invalid coordinator credentials'));
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  loginCoordinator
};
