import React, { useState, useEffect } from 'react';
import { coordinator } from '../services/api';
import { Plus, Edit2, Trash2, Search, MapPin, DollarSign, Calendar, HelpCircle, X, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    package: '',
    location: '',
    eligibilityCgpa: '',
    skillsRequired: '',
    driveDate: ''
  });

  const [toast, setToast] = useState({ message: '', type: '' });

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const fetchCompanies = async () => {
    try {
      const res = await coordinator.getCompanies();
      setCompanies(res.data);
      setLoading(false);
    } catch (err) {
      triggerToast('Failed to fetch companies.', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      companyName: '',
      package: '',
      location: '',
      eligibilityCgpa: '',
      skillsRequired: '',
      driveDate: ''
    });
    setShowModal(true);
  };

  const openEditModal = (comp) => {
    setEditingId(comp._id);
    setFormData({
      companyName: comp.companyName,
      package: comp.package,
      location: comp.location,
      eligibilityCgpa: comp.eligibilityCgpa,
      skillsRequired: comp.skillsRequired ? comp.skillsRequired.join(', ') : '',
      driveDate: comp.driveDate ? comp.driveDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { companyName, package: pkg, location, eligibilityCgpa, skillsRequired, driveDate } = formData;

    if (!companyName || !pkg || !location || !driveDate) {
      return triggerToast('Required fields are missing.', 'error');
    }

    const payload = {
      companyName,
      package: parseFloat(pkg),
      location,
      eligibilityCgpa: parseFloat(eligibilityCgpa) || 0,
      skillsRequired: skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
      driveDate: new Date(driveDate)
    };

    try {
      if (editingId) {
        await coordinator.updateCompany(editingId, payload);
        triggerToast('Company details updated successfully!');
      } else {
        await coordinator.addCompany(payload);
        triggerToast('Company added successfully!');
      }
      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Operation failed.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Deleting this company will also delete all associated job postings and student applications. Do you wish to proceed?')) {
      return;
    }

    try {
      await coordinator.deleteCompany(id);
      triggerToast('Company and related data deleted.');
      fetchCompanies();
    } catch (err) {
      triggerToast('Failed to delete company.', 'error');
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="skeleton h-72 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast notifications */}
      {toast.message && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-toast max-w-xs ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {toast.type === 'error' ? <AlertCircle className="h-5 w-5 text-red-600 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Action Header bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search companies by name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-medium hidden sm:block">{filteredCompanies.length} companies</span>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 btn-shimmer-purple text-white rounded-xl font-bold text-sm shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
        {filteredCompanies.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 className="h-10 w-10 mx-auto mb-3 text-slate-200" />
            <p className="text-slate-400 font-medium text-sm">No companies found.</p>
          </div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5">Company</th>
                <th className="px-4 py-3.5">Package</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Min CGPA</th>
                <th className="px-4 py-3.5">Required Skills</th>
                <th className="px-4 py-3.5">Drive Date</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredCompanies.map((comp, idx) => (
                <tr key={comp._id} className="hover:bg-slate-50/60 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg icon-box-purple flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-slate-800">{comp.companyName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-xs">{comp.package} LPA</span></td>
                  <td className="px-4 py-4 text-slate-600 text-xs">{comp.location}</td>
                  <td className="px-4 py-4"><span className="text-slate-700 font-semibold text-xs">{comp.eligibilityCgpa}+</span></td>
                  <td className="px-4 py-4 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {comp.skillsRequired?.length ? comp.skillsRequired.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-violet-50 border border-violet-200 text-violet-700 rounded-md text-[10px] font-semibold">{s}</span>
                      )) : <span className="text-slate-400 text-xs">Any</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{new Date(comp.driveDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEditModal(comp)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(comp._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CRUD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg icon-box-purple"><Building2 className="h-4 w-4" /></div>
                <h3 className="font-bold text-slate-800 text-sm">{editingId ? 'Edit Company Details' : 'Add New Company'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Google India"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Salary Package (LPA)</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      name="package"
                      value={formData.package}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 18.5"
                      className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Eligibility CGPA</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      name="eligibilityCgpa"
                      value={formData.eligibilityCgpa}
                      onChange={handleChange}
                      placeholder="e.g. 7.50"
                      className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Office Location</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bangalore, KA"
                    className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, AWS"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recruitment Drive Date</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    name="driveDate"
                    value={formData.driveDate}
                    onChange={handleChange}
                    required
                    className="block w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="py-2 px-4 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="py-2 px-5 btn-shimmer-purple text-white rounded-xl font-bold text-sm shadow-sm transition-all">
                  {editingId ? 'Save Changes' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
