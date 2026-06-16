import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, Mail, Lock, BookOpen, Calendar, Star, AlertCircle, ArrowRight, Sparkles, Cpu, Fingerprint, Users, TrendingUp, Shield } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'Computer Science',
    cgpa: '',
    graduationYear: new Date().getFullYear()
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, branch, cgpa, graduationYear } = formData;
    if (!name || !email || !password || !cgpa || !graduationYear) {
      return setError('Please fill in all required fields');
    }
    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      return setError('CGPA must be a valid number between 0 and 10');
    }
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, branch, cgpa: parsedCgpa, graduationYear: parseInt(graduationYear) });
      navigate('/dashboard');
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const inputClass = "block w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/80 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all text-sm shadow-inner";
  const labelClass = "flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest font-mono mb-2";
  const iconClass = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors";

  return (
    <div className="min-h-screen cyber-bg flex text-slate-300 font-sans">
      {/* Left: Cyber Hero Panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden border-r border-emerald-500/20 shadow-[5px_0_30px_rgba(16,185,129,0.1)]">
        {/* Holographic grid and glowing orbs */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/4 -left-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        {/* Brand Header */}
        <div className="animate-fade-in flex items-center gap-4 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-xl"></div>
            <div className="h-12 w-12 relative rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center">
              <Cpu className="h-7 w-7 text-emerald-400" />
            </div>
          </div>
          <span className="text-2xl font-black text-white tracking-widest neon-text-emerald">CareerPilot AI<span className="text-emerald-500 text-3xl leading-none">.</span></span>
        </div>

        {/* Hero Content */}
        <div className="space-y-8 animate-slide-up relative z-10 mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Sparkles className="h-4 w-4" />
            <span>Join 1.2K+ Users</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight text-white tracking-tight">
            Establish
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">Node Profile</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm font-medium">
            Create your digital identity to interface with the placement network and access advanced career algorithms.
          </p>

          {/* Progress steps */}
          <div className="space-y-5 pt-4">
            {[
              { step: '01', title: 'Initialize Identity', desc: 'Input core academic parameters' },
              { step: '02', title: 'Upload Data', desc: 'Sync your resume & skill matrix' },
              { step: '03', title: 'Deploy', desc: 'Execute applications seamlessly' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className={`flex items-start gap-4 animate-slide-in-left delay-${(i+1)*100}`}>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm font-black shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">{title}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 text-xs text-slate-500 animate-fade-in delay-500 font-mono tracking-widest uppercase relative z-10">
          <Fingerprint className="h-4 w-4 text-emerald-500/50" />
          <span>System v2.0.4 // Registration Node</span>
        </div>
      </div>

      {/* Right: Authentication Interface */}
      <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 lg:px-16 relative overflow-y-auto">
        <div className="w-full max-w-lg mx-auto relative z-10">
          
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-10 w-10 relative rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Cpu className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xl font-black text-white tracking-widest neon-text-emerald">CareerPilot AI</span>
          </div>

          <div className="animate-slide-up bg-slate-900/60 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-xl shadow-2xl relative my-6">
            {/* Cyber accent corner */}
            <div className="absolute -top-[1px] -left-[1px] w-8 h-8 border-t-2 border-l-2 border-emerald-500 rounded-tl-3xl opacity-70"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 border-b-2 border-r-2 border-emerald-500 rounded-br-3xl opacity-70"></div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create Identity</h2>
              <p className="text-sm text-emerald-400/80 font-mono">Establish new user clearance</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 flex items-start gap-3 text-sm text-red-300 animate-scale-in shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="reg-name" className={labelClass}>
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Designation [Name]
                  </label>
                  <div className="relative group">
                    <div className={iconClass}><User className="h-4.5 w-4.5" /></div>
                    <input id="reg-name" name="name" type="text" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="reg-email" className={labelClass}>
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Comms [Email]
                  </label>
                  <div className="relative group">
                    <div className={iconClass}><Mail className="h-4.5 w-4.5" /></div>
                    <input id="reg-email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@domain.edu" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="reg-password" className={labelClass}>
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> Security Key
                </label>
                <div className="relative group">
                  <div className={iconClass}><Lock className="h-4.5 w-4.5" /></div>
                  <input id="reg-password" name="password" type="password" required value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••••••" />
                </div>
              </div>

              {/* Branch + CGPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="reg-branch" className={labelClass}>
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Protocol [Branch]
                  </label>
                  <div className="relative group">
                    <div className={iconClass}><BookOpen className="h-4.5 w-4.5" /></div>
                    <select id="reg-branch" name="branch" value={formData.branch} onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer`}>
                      {branches.map((b) => (
                        <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="reg-cgpa" className={labelClass}>
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Metric [CGPA]
                  </label>
                  <div className="relative group">
                    <div className={iconClass}><Star className="h-4.5 w-4.5" /></div>
                    <input id="reg-cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" required value={formData.cgpa} onChange={handleChange} className={inputClass} placeholder="8.50" />
                  </div>
                </div>
              </div>

              {/* Graduation Year */}
              <div className="space-y-2">
                <label htmlFor="reg-year" className={labelClass}>
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Sync Year [Graduation]
                </label>
                <div className="relative group">
                  <div className={iconClass}><Calendar className="h-4.5 w-4.5" /></div>
                  <input id="reg-year" name="graduationYear" type="number" required value={formData.graduationYear} onChange={handleChange} className={inputClass} placeholder="2026" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-xl text-sm font-bold text-white cyber-button focus:outline-none mt-6 uppercase tracking-widest"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Identity</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 text-center space-y-4">
              <p className="text-sm text-slate-400 font-medium">
                Identity exists?{' '}
                <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                  Initiate Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
