# Placement Journey Management System (PJMS)

A production-ready, full-stack web application designed to streamline campus recruitment drives, profile tracking, and career readiness. Integrated with **Google Gemini AI** to act as a career co-pilot, providing resume scoring, skill-gap roadmaps, custom interview prep, and text rewrites.<br>

CareerPilot AI – Placement Journey Management System

<br>🚀 Live Demo
Frontend

https://careerpilot-ai-seven-red.vercel.app

<br>
Backend API

https://careerpilot-backend-pg1i.onrender.com

---

## 🌟 Key Features

### 👨‍🎓 Student Module
1. **Secure Access**: JWT-based registration and login.
2. **Academic profile**: Real-time profile views (Branch, CGPA, graduation details).
3. **Skills & Certs manager**: Add, edit, and delete skills tags and certification records.
4. **Resume Manager**: Native PDF uploads via Multer.
5. **Recruitment Board**: View jobs, track application status, and check drive qualifications.
6. **Student analytics**: Clean dashboard showing application funnels.

### 👩‍💼 Coordinator Module
1. **Administrative Access**: Designated secure portal.
2. **Executive analytics**: Detailed analytics showing placement ratios, cohort sizes, salary bounds, and branch histograms.
3. **Recruiter Manager**: Full CRUD manager for company profiles.
4. **Job Publisher**: Add, update, and remove job openings.
5. **Student Index**: Filterable index searchable by CGPA cut-off, branch, and skill tags.
6. **Application Ledger**: Review student applications, download resumes, and set applicant status.
7. **Official Reports**: Download placement ledgers in CSV formats or run printable summaries.

### 🧠 Gemini AI Features
1. **Resume Audit**: Returns scoring (0-100), missing skills, formatting advice, and grammar checks.
2. **Skill Gap Roadmap**: Compares student skills with job specifications and lists step-by-step roadmaps.
3. **Interview Prep**: Custom Technical, HR, and project questions tailored to target jobs.
4. **Resume Enhancer**: Custom rewrites for profile summaries and projects using STAR patterns.

---

## 📂 Folder Structure

```
Placement Journey Management System/
├── backend/
│   ├── config/          # Mongoose database setup
│   ├── controllers/     # MVC controller methods
│   ├── middleware/      # Auth validations & file upload filters
│   ├── models/          # Mongoose collections schemas
│   ├── routes/          # Express API route endpoints
│   ├── uploads/         # Local folder storing student resume PDFs
│   ├── utils/           # AI helper client & database seeder script
│   ├── .env             # Server variables
│   ├── package.json     # Backend Node packages
│   └── server.js        # Backend entrypoint
└── frontend/
    ├── public/          # Static browser assets
    ├── src/
    │   ├── components/  # Layout shells & navigation components
    │   ├── context/     # React state auth providers
    │   ├── pages/       # Dashboards, Resume Review, Profile, Job Listings
    │   ├── services/    # Axios API & Gemini endpoints wrapper
    │   ├── App.jsx      # Navigation routing map
    │   ├── index.css    # Tailwind base styles
    │   └── main.jsx     # Root mount file
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js**: (LTS Version 18+ recommended)
- **MongoDB**: Local server installed and running on port `27017` OR a **MongoDB Atlas** database.
- **Gemini API Key**: A valid key from Google AI Studio.

---

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install node packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory and configure the variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.5.1:27017/pjms  # Or your MongoDB Atlas URI
   JWT_SECRET=secret_placement_token_987654321
   COORDINATOR_EMAIL=coordinator@pjms.com
   COORDINATOR_PASSWORD=admin123
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Database Seeding**: Populate the database with 50 students, 10 companies, 20 jobs, and 45+ applications:
   ```bash
   npm run seed
   ```
5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🛡️ Predefined Credentials

For testing and grading convenience, use the following logins after seeding:

- **Placement Coordinator**:
  - **Email**: `coordinator@pjms.com`
  - **Password**: `admin123`
- **Sample Student Profile**:
  - **Email**: `amit.sharma0@pjms.com` (Or check the database list for other emails)
  - **Password**: `password123`

---

## 📊 API Reference

### Auth Endpoints
- `POST /api/auth/register` - Register a student
- `POST /api/auth/login` - Student Login
- `POST /api/auth/coordinator/login` - Coordinator Login

### Student Profile & Jobs
- `GET /api/student/profile` - Get profile info
- `PUT /api/student/profile` - Edit profile info
- `POST /api/student/skills` - Add skill tag
- `DELETE /api/student/skills/:skill` - Delete skill tag
- `POST /api/student/certifications` - Add certification
- `POST /api/student/resume` - Upload resume PDF (form-data: `resume`)
- `GET /api/student/opportunities` - Get job openings
- `POST /api/student/apply` - Apply for job
- `GET /api/student/dashboard` - Get student dashboard statistics

### Coordinator Actions
- `GET /api/coordinator/dashboard` - Admin analytics metrics
- `POST /api/coordinator/companies` - Add corporate partner
- `POST /api/coordinator/jobs` - Publish job openings
- `GET /api/coordinator/students` - Filter students directory
- `PUT /api/coordinator/applications/:id` - Shortlist/Place students

### AI Operations
- `POST /api/ai/resume-review` - Grade resume and missing skills
- `POST /api/ai/skill-gap` - Run skill-gap roadmap analysis
- `POST /api/ai/generate-questions` - Generate customized questions
- `POST /api/ai/resume-improvements` - Rewrite projects & summaries
