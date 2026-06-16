import React, { useState, useEffect } from 'react';
import { student } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, Star, Calendar, FileText, Upload, CheckCircle2, AlertCircle, Download } from 'lucide-react';

export default function ProfileManagement() {
  const { studentProfile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', branch: '', cgpa: '', graduationYear: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        name: studentProfile.name || '',
        email: studentProfile.email || '',
        branch: studentProfile.branch || 'Computer Science',
        cgpa: studentProfile.cgpa || '',
        graduationYear: studentProfile.graduationYear || new Date().getFullYear()
      });
    }
  }, [studentProfile]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrorMsg('Only PDF files are supported.');
        setResumeFile(null);
        return;
      }
      setErrorMsg('');
      setResumeFile(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const cgVal = parseFloat(formData.cgpa);
      if (isNaN(cgVal) || cgVal < 0 || cgVal > 10) throw new Error('CGPA must be between 0 and 10');
      await student.updateProfile({ ...formData, cgpa: cgVal, graduationYear: parseInt(formData.graduationYear) });
      await refreshProfile();
      setSuccessMsg('Profile updated successfully!');
      setLoading(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setUploading(true);
    setSuccessMsg('');
    setErrorMsg('');
    const uploadData = new FormData();
    uploadData.append('resume', resumeFile);
    try {
      await student.uploadResume(uploadData);
      await refreshProfile();
      setSuccessMsg('Resume uploaded successfully!');
      setResumeFile(null);
      setUploading(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Resume upload failed.');
      setUploading(false);
    }
  };

  const branches = [
    'Computer Science', 'Information Technology',
    'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering'
  ];

  const inputClass = "block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all text-sm";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5";
  const iconClass = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Toast Notifications */}
      {(successMsg || errorMsg) && (
        <div className="fixed top-5 right-5 z-50 space-y-2">
          {successMsg && (
            <div className="toast-success p-4 rounded-xl flex items-center gap-3 animate-toast max-w-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium">{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="toast-error p-4 rounded-xl flex items-center gap-3 animate-toast max-w-xs">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Resume Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col items-center text-center animate-slide-up">
          {/* Avatar */}
          <div className="relative mb-5">
            <div className="h-20 w-20 rounded-2xl avatar-emerald flex items-center justify-center text-white text-3xl font-bold">
              {studentProfile?.name ? studentProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-800">{studentProfile?.name || 'Your Name'}</h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-1">{studentProfile?.email}</p>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mt-1 mb-6">
            {studentProfile?.branch || 'Student'}
          </span>

          {/* Resume Status */}
          {studentProfile?.resumeUrl ? (
            <div className="w-full p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 mb-5 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-emerald-700">✓ Resume Uploaded</span>
              <a
                href={`http://localhost:5000${studentProfile.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </a>
            </div>
          ) : (
            <div className="w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 mb-5 text-center">
              <p className="text-xs font-bold text-amber-700">No Resume Uploaded</p>
              <p className="text-xs text-amber-600 mt-0.5">Upload to apply to drives</p>
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleResumeSubmit} className="w-full space-y-3">
            <label className="upload-zone w-full rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer block">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              <Upload className="h-6 w-6 text-slate-400" />
              <p className="text-xs text-slate-600 font-medium text-center">
                {resumeFile ? resumeFile.name : 'Click to select PDF'}
              </p>
              <span className="text-[10px] text-slate-400">PDF only, max 5MB</span>
            </label>
            {resumeFile && (
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 px-4 btn-shimmer text-white rounded-xl text-xs font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Uploading...
                  </span>
                ) : 'Upload Resume'}
              </button>
            )}
          </form>
        </div>

        {/* Right: Profile Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:col-span-2 animate-slide-up delay-100">
          <div className="flex items-center gap-2.5 mb-6 pb-5 border-b border-slate-100">
            <div className="p-2 rounded-lg icon-box-emerald">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Academic Profile Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">Update your placement profile information</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <div className={iconClass}><User className="h-4 w-4" /></div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <div className={iconClass}><Mail className="h-4 w-4" /></div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="john@college.edu" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Branch</label>
                <div className="relative">
                  <div className={iconClass}><BookOpen className="h-4 w-4" /></div>
                  <select name="branch" value={formData.branch} onChange={handleChange}
                    className={`${inputClass} appearance-none`}>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Current CGPA</label>
                <div className="relative">
                  <div className={iconClass}><Star className="h-4 w-4" /></div>
                  <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} required className={inputClass} placeholder="8.50" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Graduation Year</label>
                <div className="relative max-w-xs">
                  <div className={iconClass}><Calendar className="h-4 w-4" /></div>
                  <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required className={inputClass} placeholder="2026" />
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 btn-shimmer text-white rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
