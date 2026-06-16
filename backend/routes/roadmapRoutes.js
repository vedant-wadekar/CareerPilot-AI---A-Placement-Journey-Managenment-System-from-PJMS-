const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRoadmap,
  generateRoadmap,
  updateProgress
} = require('../controllers/roadmapController');

router.use(protect); // Secure all roadmap endpoints for student use

router.get('/', getRoadmap);
router.post('/generate', generateRoadmap);
router.put('/progress', updateProgress);

module.exports = router;
