'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, AlertCircle, CheckCircle, RefreshCw,
  FileText, Users, TrendingUp, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

interface ParsedRow {
  rowIndex: number;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  gross: number;
  daysWorked: number;
  daysInMonth: number;
  errors: string[];
  [key: string]: any;
}

interface PreviewData {
  fileName: string;
  clientId: string;
  month: string;
  totalRows: number;
  totalErrors: number;
  rows: ParsedRow[];
}

function fmt(n: number) {
  return `₹${(n || 0).toLocaleString('en-IN')}`;
}

function fmtMonth(m: string) {
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function PayrollPreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<PreviewData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState('');
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [regenerate, setRegenerate] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('payroll_preview');
    if (!raw) { router.push('/dashboard/admin/payroll'); return; }
    setData(JSON.parse(raw));
  }, [router]);

  const handleProcess = async () => {
    if (!data) return;
    setProcessing(true);
    setProcessError('');

    const res = await fetch('/api/payroll/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: data.clientId,
        month: data.month,
        rows: data.rows,
        fileName: data.fileName,
        regenerate,
      }),
    });

    const result = await res.json();
    setProcessing(false);

    if (!res.ok) {
      if (result.error?.includes('already processed')) {
        setRegenerate(true);
        setProcessError(result.error);
      } else {
        setProcessError(result.error);
      }
      return;
    }

    sessionStorage.removeItem('payroll_preview');
    router.push(`/dashboard/admin/payroll/${result.runId}`);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const validRows = data.rows.filter(r => r.errors.length === 0);
  const errorRows = data.rows.filter(r => r.errors.length > 0);
  const displayRows = showErrorsOnly ? errorRows : data.rows;
  const totalGross = data.rows.reduce((s, r) => s + (r.gross || 0), 0);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <header className="flex items-center gap-6">
        <Link href="/dashboard/admin/payroll" className="p-3 bg-white border rounded-2xl hover:shadow-md transition-all">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 italic uppercase">Payroll Preview</h1>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">
            {data.fileName} · {fmtMonth(data.month)}
          </p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: data.totalRows, icon: Users, color: 'indigo' },
          { label: 'Valid Records',   value: validRows.length, icon: CheckCircle, color: 'emerald' },
          { label: 'Errors Found',   value: data.totalErrors, icon: AlertCircle, color: data.totalErrors > 0 ? 'red' : 'gray' },
          { label: 'Total Gross',    value: fmt(totalGross), icon: TrendingUp, color: 'violet' },
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

      {/* Error/Process Banner */}
      {processError && (
        <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-200 rounded-[2rem]">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-black text-red-700">{processError}</p>
            {regenerate && (
              <p className="text-sm text-red-500 mt-1">Click <strong>Process Payroll</strong> again to overwrite the existing run.</p>
            )}
          </div>
        </div>
      )}

      {data.totalErrors > 0 && (
        <div className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-200 rounded-[2rem]">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-amber-700">
            <strong>{data.totalErrors} rows have errors</strong> and will be skipped during processing. Fix the source file or proceed with valid rows only.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h3 className="font-black uppercase italic text-sm">Employee Data Preview</h3>
          <button
            onClick={() => setShowErrorsOnly(v => !v)}
            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
              showErrorsOnly ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {showErrorsOnly ? 'Show All' : `Errors Only (${errorRows.length})`}
          </button>
        </div>
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm">
              <tr>
                {['Row', 'Employee ID', 'Name', 'Dept', 'Designation', 'Gross', 'Days', 'Status'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayRows.map(row => (
                <tr key={row.rowIndex} className={`group transition-all ${row.errors.length > 0 ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">#{row.rowIndex}</td>
                  <td className="px-6 py-4 font-black text-xs uppercase">{row.employeeId || <span className="text-red-400 italic">missing</span>}</td>
                  <td className="px-6 py-4 font-bold text-sm">{row.employeeName || <span className="text-red-400 italic">missing</span>}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{row.department}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{row.designation}</td>
                  <td className="px-6 py-4 font-black text-sm">{fmt(row.gross)}</td>
                  <td className="px-6 py-4 text-xs">{row.daysWorked}/{row.daysInMonth}</td>
                  <td className="px-6 py-4">
                    {row.errors.length > 0 ? (
                      <div className="space-y-1">
                        {row.errors.map((e, i) => (
                          <span key={i} className="flex items-center gap-1 text-[9px] text-red-600 font-black uppercase">
                            <AlertCircle className="w-3 h-3 shrink-0" />{e}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process CTA */}
      <div className="flex items-center justify-between p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <p className="font-black text-lg italic uppercase">Ready to Process</p>
          <p className="text-sm text-gray-400 mt-1">{validRows.length} valid records will be processed & PDFs generated.</p>
        </div>
        <button
          onClick={handleProcess}
          disabled={processing || validRows.length === 0}
          className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl uppercase italic tracking-widest disabled:opacity-40 transition-all shadow-xl shadow-indigo-100"
        >
          {processing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          {processing ? 'Generating Payslips...' : regenerate ? 'Re-Generate Payroll' : 'Process Payroll'}
        </button>
      </div>
    </div>
  );
}
