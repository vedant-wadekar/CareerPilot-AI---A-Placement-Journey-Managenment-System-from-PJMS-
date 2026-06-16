import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, ArrowRight, AlertCircle, Shield, CheckCircle, Fingerprint, Database, Network } from 'lucide-react';

export default function CoordLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginCoord } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields');
    }
    setError('');
    setLoading(true);
    try {
      await loginCoord(email, password);
      navigate('/coord/dashboard');
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const inputClass = "block w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/80 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all text-sm shadow-inner";
  const labelClass = "flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest font-mono mb-2";
  const iconClass = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors";

  return (
    <div className="min-h-screen cyber-bg flex text-slate-300 font-sans">
      {/* Left: Cyber Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-purple-500/20 shadow-[5px_0_30px_rgba(168,85,247,0.1)]">
        {/* Holographic grid and glowing orbs */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/4 -left-16 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        {/* Brand Header */}
        <div className="animate-fade-in flex items-center gap-4 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-purple-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-xl"></div>
            <div className="h-12 w-12 relative rounded-xl bg-slate-900 border border-purple-500/50 flex items-center justify-center">
              <ShieldAlert className="h-7 w-7 text-purple-400" />
            </div>
          </div>
          <span className="text-xl font-black text-white tracking-widest neon-text-purple">CareerPilot AI Admin<span className="text-purple-500 text-3xl leading-none">.</span></span>
        </div>

        {/* Hero Content */}
        <div className="space-y-8 animate-slide-up relative z-10 mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Shield className="h-4 w-4" />
            <span>Master Control System</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-black leading-tight text-white tracking-tight">
            Override
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Network Grid</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
            Authorized personnel only. Monitor student nodes, manage corporate entities, and orchestrate placement algorithms.
          </p>

          {/* Cyber Stats */}
          <div className="space-y-4 pt-8">
            {[
              { icon: Network, label: 'Real-time Matrix Monitoring' },
              { icon: Database, label: 'Entity Data Management' },
              { icon: Shield, label: 'Security Override Privileges' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={label} className={`flex items-center gap-4 text-slate-300 animate-slide-in-left delay-${(i+1)*100}`}>
                <div className="h-8 w-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  <Icon className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-sm font-bold tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 text-xs text-slate-500 animate-fade-in delay-500 font-mono tracking-widest uppercase relative z-10">
          <Fingerprint className="h-4 w-4 text-purple-500/50" />
          <span>System v2.0.4 // Master Control Node</span>
        </div>
      </div>

      {/* Right: Authentication Interface */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 relative">
        <div className="w-full max-w-md mx-auto relative z-10">
          
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="h-10 w-10 relative rounded-xl bg-slate-900 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <ShieldAlert className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xl font-black text-white tracking-widest neon-text-purple">CareerPilot AI Admin</span>
          </div>

          <div className="animate-slide-up bg-slate-900/60 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-xl shadow-2xl relative">
            {/* Cyber accent corner */}
            <div className="absolute -top-[1px] -left-[1px] w-8 h-8 border-t-2 border-l-2 border-purple-500 rounded-tl-3xl opacity-70"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 border-b-2 border-r-2 border-purple-500 rounded-br-3xl opacity-70"></div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Authorization</h2>
              <p className="text-sm text-purple-400/80 font-mono">Level 5 Clearance Required</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 flex items-start gap-3 text-sm text-red-300 animate-scale-in shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="coord-email" className={labelClass}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                  Admin ID [Email]
                </label>
                <div className="relative group">
                  <div className={iconClass}><Mail className="h-5 w-5" /></div>
                  <input
                    id="coord-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="admin@mainframe.gov"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="coord-password" className={labelClass}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-75"></span>
                  Override Code [Password]
                </label>
                <div className="relative group">
                  <div className={iconClass}><Lock className="h-5 w-5" /></div>
                  <input
                    id="coord-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-xl text-sm font-bold text-white cyber-button-purple focus:outline-none mt-4 uppercase tracking-widest"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Command</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-8 bg-slate-700"></div>
                <p className="text-xs text-slate-500 font-mono uppercase">Standard Access</p>
                <div className="h-[1px] w-8 bg-slate-700"></div>
              </div>
              <p className="text-sm">
                <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                  Return to Student Portal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
