const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
const path = require('path');
const fs = require('fs');

// @desc    Get student profile details
// @route   GET /api/student/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile details
// @route   PUT /api/student/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.branch = req.body.branch !== undefined ? req.body.branch : student.branch;
    student.cgpa = req.body.cgpa !== undefined ? req.body.cgpa : student.cgpa;
    student.graduationYear = req.body.graduationYear !== undefined ? req.body.graduationYear : student.graduationYear;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a skill to student profile
// @route   POST /api/student/skills
// @access  Private
const addSkill = async (req, res, next) => {
  const { skill } = req.body;
  if (!skill) {
    res.status(400);
    return next(new Error('Skill name is required'));
  }

  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    // Add skill if not already present
    if (!student.skills.includes(skill)) {
      student.skills.push(skill);
      await student.save();
    }

    res.json(student.skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Update skills array directly (bulk update)
// @route   PUT /api/student/skills
// @access  Private
const updateSkills = async (req, res, next) => {
  const { skills } = req.body;
  if (!Array.isArray(skills)) {
    res.status(400);
    return next(new Error('Skills must be an array'));
  }

  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    student.skills = skills;
    await student.save();
    res.json(student.skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill from student profile
// @route   DELETE /api/student/skills/:skill
// @access  Private
const deleteSkill = async (req, res, next) => {
  const skillToDelete = req.params.skill;

  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    student.skills = student.skills.filter(s => s !== skillToDelete);
    await student.save();
    res.json(student.skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Add certification
// @route   POST /api/student/certifications
// @access  Private
const addCertification = async (req, res, next) => {
  const { title, issuer, date } = req.body;
  if (!title || !issuer) {
    res.status(400);
    return next(new Error('Title and issuer are required'));
  }

  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    student.certifications.push({ title, issuer, date });
    await student.save();
    res.json(student.certifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certification
// @route   DELETE /api/student/certifications/:id
// @access  Private
const deleteCertification = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    student.certifications = student.certifications.filter(
      c => c._id.toString() !== req.params.id
    );
    await student.save();
    res.json(student.certifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume (PDF)
// @route   POST /api/student/resume
// @access  Private
const uploadResume = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error('Please upload a PDF file'));
  }

  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    // Save relative path for download
    student.resumeUrl = `/uploads/${req.file.filename}`;
    await student.save();

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl: student.resumeUrl
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job openings (Placement opportunities)
// @route   GET /api/student/opportunities
// @access  Private
const getOpportunities = async (req, res, next) => {
  try {
    // Find all jobs, populate company details
    const jobs = await Job.find({}).populate('companyId');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to a Job
// @route   POST /api/student/apply
// @access  Private
const applyToJob = async (req, res, next) => {
  const { jobId } = req.body;
  if (!jobId) {
    res.status(400);
    return next(new Error('Job ID is required'));
  }

  try {
    const student = await Student.findById(req.user.id);
    const job = await Job.findById(jobId).populate('companyId');
    
    if (!job) {
      res.status(404);
      return next(new Error('Job opening not found'));
    }

    // Verify Eligibility (CGPA check)
    if (student.cgpa < job.companyId.eligibilityCgpa) {
      res.status(400);
      return next(new Error(`You do not meet the minimum CGPA requirement (${job.companyId.eligibilityCgpa}) for this company.`));
    }

    // Check for existing application
    const existingApp = await Application.findOne({ studentId: req.user.id, jobId });
    if (existingApp) {
      res.status(400);
      return next(new Error('You have already applied to this job'));
    }

    const application = await Application.create({
      studentId: req.user.id,
      jobId,
      status: 'Applied'
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's submitted applications
// @route   GET /api/student/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics for student
// @route   GET /api/student/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const applications = await Application.find({ studentId }).populate({
      path: 'jobId',
      populate: { path: 'companyId' }
    });

    const totalApplications = applications.length;
    const shortlistedCount = applications.filter(app => app.status === 'Shortlisted').length;
    const interviewingCount = applications.filter(app => app.status === 'Interviewing').length;
    const placedCount = applications.filter(app => app.status === 'Placed').length;
    const rejectedCount = applications.filter(app => app.status === 'Rejected').length;

    // Progress timeline or placement status
    let placementProgress = 'Not Placed';
    if (placedCount > 0) {
      placementProgress = 'Placed';
    } else if (interviewingCount > 0) {
      placementProgress = 'Interviewing';
    } else if (shortlistedCount > 0) {
      placementProgress = 'Shortlisted';
    } else if (totalApplications > 0) {
      placementProgress = 'Applied';
    }

    res.json({
      totalApplications,
      shortlistedCount,
      interviewingCount,
      placedCount,
      rejectedCount,
      placementProgress,
      applications
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
