const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getProfile,
  updateProfile,
  addSkill,
  updateSkills,
  deleteSkill,
  addCertification,
  deleteCertification,
  uploadResume,
  getOpportunities,
  applyToJob,
  getApplications,
  getDashboardStats
} = require('../controllers/studentController');

router.use(protect); // Secure all student endpoints

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.post('/skills', addSkill);
router.put('/skills', updateSkills);
router.delete('/skills/:skill', deleteSkill);

router.post('/certifications', addCertification);
router.delete('/certifications/:id', deleteCertification);

router.post('/resume', upload.single('resume'), uploadResume);

router.get('/opportunities', getOpportunities);
router.post('/apply', applyToJob);
router.get('/applications', getApplications);
router.get('/dashboard', getDashboardStats);

module.exports = router;
