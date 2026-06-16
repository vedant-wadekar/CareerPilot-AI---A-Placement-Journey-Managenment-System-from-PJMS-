import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle, Sparkles, TrendingUp, Users, Award, Fingerprint, Shield, Cpu } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields');
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cyber-bg flex text-slate-300 font-sans">
      {/* Left: Cyber Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-emerald-500/20 shadow-[5px_0_30px_rgba(16,185,129,0.1)]">
        {/* Holographic grid and glowing orbs */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/4 -left-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

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
            <span>Next-Gen Career Portal</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-black leading-tight text-white tracking-tight">
            Initiate
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">Career Sequence</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
            Access the mainframe to track applications, analyze skill gaps, and secure your future with AI-driven placement insights.
          </p>

          {/* Cyber Stats */}
          <div className="grid grid-cols-3 gap-5 pt-8">
            {[
              { icon: Users, label: 'Active Users', value: '1.2K+' },
              { icon: TrendingUp, label: 'Success Rate', value: '85%' },
              { icon: Shield, label: 'Secure Orgs', value: '50+' },
            ].map(({ icon: Icon, label, value }, i) => (
              <div key={label} className={`relative group p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md animate-slide-up delay-${(i + 1) * 100} hover:border-emerald-400/50 transition-colors shadow-lg`}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="h-6 w-6 text-emerald-400 mb-3 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                <p className="text-2xl font-black text-white tracking-tight">{value}</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 text-xs text-slate-500 animate-fade-in delay-500 font-mono tracking-widest uppercase relative z-10">
          <Fingerprint className="h-4 w-4 text-emerald-500/50" />
          <span>System v2.0.4 // Secure Connection</span>
        </div>
      </div>

      {/* Right: Authentication Interface */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 relative">
        <div className="w-full max-w-md mx-auto relative z-10">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="h-10 w-10 relative rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Cpu className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xl font-black text-white tracking-widest neon-text-emerald">CareerPilot AI</span>
          </div>

          <div className="animate-slide-up bg-slate-900/60 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-xl shadow-2xl relative">
            {/* Cyber accent corner */}
            <div className="absolute -top-[1px] -left-[1px] w-8 h-8 border-t-2 border-l-2 border-emerald-500 rounded-tl-3xl opacity-70"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 border-b-2 border-r-2 border-emerald-500 rounded-br-3xl opacity-70"></div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Access Portal</h2>
              <p className="text-sm text-emerald-400/80 font-mono">Authenticate to proceed</p>
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
                <label htmlFor="login-email" className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Identity [Email]
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/80 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all text-sm shadow-inner"
                    placeholder="student@mainframe.edu"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></span>
                  Security Key [Password]
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/80 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all text-sm shadow-inner"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-xl text-sm font-bold text-white cyber-button focus:outline-none mt-4 uppercase tracking-widest"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Connection</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 text-center space-y-4">
              <p className="text-sm text-slate-400 font-medium">
                Unregister Student?{' '}
                <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                  Establish Profile
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-8 bg-slate-700"></div>
                <p className="text-xs text-slate-500 font-mono uppercase">Admin Override</p>
                <div className="h-[1px] w-8 bg-slate-700"></div>
              </div>
              <p className="text-sm">
                <Link to="/coordinator-login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  Coordinator Access
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
