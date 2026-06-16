import React, { useState, useEffect } from 'react';
import { student, ai } from '../services/api';
import {
  FileSearch,
  BookOpen,
  Award,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Wand2,
  CheckCircle,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ResumeAISpace() {
  const [activeTab, setActiveTab] = useState('review');
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  // States for AI queries
  const [reviewData, setReviewData] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [questionsData, setQuestionsData] = useState(null);
  const [improveData, setImproveData] = useState(null);
  
  // Loading states
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingGap, setLoadingGap] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingImprove, setLoadingImprove] = useState(false);

  // Expanded questions state
  const [expandedIndex, setExpandedIndex] = useState({ tech: null, hr: null, proj: null });

  // Error state
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await student.getOpportunities();
        setJobs(res.data);
        if (res.data.length > 0) {
          setSelectedJobId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchOpportunities();
  }, []);

  const handleFetchReview = async () => {
    setLoadingReview(true);
    setErrorMsg('');
    try {
      const res = await ai.reviewResume();
      setReviewData(res.data);
    } catch (err) {
      setErrorMsg('Failed to fetch resume review.');
    }
    setLoadingReview(false);
  };

  const handleFetchGap = async () => {
    if (!selectedJobId) return;
    setLoadingGap(true);
    setErrorMsg('');
    try {
      const res = await ai.analyzeSkillGap(selectedJobId);
      setGapData(res.data);
    } catch (err) {
      setErrorMsg('Failed to analyze skill gap.');
    }
    setLoadingGap(false);
  };

  const handleFetchQuestions = async () => {
    setLoadingQuestions(true);
    setErrorMsg('');
    try {
      const res = await ai.generateQuestions(selectedJobId || null, selectedJobId ? null : 'Software Developer');
      setQuestionsData(res.data);
    } catch (err) {
      setErrorMsg('Failed to generate interview questions.');
    }
    setLoadingQuestions(false);
  };

  const handleFetchImprove = async () => {
    setLoadingImprove(true);
    setErrorMsg('');
    try {
      const res = await ai.suggestImprovements();
      setImproveData(res.data);
    } catch (err) {
      setErrorMsg('Failed to fetch improvement suggestions.');
    }
    setLoadingImprove(false);
  };

  // Run automatically if active tab changes
  useEffect(() => {
    if (activeTab === 'review' && !reviewData) handleFetchReview();
    if (activeTab === 'gap' && !gapData && selectedJobId) handleFetchGap();
    if (activeTab === 'questions' && !questionsData) handleFetchQuestions();
    if (activeTab === 'improve' && !improveData) handleFetchImprove();
  }, [activeTab, selectedJobId]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-emerald-600" />
            <span>Gemini AI Career Co-Pilot</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Get immediate intelligent feedback on your profile, analyze skill gaps, and prep for upcoming corporate recruitment drives.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'review', label: 'Resume Review', icon: FileSearch },
            { id: 'gap', label: 'Skill Gap & Roadmap', icon: TrendingUp },
            { id: 'questions', label: 'Interview Prep', icon: HelpCircle },
            { id: 'improve', label: 'Resume Improver', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setErrorMsg(''); }}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TABS CONTAINER */}
      <div className="min-h-[400px]">
        {/* --- T1: RESUME REVIEW --- */}
        {activeTab === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loadingReview ? (
              <div className="lg:col-span-3 flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mr-3"></span>
                <span className="text-sm font-medium text-slate-500">Gemini is analyzing your credentials...</span>
              </div>
            ) : (
              <>
                {/* Score panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <h3 className="text-md font-bold text-slate-800 mb-6">Profile Assessment Score</h3>
                  <div className="relative h-32 w-32 flex items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100 mb-4 shadow-inner">
                    <span className="text-4xl font-extrabold text-emerald-600">{reviewData?.score || 0}</span>
                    <span className="text-xs text-emerald-400 absolute bottom-4">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-[200px]">Calculated based on listed skills, certifications, and academic record.</p>
                  <button
                    onClick={handleFetchReview}
                    className="mt-6 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-semibold bg-slate-50 transition-colors"
                  >
                    Recalculate Score
                  </button>
                </div>

                {/* Suggestions panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
                  {/* Missing Skills */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                      <BookOpen className="h-4.5 w-4.5 text-blue-500" />
                      <span>Missing Core Skills</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {reviewData?.missingSkills?.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-semibold">
                          + {skill}
                        </span>
                      )) || <span className="text-xs text-slate-400 italic">None identified</span>}
                    </div>
                  </div>

                  {/* FormattingSuggestions */}
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                      <Wand2 className="h-4.5 w-4.5 text-amber-500" />
                      <span>Formatting Suggestions</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
                      {reviewData?.formattingSuggestions?.map((sug, i) => (
                        <li key={i}>{sug}</li>
                      )) || <li className="text-slate-400 italic list-none">No suggestions found</li>}
                    </ul>
                  </div>

                  {/* GrammarSuggestions */}
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                      <Award className="h-4.5 w-4.5 text-purple-500" />
                      <span>Grammar & Tone Optimization</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
                      {reviewData?.grammarSuggestions?.map((sug, i) => (
                        <li key={i}>{sug}</li>
                      )) || <li className="text-slate-400 italic list-none">No suggestions found</li>}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* --- T2: SKILL GAP & ROADMAP --- */}
        {activeTab === 'gap' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Job Position</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm min-w-[200px]"
                >
                  {jobs.map(j => (
                    <option key={j._id} value={j._id}>{j.title} ({j.companyId?.companyName})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleFetchGap}
                disabled={loadingGap || !selectedJobId}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors shrink-0 disabled:opacity-50"
              >
                {loadingGap ? 'Analyzing...' : 'Run Gap Analysis'}
              </button>
            </div>

            {loadingGap ? (
              <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mr-3"></span>
                <span className="text-sm font-medium text-slate-500">Gemini is checking matching criteria and structuring your roadmap...</span>
              </div>
            ) : gapData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skills comparison */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3">Skills Audit</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matching Skills</h4>
                    {gapData?.commonSkills?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No direct matching skills found</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {gapData?.commonSkills?.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-medium">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gaps / Missing Skills</h4>
                    {gapData?.missingSkills?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">You match all requirements!</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {gapData?.missingSkills?.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">
                            ✕ {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Roadmap timeline */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
                  <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6">Structured Learning Roadmap</h3>
                  
                  <div className="flex-1 space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {gapData?.learningRoadmap?.map((phase, idx) => (
                      <div key={idx} className="relative space-y-2">
                        {/* Bullet node */}
                        <span className="absolute -left-6 top-1 h-4.5 w-4.5 rounded-full border-4 border-white bg-emerald-500 shadow"></span>
                        
                        <h4 className="font-bold text-sm text-slate-800">{phase.milestone}</h4>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p className="font-medium text-slate-500">Key topics to master:</p>
                          <ul className="list-disc list-inside pl-2 space-y-0.5">
                            {phase.topics?.map((topic, i) => <li key={i}>{topic}</li>)}
                          </ul>
                        </div>
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resources:</span>
                          {phase.resources?.map((res, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-semibold">
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                Click "Run Gap Analysis" above to compare your profile with the selected drive.
              </div>
            )}
          </div>
        )}

        {/* --- T3: INTERVIEW PREPARATION --- */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Drive</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm min-w-[200px]"
                >
                  {jobs.map(j => (
                    <option key={j._id} value={j._id}>{j.title} ({j.companyId?.companyName})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleFetchQuestions}
                disabled={loadingQuestions}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors shrink-0 disabled:opacity-50"
              >
                {loadingQuestions ? 'Generating...' : 'Generate Questions'}
              </button>
            </div>

            {loadingQuestions ? (
              <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mr-3"></span>
                <span className="text-sm font-medium text-slate-500">Gemini is writing custom Technical, HR, and Project questions...</span>
              </div>
            ) : questionsData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Technical Questions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <BrainCircuit className="h-4.5 w-4.5 text-blue-500" />
                    <span>Technical Questions</span>
                  </h3>
                  <div className="space-y-3">
                    {questionsData.technicalQuestions?.map((q, i) => (
                      <div key={i} className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-bold text-slate-700">{q.question}</p>
                        <button
                          onClick={() => setExpandedIndex({ ...expandedIndex, tech: expandedIndex.tech === i ? null : i })}
                          className="mt-2 text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 hover:underline"
                        >
                          {expandedIndex.tech === i ? <>Hide Answer <ChevronUp className="h-3 w-3" /></> : <>Reveal Answer <ChevronDown className="h-3 w-3" /></>}
                        </button>
                        {expandedIndex.tech === i && (
                          <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-2 font-medium">
                            {q.expectedAnswer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* HR Questions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <MessageSquare className="h-4.5 w-4.5 text-amber-500" />
                    <span>HR Behavioral Questions</span>
                  </h3>
                  <div className="space-y-3">
                    {questionsData.hrQuestions?.map((q, i) => (
                      <div key={i} className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-bold text-slate-700">{q.question}</p>
                        <button
                          onClick={() => setExpandedIndex({ ...expandedIndex, hr: expandedIndex.hr === i ? null : i })}
                          className="mt-2 text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 hover:underline"
                        >
                          {expandedIndex.hr === i ? <>Hide Tips <ChevronUp className="h-3 w-3" /></> : <>Reveal Tips <ChevronDown className="h-3 w-3" /></>}
                        </button>
                        {expandedIndex.hr === i && (
                          <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-2 bg-amber-50/50 p-2 rounded border border-amber-100">
                            {q.tips}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Questions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-purple-500" />
                    <span>Project-Based Questions</span>
                  </h3>
                  <div className="space-y-3">
                    {questionsData.projectQuestions?.map((q, i) => (
                      <div key={i} className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-bold text-slate-700">{q.question}</p>
                        <button
                          onClick={() => setExpandedIndex({ ...expandedIndex, proj: expandedIndex.proj === i ? null : i })}
                          className="mt-2 text-[10px] text-purple-600 font-semibold flex items-center gap-0.5 hover:underline"
                        >
                          {expandedIndex.proj === i ? <>Hide Tips <ChevronUp className="h-3 w-3" /></> : <>Reveal Tips <ChevronDown className="h-3 w-3" /></>}
                        </button>
                        {expandedIndex.proj === i && (
                          <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-2 bg-purple-50/50 p-2 rounded border border-purple-100">
                            {q.tips}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                Click "Generate Questions" above to receive custom prep questions.
              </div>
            )}
          </div>
        )}

        {/* --- T4: RESUME IMPROVER --- */}
        {activeTab === 'improve' && (
          <div className="space-y-6">
            {loadingImprove ? (
              <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mr-3"></span>
                <span className="text-sm font-medium text-slate-500">Gemini is rewriting your bio summary and project templates...</span>
              </div>
            ) : improveData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Rewritten Summary */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
                    <span>AI Rewritten Summary</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100/50 text-xs text-slate-700 leading-relaxed font-medium">
                    "{improveData.rewrittenSummary}"
                  </div>

                  {/* Project Enhancers */}
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Wand2 className="h-4.5 w-4.5 text-blue-500" />
                      <span>Project Descriptions Enhancer</span>
                    </h3>
                    <div className="space-y-4">
                      {improveData.improvedProjects?.map((proj, i) => (
                        <div key={i} className="border border-slate-150 rounded-xl p-4 space-y-3 bg-slate-50/50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Before / Original</span>
                              <p className="text-slate-500 italic">"{proj.original}"</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">After / Enhanced</span>
                              <p className="text-slate-800 font-semibold">"{proj.improved}"</p>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-500 border-t border-slate-200/50 pt-2 font-medium">
                            <span className="font-bold text-slate-600">Recruiter Rationale:</span> {proj.rationale}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills Adjuster */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-full">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                    <TrendingUp className="h-4.5 w-4.5 text-amber-500" />
                    <span>Skills Terminology Adjuster</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Upgrade standard keywords on your resume to industry-equivalent modern alternatives to beat ATS screens.</p>
                  
                  <div className="space-y-3 pt-2">
                    {improveData.skillsAdjustment?.map((sa, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="text-slate-500 italic">{sa.original}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">→</span>
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded">
                          {sa.suggestedUpgrade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                Click "Suggest Improvements" to generate enhanced text structures.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
