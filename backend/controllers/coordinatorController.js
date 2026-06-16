const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get coordinator analytics
// @route   GET /api/coordinator/dashboard
// @access  Private (Coordinator Only)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments({ role: 'student' });
    const totalCompanies = await Company.countDocuments({});
    const totalJobs = await Job.countDocuments({});
    const totalApplications = await Application.countDocuments({});

    // Placed vs Unplaced Students
    const placedStudents = await Student.find({
      _id: { $in: await Application.find({ status: 'Placed' }).distinct('studentId') }
    });
    const placedCount = placedStudents.length;
    const unplacedCount = Math.max(0, totalStudents - placedCount);

    // Calculate Average and Max Package
    // We join Applications (status: Placed) with Job & Company to find packages
    const placedApps = await Application.find({ status: 'Placed' })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      });

    let maxPackage = 0;
    let totalPackageSum = 0;
    
    placedApps.forEach(app => {
      if (app.jobId && app.jobId.companyId) {
        const pkg = app.jobId.companyId.package;
        totalPackageSum += pkg;
        if (pkg > maxPackage) {
          maxPackage = pkg;
        }
      }
    });

    const averagePackage = placedCount > 0 ? Number((totalPackageSum / placedCount).toFixed(2)) : 0;

    // Branch Wise Statistics
    // Aggregation of students by branch and placement status
    const students = await Student.find({ role: 'student' });
    const branchStats = {};

    students.forEach(student => {
      const branch = student.branch || 'Unspecified';
      if (!branchStats[branch]) {
        branchStats[branch] = { total: 0, placed: 0 };
      }
      branchStats[branch].total += 1;
    });

    // Check placed students by branch
    for (const app of placedApps) {
      const student = await Student.findById(app.studentId);
      if (student) {
        const branch = student.branch || 'Unspecified';
        if (branchStats[branch]) {
          branchStats[branch].placed += 1;
        }
      }
    }

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      placedCount,
      unplacedCount,
      averagePackage,
      maxPackage,
      branchStats
    });
  } catch (error) {
    next(error);
  }
};

// --- COMPANY CRUD ---

const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({}).sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

const addCompany = async (req, res, next) => {
  const { companyName, package, location, eligibilityCgpa, skillsRequired, driveDate } = req.body;
  if (!companyName || !package || !location || !driveDate) {
    res.status(400);
    return next(new Error('Company Name, Package, Location, and Drive Date are required'));
  }
  try {
    const company = await Company.create({
      companyName,
      package,
      location,
      eligibilityCgpa: eligibilityCgpa || 0,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      driveDate
    });
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404);
      return next(new Error('Company not found'));
    }

    company.companyName = req.body.companyName || company.companyName;
    company.package = req.body.package !== undefined ? req.body.package : company.package;
    company.location = req.body.location || company.location;
    company.eligibilityCgpa = req.body.eligibilityCgpa !== undefined ? req.body.eligibilityCgpa : company.eligibilityCgpa;
    company.skillsRequired = Array.isArray(req.body.skillsRequired) ? req.body.skillsRequired : company.skillsRequired;
    company.driveDate = req.body.driveDate || company.driveDate;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404);
      return next(new Error('Company not found'));
    }
    // Delete associated jobs & applications as well
    const jobs = await Job.find({ companyId: company._id });
    const jobIds = jobs.map(j => j._id);
    await Application.deleteMany({ jobId: { $in: jobIds } });
    await Job.deleteMany({ companyId: company._id });
    await Company.findByIdAndDelete(req.params.id);

    res.json({ message: 'Company and associated jobs deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// --- JOB CRUD ---

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({}).populate('companyId').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

const addJob = async (req, res, next) => {
  const { companyId, title, description, eligibility, deadline } = req.body;
  if (!companyId || !title || !description || !eligibility || !deadline) {
    res.status(400);
    return next(new Error('All fields are required (Company, Title, Description, Eligibility, Deadline)'));
  }
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      res.status(404);
      return next(new Error('Associated Company not found'));
    }

    const job = await Job.create({
      companyId,
      title,
      description,
      eligibility,
      deadline
    });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.eligibility = req.body.eligibility || job.eligibility;
    job.deadline = req.body.deadline || job.deadline;
    job.companyId = req.body.companyId || job.companyId;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }
    // Delete applications for this job
    await Application.deleteMany({ jobId: job._id });
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job and associated applications deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// --- ELIGIBLE STUDENTS DIRECTORY ---

const getEligibleStudents = async (req, res, next) => {
  try {
    const { branch, minCgpa, skill } = req.query;
    const query = { role: 'student' };

    if (branch) {
      query.branch = branch;
    }
    if (minCgpa) {
      query.cgpa = { $gte: parseFloat(minCgpa) };
    }
    if (skill) {
      // Perform case-insensitive array element matching
      query.skills = { $regex: new RegExp(skill, 'i') };
    }

    const students = await Student.find(query).select('-password');
    res.json(students);
  } catch (error) {
    next(error);
  }
};

// --- MANAGE APPLICATIONS ---

const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({})
      .populate('studentId', '-password')
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  const { status } = req.body;
  if (!status) {
    res.status(400);
    return next(new Error('Status is required'));
  }

  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    application.status = status;
    const updatedApplication = await application.save();
    
    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

// --- PLACEMENT REPORT GENERATION ---

const getPlacementReportData = async (req, res, next) => {
  try {
    const students = await Student.find({ role: 'student' }).select('-password');
    const companies = await Company.find({});
    const applications = await Application.find({ status: 'Placed' })
      .populate('studentId')
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      });

    // Report Summary Metrics
    const totalStudents = students.length;
    const placedStudentsCount = await Application.find({ status: 'Placed' }).distinct('studentId');
    const totalPlaced = placedStudentsCount.length;
    const placementRate = totalStudents > 0 ? Number(((totalPlaced / totalStudents) * 100).toFixed(2)) : 0;

    let totalPackage = 0;
    let highestPackage = 0;
    let lowestPackage = Infinity;
    
    const placedList = [];
    
    applications.forEach(app => {
      if (app.studentId && app.jobId && app.jobId.companyId) {
        const pkg = app.jobId.companyId.package;
        totalPackage += pkg;
        if (pkg > highestPackage) highestPackage = pkg;
        if (pkg < lowestPackage) lowestPackage = pkg;

        placedList.push({
          studentName: app.studentId.name,
          studentEmail: app.studentId.email,
          branch: app.studentId.branch,
          cgpa: app.studentId.cgpa,
          companyName: app.jobId.companyId.companyName,
          jobTitle: app.jobId.title,
          package: pkg,
          driveDate: app.jobId.companyId.driveDate
        });
      }
    });

    if (lowestPackage === Infinity) lowestPackage = 0;
    const avgPackage = totalPlaced > 0 ? Number((totalPackage / totalPlaced).toFixed(2)) : 0;

    res.json({
      summary: {
        totalStudents,
        totalPlaced,
        placementRate,
        highestPackage,
        lowestPackage,
        averagePackage: avgPackage
      },
      placedStudents: placedList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
