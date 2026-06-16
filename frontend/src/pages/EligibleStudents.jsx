import React, { useState, useEffect } from 'react';
import { coordinator } from '../services/api';
import { Users, Search, BookOpen, Star, Shield, FileText, AlertCircle } from 'lucide-react';

export default function EligibleStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [filters, setFilters] = useState({
    branch: '',
    minCgpa: '',
    skill: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await coordinator.getEligibleStudents(filters);
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students directory.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters.branch, filters.minCgpa]); // Auto refetch when branch/cgpa changes

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents(); // manual fetch on skill query
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Filtering Toolbar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
        
        {/* Branch Filter */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Branch</label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm appearance-none"
            >
              <option value="">All Branches</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* CGPA cut-off */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Min CGPA</label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Star className="h-4 w-4" />
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              name="minCgpa"
              value={filters.minCgpa}
              onChange={handleFilterChange}
              placeholder="e.g. 8.0"
              className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Skill tag query */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Required Skill</label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Shield className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="skill"
              value={filters.skill}
              onChange={handleFilterChange}
              placeholder="e.g. React"
              className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>

      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-50/10 border border-red-100/20 text-red-600 flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Directory Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200">
          <span className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full mr-3"></span>
          <span className="text-sm font-medium text-slate-500 font-sans">Scanning students list...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
          No students match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student) => (
            <div key={student._id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-sm hover:border-slate-300 transition-all space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-slate-850 text-base">{student.name}</h4>
                  <p className="text-xs text-slate-400">{student.email}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shrink-0">
                  GPA: {student.cgpa.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-3.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Academic Branch</span>
                  <span className="text-slate-700">{student.branch || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Graduation Year</span>
                  <span className="text-slate-700">{student.graduationYear}</span>
                </div>
              </div>

              {/* Skills block */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills Tag</span>
                {student.skills?.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No skills listed</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {student.skills?.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-700 rounded-md text-[10px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Download Resume block */}
              <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
                {student.resumeUrl ? (
                  <a
                    href={`http://localhost:5000${student.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
                  >
                    <FileText className="h-4 w-4 text-brand-500" />
                    <span>Download Resume PDF</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span>No Resume Uploaded</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
