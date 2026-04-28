'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Download, FileText, TrendingUp, CreditCard,
  ChevronDown, CheckCircle, AlertCircle, Eye
} from 'lucide-react';

interface PayrollRun {
  _id: string;
  month: string;
  status: string;
  totalEmployees: number;
  totalGross: number;
  totalNetPay: number;
  processedAt: string;
}

interface PayslipRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  gross: number;
  daysWorked: number;
  daysInMonth: number;
  components: Record<string, number>;
  earningsTotal: number;
  deductionsTotal: number;
  netPay: number;
  pdfUrl: string;
  errors: string[];
}

function fmt(n: number) {
  return `₹${(n || 0).toLocaleString('en-IN')}`;
}
function fmtMonth(m: string) {
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

import { useSearchParams } from 'next/navigation';

export default function ClientPayrollPage() {
  const searchParams = useSearchParams();
  const urlClientId = searchParams.get('clientId');
  
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [currentRun, setCurrentRun] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlips, setLoadingSlips] = useState(false);
  const [expandedSlip, setExpandedSlip] = useState<string | null>(null);

  useEffect(() => {
    const url = urlClientId ? `/api/client/payroll?clientId=${urlClientId}` : '/api/client/payroll';
    fetch(url)
      .then(r => r.json())
      .then(d => {
        setRuns(d.runs || []);
        if (d.runs?.length) {
          setSelectedMonth(d.runs[0].month);
        }
        setLoading(false);
      });
  }, [urlClientId]);

  useEffect(() => {
    if (!selectedMonth) return;
    setLoadingSlips(true);
    const url = urlClientId 
      ? `/api/client/payroll?month=${selectedMonth}&clientId=${urlClientId}` 
      : `/api/client/payroll?month=${selectedMonth}`;
      
    fetch(url)
      .then(r => r.json())
      .then(d => {
        setPayslips(d.payslips || []);
        setCurrentRun(d.run || null);
        setLoadingSlips(false);
      });
  }, [selectedMonth, urlClientId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-xs font-black uppercase tracking-widest animate-pulse">Loading Payroll Vault...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 italic uppercase">Payroll Vault</h1>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Your Monthly Payroll Records</p>
        </div>
        {currentRun && (
          <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Net Payable</p>
              <p className="font-black text-lg text-gray-900">{fmt(currentRun.totalNetPay)}</p>
            </div>
          </div>
        )}
      </header>

      {/* Month Selector */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Pay Period</label>
        <div className="flex flex-wrap gap-3">
          {runs.map(run => (
            <button
              key={run._id}
              onClick={() => setSelectedMonth(run.month)}
              className={`px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-wide transition-all ${
                selectedMonth === run.month
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {fmtMonth(run.month)}
            </button>
          ))}
          {runs.length === 0 && (
            <p className="text-sm text-gray-400 italic font-medium">No payroll records available yet.</p>
          )}
        </div>
      </div>

      {/* Summary Strip */}
      {currentRun && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Gross', value: fmt(currentRun.totalGross), icon: TrendingUp, color: 'violet' },
            { label: 'Employees',   value: String(currentRun.totalEmployees), icon: FileText, color: 'indigo' },
            { label: 'Net Pay',     value: fmt(currentRun.totalNetPay), icon: CreditCard, color: 'emerald' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Payslips */}
      {loadingSlips ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : payslips.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border border-gray-100">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No payslips for this period</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-black uppercase italic text-sm text-gray-900">
            Employee Payslips — {fmtMonth(selectedMonth)}
          </h3>
          {payslips.map(slip => (
            <div key={slip._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-all"
                onClick={() => setExpandedSlip(expandedSlip === slip._id ? null : slip._id)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                    {slip.employeeName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-sm">{slip.employeeName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{slip.employeeId} · {slip.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Net Pay</p>
                    <p className="font-black text-xl text-indigo-700">{fmt(slip.netPay)}</p>
                  </div>
                  <a
                    href={`/api/payroll/download?id=${slip._id}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black transition-all"
                  >
                    <Download className="w-3 h-3" /> Payslip PDF
                  </a>
                  <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${expandedSlip === slip._id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Breakdown */}
              {expandedSlip === slip._id && (
                <div className="px-6 pb-6 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    {/* Earnings */}
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Earnings</p>
                      <div className="space-y-2">
                        {Object.entries(slip.components)
                          .filter(([k]) => !['net_pay', 'deductions_total', 'earnings_total'].includes(k) && slip.components[k] > 0)
                          .map(([key, val]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className="font-black text-emerald-600">{fmt(val)}</span>
                            </div>
                          ))}
                        <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black">
                          <span>Total Earnings</span>
                          <span className="text-emerald-700">{fmt(slip.earningsTotal)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Deductions + Net */}
                    <div>
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Deductions</p>
                      <div className="space-y-2">
                        {Object.entries(slip.components)
                          .filter(([k]) => !['net_pay', 'basic', 'hra', 'special_allowance', 'earnings_total', 'deductions_total'].includes(k) && slip.components[k] > 0)
                          .map(([key, val]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className="font-black text-red-500">{fmt(val)}</span>
                            </div>
                          ))}
                        <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black">
                          <span>Total Deductions</span>
                          <span className="text-red-600">{fmt(slip.deductionsTotal)}</span>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-indigo-600 text-white rounded-2xl flex justify-between items-center">
                        <span className="font-black uppercase text-sm">Net Pay</span>
                        <span className="font-black text-2xl">{fmt(slip.netPay)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    <span>Days: {slip.daysWorked}/{slip.daysInMonth}</span>
                    <span>·</span>
                    <span>Gross: {fmt(slip.gross)}</span>
                    {slip.errors.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{slip.errors.join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
