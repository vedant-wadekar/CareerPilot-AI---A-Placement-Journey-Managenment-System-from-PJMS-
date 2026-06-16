import React, { useEffect, useState } from 'react';
import { student } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  FileText, UserCheck, Calendar, Clock,
  TrendingUp, AlertCircle, Building, CheckCircle,
  XCircle, AlertTriangle, Sparkles, Activity, Cpu, Network
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
      <div className="space-y-3">
        <div className="skeleton h-3 w-28 rounded-md" />
        <div className="skeleton h-8 w-16 rounded-lg" />
      </div>
      <div className="skeleton h-14 w-14 rounded-2xl" />
    </div>
  );
}

export default function StudentDashboard() {
  const { refreshProfile } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await student.getDashboardStats();
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    refreshProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 animate-scale-in shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  const chartData = {
    labels: ['Applied', 'Shortlisted', 'Interviewing', 'Placed', 'Rejected'],
    datasets: [{
      data: [
        stats?.totalApplications - stats?.shortlistedCount - stats?.interviewingCount - stats?.placedCount - stats?.rejectedCount,
        stats?.shortlistedCount,
        stats?.interviewingCount,
        stats?.placedCount,
        stats?.rejectedCount
      ].map(val => Math.max(0, val)),
      backgroundColor: ['#475569', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
      borderColor: isDark ? 'transparent' : '#ffffff',
      borderWidth: 2,
      hoverOffset: 4,
      borderRadius: 4,
    }]
  };

  const statusBadges = {
    Applied:     'bg-slate-500/15 text-slate-400 border border-slate-500/30',
    Shortlisted: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    Interviewing:'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Placed:      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Rejected:    'bg-red-500/15 text-red-400 border border-red-500/30'
  };

  const statusIcons = {
    Applied:     <Clock className="h-3 w-3" />,
    Shortlisted: <UserCheck className="h-3 w-3" />,
    Interviewing:<Calendar className="h-3 w-3" />,
    Placed:      <CheckCircle className="h-3 w-3" />,
    Rejected:    <XCircle className="h-3 w-3" />,
  };

  const statCards = [
    {
      label: 'Applications Synced',
      value: stats?.totalApplications ?? 0,
      iconBox: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      icon: <Activity className="h-5 w-5" />,
      delay: 'delay-100',
    },
    {
      label: 'Shortlists Active',
      value: stats?.shortlistedCount ?? 0,
      iconBox: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.15)]',
      icon: <UserCheck className="h-5 w-5" />,
      delay: 'delay-200',
    },
    {
      label: 'Interviews Pending',
      value: stats?.interviewingCount ?? 0,
      iconBox: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      icon: <Cpu className="h-5 w-5" />,
      delay: 'delay-300',
    },
    {
      label: 'Career Status',
      value: stats?.placedCount > 0 ? 'SECURED' : 'ANALYZING',
      isText: true,
      iconBox: stats?.placedCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
      icon: <Network className="h-5 w-5" />,
      delay: 'delay-400',
    },
  ];

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Placed Banner (Cyber theme) */}
      {stats?.placedCount > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-6 text-white animate-scale-in border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-slate-900/80 backdrop-blur-md">
          {/* Cyber Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          
          <div className="relative flex items-center gap-5 z-10">
            <div className="h-14 w-14 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Sparkles className="h-7 w-7 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Status Update
              </div>
              <h2 className="text-2xl font-black mb-0.5 tracking-tight neon-text-emerald">PLACEMENT SECURED</h2>
              <p className="text-emerald-100/70 text-sm font-medium">Node objective achieved. Await further network directives.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, iconBox, icon, isText, delay }) => (
          <div key={label} className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between card-hover animate-slide-up ${delay} group relative overflow-hidden`}>
            {/* Cyber accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="space-y-1.5 min-w-0 flex-1 mr-3 relative z-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{label}</p>
              <p className={`font-black text-slate-800 truncate tracking-tight ${isText ? 'text-lg neon-text-emerald' : 'text-3xl'}`}>{value}</p>
            </div>
            <div className={`p-3.5 rounded-xl shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 ${iconBox}`}>{icon}</div>
          </div>
        ))}
      </div>

      {/* Applications + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col overflow-hidden animate-slide-up delay-200 group relative">
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="px-6 py-5 border-b border-slate-100/50 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Building className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Active Nodes [Applications]</h3>
            {stats?.applications?.length > 0 && (
              <span className="ml-auto px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
                {stats.applications.length}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-x-auto">
            {stats?.applications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <AlertTriangle className="h-12 w-12 mb-3 text-slate-400/50 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                <p className="text-sm font-bold tracking-wide uppercase">No Active Connections</p>
                <p className="text-xs mt-1 font-medium">Browse network opportunities to initialize.</p>
              </div>
            ) : (
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100/50">
                    <th className="py-4 px-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entity</th>
                    <th className="py-4 px-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</th>
                    <th className="py-4 px-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value [LPA]</th>
                    <th className="py-4 px-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="py-4 px-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {stats?.applications.map((app, idx) => (
                    <tr key={app._id} className={`hover:bg-slate-500/5 transition-colors animate-fade-in group/row`} style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover/row:border-emerald-500/50 transition-colors">
                            <Building className="h-4 w-4 text-slate-400 group-hover/row:text-emerald-400 transition-colors" />
                          </div>
                          <span className="font-bold text-slate-800 text-sm tracking-wide">{app.jobId?.companyId?.companyName || 'DELETED_ENTITY'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-slate-600">{app.jobId?.title}</td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-600 font-mono">
                        {app.jobId?.companyId?.package ? `${app.jobId.companyId.package}` : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusBadges[app.status]}`}>
                          {statusIcons[app.status]}
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-500 font-mono">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col animate-slide-up delay-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-purple-500/0 via-purple-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="px-6 py-5 border-b border-slate-100/50 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Telemetry</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
            <div className="w-full max-w-[220px] aspect-square flex items-center justify-center relative">
              {/* Decorative cyber rings behind chart */}
              <div className="absolute inset-0 rounded-full border border-purple-500/20 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none shadow-[0_0_15px_rgba(168,85,247,0.1)]" />
              <div className="absolute inset-4 rounded-full border border-emerald-500/20 border-dotted animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />
              
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {stats?.totalApplications || 0}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Nodes</span>
              </div>

              {stats?.totalApplications === 0 ? (
                <div className="text-center text-sm text-slate-500 relative z-10 opacity-0">
                  {/* Hidden when 0 because center text handles it */}
                </div>
              ) : (
                <div className="relative z-20 w-full h-full p-4">
                  <Doughnut 
                    data={chartData} 
                    options={{ 
                      plugins: { legend: { display: false } }, 
                      maintainAspectRatio: true, 
                      cutout: '80%',
                      layout: { padding: 10 }
                    }} 
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full px-4">
              {[
                { color: 'bg-slate-500', shadow: 'shadow-[0_0_8px_rgba(100,116,139,0.5)]', label: 'Applied' },
                { color: 'bg-blue-500', shadow: 'shadow-[0_0_8px_rgba(59,130,246,0.5)]', label: 'Shortlisted' },
                { color: 'bg-amber-500', shadow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]', label: 'Interviewing' },
                { color: 'bg-emerald-500', shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]', label: 'Placed' },
                { color: 'bg-red-500', shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]', label: 'Rejected' },
              ].map(({ color, shadow, label }) => (
                <div key={label} className="flex items-center gap-2.5 group/item cursor-default">
                  <span className={`h-2.5 w-2.5 rounded-sm shrink-0 ${color} ${shadow} group-hover/item:scale-125 transition-transform`} />
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
