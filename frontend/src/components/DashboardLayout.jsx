import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, User, GraduationCap, Briefcase, Wand2,
  Building2, FileSpreadsheet, Users, CheckSquare, LogOut,
  Menu, X, ChevronRight, Sun, Moon, Bell, Search,
  TrendingUp, BookOpen, Zap, Map
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCoord = user?.role === 'coordinator';

  const studentNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, description: 'Overview & Stats' },
    { name: 'Profile', path: '/profile', icon: User, description: 'Manage your info' },
    { name: 'Skills & Certs', path: '/skills', icon: GraduationCap, description: 'Track your skills' },
    { name: 'Opportunities', path: '/opportunities', icon: Briefcase, description: 'Browse job listings' },
    { name: 'AI Resume Space', path: '/ai-space', icon: Wand2, description: 'AI-powered tools', badge: 'AI' },
    { name: 'Tech Roadmap', path: '/roadmap', icon: Map, description: 'AI Custom Roadmaps', badge: 'NEW' },
  ];

  const coordinatorNav = [
    { name: 'Analytics', path: '/coord/dashboard', icon: LayoutDashboard, description: 'Placement overview' },
    { name: 'Companies', path: '/coord/companies', icon: Building2, description: 'Manage companies' },
    { name: 'Job Postings', path: '/coord/jobs', icon: Briefcase, description: 'Post & manage jobs' },
    { name: 'Students', path: '/coord/students', icon: Users, description: 'Student directory' },
    { name: 'Applications', path: '/coord/applications', icon: CheckSquare, description: 'Review applications' },
    { name: 'Reports', path: '/coord/reports', icon: FileSpreadsheet, description: 'Placement reports' },
  ];

  const navigation = isCoord ? coordinatorNav : studentNav;
  const accentGreen = 'emerald';
  const accentPurple = 'violet';
  const accent = isCoord ? accentPurple : accentGreen;

  const activeStyle = isCoord
    ? 'bg-violet-500/15 text-violet-400 border-r-2 border-violet-400'
    : 'bg-emerald-500/15 text-emerald-400 border-r-2 border-emerald-400';

  const avatarGrad = isCoord
    ? 'from-violet-500 to-purple-600'
    : 'from-emerald-500 to-teal-600';

  const accentRing = isCoord ? 'ring-violet-500/40' : 'ring-emerald-500/40';

  const greetingHour = currentTime.getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingEmoji = greetingHour < 12 ? '☀️' : greetingHour < 17 ? '👋' : '🌙';

  const notifications = isCoord
    ? [
        { id: 1, text: 'New student application received', time: '2m ago', color: 'bg-blue-500' },
        { id: 2, text: 'Company "TechCorp" drive scheduled', time: '1h ago', color: 'bg-emerald-500' },
        { id: 3, text: 'Monthly placement report ready', time: '3h ago', color: 'bg-amber-500' },
      ]
    : [
        { id: 1, text: 'New job opportunity posted!', time: '5m ago', color: 'bg-emerald-500' },
        { id: 2, text: 'Update your profile for better matches', time: '1h ago', color: 'bg-blue-500' },
        { id: 3, text: 'Drive deadline approaching soon', time: '2h ago', color: 'bg-amber-500' },
      ];

  const currentPage = navigation.find(item => item.path === location.pathname);

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#080e1a]' : 'bg-slate-50'} transition-colors duration-300`}>

      {/* ─── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col
        transition-all duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
        ${isDark
          ? 'bg-gradient-to-b from-[#0a1120] to-[#0f172a] border-r border-slate-800/60'
          : 'bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/40'}
      `}>

        {/* Brand Header */}
        <div className={`h-16 flex items-center shrink-0 border-b border-white/5 ${sidebarCollapsed ? 'justify-center px-0' : 'px-4 justify-between'}`}>
          <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className={`
              h-9 w-9 shrink-0 rounded-xl flex items-center justify-center
              ${isCoord ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-emerald-500/20 border border-emerald-500/30'}
            `}>
              <GraduationCap className={`h-5 w-5 ${isCoord ? 'text-violet-400' : 'text-emerald-400'}`} />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-white tracking-wide leading-none">CareerPilot AI</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isCoord ? 'bg-violet-400' : 'bg-emerald-400'}`} />
                  <span className="text-[10px] text-slate-500 font-medium">Live</span>
                </div>
              </div>
            )}
          </div>
          {/* Collapse toggle — desktop only */}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex h-6 w-6 rounded-md items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="hidden lg:flex absolute -right-3 top-5 h-6 w-6 rounded-full bg-slate-700 border border-slate-600 items-center justify-center text-slate-300 hover:text-white shadow-lg"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
          {!sidebarCollapsed && (
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 py-1.5 mb-1">
              {isCoord ? 'Coordinator Panel' : 'Student Panel'}
            </p>
          )}
          {navigation.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                title={sidebarCollapsed ? item.name : ''}
                style={{ animationDelay: `${idx * 40}ms` }}
                className={`
                  flex items-center gap-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group animate-fade-in relative
                  ${sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                  ${isActive ? activeStyle : 'text-slate-400 hover:bg-white/6 hover:text-white'}
                `}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? '' : ''}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                        isCoord ? 'bg-violet-500/20 text-violet-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>{item.badge}</span>
                    )}
                  </>
                )}
                {/* Collapsed tooltip */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-slate-700 z-50">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Card */}
        <div className={`shrink-0 border-t border-white/5 ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-3 p-2 rounded-xl mb-1">
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ${accentRing}`}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
              >
                <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-xs font-bold`}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button onClick={handleLogout} className="flex h-8 w-8 rounded-xl items-center justify-center text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ─── TOP HEADER ─── */}
        <header className={`
          h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30
          border-b transition-all duration-300
          ${isDark
            ? 'bg-[#0a1120]/95 backdrop-blur-xl border-slate-800/60'
            : 'bg-white/95 backdrop-blur-xl border-slate-200/80'}
          shadow-sm
        `}>
          {/* Left: Mobile toggle + Page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden flex h-9 w-9 rounded-xl items-center justify-center transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-md flex items-center justify-center ${isCoord ? 'bg-violet-500/15' : 'bg-emerald-500/15'}`}>
                {currentPage && <currentPage.icon className={`h-3 w-3 ${isCoord ? 'text-violet-500' : 'text-emerald-500'}`} />}
              </div>
              <div>
                <h1 className={`text-sm font-bold leading-none ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {currentPage?.name || 'Dashboard'}
                </h1>
                <p className={`text-[10px] leading-tight mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {currentPage?.description || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Greeting (desktop) */}
            <div className={`hidden md:block text-right mr-1`}>
              <p className={`text-xs font-semibold leading-none ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {greeting}, {user?.name?.split(' ')[0]} {greetingEmoji}
              </p>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative flex h-9 w-9 rounded-xl items-center justify-center transition-all ${
                  isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-[#0a1120]" />
              </button>
              {/* Dropdown */}
              {notifOpen && (
                <div className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-scale-in ${
                  isDark ? 'bg-[#0f1a2e] border-slate-700/60' : 'bg-white border-slate-200'
                }`}>
                  <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Notifications</p>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/15 text-red-500">{notifications.length} new</span>
                  </div>
                  <div className="divide-y divide-slate-100/10">
                    {notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium leading-snug ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{n.text}</p>
                          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`px-4 py-2.5 border-t ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                    <button className={`text-xs font-semibold w-full text-center ${isCoord ? 'text-violet-400' : 'text-emerald-500'}`}>View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`
                relative flex h-9 w-16 rounded-full items-center p-1 transition-all duration-300 focus:outline-none focus:ring-2 ${accentRing}
                ${isDark ? 'bg-slate-700 border border-slate-600' : 'bg-slate-200 border border-slate-300'}
              `}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className={`
                h-7 w-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300
                ${isDark
                  ? 'translate-x-7 bg-slate-900 text-amber-300'
                  : 'translate-x-0 bg-white text-amber-500'}
              `}>
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </span>
            </button>

            {/* Avatar */}
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ${accentRing} cursor-pointer`}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* ─── PAGE CONTENT ─── */}
        <main className={`flex-1 overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-[#080e1a]' : 'bg-slate-50/80'}`}>
          {/* Subtle top accent bar */}
          <div className={`h-0.5 w-full ${isCoord ? 'bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'}`} />
          <div className="p-5 lg:p-7">
            {children}
          </div>
        </main>
      </div>

      {/* Close notif on outside click */}
      {notifOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
      )}
    </div>
  );
}
