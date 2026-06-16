const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  loginCoordinator
} = require('../controllers/authController');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/coordinator/login', loginCoordinator);

module.exports = router;
