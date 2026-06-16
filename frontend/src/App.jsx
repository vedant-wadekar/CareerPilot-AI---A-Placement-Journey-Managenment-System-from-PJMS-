import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import CoordLogin from './pages/CoordLogin';

// Student pages
import StudentDashboard from './pages/StudentDashboard';
import ProfileManagement from './pages/ProfileManagement';
import SkillsCertifications from './pages/SkillsCertifications';
import Opportunities from './pages/Opportunities';
import ResumeAISpace from './pages/ResumeAISpace';
import RoadmapGenerator from './pages/RoadmapGenerator';

// Coordinator pages
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import CompanyManagement from './pages/CompanyManagement';
import JobPostings from './pages/JobPostings';
import EligibleStudents from './pages/EligibleStudents';
import ApplicationManagement from './pages/ApplicationManagement';
import Reports from './pages/Reports';

// Layout component
import DashboardLayout from './components/DashboardLayout';

// Guard for protected student routes
const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50"><span className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></span></div>;
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Guard for protected coordinator routes
const CoordinatorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50"><span className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></span></div>;
  if (!user || user.role !== 'coordinator') {
    return <Navigate to="/coordinator-login" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={user ? (user.role === 'student' ? <Navigate to="/dashboard" /> : <Navigate to="/coord/dashboard" />) : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/coordinator-login" element={user ? (user.role === 'student' ? <Navigate to="/dashboard" /> : <Navigate to="/coord/dashboard" />) : <CoordLogin />} />

      {/* Student Protected Routes */}
      <Route path="/dashboard" element={<StudentRoute><DashboardLayout><StudentDashboard /></DashboardLayout></StudentRoute>} />
      <Route path="/profile" element={<StudentRoute><DashboardLayout><ProfileManagement /></DashboardLayout></StudentRoute>} />
      <Route path="/skills" element={<StudentRoute><DashboardLayout><SkillsCertifications /></DashboardLayout></StudentRoute>} />
      <Route path="/opportunities" element={<StudentRoute><DashboardLayout><Opportunities /></DashboardLayout></StudentRoute>} />
      <Route path="/ai-space" element={<StudentRoute><DashboardLayout><ResumeAISpace /></DashboardLayout></StudentRoute>} />
      <Route path="/roadmap" element={<StudentRoute><DashboardLayout><RoadmapGenerator /></DashboardLayout></StudentRoute>} />

      {/* Coordinator Protected Routes */}
      <Route path="/coord/dashboard" element={<CoordinatorRoute><DashboardLayout><CoordinatorDashboard /></DashboardLayout></CoordinatorRoute>} />
      <Route path="/coord/companies" element={<CoordinatorRoute><DashboardLayout><CompanyManagement /></DashboardLayout></CoordinatorRoute>} />
      <Route path="/coord/jobs" element={<CoordinatorRoute><DashboardLayout><JobPostings /></DashboardLayout></CoordinatorRoute>} />
      <Route path="/coord/students" element={<CoordinatorRoute><DashboardLayout><EligibleStudents /></DashboardLayout></CoordinatorRoute>} />
      <Route path="/coord/applications" element={<CoordinatorRoute><DashboardLayout><ApplicationManagement /></DashboardLayout></CoordinatorRoute>} />
      <Route path="/coord/reports" element={<CoordinatorRoute><DashboardLayout><Reports /></DashboardLayout></CoordinatorRoute>} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
