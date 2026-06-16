import React, { useEffect, useState } from 'react';
import { coordinator } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Users, Building2, Briefcase, FileText, CheckCircle, TrendingUp, DollarSign, Award, AlertCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="skeleton h-3 w-24 mb-3" />
      <div className="skeleton h-9 w-20" />
    </div>
  );
}

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await coordinator.getDashboardStats();
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch coordinator analytics.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="skeleton h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 animate-scale-in">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const totalStudents = stats?.totalStudents || 0;
  const placedCount = stats?.placedCount || 0;
  const unplacedCount = stats?.unplacedCount || 0;
  const placementRate = totalStudents > 0 ? ((placedCount / totalStudents) * 100).toFixed(1) : 0;

  const placementDoughnutData = {
    labels: ['Placed', 'Unplaced'],
    datasets: [{
      data: [placedCount, unplacedCount],
      backgroundColor: ['#10b981', '#e2e8f0'],
      borderWidth: 0,
      hoverOffset: 6,
    }]
  };

  const branches = stats?.branchStats ? Object.keys(stats.branchStats) : [];
  const totalByBranch = branches.map(b => stats.branchStats[b].total);
  const placedByBranch = branches.map(b => stats.branchStats[b].placed);

  const branchBarData = {
    labels: branches,
    datasets: [
      {
        label: 'Total Registered',
        data: totalByBranch,
        backgroundColor: 'rgba(99,102,241,0.8)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Placed',
        data: placedByBranch,
        backgroundColor: 'rgba(16,185,129,0.85)',
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const kpiCards = [
    { label: 'Placement Rate', value: `${placementRate}%`, iconBox: 'icon-box-emerald', icon: <TrendingUp className="h-5 w-5" />, delay: 'delay-100' },
    { label: 'Total Placed', value: `${placedCount}`, iconBox: 'icon-box-indigo', icon: <CheckCircle className="h-5 w-5" />, delay: 'delay-200' },
    { label: 'Avg Package', value: `${stats?.averagePackage} LPA`, iconBox: 'icon-box-amber', icon: <DollarSign className="h-5 w-5" />, delay: 'delay-300' },
    { label: 'Highest Package', value: `${stats?.maxPackage} LPA`, iconBox: 'icon-box-purple', icon: <Award className="h-5 w-5" />, delay: 'delay-400' },
  ];

  const directoryCards = [
    { label: 'Students', value: stats?.totalStudents, icon: <Users className="h-4 w-4" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Companies', value: stats?.totalCompanies, icon: <Building2 className="h-4 w-4" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Job Openings', value: stats?.totalJobs, icon: <Briefcase className="h-4 w-4" />, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Applications', value: stats?.totalApplications, icon: <FileText className="h-4 w-4" />, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  ];

  return (
    <div className="space-y-7 animate-fade-in">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map(({ label, value, iconBox, icon, delay }) => (
          <div key={label} className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between card-hover animate-slide-up ${delay}`}>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
            <div className={`p-3.5 rounded-xl ${iconBox}`}>{icon}</div>
          </div>
        ))}
      </div>

      {/* Directory Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {directoryCards.map(({ label, value, icon, color }, i) => (
          <div key={label} className={`bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3 card-hover animate-slide-up delay-${(i+1)*100}`}>
            <div className={`p-2.5 rounded-lg border ${color}`}>{icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
              <p className="text-lg font-bold text-slate-700">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 animate-slide-up delay-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-lg icon-box-indigo">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Branch-wise Recruitment Rate</h3>
          </div>
          <div className="p-6">
            <div className="w-full h-64 flex items-center justify-center">
              {branches.length === 0 ? (
                <div className="text-center text-slate-400">
                  <Building2 className="h-10 w-10 mx-auto mb-2 text-slate-200" />
                  <p className="text-sm">No branch data available</p>
                </div>
              ) : (
                <Bar
                  data={branchBarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 16, font: { size: 11 } }
                      }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
                      x: { grid: { display: false }, ticks: { font: { size: 11 } } }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Doughnut */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm animate-slide-up delay-300">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-lg icon-box-emerald">
              <CheckCircle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Placement Funnel</h3>
          </div>
          <div className="p-6 flex flex-col items-center gap-6">
            <div className="w-full max-w-[180px] aspect-square flex items-center justify-center">
              {totalStudents === 0 ? (
                <div className="text-center text-sm text-slate-400">No data</div>
              ) : (
                <Doughnut data={placementDoughnutData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: true, cutout: '68%' }} />
              )}
            </div>

            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600 font-medium">Placed</span>
                </div>
                <span className="font-bold text-slate-800">{placedCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200 shrink-0" />
                  <span className="text-slate-600 font-medium">Unplaced</span>
                </div>
                <span className="font-bold text-slate-800">{unplacedCount}</span>
              </div>
              {totalStudents > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Placement Rate</span>
                    <span className="font-bold text-emerald-600">{placementRate}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full progress-bar rounded-full" style={{ width: `${placementRate}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
