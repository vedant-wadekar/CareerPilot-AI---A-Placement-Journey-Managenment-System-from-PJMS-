const Student = require('../models/Student');
const Job = require('../models/Job');
const { generateJSONResponse } = require('../utils/gemini');

// Helper to extract text from a dummy or text representation of resume if available
// For simple implementation, if a student hasn't uploaded a full PDF, we can use their listed Skills and Certifications.
// In a real system, a PDF text parser is used. We will construct a profile digest for the AI.
const getStudentProfileDigest = (student) => {
  return `
    Student Name: ${student.name}
    Branch: ${student.branch}
    CGPA: ${student.cgpa}
    Graduation Year: ${student.graduationYear}
    Skills: ${student.skills.join(', ')}
    Certifications: ${student.certifications.map(c => `${c.title} by ${c.issuer}`).join(', ')}
  `;
};

// @desc    Analyze student resume and return scoring + feedback
// @route   POST /api/ai/resume-review
// @access  Private
const reviewResume = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    const digest = getStudentProfileDigest(student);
    const systemInstruction = `
      You are an expert technical recruiter and resume reviewer.
      Analyze the student profile data provided and evaluate it as if it were their resume.
      Provide detailed feedback, including:
      1. A numeric score (0 to 100) based on their skills, CGPA, and certifications.
      2. A list of missing skills that are standard for their branch (${student.branch}).
      3. Practical formatting suggestions.
      4. Grammar or structural recommendations.
      
      You must respond strictly with a JSON object in this format:
      {
        "score": 75,
        "missingSkills": ["Docker", "Kubernetes", "TypeScript"],
        "formattingSuggestions": ["Highlight your key project accomplishments using bullet points instead of paragraphs.", "Put your skills section at the top of your resume above certifications."],
        "grammarSuggestions": ["Avoid using first-person pronouns like 'I worked on' - instead use action verbs like 'Developed', 'Engineered', or 'Architected'.", "Maintain consistent past tense when describing completed projects."]
      }
    `;

    const prompt = `Review this student's placement resume details:\n${digest}`;
    
    // Realistic fallback data in case Gemini is offline or API key is not configured
    const fallbackData = {
      score: 68,
      missingSkills: ["Git/GitHub Version Control", "Data Structures & Algorithms", "Unit Testing (Jest/Mocha)", "Docker basics"],
      formattingSuggestions: [
        "Include a dedicated 'Projects' section detailing your software accomplishments.",
        "Add links to your GitHub profile and LinkedIn profile in the header.",
        "Ensure all project descriptions follow the STAR (Situation, Task, Action, Result) methodology."
      ],
      grammarSuggestions: [
        "Use active verb starters like 'Designed', 'Built', 'Optimized' instead of passive phrases.",
        "Ensure all verb tenses are consistent across your project bullet points."
      ]
    };

    // If student has a custom uploaded resume, we can mock analyzing it
    if (student.resumeUrl) {
      fallbackData.score = 82;
      fallbackData.formattingSuggestions.push("PDF resume formatting looks clean. Ensure font sizes are consistent (10-12pt for body).");
    }

    const response = await generateJSONResponse(prompt, systemInstruction, fallbackData);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Perform skill gap analysis comparing student skills vs job requirements
