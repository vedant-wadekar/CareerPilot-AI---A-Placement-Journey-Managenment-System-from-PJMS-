const express = require('express');
const router = express.Router();
const { protect, coordinatorOnly } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  getJobs,
  addJob,
  updateJob,
  deleteJob,
  getEligibleStudents,
  getApplications,
  updateApplicationStatus,
  getPlacementReportData
} = require('../controllers/coordinatorController');

// All coordinator routes require authentication and coordinator role
router.use(protect);
router.use(coordinatorOnly);

router.get('/dashboard', getDashboardStats);

router.get('/companies', getCompanies);
router.post('/companies', addCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

router.get('/jobs', getJobs);
router.post('/jobs', addJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

router.get('/students', getEligibleStudents);
router.get('/applications', getApplications);
router.put('/applications/:id', updateApplicationStatus);
router.get('/reports', getPlacementReportData);

module.exports = router;
