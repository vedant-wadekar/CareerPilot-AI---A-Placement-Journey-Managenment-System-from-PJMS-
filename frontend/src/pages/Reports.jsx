import React, { useState, useEffect } from 'react';
import { coordinator } from '../services/api';
import { FileSpreadsheet, Search, Printer, Download, Award, TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReportData = async () => {
    try {
      const res = await coordinator.getPlacementReportData();
      setReportData(res.data);
      setLoading(false);
    } catch (err) {
      setErrorMsg('Failed to load placement reports.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData || reportData.placedStudents.length === 0) return;

    // Build CSV header & rows
    const headers = ['Student Name', 'Email', 'Branch', 'CGPA', 'Hired Company', 'Job Title', 'Salary Package (LPA)', 'Drive Date'];
    const rows = reportData.placedStudents.map(s => [
      s.studentName,
      s.studentEmail,
      s.branch,
      s.cgpa,
      s.companyName,
      s.jobTitle,
      s.package,
      new Date(s.driveDate).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pjms_placement_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPlaced = reportData?.placedStudents?.filter(s => {
    const query = searchQuery.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(query) ||
      s.branch.toLowerCase().includes(query) ||
      s.companyName.toLowerCase().includes(query)
    );
  }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-4 rounded-lg bg-red-50/10 border border-red-100/20 text-red-600 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{errorMsg}</span>
      </div>
    );
  }

  const s = reportData?.summary;

  return (
    <div className="space-y-8 animate-fade-in print:p-0">
      
      {/* Action Header block - Hidden in Print */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search placed students by name, branch, or recruiter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold text-xs transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-xs shadow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary report KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 print:grid-cols-6">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Cohort</p>
          <p className="text-xl font-bold text-slate-850">{s?.totalStudents} Students</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Placed</p>
          <p className="text-xl font-bold text-emerald-650">{s?.totalPlaced} Placed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Rate</p>
          <p className="text-xl font-bold text-slate-850">{s?.placementRate}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Package</p>
          <p className="text-xl font-bold text-indigo-600">{s?.averagePackage} LPA</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Offer</p>
          <p className="text-xl font-bold text-purple-600">{s?.highestPackage} LPA</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lowest Offer</p>
          <p className="text-xl font-bold text-slate-600">{s?.lowestPackage} LPA</p>
        </div>

      </div>

      {/* Main Placement Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-brand-500" />
            <span>Official Placement Ledger</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold print:block">
            Report Compiled: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="flex-1 overflow-x-auto">
          {filteredPlaced.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No placed student records found.</div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/30">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Recruiter Company</th>
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Salary Package</th>
                  <th className="p-4">Recruitment Drive Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPlaced.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{student.studentName}</td>
                    <td className="p-4 text-slate-600">{student.studentEmail}</td>
                    <td className="p-4 text-slate-600">{student.branch}</td>
                    <td className="p-4 font-semibold text-slate-700">{student.cgpa.toFixed(2)}</td>
                    <td className="p-4 font-bold text-brand-700">{student.companyName}</td>
                    <td className="p-4 text-slate-600">{student.jobTitle}</td>
                    <td className="p-4 font-extrabold text-emerald-600">{student.package} LPA</td>
                    <td className="p-4 text-slate-500">{new Date(student.driveDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
