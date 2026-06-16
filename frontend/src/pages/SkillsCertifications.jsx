import React, { useState } from 'react';
import { student } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, X, GraduationCap, Award, Calendar, Shield, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function SkillsCertifications() {
  const { studentProfile, refreshProfile } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [certForm, setCertForm] = useState({ title: '', issuer: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3500);
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setLoading(true);
    try {
      await student.addSkill(newSkill.trim());
      await refreshProfile();
      setNewSkill('');
      triggerToast('Skill added successfully!');
    } catch (err) {
      triggerToast('Failed to add skill.', 'error');
    }
    setLoading(false);
  };

  const handleDeleteSkill = async (skillToDelete) => {
    try {
      await student.deleteSkill(skillToDelete);
      await refreshProfile();
      triggerToast('Skill removed.');
    } catch (err) {
      triggerToast('Failed to delete skill.', 'error');
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) return triggerToast('Title and Issuer are required.', 'error');
    setLoading(true);
    try {
      await student.addCertification({
        title: certForm.title,
        issuer: certForm.issuer,
        date: certForm.date ? new Date(certForm.date) : null
      });
      await refreshProfile();
      setCertForm({ title: '', issuer: '', date: '' });
      triggerToast('Certification added!');
    } catch (err) {
      triggerToast('Failed to add certification.', 'error');
    }
    setLoading(false);
  };

  const handleDeleteCert = async (id) => {
    try {
      await student.deleteCertification(id);
      await refreshProfile();
      triggerToast('Certification removed.');
    } catch (err) {
      triggerToast('Failed to delete certification.', 'error');
    }
  };

  const skillColors = [
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-violet-50 text-violet-700 border-violet-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-teal-50 text-teal-700 border-teal-200',
    'bg-rose-50 text-rose-700 border-rose-200',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Toast */}
      {toast.message && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-toast max-w-xs ${
            toast.type === 'error' ? 'toast-error' : 'toast-success'
          }`}>
            {toast.type === 'error'
              ? <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              : <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-lg icon-box-emerald">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Professional Skills</h3>
              <p className="text-xs text-slate-400 mt-0.5">Add technical & core competencies</p>
            </div>
            {studentProfile?.skills?.length > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                {studentProfile.skills.length}
              </span>
            )}
          </div>

          <div className="p-5 flex flex-col gap-5 flex-1">
            {/* Add Skill Input */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React, Python…)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-sm transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 btn-shimmer text-white rounded-xl font-bold text-sm flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </form>

            {/* Skills Tags */}
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Skills</p>
              {!studentProfile?.skills?.length ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Sparkles className="h-8 w-8 mb-2 text-slate-200" />
                  <p className="text-sm font-medium">No skills added yet</p>
                  <p className="text-xs mt-1">Add your first skill above</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {studentProfile.skills.map((skill, i) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold card-hover ${skillColors[i % skillColors.length]}`}
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill)}
                        className="rounded-full hover:bg-black/10 p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certifications Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-lg icon-box-amber">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Certifications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Verified credentials & badges</p>
            </div>
            {studentProfile?.certifications?.length > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                {studentProfile.certifications.length}
              </span>
            )}
          </div>

          <div className="p-5 flex flex-col gap-4 flex-1">
            {/* Cert List */}
            <div className="flex-1 space-y-2 max-h-52 overflow-y-auto pr-1">
              {!studentProfile?.certifications?.length ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Award className="h-8 w-8 mb-2 text-slate-200" />
                  <p className="text-sm font-medium">No certifications yet</p>
                </div>
              ) : (
                studentProfile.certifications.map((c, i) => (
                  <div key={c._id} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all card-hover animate-fade-in delay-${Math.min(i*100, 400)} bg-emerald-50 border-emerald-200 shadow-sm`}>
                    <div className="min-w-0 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg icon-box-amber flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{c.title}</p>
                        <p className="text-xs text-slate-500 truncate">{c.issuer}</p>
                        {c.date && <p className="text-[10px] text-slate-400 mt-0.5">{new Date(c.date).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCert(c._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Cert Form */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Add Certification</p>
              <form onSubmit={handleAddCert} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Certification Title"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-xs transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Issuer (e.g. AWS)"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-xs transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type="date"
                      value={certForm.date}
                      onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                      className="block w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-xs transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 btn-shimmer text-white rounded-xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-60 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
