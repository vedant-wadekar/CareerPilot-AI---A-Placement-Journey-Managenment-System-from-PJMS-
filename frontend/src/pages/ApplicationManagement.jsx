import React, { useState, useEffect } from 'react';
import { coordinator } from '../services/api';
import { CheckSquare, Search, CheckCircle, Clock, UserCheck, Calendar, XCircle, AlertCircle, Eye } from 'lucide-react';

export default function ApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (message, type = 'success') => {
    setToastMsg(message);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchApplications = async () => {
    try {
      const res = await coordinator.getApplications();
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      triggerToast('Failed to load student applications.', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await coordinator.updateApplicationStatus(id, status);
      triggerToast(`Application status updated to ${status}!`);
      fetchApplications(); // refresh table
    } catch (err) {
      triggerToast('Failed to update application status.', 'error');
    }
  };

  const statusIcons = {
    Applied: <Clock className="h-4 w-4 text-slate-500" />,
    Shortlisted: <UserCheck className="h-4 w-4 text-blue-500" />,
    Interviewing: <Calendar className="h-4 w-4 text-amber-500" />,
    Placed: <CheckCircle className="h-4 w-4 text-emerald-500 animate-bounce" />,
    Rejected: <XCircle className="h-4 w-4 text-red-500" />
  };

  const statusStyles = {
    Applied: 'bg-slate-100 text-slate-700 border border-slate-200',
    Shortlisted: 'bg-blue-100 text-blue-700 border border-blue-200',
    Interviewing: 'bg-amber-100 text-amber-700 border border-amber-200',
    Placed: 'bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold',
    Rejected: 'bg-red-100 text-red-700 border border-red-200'
  };

  const filteredApps = applications.filter(app => {
    const query = searchQuery.toLowerCase();
    const studentName = app.studentId?.name || '';
    const companyName = app.jobId?.companyId?.companyName || '';
    const jobTitle = app.jobId?.title || '';
    return (
      studentName.toLowerCase().includes(query) ||
      companyName.toLowerCase().includes(query) ||
      jobTitle.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="skeleton h-80 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-toast max-w-xs ${toastType === 'error' ? 'toast-error' : 'toast-success'}`}>
            {toastType === 'error' ? <AlertCircle className="h-5 w-5 text-red-600 shrink-0" /> : <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />}
            <span className="text-sm font-medium">{toastMsg}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input type="text" placeholder="Search by student, company or job..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all text-sm" />
        </div>
        <div className="text-xs text-slate-400 font-semibold shrink-0">
          Total: <span className="font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-lg">{applications.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
        {filteredApps.length === 0 ? (
          <div className="p-16 text-center">
            <CheckSquare className="h-10 w-10 mx-auto mb-3 text-slate-200" />
            <p className="text-slate-400 font-medium text-sm">No applications match your search.</p>
          </div>
        ) : (
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                <th className="p-4">Student Info</th>
                <th className="p-4">Target Job / Company</th>
                <th className="p-4">Cut-off GPA vs Student</th>
                <th className="p-4">Resume</th>
                <th className="p-4">Applied On</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Set Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredApps.map((app) => {
                const s = app.studentId;
                const company = app.jobId?.companyId;
                const job = app.jobId;

                return (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      {s ? (
                        <div>
                          <p className="font-bold text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-450">{s.branch} • Grad {s.graduationYear}</p>
                        </div>
                      ) : (
                        <span className="text-red-500 italic">Deleted Profile</span>
                      )}
                    </td>
                    <td className="p-4">
                      {job ? (
                        <div>
                          <p className="font-semibold text-slate-700">{job.title}</p>
                          <p className="text-xs text-slate-500 font-bold">{company?.companyName}</p>
                        </div>
                      ) : (
                        <span className="text-red-500 italic">Deleted Job</span>
                      )}
                    </td>
                    <td className="p-4">
                      {s && company ? (
                        <span className={`font-semibold ${s.cgpa >= company.eligibilityCgpa ? 'text-emerald-600' : 'text-red-600'}`}>
                          {company.eligibilityCgpa} vs <span className="font-bold">{s.cgpa}</span>
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className="p-4">
                      {s?.resumeUrl ? (
                        <a
                          href={`http://localhost:5000${s.resumeUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                        >
                          <Eye className="h-4 w-4 text-brand-500" />
                          <span>View PDF</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[app.status]}`}>
                        {statusIcons[app.status]}
                        <span>{app.status}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="block w-full mx-auto px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent cursor-pointer max-w-[120px]"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Placed">Placed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
