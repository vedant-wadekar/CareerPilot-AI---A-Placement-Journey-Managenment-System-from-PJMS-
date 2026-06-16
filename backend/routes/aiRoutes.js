const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  reviewResume,
  analyzeSkillGap,
  generateQuestions,
  suggestResumeImprovements
} = require('../controllers/aiController');

router.use(protect); // Secure all AI endpoints for student use

router.post('/resume-review', reviewResume);
router.post('/skill-gap', analyzeSkillGap);
router.post('/generate-questions', generateQuestions);
router.post('/resume-improvements', suggestResumeImprovements);

module.exports = router;
