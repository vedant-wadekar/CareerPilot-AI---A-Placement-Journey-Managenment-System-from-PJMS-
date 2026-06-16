const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Protect routes - verifies JWT and attaches user to request
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret_123456');
      
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      };
      
      // If student, attach student document details
      if (decoded.role === 'student') {
        const student = await Student.findById(decoded.id).select('-password');
        if (student) {
          req.student = student;
        }
      }
      
      next();
    } catch (error) {
      console.error('Auth middleware token verification error:', error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

// Check if user is a Placement Coordinator
const coordinatorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'coordinator') {
    next();
  } else {
    res.status(403);
    return next(new Error('Not authorized as a coordinator'));
  }
};

module.exports = { protect, coordinatorOnly };
