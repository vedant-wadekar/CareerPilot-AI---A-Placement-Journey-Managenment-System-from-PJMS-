import React, { useState, useEffect } from 'react';
import { student } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building, MapPin, DollarSign, Calendar, Search, AlertCircle, CheckCircle, HelpCircle, Clock, Sparkles } from 'lucide-react';

export default function Opportunities() {
  const { studentProfile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      const jobsRes = await student.getOpportunities();
      const appsRes = await student.getApplications();
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
      setLoading(false);
    } catch (err) {
      setErrorMsg('Failed to load job opportunities.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-dismiss toasts
  useEffect(() => {
    if (successMsg || errorMsg) {
      const t = setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg, errorMsg]);

  const handleApply = async (jobId) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await student.applyToJob(jobId);
      setSuccessMsg('Applied to job successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  const getApplicationStatus = (jobId) => {
    const app = applications.find(a => a.jobId?._id === jobId);
    return app ? app.status : null;
  };

  const isEligible = (company) => {
    if (!studentProfile) return false;
    return studentProfile.cgpa >= company.eligibilityCgpa;
  };

  const getDeadlineUrgency = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return { label: `${daysLeft}d left`, color: 'text-red-600 bg-red-50 border-red-200' };
    if (daysLeft <= 7) return { label: `${daysLeft}d left`, color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: new Date(deadline).toLocaleDateString(), color: 'text-slate-500' };
  };

  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.companyId?.companyName.toLowerCase().includes(query) ||
      job.companyId?.location.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-56 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notifications */}
      {(successMsg || errorMsg) && (
        <div className="fixed top-5 right-5 z-50 space-y-2">
          {successMsg && (
            <div className="toast-success p-4 rounded-xl flex items-center gap-3 animate-toast max-w-xs">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
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

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by role, company or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium">Your CGPA:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            {studentProfile?.cgpa || '0.00'}
          </span>
          <span className="text-xs text-slate-400 font-medium">{filteredJobs.length} drives</span>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-16 text-center animate-scale-in">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-slate-200" />
          <p className="text-slate-500 font-medium">No active drives match your search</p>
          <p className="text-xs text-slate-400 mt-1">Try a different keyword or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job, index) => {
            const company = job.companyId;
            const appliedStatus = getApplicationStatus(job._id);
            const eligible = isEligible(company);
            const urgency = getDeadlineUrgency(job.deadline);

            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col card-hover animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Card Header */}
                <div className="p-5 border-b border-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Company Avatar */}
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 border border-slate-100">
                        <Building className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{job.title}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">{company?.companyName}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {appliedStatus ? (
                      <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded-lg shrink-0 capitalize">
                        {appliedStatus}
                      </span>
                    ) : eligible ? (
                      <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shrink-0 pulse-glow-emerald">
                        Eligible ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg shrink-0">
                        Ineligible
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-3.5 line-clamp-2 leading-relaxed">{job.description}</p>
                </div>

                {/* Card Meta */}
                <div className="px-5 py-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-500 truncate">{company?.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-emerald-700">{company?.package} LPA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${urgency.color}`}>
                      {urgency.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-500">Min CGPA: <span className="font-semibold text-slate-700">{company?.eligibilityCgpa}</span></span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-5 pb-5 mt-auto">
                  {appliedStatus ? (
                    <div className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Application Submitted
                    </div>
                  ) : eligible ? (
                    <button
                      onClick={() => handleApply(job._id)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white btn-shimmer transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Apply Now
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-red-50 border border-red-100 text-red-400 rounded-xl text-xs font-semibold text-center cursor-not-allowed">
                      CGPA Requirement Not Met
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