// @route   POST /api/ai/skill-gap
// @access  Private
const analyzeSkillGap = async (req, res, next) => {
  const { jobId } = req.body;
  if (!jobId) {
    res.status(400);
    return next(new Error('Job ID is required for skill gap analysis'));
  }

  try {
    const student = await Student.findById(req.user.id);
    const job = await Job.findById(jobId).populate('companyId');

    if (!job) {
      res.status(404);
      return next(new Error('Job opening not found'));
    }

    const studentSkills = student.skills || [];
    const requiredSkills = job.companyId.skillsRequired || [];

    const systemInstruction = `
      You are an AI career coach.
      Compare the student's current skills with the job requirements and identify gaps.
      Create a step-by-step learning roadmap with milestones, topics, and free resources.
      
      Respond strictly with a JSON object in this format:
      {
        "commonSkills": ["React", "JavaScript"],
        "missingSkills": ["Node.js", "Express", "MongoDB"],
        "learningRoadmap": [
          {
            "milestone": "Phase 1: Backend Fundamentals",
            "topics": ["Node.js event loop", "Express routing", "RESTful API architecture"],
            "resources": ["MDN Web Docs", "Node.js official guides", "FreeCodeCamp Node.js tutorial"]
          },
          {
            "milestone": "Phase 2: Database Integration",
            "topics": ["MongoDB Atlas setup", "Mongoose schemas", "CRUD operations", "Indexing"],
            "resources": ["MongoDB University", "Mongoose official documentation"]
          }
        ]
      }
    `;

    const prompt = `
      Student Current Skills: ${JSON.stringify(studentSkills)}
      Job Title: ${job.title}
      Company: ${job.companyId.companyName}
      Job Required Skills: ${JSON.stringify(requiredSkills)}
      Job Description: ${job.description}
    `;

    // Realistic fallback data
    const common = studentSkills.filter(s => requiredSkills.some(reqS => reqS.toLowerCase() === s.toLowerCase()));
    const missing = requiredSkills.filter(reqS => !studentSkills.some(s => s.toLowerCase() === reqS.toLowerCase()));
    
    // Add defaults if there's no overlap
    const finalMissing = missing.length > 0 ? missing : ["Data Structures & Algorithms", "System Design", "Cloud Deployment (AWS/GCP)"];

    const fallbackData = {
      commonSkills: common.length > 0 ? common : ["HTML", "CSS", "JavaScript"],
      missingSkills: finalMissing,
      learningRoadmap: [
        {
          "milestone": "Week 1-2: Core Concept Mastery",
          "topics": finalMissing.slice(0, 2).concat(["Problem Solving Basics"]),
          "resources": ["LeetCode for algorithms", "YouTube crash courses", "W3Schools references"]
        },
        {
          "milestone": "Week 3-4: Hands-on Projects",
          "topics": ["Building full-stack projects", "API testing with Postman", "Local development setup"],
          "resources": ["GitHub repositories", "FreeCodeCamp projects checklist", "Official docs"]
        }
      ]
    };

    const response = await generateJSONResponse(prompt, systemInstruction, fallbackData);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate technical, HR, and project questions based on profile/job
// @route   POST /api/ai/generate-questions
// @access  Private
const generateQuestions = async (req, res, next) => {
  const { jobId, customRole } = req.body;

  try {
    const student = await Student.findById(req.user.id);
    let jobDetails = 'General Software Engineering Placement';
    
    if (jobId) {
      const job = await Job.findById(jobId).populate('companyId');
      if (job) {
        jobDetails = `Job Title: ${job.title}, Company: ${job.companyId.companyName}, Description: ${job.description}`;
      }
    } else if (customRole) {
      jobDetails = `Role Name: ${customRole}`;
    }

    const digest = getStudentProfileDigest(student);

    const systemInstruction = `
      You are an AI placement interviewer.
      Based on the student's profile (skills, projects, major) and the target job/role description, generate:
      1. Technical questions focusing on their core skills and the target role.
      2. HR behavioral questions.
      3. Project-specific questions based on their certifications or potential branch projects.
      
      Respond strictly with a JSON object in this format:
      {
        "technicalQuestions": [
          { "question": "Explain the virtual DOM in React.", "expectedAnswer": "React uses a virtual DOM which is a lightweight copy of the real DOM. When state changes, React updates the virtual DOM, compares it with the previous version (diffing), and batches changes to the real DOM (reconciliation)." }
        ],
        "hrQuestions": [
          { "question": "Tell me about a time you faced a technical challenge and how you resolved it.", "tips": "Use the STAR model. Describe the situation, task, your action, and the result. Emphasize team work or critical problem solving." }
        ],
        "projectQuestions": [
          { "question": "How did you secure user data in your full stack application?", "tips": "Talk about HTTPS, JWT authorization, bcrypt password hashing, input validation, and sanitizing queries." }
        ]
      }
    `;

    const prompt = `
      Student Profile:\n${digest}
      Target Placement Job/Role:\n${jobDetails}
    `;

    // Realistic fallback data
    const fallbackData = {
      technicalQuestions: [
        {
          "question": "What is the difference between synchronous and asynchronous execution in JavaScript?",
          "expectedAnswer": "Synchronous code execution is sequential; each statement blocks the next until it completes. Asynchronous code allows operations (like network requests or timers) to run in the background, executing a callback, promise, or async/await once finished without blocking the main execution thread."
        },
        {
          "question": "Explain index optimization in MongoDB. When should we use it?",
          "expectedAnswer": "Indexes speed up read operations by avoiding collection scans. We should use them on fields frequently queried in filter, sort, or join conditions. However, indexes slow down write operations (insert, update, delete) because the index tree must be updated, so they should be chosen carefully."
        }
      ],
      hrQuestions: [
        {
          "question": "Why do you want to join this company, and why do you think you are a good fit?",
          "tips": "Research the company's culture, vision, and recent products. Connect their requirements with your core skills and express enthusiasm for their domain."
        },
        {
          "question": "Describe a scenario where you had a conflict with a team member during a project. How did you resolve it?",
          "tips": "Demonstrate active listening, empathy, open communication, and focusing on the shared project goal rather than personal differences."
        }
      ],
      projectQuestions: [
        {
          "question": "What was the architecture of the most complex project you have listed on your profile?",
          "tips": "Discuss the frontend stack, API routing, database schema layout, authentication mechanisms, and deployment strategies."
        }
      ]
    };

    const response = await generateJSONResponse(prompt, systemInstruction, fallbackData);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Suggest resume improvements (summary rewrites, project descriptions, skills updates)
// @route   POST /api/ai/resume-improvements
// @access  Private
const suggestResumeImprovements = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(404);
      return next(new Error('Student not found'));
    }

    const digest = getStudentProfileDigest(student);
    const systemInstruction = `
      You are an elite resume editor.
      Based on the student's profile details, suggest improvements:
      1. Write a professional Resume Summary tailored for their branch.
      2. Improve hypothetical project descriptions (give examples of how to rewrite standard projects like e-commerce or portfolio websites).
      3. Recommend modern skills upgrades.
      
      Respond strictly with a JSON object in this format:
      {
        "rewrittenSummary": "Proactive Computer Science undergraduate with a solid foundation in Mongoose, React, and RESTful APIs, seeking to leverage hands-on project development skills...",
        "improvedProjects": [
          { "original": "Made a basic MERN chat app using sockets.", "improved": "Engineered a real-time collaborative chat application using the MERN stack and WebSockets, reducing message latency by 40%.", "rationale": "Uses strong action verbs and quantifies impact to stand out to hiring managers." }
        ],
        "skillsAdjustment": [
          { "original": "CSS", "suggestedUpgrade": "Tailwind CSS / SASS" }
        ]
      }
    `;

    const prompt = `Suggest improvements for this student profile:\n${digest}`;

    // Realistic fallback data
    const branchName = student.branch || 'Engineering';
    const fallbackData = {
      rewrittenSummary: `Highly motivated ${branchName} undergraduate with a strong GPA of ${student.cgpa || '8.5'} and hands-on experience in full-stack web development. Proficient in designing scalable RESTful APIs, front-end interfaces, and database integrations. Eager to contribute technical skills and a collaborative mindset to a dynamic software engineering team.`,
      improvedProjects: [
        {
          "original": "Built a website for placement tracking with Node.js and MongoDB.",
          "improved": "Architected and developed a full-stack Placement Journey Management System utilizing Node.js, Express, and MongoDB; integrated automated Gemini AI resume review systems and interactive Chart.js analytics dashboards to streamline recruitment workflows.",
          "rationale": "Specifies the technology stack, includes the system architecture, and highlights advanced integrations (AI & Analytics)."
        },
        {
          "original": "Learned Java and created console games.",
          "improved": "Designed and implemented object-oriented logic games in Java, applying key data structures, algorithm optimizations, and robust exception-handling frameworks.",
          "rationale": "Focuses on computer science fundamentals and object-oriented principles rather than just 'console games'."
        }
      ],
      skillsAdjustment: [
        { "original": "JavaScript", "suggestedUpgrade": "ES6+ Modern JavaScript / TypeScript" },
        { "original": "SQL", "suggestedUpgrade": "PostgreSQL / MySQL database indexing & performance tuning" }
      ]
    };

    const response = await generateJSONResponse(prompt, systemInstruction, fallbackData);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a customized learning roadmap based on multiple tech stacks
// @route   POST /api/ai/roadmap
// @access  Private
const generateRoadmap = async (req, res, next) => {
  const { techStacks } = req.body;
  if (!techStacks || techStacks.length === 0) {
    res.status(400);
    return next(new Error('Tech stacks are required to generate a roadmap.'));
  }

  try {
    const student = await Student.findById(req.user.id);
    
    const systemInstruction = `
      You are an expert AI Tech Mentor.
      The student has provided a list of engineering tech stacks they want to learn or master.
      Create a highly customized, step-by-step learning roadmap. 
      The roadmap should logically sequence the learning of these specific technologies, breaking them down into actionable phases.
      
      Respond strictly with a JSON object in this format:
      {
        "title": "Full-Stack Cloud Engineering Roadmap",
        "description": "A comprehensive path to mastering the requested stack.",
        "estimatedDuration": "6 Months",
        "phases": [
          {
            "phaseNumber": 1,
            "title": "Foundation & Frontend Basics",
            "duration": "4 Weeks",
            "topics": ["HTML/CSS/JS Refresher", "React Component Lifecycle", "State Management"],
            "resources": ["freeCodeCamp React Course", "MDN Web Docs"],
            "milestoneProject": "Build a responsive portfolio."
          }
        ]
      }
    `;

    const prompt = `
      Student Profile summary:
      Branch: ${student?.branch || 'Engineering'}
      Current Skills: ${student?.skills ? student.skills.join(', ') : 'Beginner'}
      
      Requested Tech Stacks to Learn: ${Array.isArray(techStacks) ? techStacks.join(', ') : techStacks}
    `;

    // Realistic fallback data in case Gemini is offline
    const fallbackData = {
      title: "Customized Tech Stack Mastery Roadmap",
      description: `A structured learning path for mastering ${Array.isArray(techStacks) ? techStacks.join(', ') : techStacks}.`,
      estimatedDuration: "12-16 Weeks",
      phases: [
        {
          phaseNumber: 1,
          title: "Core Fundamentals",
          duration: "3 Weeks",
          topics: ["Syntax and core concepts", "Environment setup", "Basic building blocks"],
          resources: ["Official Documentation", "YouTube Crash Courses"],
          milestoneProject: "Create a simple CLI or single-page app."
        },
        {
          phaseNumber: 2,
          title: "Intermediate Integration",
          duration: "4 Weeks",
          topics: ["Connecting components", "State/Data management", "API consumption"],
          resources: ["Udemy", "GitHub Examples"],
          milestoneProject: "Build a full CRUD application."
        },
        {
          phaseNumber: 3,
          title: "Advanced Concepts & Deployment",
          duration: "5 Weeks",
          topics: ["Performance optimization", "Testing (Unit/Integration)", "CI/CD & Cloud Deployment"],
          resources: ["Medium Architecture Blogs", "Cloud Provider Docs"],
          milestoneProject: "Deploy the app with a fully automated pipeline."
        }
      ]
    };

    const response = await generateJSONResponse(prompt, systemInstruction, fallbackData);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reviewResume,
  analyzeSkillGap,
  generateQuestions,
  suggestResumeImprovements,
  generateRoadmap
};
