const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

dotenv.config();

const firstNames = [
  'Amit', 'Rahul', 'Priya', 'Sneha', 'Rohan', 'Anjali', 'Karan', 'Deepak', 'Neha', 'Vikram',
  'Siddharth', 'Aditi', 'Alok', 'Divya', 'Manish', 'Pooja', 'Sanjay', 'Swati', 'Rajesh', 'Kiran',
  'Harish', 'Nisha', 'Vijay', 'Jyoti', 'Abhishek', 'Ritu', 'Arjun', 'Meera', 'Sunil', 'Preeti',
  'Gaurav', 'Shweta', 'Kartik', 'Kavita', 'Mohit', 'Aarati', 'Vivek', 'Sonam', 'Sumit', 'Kajal',
  'Vinay', 'Renu', 'Sandeep', 'Asha', 'Ashish', 'Varsha', 'Sachin', 'Usha', 'Nitin', 'Rekha'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Joshi', 'Mehta', 'Patel', 'Shah', 'Nair',
  'Reddy', 'Rao', 'Das', 'Choudhury', 'Banerjee', 'Chatterjee', 'Mishra', 'Pandey', 'Trivedi', 'Yadav',
  'Sen', 'Roy', 'Prasad', 'Jha', 'Kulkarni', 'Deshmukh', 'Saxena', 'Agrawal', 'Bansal', 'Garg',
  'Malhotra', 'Kapoor', 'Khanna', 'Gill', 'Sandhu', 'Dhillon', 'Menon', 'Pillai', 'Sinha', 'Dubey',
  'Shukla', 'Dwivedi', 'Bhat', 'Raina', 'Kaul', 'Naik', 'Shetty', 'Hegde', 'Gowda', 'Acharya'
];

const branches = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering'
];

const skillBank = [
  'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Java', 'C++', 'SQL',
  'Tailwind CSS', 'Git', 'Docker', 'AWS', 'Data Structures', 'Machine Learning', 'HTML', 'CSS',
  'TypeScript', 'Spring Boot', 'Django', 'Flask', 'Linux', 'Kubernetes', 'REST APIs'
];

const companyData = [
  { companyName: 'Google', package: 35, location: 'Bangalore', eligibilityCgpa: 8.5, skillsRequired: ['Java', 'C++', 'Data Structures', 'Git', 'Python'], driveDate: new Date('2026-08-15') },
  { companyName: 'Microsoft', package: 32, location: 'Hyderabad', eligibilityCgpa: 8.0, skillsRequired: ['C++', 'JavaScript', 'React', 'SQL', 'Data Structures'], driveDate: new Date('2026-08-20') },
  { companyName: 'Amazon', package: 28, location: 'Bangalore', eligibilityCgpa: 8.0, skillsRequired: ['Java', 'Data Structures', 'Linux', 'AWS', 'Docker'], driveDate: new Date('2026-08-25') },
  { companyName: 'TCS Digital', package: 7.5, location: 'Pune', eligibilityCgpa: 7.0, skillsRequired: ['Python', 'Java', 'SQL', 'HTML', 'CSS', 'JavaScript'], driveDate: new Date('2026-09-02') },
  { companyName: 'Infosys Power Programmer', package: 9.5, location: 'Mysore', eligibilityCgpa: 7.5, skillsRequired: ['Java', 'Python', 'C++', 'Data Structures', 'SQL'], driveDate: new Date('2026-09-05') },
  { companyName: 'Wipro Turbo', package: 6.5, location: 'Bangalore', eligibilityCgpa: 6.5, skillsRequired: ['JavaScript', 'HTML', 'CSS', 'Java', 'SQL'], driveDate: new Date('2026-09-10') },
  { companyName: 'Accenture', package: 5.5, location: 'Chennai', eligibilityCgpa: 6.5, skillsRequired: ['SQL', 'Excel', 'Python', 'HTML', 'CSS'], driveDate: new Date('2026-09-12') },
  { companyName: 'Capgemini', package: 4.5, location: 'Mumbai', eligibilityCgpa: 6.0, skillsRequired: ['Java', 'JavaScript', 'HTML', 'CSS', 'SQL'], driveDate: new Date('2026-09-15') },
  { companyName: 'Cognizant GenC Elevate', package: 4.0, location: 'Kolkata', eligibilityCgpa: 6.0, skillsRequired: ['Python', 'Java', 'HTML', 'CSS', 'JavaScript'], driveDate: new Date('2026-09-18') },
  { companyName: 'Adobe', package: 22, location: 'Noida', eligibilityCgpa: 8.0, skillsRequired: ['C++', 'Java', 'React', 'REST APIs', 'TypeScript'], driveDate: new Date('2026-09-22') }
];

const jobTitles = [
  'Software Engineer Intern', 'Associate Software Engineer', 'Full Stack Developer',
  'Data Analyst', 'Cloud Engineer', 'Systems Engineer', 'Backend Developer',
  'Frontend Developer', 'Quality Assurance Engineer', 'DevOps Specialist'
];

