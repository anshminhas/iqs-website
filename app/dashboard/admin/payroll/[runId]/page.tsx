'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Download, RefreshCw, Users, TrendingUp,
  CreditCard, AlertCircle, FileText, CheckCircle, Eye
} from 'lucide-react';

interface PayslipRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  gross: number;
  earningsTotal: number;
  deductionsTotal: number;
  netPay: number;
  pdfUrl: string;
  errors: string[];
  components: Record<string, number>;
}

interface PayrollRun {
  _id: string;
  month: string;
  status: string;
  totalEmployees: number;
  totalGross: number;
  totalNetPay: number;
  totalDeductions: number;
  processedAt: string;
  rawFileName: string;
  clientId: string;
}

function fmt(n: number) {
  return `₹${(n || 0).toLocaleString('en-IN')}`;
}
function fmtMonth(m: string) {
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

const STATUS_STYLE: Record<string, string> = {
  processed:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  regenerated: 'bg-amber-50 text-amber-700 border-amber-200',
  draft:       'bg-gray-100 text-gray-500',
};

export default function PayrollRunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = use(params);
  const [run, setRun] = useState<PayrollRun | null>(null);
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(`/api/payroll/payslips/${runId}`);
    const data = await res.json();
    setRun(data.run);
    setPayslips(data.payslips || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [runId]);

  const filteredPayslips = payslips.filter(p =>
    p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    p.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegenerate = () => {
    window.location.href = `/dashboard/admin/payroll`;
  };

  const handleExcelDownload = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/payroll/export/${runId}`);
      if (!res.ok) { alert('Export failed'); setExporting(false); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `payroll_${run?.month || 'export'}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export error');
    }
    setExporting(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-xs font-black uppercase tracking-widest animate-pulse">Loading Run Data...</p>
    </div>
  );

  if (!run) return (
    <div className="max-w-lg mx-auto mt-20 p-10 bg-white rounded-[3rem] border text-center">
      <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p className="font-black text-gray-400 uppercase italic">Run not found</p>
      <Link href="/dashboard/admin/payroll" className="mt-6 inline-block px-6 py-3 bg-gray-900 text-white rounded-2xl font-black">Back to Payroll</Link>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/admin/payroll" className="p-3 bg-white border rounded-2xl hover:shadow-md transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black italic uppercase">{fmtMonth(run.month)}</h1>
              <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-xl border ${STATUS_STYLE[run.status] || STATUS_STYLE.draft}`}>
                {run.status}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">{run.rawFileName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExcelDownload}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? 'Exporting...' : 'Download Excel'}
          </button>

          <a
            href={`/api/payroll/download-all?runId=${runId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100"
          >
            <Download className="w-4 h-4" />
            Download All PDFs
          </a>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm hover:shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4 text-indigo-500" /> Re-generate
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Employees',       value: fmt(run.totalEmployees).replace('₹',''), icon: Users,      color: 'indigo',  raw: run.totalEmployees },
          { label: 'Total Gross',     value: fmt(run.totalGross),   icon: TrendingUp, color: 'violet',  raw: run.totalGross },
          { label: 'Total Deductions',value: fmt(run.totalDeductions), icon: CreditCard, color: 'red', raw: run.totalDeductions },
          { label: 'Net Payable',     value: fmt(run.totalNetPay),  icon: CheckCircle, color: 'emerald', raw: run.totalNetPay },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Payslip Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h3 className="font-black uppercase italic text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" /> Employee Payslips
          </h3>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-400 w-56"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/80">
                {['Employee', 'Department', 'Gross', 'Earnings', 'Deductions', 'Net Pay', 'Status', 'PDF'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayslips.map(p => (
                <tr key={p._id} className={`group transition-all hover:bg-gray-50/70 ${p.errors.length > 0 ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-5">
                    <p className="font-black text-sm">{p.employeeName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{p.employeeId}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{p.department || '—'}<br /><span className="text-[10px] text-gray-400">{p.designation}</span></td>
                  <td className="px-6 py-5 font-black text-sm">{fmt(p.gross)}</td>
                  <td className="px-6 py-5 text-emerald-600 font-black text-sm">{fmt(p.earningsTotal)}</td>
                  <td className="px-6 py-5 text-red-600 font-black text-sm">{fmt(p.deductionsTotal)}</td>
                  <td className="px-6 py-5 text-indigo-700 font-black text-base">{fmt(p.netPay)}</td>
                  <td className="px-6 py-5">
                    {p.errors.length > 0 ? (
                      <span 
                        className="flex items-center gap-1 text-[9px] text-red-600 font-black uppercase cursor-help"
                        title={p.errors.join('\n')}
                      >
                        <AlertCircle className="w-3 h-3" />{p.errors.length} err
                      </span>
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <a
                      href={`/api/payroll/download?id=${p._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black transition-all"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayslips.length === 0 && (
            <div className="p-16 text-center">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No records match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
