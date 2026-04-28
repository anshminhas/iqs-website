'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Upload, Calendar, FileText, ChevronRight, Clock,
  Users, TrendingUp, AlertCircle, CheckCircle, RefreshCw,
  Building2, Settings, Plus
} from 'lucide-react';

interface PayrollRun {
  _id: string;
  month: string;
  status: 'draft' | 'processed' | 'regenerated';
  totalEmployees: number;
  totalGross: number;
  totalNetPay: number;
  totalDeductions: number;
  processedAt: string;
  rawFileName: string;
  uploadedBy: { name: string };
}

interface Client { _id: string; companyName: string; }

const STATUS_STYLE = {
  processed:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  regenerated: 'bg-amber-50 text-amber-700 border-amber-200',
  draft:       'bg-gray-100 text-gray-500 border-gray-200',
};

function fmt(n: number) {
  return `₹${(n || 0).toLocaleString('en-IN')}`;
}

function fmtMonth(m: string) {
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function AdminPayrollHub() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [month, setMonth] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then(d => { setClients(d.clients || []); setLoadingClients(false); });
  }, []);

  useEffect(() => {
    if (!selectedClient) { setRuns([]); return; }
    setLoadingRuns(true);
    fetch(`/api/payroll/runs/${selectedClient}`)
      .then(r => r.json())
      .then(d => { setRuns(d.runs || []); setLoadingRuns(false); });
  }, [selectedClient]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setUploadFile(f);
  }, []);

  const handleParse = async () => {
    if (!uploadFile || !selectedClient || !month) {
      setParseError('Please select a client, month, and upload a file.');
      return;
    }
    setParsing(true);
    setParseError('');
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('clientId', selectedClient);
    fd.append('month', month);

    const res = await fetch('/api/payroll/parse', { method: 'POST', body: fd });
    const data = await res.json();
    setParsing(false);

    if (!res.ok) { setParseError(data.error); return; }

    // Store in sessionStorage and navigate to preview
    sessionStorage.setItem('payroll_preview', JSON.stringify(data));
    window.location.href = '/dashboard/admin/payroll/preview';
  };

  const selectedClientName = clients.find(c => c._id === selectedClient)?.companyName || '';

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">Payroll Engine</h1>
          <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">Dynamic Formula-Based Payroll Processing</p>
        </div>
        {selectedClient && (
          <Link
            href={`/dashboard/admin/payroll/config/${selectedClient}`}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <Settings className="w-4 h-4 text-indigo-500" />
            Configure Formulas
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Upload Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-black text-lg uppercase italic flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white"><Upload className="w-5 h-5" /></div>
              New Payroll Run
            </h2>

            {/* Client Select */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Select Client</label>
              {loadingClients ? (
                <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
              ) : (
                <select
                  value={selectedClient}
                  onChange={e => setSelectedClient(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
                </select>
              )}
            </div>

            {/* Month */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Payroll Month</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input
                  type="month"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* File Drop Zone */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Upload CSV / Excel</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('csv-upload')?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  dragging ? 'border-indigo-400 bg-indigo-50' : uploadFile ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <input id="csv-upload" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                {uploadFile ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-black text-sm text-emerald-700 truncate">{uploadFile.name}</p>
                    <p className="text-xs text-emerald-500 mt-1">Ready to parse</p>
                  </>
                ) : (
                  <>
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-gray-500">Drop file or click to select</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">CSV, XLSX, XLS supported</p>
                  </>
                )}
              </div>
            </div>

            {parseError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{parseError}</p>
              </div>
            )}

            <button
              onClick={handleParse}
              disabled={parsing || !uploadFile || !selectedClient || !month}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl uppercase italic tracking-widest disabled:opacity-40 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
            >
              {parsing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              {parsing ? 'Parsing File...' : 'Parse & Preview'}
            </button>
          </div>
        </div>

        {/* Run History */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="font-black text-lg uppercase italic flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-500" /> Run History
              </h3>
              {selectedClientName && (
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{selectedClientName}</span>
              )}
            </div>

            {!selectedClient ? (
              <div className="p-20 text-center">
                <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Select a client to view run history</p>
              </div>
            ) : loadingRuns ? (
              <div className="p-8 space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : runs.length === 0 ? (
              <div className="p-20 text-center">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No payroll runs yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {runs.map(run => (
                  <Link key={run._id} href={`/dashboard/admin/payroll/${run._id}`}
                    className="flex items-center justify-between p-6 hover:bg-gray-50/70 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase italic">{fmtMonth(run.month)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${STATUS_STYLE[run.status]}`}>
                            {run.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold"><Users className="w-3 h-3 inline mr-1" />{run.totalEmployees} emp</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-base text-gray-900">{fmt(run.totalNetPay)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Net Payable</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-500 transition-colors ml-4" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
