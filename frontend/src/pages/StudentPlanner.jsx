import React, { useState, useEffect, useMemo } from 'react';
import { student } from '../services/api';
import {
  ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle2,
  Circle, Calendar, Target, Zap, BookOpen, Users, Flag,
  Clock, Flame, Star, TrendingUp, AlertTriangle, Sparkles,
  Filter, X, Edit3, Check
} from 'lucide-react';

/* ──────────────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'interview', label: 'Interview Prep', icon: Users,    color: 'bg-blue-100 text-blue-700 border-blue-200',   dot: 'bg-blue-500' },
  { id: 'deadline',  label: 'Deadline',       icon: Flag,     color: 'bg-red-100 text-red-700 border-red-200',      dot: 'bg-red-500' },
  { id: 'study',     label: 'Study',          icon: BookOpen, color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  { id: 'goal',      label: 'Personal Goal',  icon: Target,   color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  { id: 'drive',     label: 'Drive Alert',    icon: Zap,      color: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-500' },
];

const PRIORITIES = [
  { id: 'high',   label: 'High',   color: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
  { id: 'medium', label: 'Medium', color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
  { id: 'low',    label: 'Low',    color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const PRI_MAP = Object.fromEntries(PRIORITIES.map(p => [p.id, p]));

const todayISO = () => new Date().toISOString().slice(0, 10);

/* ──────────────────────────────────────────────
   STORAGE HELPERS
   ────────────────────────────────────────────── */
