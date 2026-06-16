import React, { useState, useEffect } from 'react';
import { coordinator } from '../services/api';
import { Plus, Edit2, Trash2, Search, Briefcase, Building, Calendar, HelpCircle, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JobPostings() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    eligibility: '',
    deadline: ''
  });

  const [toast, setToast] = useState({ message: '', type: '' });

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const fetchData = async () => {
    try {
      const jobsRes = await coordinator.getJobs();
      const companiesRes = await coordinator.getCompanies();
      setJobs(jobsRes.data);
      setCompanies(companiesRes.data);
      setLoading(false);
    } catch (err) {
      triggerToast('Failed to load job posting data.', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    if (companies.length === 0) {
      return triggerToast('Please register at least one company first!', 'error');
    }
    setEditingId(null);
    setFormData({
      companyId: companies[0]._id,
      title: '',
      description: '',
      eligibility: '',
      deadline: ''
    });
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingId(job._id);
    setFormData({
      companyId: job.companyId?._id || '',
      title: job.title,
      description: job.description,
      eligibility: job.eligibility,
      deadline: job.deadline ? job.deadline.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { companyId, title, description, eligibility, deadline } = formData;

    if (!companyId || !title || !description || !eligibility || !deadline) {
      return triggerToast('Required fields are missing.', 'error');
    }

    const payload = {
      companyId,
      title,
      description,
      eligibility,
      deadline: new Date(deadline)
    };

    try {
      if (editingId) {
        await coordinator.updateJob(editingId, payload);
        triggerToast('Job posting updated successfully!');
      } else {
        await coordinator.addJob(payload);
        triggerToast('Job posting created successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Operation failed.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This will remove all student applications linked to it.')) {
      return;
    }

    try {
      await coordinator.deleteJob(id);
      triggerToast('Job posting and student applications deleted.');
      fetchData();
    } catch (err) {
      triggerToast('Failed to delete job posting.', 'error');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.companyId?.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-52 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast banners */}
      {toast.message && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-toast max-w-xs ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {toast.type === 'error' ? <AlertCircle className="h-5 w-5 text-red-600 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Toolbar header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input type="text" placeholder="Search by role or company..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all text-sm" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-medium hidden sm:block">{filteredJobs.length} postings</span>
          <button onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 btn-shimmer-purple text-white rounded-xl font-bold text-sm shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-16 text-center animate-scale-in">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-slate-200" />
          <p className="text-slate-400 font-medium text-sm">No job postings yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredJobs.map((job, index) => (
            <div key={job._id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm card-hover flex flex-col animate-slide-up overflow-hidden" style={{ animationDelay: `${index * 60}ms` }}>
              <div className="p-5 border-b border-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl icon-box-purple flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{job.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {job.companyId?.companyName || 'Deleted Company'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEditModal(job)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2">{job.description}</p>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 truncate">Eligibility: {job.eligibility}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">Due: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg icon-box-purple"><Briefcase className="h-4 w-4" /></div>
                <h3 className="font-bold text-slate-800 text-sm">{editingId ? 'Edit Job Posting' : 'Publish Job Opening'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Recruiter Company</label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                >
                  {companies.map(c => (
                    <option key={c._id} value={c._id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Associate Software Engineer"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Describe roles, responsibilities, and department info..."
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Eligibility Criteria (Details)</label>
                <input
                  type="text"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  required
                  placeholder="e.g. CGPA >= 8.0, Computer Science major"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Application Deadline</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="py-2 px-4 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 text-sm transition-colors">Cancel</button>
                <button type="submit"
                  className="py-2 px-5 btn-shimmer-purple text-white rounded-xl font-bold text-sm shadow-sm transition-all">
                  {editingId ? 'Save Changes' : 'Post Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