const seedDB = async () => {
  try {
    // Connect inside seeder script
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pjms';
    await mongoose.connect(connStr);
    console.log('Seeder connected to MongoDB');

    // Clean up
    await Student.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('Database collections cleared');

    // 1. Seed Companies
    const createdCompanies = await Company.insertMany(companyData);
    console.log(`${createdCompanies.length} Companies seeded.`);

    // 2. Seed Jobs (20 Jobs distributed among 10 companies)
    const jobsToInsert = [];
    createdCompanies.forEach((company, index) => {
      // Job 1
      jobsToInsert.push({
        companyId: company._id,
        title: jobTitles[index % jobTitles.length],
        description: `Join ${company.companyName} as a ${jobTitles[index % jobTitles.length]}. You will work on cutting-edge systems, collaborate with cross-functional teams, and write clean, scalable code.`,
        eligibility: `Minimum CGPA of ${company.eligibilityCgpa}. Candidates must have strong problem-solving skills and knowledge in ${company.skillsRequired.slice(0, 3).join(', ')}.`,
        deadline: new Date(company.driveDate.getTime() - 7 * 24 * 60 * 60 * 1000) // Deadline is 7 days before drive date
      });

      // Job 2 (each company gets 2 jobs)
      jobsToInsert.push({
        companyId: company._id,
        title: jobTitles[(index + 3) % jobTitles.length],
        description: `Exciting opportunity at ${company.companyName} for the role of ${jobTitles[(index + 3) % jobTitles.length]}. We are seeking highly motivated engineers with a passion for software delivery, API integrations, and database performance.`,
        eligibility: `Minimum CGPA of ${company.eligibilityCgpa}. Proficiency in ${company.skillsRequired.slice(-2).join(' or ')} required.`,
        deadline: new Date(company.driveDate.getTime() - 4 * 24 * 60 * 60 * 1000) // Deadline is 4 days before drive date
      });
    });

    const createdJobs = await Job.insertMany(jobsToInsert);
    console.log(`${createdJobs.length} Jobs seeded.`);

    // 3. Seed 50 Students
    const studentsToInsert = [];
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@pjms.com`;
      const branch = branches[Math.floor(Math.random() * branches.length)];
      
      // CGPA distribution: mostly 7.0 - 9.5
      const cgpa = Number((7.0 + Math.random() * 2.5).toFixed(2));
      
      // Skills distribution
      const numSkills = 4 + Math.floor(Math.random() * 5); // 4 to 8 skills
      const studentSkills = [];
      while (studentSkills.length < numSkills) {
        const randSkill = skillBank[Math.floor(Math.random() * skillBank.length)];
        if (!studentSkills.includes(randSkill)) {
          studentSkills.push(randSkill);
        }
      }

      // Certifications
      const certifications = [];
      if (Math.random() > 0.4) {
        certifications.push({
          title: `${studentSkills[0] || 'Java'} Developer Certification`,
          issuer: 'Udemy / Coursera',
          date: new Date('2025-11-20')
        });
      }
      if (Math.random() > 0.7) {
        certifications.push({
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          date: new Date('2026-02-10')
        });
      }

      studentsToInsert.push({
        name,
        email,
        password: 'password123', // Will be hashed by Student schema save hook
        branch,
        cgpa,
        graduationYear: 2026,
        skills: studentSkills,
        certifications,
        resumeUrl: Math.random() > 0.5 ? '/uploads/dummy-resume-sample.pdf' : ''
      });
    }

    // Insert student by student to trigger the save password hook
    const createdStudents = [];
    for (const studentData of studentsToInsert) {
      const student = new Student(studentData);
      await student.save();
      createdStudents.push(student);
    }
    console.log(`${createdStudents.length} Students seeded successfully with hashed passwords.`);

    // 4. Seed 45 Applications
    // We will distribute applications. Let's make sure students apply to jobs where they meet CGPA requirement!
    const applicationsToInsert = [];
    let applicationCount = 0;
    const statuses = ['Applied', 'Shortlisted', 'Interviewing', 'Placed', 'Rejected'];

    // Track placed students so they don't get placed in multiple companies
    const placedStudentIds = new Set();

    for (const student of createdStudents) {
      // Limit number of applications per student (0 to 3)
      const numApps = Math.floor(Math.random() * 3);
      let studentApps = 0;

      for (const job of createdJobs) {
        if (studentApps >= numApps || applicationCount >= 45) break;

        // Check if student meets the minimum CGPA
        const associatedCompany = createdCompanies.find(c => c._id.toString() === job.companyId.toString());
        if (associatedCompany && student.cgpa >= associatedCompany.eligibilityCgpa) {
          
          let status = statuses[Math.floor(Math.random() * statuses.length)];
          
          if (status === 'Placed') {
            if (placedStudentIds.has(student._id.toString())) {
              status = 'Shortlisted'; // fallback to avoid multiple placements
            } else {
              placedStudentIds.add(student._id.toString());
            }
          }

          applicationsToInsert.push({
            studentId: student._id,
            jobId: job._id,
            status,
            appliedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) // Applied in past 10 days
          });

          studentApps++;
          applicationCount++;
        }
      }
    }

    await Application.insertMany(applicationsToInsert);
    console.log(`${applicationsToInsert.length} Applications seeded successfully.`);
    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
