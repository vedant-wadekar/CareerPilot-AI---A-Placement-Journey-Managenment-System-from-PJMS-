import axios from 'axios';

// Fallback to local server address
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000
});

// Request Interceptor: Attach JWT Token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
const auth = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  coordinatorLogin: (data) => API.post('/auth/coordinator/login', data)
};

// Student endpoints
const student = {
  getProfile: () => API.get('/student/profile'),
  updateProfile: (data) => API.put('/student/profile', data),
  addSkill: (skill) => API.post('/student/skills', { skill }),
  updateSkills: (skills) => API.put('/student/skills', { skills }),
  deleteSkill: (skill) => API.delete(`/student/skills/${encodeURIComponent(skill)}`),
  addCertification: (data) => API.post('/student/certifications', data),
  deleteCertification: (id) => API.delete(`/student/certifications/${id}`),
  uploadResume: (formData) =>
    API.post('/student/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getOpportunities: () => API.get('/student/opportunities'),
  applyToJob: (jobId) => API.post('/student/apply', { jobId }),
  getApplications: () => API.get('/student/applications'),
  getDashboardStats: () => API.get('/student/dashboard')
};

// Coordinator endpoints
const coordinator = {
  getDashboardStats: () => API.get('/coordinator/dashboard'),
  getCompanies: () => API.get('/coordinator/companies'),
  addCompany: (data) => API.post('/coordinator/companies', data),
  updateCompany: (id, data) => API.put(`/coordinator/companies/${id}`, data),
  deleteCompany: (id) => API.delete(`/coordinator/companies/${id}`),
  getJobs: () => API.get('/coordinator/jobs'),
  addJob: (data) => API.post('/coordinator/jobs', data),
  updateJob: (id, data) => API.put(`/coordinator/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/coordinator/jobs/${id}`),
  getEligibleStudents: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return API.get(`/coordinator/students?${params}`);
  },
  getApplications: () => API.get('/coordinator/applications'),
  updateApplicationStatus: (id, status) =>
    API.put(`/coordinator/applications/${id}`, { status }),
  getPlacementReportData: () => API.get('/coordinator/reports')
};

// AI endpoints
const ai = {
  reviewResume: () => API.post('/ai/resume-review'),
  analyzeSkillGap: (jobId) => API.post('/ai/skill-gap', { jobId }),
  generateQuestions: (jobId, customRole) =>
    API.post('/ai/generate-questions', { jobId, customRole }),
  suggestImprovements: () => API.post('/ai/resume-improvements')
};

// Personalized Roadmap endpoints
const customRoadmap = {
  getRoadmap: () => API.get('/roadmap'),
  generateRoadmap: (interests) => API.post('/roadmap/generate', { interests }),
  updateProgress: (phaseId, topicId, status) => API.put('/roadmap/progress', { phaseId, topicId, status })
};

export default API;
export { auth, student, coordinator, ai, customRoadmap };