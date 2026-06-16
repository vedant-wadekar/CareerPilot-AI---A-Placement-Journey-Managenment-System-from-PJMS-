import React, { useState, useEffect } from 'react';
import { customRoadmap } from '../services/api';
import { 
  Network, Cpu, Rocket, CheckCircle2, Circle, Clock,
  Map, Sparkles, AlertTriangle, Layers, BookOpen, LayoutTemplate,
  Award, RefreshCw, ChevronDown, ChevronRight, Activity
} from 'lucide-react';

const predefinedInterests = [
  "Java Full Stack Development", "MERN Stack Development", "Software Testing", 
  "AWS Cloud", "DevOps", "Cyber Security", "Artificial Intelligence", 
  "Machine Learning", "Data Science", "UI/UX Design", "Product Management", 
  "Android Development", "Blockchain", "IoT", "Data Analytics"
];

export default function RoadmapGenerator() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [expandedPhase, setExpandedPhase] = useState(0);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await customRoadmap.getRoadmap();
      setRoadmap(res.data);
      setSelectedInterests(res.data.interests || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load roadmap.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const generateRoadmap = async () => {
    if (selectedInterests.length === 0) {
      setError('Please select at least one career path to generate a roadmap.');
      return;
    }
    
    setError('');
    setGenerating(true);
    try {
      const res = await customRoadmap.generateRoadmap(selectedInterests);
      setRoadmap(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to synthesize roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const updateTopicStatus = async (phaseId, topicId, status) => {
    try {
      const updatedRoadmap = { ...roadmap };
      const phase = updatedRoadmap.phases.find(p => p._id === phaseId);
      const topic = phase.topics.find(t => t._id === topicId);
      topic.status = status;
      setRoadmap(updatedRoadmap);

      const res = await customRoadmap.updateProgress(phaseId, topicId, status);
      setRoadmap(res.data);
    } catch (err) {
      setError('Failed to update progress.');
      fetchRoadmap();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-indigo-500">
        <Sparkles className="h-10 w-10 animate-pulse mb-4" />
        <p className="text-sm font-bold tracking-widest uppercase animate-pulse">Initializing Interface...</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    if (status === 'In Progress') return <Activity className="h-5 w-5 text-amber-500 animate-pulse" />;
    return <Circle className="h-5 w-5 text-slate-400" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'In Progress') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Map className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1 flex items-center gap-3">
                Career Roadmap
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest border border-indigo-100">AI Powered</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Tailored learning sequences, projects, and certifications based on your profile and chosen career paths.
              </p>
            </div>
          </div>

          {roadmap && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 min-w-[250px]">
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Overall Completion</span>
                <span className="text-2xl font-black text-slate-800">{roadmap.overallProgress}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000 ease-out"
                  style={{ width: `${roadmap.overallProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-600">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* SETUP PHASE (No Roadmap) */}
      {!roadmap && (
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200/80 shadow-sm relative z-10 animate-slide-up">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Your Target Domains</h2>
            <p className="text-slate-500 text-sm">Choose multiple career paths to synthesize a unified, optimized learning sequence.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
            {predefinedInterests.map(interest => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`
                    p-4 rounded-xl border text-sm font-bold transition-all text-left flex items-center justify-between group
                    ${isSelected 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                  `}
                >
                  <span className="truncate pr-2">{interest}</span>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 group-hover:border-slate-400 bg-white'}`}>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateRoadmap}
              disabled={generating || selectedInterests.length === 0}
              className="group relative flex justify-center items-center gap-3 py-4 px-10 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md focus:outline-none uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <>
                  <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Synthesizing Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                  <span>Generate Roadmap Sequence</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ROADMAP DASHBOARD */}
      {roadmap && !generating && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          
          {/* LEFT COLUMN: TIMELINE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interests Chips */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Network className="h-3 w-3" /> Selected Domains
                </p>
                <div className="flex flex-wrap gap-2">
                  {roadmap.interests.map((interest, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setRoadmap(null)}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Modify Parameters
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
              {roadmap.phases.map((phase, idx) => (
                <div key={phase._id || idx} className="relative z-10">
                  <div 
                    onClick={() => setExpandedPhase(expandedPhase === idx ? -1 : idx)}
                    className={`
                      ml-12 p-6 rounded-2xl border cursor-pointer transition-all duration-300 group
                      ${expandedPhase === idx 
                        ? 'bg-white border-indigo-200 shadow-md' 
                        : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'}
                    `}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-colors ${expandedPhase === idx ? 'border-indigo-500 bg-white shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'border-slate-300 bg-white group-hover:border-slate-400'}`} />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 transition-colors ${expandedPhase === idx ? 'text-indigo-600' : 'text-slate-800'}`}>
                          {phase.title}
                        </h3>
                        {phase.duration && (
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {phase.duration}
                          </span>
                        )}
                      </div>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${expandedPhase === idx ? 'rotate-180 text-indigo-500' : ''}`} />
                    </div>

                    {/* Topics List (Expandable) */}
                    <div className={`grid transition-all duration-300 ${expandedPhase === idx ? 'grid-rows-[1fr] mt-5 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden space-y-2">
                        <div className="h-px w-full bg-slate-100 mb-4" />
                        {phase.topics.map((topic) => (
                          <div key={topic._id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${getStatusColor(topic.status)}`}>
                            <div className="flex items-center gap-3">
                              {getStatusIcon(topic.status)}
                              <span className="text-sm font-semibold">{topic.name}</span>
                            </div>
                            
                            <select
                              value={topic.status}
                              onChange={(e) => updateTopicStatus(phase._id, topic._id, e.target.value)}
                              className="bg-white border border-slate-300 hover:border-indigo-400 text-xs font-bold rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: RECOMMENDATIONS */}
          <div className="space-y-6">
            
            {/* Skills Array */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-500" /> Target Architecture Skills
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {roadmap.skills?.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Projects */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-purple-500" /> Recommended Projects
              </h3>
              <div className="space-y-4">
                {roadmap.recommendedProjects?.map((proj, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-colors">
                    <p className="text-sm font-bold text-slate-800 mb-1.5">{proj.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Prep */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-500" /> Placement Prep
              </h3>
              <div className="space-y-5">
                {['aptitude', 'technical', 'interview'].map(category => (
                  <div key={category}>
                    <p className="text-xs font-bold text-slate-700 capitalize mb-3 px-2 border-l-2 border-cyan-400">{category}</p>
                    <ul className="space-y-2">
                      {roadmap.placementPrep?.[category]?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-500 font-medium">
                          <ChevronRight className="h-4 w-4 text-cyan-500 shrink-0 mt-0" />
                          <span className="pt-0.5">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" /> Recommended Certifications
              </h3>
              <div className="space-y-3">
                {roadmap.recommendedCertifications?.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-0.5">{cert.title}</p>
                      {cert.provider && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{cert.provider}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* GENERATING OVERLAY */}
      {generating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-[spin_2s_linear_infinite_reverse]"></div>
              <Sparkles className="h-12 w-12 text-indigo-600 animate-pulse m-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Synthesizing Blueprint</h3>
            <p className="text-sm text-slate-500">Our AI core is analyzing your profile and constructing a highly optimized learning sequence. This may take up to 15 seconds.</p>
          </div>
        </div>
      )}

    </div>
  );
}