const loadTasks = () => {
  try { return JSON.parse(localStorage.getItem('pjms-planner-tasks') || '[]'); }
  catch { return []; }
};
const saveTasks = tasks => localStorage.setItem('pjms-planner-tasks', JSON.stringify(tasks));

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
export default function StudentPlanner() {
  const [tasks, setTasks]       = useState(loadTasks);
  const [opportunities, setOpp] = useState([]);
  const [now, setNow]           = useState(new Date());
  const [selectedDate, setSelDate] = useState(todayISO());
  const [filterCat, setFilterCat] = useState('all');
  const [filterDone, setFilterDone] = useState('all'); // 'all' | 'pending' | 'done'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'study', priority: 'medium', date: todayISO(), note: '' });
  const [showCalendar, setShowCalendar] = useState(true);

  /* Fetch opportunities for drive deadline tasks */
  useEffect(() => {
    student.getOpportunities().then(r => setOpp(r.data)).catch(() => {});
  }, []);

  /* Persist whenever tasks change */
  useEffect(() => { saveTasks(tasks); }, [tasks]);

  /* ── Calendar helpers ── */
  const year  = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calCells = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, [tasks]);

  /* ── Stats ── */
  const today = todayISO();
  const todayTasks   = tasks.filter(t => t.date === today);
  const totalDone    = tasks.filter(t => t.done).length;
  const pendingToday = todayTasks.filter(t => !t.done).length;
  const streak       = calcStreak(tasks);

  /* ── Upcoming 7 days ── */
  const upcoming = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days.flatMap(d => (tasksByDate[d] || []).map(t => ({ ...t, _day: d })))
               .filter(t => !t.done)
               .sort((a, b) => a.date.localeCompare(b.date))
               .slice(0, 8);
  }, [tasks, tasksByDate]);

  /* ── Filtered list for selected date or all ── */
  const displayedTasks = useMemo(() => {
    let list = selectedDate ? (tasksByDate[selectedDate] || []) : tasks;
    if (filterCat !== 'all') list = list.filter(t => t.category === filterCat);
    if (filterDone === 'pending') list = list.filter(t => !t.done);
    if (filterDone === 'done')    list = list.filter(t => t.done);
    return [...list].sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  }, [tasks, tasksByDate, selectedDate, filterCat, filterDone]);

  /* ── Drive deadlines auto-import ── */
  useEffect(() => {
    if (!opportunities.length) return;
    const existing = tasks.map(t => t._driveId).filter(Boolean);
    const toAdd = opportunities
      .filter(o => !existing.includes(o._id))
      .map(o => ({
        id: `drive-${o._id}`,
        _driveId: o._id,
        title: `Apply: ${o.title} @ ${o.companyId?.companyName}`,
        category: 'drive',
        priority: 'high',
        date: o.deadline ? o.deadline.slice(0, 10) : todayISO(),
        note: `Package: ${o.companyId?.package} LPA`,
        done: false,
        createdAt: new Date().toISOString(),
      }));
    if (toAdd.length) setTasks(prev => [...prev, ...toAdd]);
  }, [opportunities]);

  /* ── Handlers ── */
  const handleAddOrEdit = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      setTasks(prev => prev.map(t => t.id === editingId ? { ...t, ...form } : t));
      setEditingId(null);
    } else {
      setTasks(prev => [...prev, {
        id: `task-${Date.now()}`,
        ...form,
        done: false,
        createdAt: new Date().toISOString(),
      }]);
    }
    setForm({ title: '', category: 'study', priority: 'medium', date: selectedDate || todayISO(), note: '' });
    setShowAddForm(false);
  };

  const toggleDone = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = id => setTasks(prev => prev.filter(t => t.id !== id));

  const startEdit = t => {
    setForm({ title: t.title, category: t.category, priority: t.priority, date: t.date, note: t.note || '' });
    setEditingId(t.id);
    setShowAddForm(true);
  };

  const prevMonth = () => setNow(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setNow(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const dateLabel = (iso) => {
    if (iso === todayISO()) return 'Today';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  };

  /* ── Compact task card ── */
  const TaskCard = ({ task, idx }) => {
    const cat = CAT_MAP[task.category] || CAT_MAP.study;
    const pri = PRI_MAP[task.priority] || PRI_MAP.medium;
    const Icon = cat.icon;
    return (
      <div className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all animate-task-slide card-hover ${task.done ? 'opacity-50' : ''}`}
        style={{ animationDelay: `${idx * 40}ms` }}>
        {/* done toggle */}
        <button onClick={() => toggleDone(task.id)} className="mt-0.5 shrink-0 transition-transform hover:scale-110">
          {task.done
            ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            : <Circle className="h-5 w-5 text-slate-300 hover:text-emerald-400 transition-colors" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
          {task.note && <p className="text-xs text-slate-400 mt-0.5 truncate">{task.note}</p>}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${cat.color}`}>
              <Icon className="h-2.5 w-2.5" />{cat.label}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pri.bg} ${pri.color}`}>{pri.label}</span>
            {task.date !== selectedDate && <span className="text-[10px] text-slate-400">{dateLabel(task.date)}</span>}
          </div>
        </div>
        {/* actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => startEdit(task)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">

      {/* ── Top Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Today's Tasks", value: todayTasks.length, sub: `${pendingToday} pending`, icon: <Calendar className="h-5 w-5" />, box: 'icon-box-blue' },
          { label: 'Completed',     value: totalDone,          sub: 'all time',              icon: <CheckCircle2 className="h-5 w-5" />, box: 'icon-box-emerald' },
          { label: 'Day Streak',    value: `${streak}🔥`,       sub: 'keep it up!',           icon: <Flame className="h-5 w-5" />,       box: 'icon-box-amber' },
          { label: 'Drive Alerts',  value: tasks.filter(t=>t.category==='drive'&&!t.done).length, sub: 'upcoming deadlines', icon: <Zap className="h-5 w-5" />, box: 'icon-box-rose' },
        ].map(({ label, value, sub, icon, box }, i) => (
          <div key={label} className={`bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between card-hover animate-slide-up delay-${(i+1)*100}`}>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${box}`}>{icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Calendar + Upcoming ── */}
        <div className="space-y-5">

          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up delay-100">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg icon-box-emerald"><Calendar className="h-4 w-4" /></div>
                <h3 className="text-sm font-bold text-slate-800">{MONTHS[month]} {year}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setNow(new Date())} className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">Today</button>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="p-4">
              {/* day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
                ))}
              </div>
              {/* cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {calCells.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />;
                  const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                  const isToday   = iso === todayISO();
                  const isSelected = iso === selectedDate;
                  const hasTasks  = (tasksByDate[iso]||[]).length > 0;
                  const hasPending = (tasksByDate[iso]||[]).some(t=>!t.done);

                  return (
                    <div key={iso} onClick={() => setSelDate(iso === selectedDate ? null : iso)}
                      className={`planner-day relative flex flex-col items-center justify-center rounded-lg text-xs font-semibold
                        ${isSelected ? 'bg-emerald-500 text-white shadow-lg' : isToday ? 'bg-emerald-50 text-emerald-700 today' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <span className="leading-none py-1.5">{day}</span>
                      {hasTasks && !isSelected && (
                        <span className={`w-1.5 h-1.5 rounded-full absolute bottom-0.5 ${hasPending ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up delay-200">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg icon-box-amber"><TrendingUp className="h-4 w-4" /></div>
              <h3 className="text-sm font-bold text-slate-800">Next 7 Days</h3>
            </div>
            <div className="divide-y divide-slate-50 max-h-56 overflow-y-auto">
              {upcoming.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Star className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                  <p className="text-xs">No pending tasks ahead</p>
                </div>
              ) : upcoming.map(t => {
                const cat = CAT_MAP[t.category] || CAT_MAP.study;
                const Icon = cat.icon;
                return (
                  <div key={t.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => setSelDate(t.date)}>
                    <div className={`p-1.5 rounded-lg shrink-0 ${cat.color.split(' ').slice(0,2).join(' ')}`}><Icon className="h-3.5 w-3.5" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{t.title}</p>
                      <p className="text-[10px] text-slate-400">{dateLabel(t.date)}</p>
                    </div>
                    <span className={`text-[10px] font-bold ${PRI_MAP[t.priority]?.color}`}>{t.priority}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Task Panel ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header + filters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 animate-slide-up delay-100">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  {selectedDate ? `Tasks for ${dateLabel(selectedDate)}` : 'All Tasks'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{displayedTasks.length} task{displayedTasks.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedDate && (
                  <button onClick={() => setSelDate(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X className="h-4 w-4" /></button>
                )}
                <button onClick={() => { setShowAddForm(true); setEditingId(null); setForm({ title:'', category:'study', priority:'medium', date: selectedDate || todayISO(), note:'' }); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 btn-shimmer text-white rounded-xl text-xs font-bold shadow-sm">
                  <Plus className="h-3.5 w-3.5" /> Add Task
                </button>
              </div>
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-2">
              {/* Category filter */}
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={() => setFilterCat('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${filterCat==='all' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  All
                </button>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setFilterCat(filterCat===c.id ? 'all' : c.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${filterCat===c.id ? c.color : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />{c.label}
                  </button>
                ))}
              </div>
              {/* Done filter */}
              <div className="flex gap-1.5 ml-auto">
                {['all','pending','done'].map(f => (
                  <button key={f} onClick={() => setFilterDone(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border capitalize transition-all ${filterDone===f ? 'bg-slate-700 text-white border-slate-700' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add / Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg icon-box-emerald"><Plus className="h-4 w-4" /></div>
                  <h3 className="text-sm font-bold text-slate-800">{editingId ? 'Edit Task' : 'New Task'}</h3>
                </div>
                <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="What do you need to do?" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAddOrEdit()}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-sm transition-all" />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all">
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                    <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all">
                      {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all" />
                  </div>
                </div>
                <input type="text" placeholder="Optional note or description..." value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 text-xs transition-all" />
                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={() => { setShowAddForm(false); setEditingId(null); }}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                  <button onClick={handleAddOrEdit}
                    className="px-5 py-2 btn-shimmer text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />{editingId ? 'Save Changes' : 'Add Task'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-slide-up delay-200">
            {displayedTasks.length === 0 ? (
              <div className="py-16 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                <p className="text-slate-500 font-semibold text-sm">No tasks here</p>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedDate ? `Nothing planned for ${dateLabel(selectedDate)}` : 'Add your first task to get started!'}
                </p>
                <button onClick={() => { setShowAddForm(true); setEditingId(null); setForm({ title:'', category:'study', priority:'medium', date: selectedDate || todayISO(), note:'' }); }}
                  className="mt-4 px-5 py-2 btn-shimmer text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Plan Something
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 p-3 space-y-1.5">
                {displayedTasks.map((t, i) => <TaskCard key={t.id} task={t} idx={i} />)}
              </div>
            )}
          </div>

          {/* Motivational Quote */}
          <div className="relative overflow-hidden rounded-2xl p-5 text-white animate-slide-up delay-300"
            style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #0d9488 100%)' }}>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-4 bottom-0 h-20 w-20 rounded-full bg-white/05 pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider mb-0.5">Daily Motivation</p>
                <p className="text-sm font-semibold leading-relaxed">{getMotivationalQuote(totalDone)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper: calculate streak (consecutive days with completed tasks) ── */
function calcStreak(tasks) {
  const doneDates = new Set(tasks.filter(t => t.done).map(t => t.date));
  let streak = 0;
  const check = new Date();
  while (true) {
    const iso = check.toISOString().slice(0, 10);
    if (doneDates.has(iso)) { streak++; check.setDate(check.getDate() - 1); }
    else break;
  }
  return streak;
}

/* ── Helper: motivational quotes based on progress ── */
function getMotivationalQuote(completedCount) {
  const quotes = [
    "Every expert was once a beginner. Start today!",
    "Your placement journey is a marathon, not a sprint.",
    `You've completed ${completedCount} tasks — incredible momentum!`,
    "Consistent daily effort compounds into extraordinary results.",
    "The best time to prepare for your interview was yesterday. The next best time is now.",
    "Small progress is still progress. Keep going!",
    "Your dream company is one prepared task closer today.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
