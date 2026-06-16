const Roadmap = require('../models/Roadmap');
const Student = require('../models/Student');
const { generateJSONResponse } = require('../utils/gemini');

// @desc    Get student's personalized roadmap
// @route   GET /api/roadmap
// @access  Private
const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ studentId: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found. Please generate one.' });
    }
    res.json(roadmap);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a new personalized roadmap
// @route   POST /api/roadmap/generate
// @access  Private
const generateRoadmap = async (req, res, next) => {
  const { interests } = req.body;
  if (!interests || !Array.isArray(interests) || interests.length === 0) {
    res.status(400);
    return next(new Error('Please select at least one career interest.'));
  }

  try {
    const student = await Student.findById(req.user.id);

    const systemInstruction = `
      You are an elite Career Coach and Senior Staff Engineer.
      The student has selected the following career interests: ${interests.join(', ')}.
      Generate a comprehensive, personalized career roadmap based on their profile.
      
      Respond strictly with a JSON object in this format:
      {
        "skills": ["Java", "Spring Boot", "React", "AWS", "Git"],
        "phases": [
          {
            "title": "Phase 1: Core Fundamentals",
            "duration": "4 Weeks",
            "topics": [
              { "name": "Core Java Basics" },
              { "name": "Object Oriented Programming" }
            ]
          }
        ],
        "recommendedProjects": [
          { "title": "Student Management System", "description": "Full stack CRUD app using selected tech." }
        ],
        "recommendedCertifications": [
          { "title": "AWS Cloud Practitioner", "provider": "Amazon" }
        ],
        "placementPrep": {
          "aptitude": ["Quantitative Aptitude", "Logical Reasoning"],
          "technical": ["System Design Basics", "Database Indexing"],
          "interview": ["Behavioral STAR methodology", "Mock Interviews"]
        }
      }
    `;

    const prompt = `
      Student Profile Summary:
      Branch: ${student?.branch || 'N/A'}
      CGPA: ${student?.cgpa || 'N/A'}
      Current Skills: ${student?.skills?.length > 0 ? student.skills.join(', ') : 'Beginner'}
      Certifications: ${student?.certifications?.length > 0 ? student.certifications.map(c => c.title).join(', ') : 'None'}
      
      Create a detailed sequence focusing heavily on: ${interests.join(', ')}.
      Make sure to include 4-5 phases, 3-5 projects, and placement prep tailored for these roles.
    `;

    // Realistic fallback data
    const fallbackData = {
      skills: ["HTML", "CSS", "JavaScript", "React.js", "Node.js", "Git"],
      phases: [
        {
          title: "Phase 1: Foundation",
          duration: "3 Weeks",
          topics: [{ name: "Internet Fundamentals" }, { name: "HTML & CSS" }, { name: "Version Control (Git)" }]
        },
        {
          title: "Phase 2: Programming & Logic",
          duration: "4 Weeks",
          topics: [{ name: "JavaScript ES6+" }, { name: "DOM Manipulation" }, { name: "Async JS" }]
        },
        {
          title: "Phase 3: Frontend Frameworks",
          duration: "5 Weeks",
          topics: [{ name: "React Component Lifecycle" }, { name: "State Management" }, { name: "Routing" }]
        }
      ],
      recommendedProjects: [
        { title: "Personal Portfolio", description: "Responsive portfolio showing your skills." },
        { title: "Task Manager App", description: "CRUD app to track daily tasks." }
      ],
      recommendedCertifications: [
        { title: "Frontend Developer Certificate", provider: "Meta/Coursera" }
      ],
      placementPrep: {
        aptitude: ["Numerical Logic", "Pattern Recognition"],
        technical: ["JS Event Loop", "React Re-rendering"],
        interview: ["Tell me about yourself", "Project deep-dives"]
      }
    };

    const generatedData = await generateJSONResponse(prompt, systemInstruction, fallbackData);

    // Save to DB (Overwrite if exists)
    let roadmap = await Roadmap.findOne({ studentId: req.user.id });
    
    if (roadmap) {
      roadmap.interests = interests;
      roadmap.skills = generatedData.skills;
      roadmap.phases = generatedData.phases;
      roadmap.recommendedProjects = generatedData.recommendedProjects;
      roadmap.recommendedCertifications = generatedData.recommendedCertifications;
      roadmap.placementPrep = generatedData.placementPrep;
      // Saving will trigger pre-save to calculate overallProgress (resetting to 0)
      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        studentId: req.user.id,
        interests,
        skills: generatedData.skills,
        phases: generatedData.phases,
        recommendedProjects: generatedData.recommendedProjects,
        recommendedCertifications: generatedData.recommendedCertifications,
        placementPrep: generatedData.placementPrep
      });
    }

    res.json(roadmap);
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress of a specific roadmap topic
// @route   PUT /api/roadmap/progress
// @access  Private
const updateProgress = async (req, res, next) => {
  const { phaseId, topicId, status } = req.body;

  if (!['Not Started', 'In Progress', 'Completed'].includes(status)) {
    res.status(400);
    return next(new Error('Invalid status'));
  }

  try {
    const roadmap = await Roadmap.findOne({ studentId: req.user.id });
    if (!roadmap) {
      res.status(404);
      return next(new Error('Roadmap not found'));
    }

    const phase = roadmap.phases.id(phaseId);
    if (!phase) {
      res.status(404);
      return next(new Error('Phase not found'));
    }

    const topic = phase.topics.id(topicId);
    if (!topic) {
      res.status(404);
      return next(new Error('Topic not found'));
    }

    topic.status = status;
    await roadmap.save(); // Triggers overallProgress calculation

    res.json(roadmap);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
  generateRoadmap,
  updateProgress
};
