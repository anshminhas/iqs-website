'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Trash2, GripVertical, Save,
  FlaskConical, CheckCircle, AlertCircle, RefreshCw, Info
} from 'lucide-react';

interface Component {
  key: string;
  label: string;
  type: 'earning' | 'deduction' | 'result';
  formula: string;
  order: number;
}

const TYPE_STYLE = {
  earning:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  deduction: 'bg-red-50 text-red-700 border-red-200',
  result:    'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const FORMULA_HINTS = [
  'gross', 'basic', 'hra', 'days_worked', 'days_in_month',
  'earnings_total', 'deductions_total', 'round(x)', 'max(a,b)', 'min(a,b)',
];

const DEFAULT_COMPONENTS: Component[] = [
  { key: 'basic',             label: 'Basic Salary',   type: 'earning',   formula: 'gross * 0.4',                                  order: 1 },
  { key: 'hra',               label: 'HRA',            type: 'earning',   formula: 'basic * 0.5',                                  order: 2 },
  { key: 'special_allowance', label: 'Special Allow.', type: 'earning',   formula: 'gross - basic - hra',                          order: 3 },
  { key: 'pf',                label: 'PF (Employee)',  type: 'deduction', formula: 'round(basic * 0.12)',                          order: 4 },
  { key: 'esic',              label: 'ESIC',           type: 'deduction', formula: 'gross <= 21000 ? round(gross * 0.0075) : 0',   order: 5 },
  { key: 'professional_tax',  label: 'Prof. Tax',      type: 'deduction', formula: '200',                                          order: 6 },
  { key: 'net_pay',           label: 'Net Pay',        type: 'result',    formula: 'earnings_total - deductions_total',            order: 7 },
];

async function evalFormula(formula: string, scope: Record<string, number>) {
  try {
    const mathjs = await import('mathjs');
    return { value: Number((mathjs.evaluate as any)(formula, scope)), error: null };
  } catch (e: any) {
    return { value: null, error: e.message };
  }
}

export default function PayrollConfigPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const [components, setComponents] = useState<Component[]>(DEFAULT_COMPONENTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testGross, setTestGross] = useState(50000);
  const [testResults, setTestResults] = useState<Record<string, { value: number | null; error: string | null }>>({});
  const [testRunning, setTestRunning] = useState(false);

  useEffect(() => {
    fetch(`/api/payroll/config/${clientId}`)
      .then(r => r.json())
      .then(d => {
        if (d.config?.components?.length) {
          setComponents(d.config.components);
        } else if (d.defaults?.length) {
          setComponents(d.defaults);
        }
        setLoading(false);
      });
  }, [clientId]);

  const update = (idx: number, field: keyof Component, val: any) => {
    setComponents(prev => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  };

  const addComponent = () => {
    setComponents(prev => [
      ...prev,
      { key: `comp_${Date.now()}`, label: 'New Component', type: 'earning', formula: '0', order: prev.length + 1 },
    ]);
  };

  const removeComponent = (idx: number) => {
    setComponents(prev => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, order: i + 1 })));
  };

  const runTest = async () => {
    setTestRunning(true);
    const scope: Record<string, number> = { gross: testGross, days_worked: 26, days_in_month: 30, earnings_total: 0, deductions_total: 0 };
    const results: Record<string, { value: number | null; error: string | null }> = {};
    let earningsTotal = 0, deductionsTotal = 0;

    const sorted = [...components].sort((a, b) => a.order - b.order);
    for (const comp of sorted) {
      if (comp.type === 'result') continue;
      scope.earnings_total = earningsTotal;
      scope.deductions_total = deductionsTotal;
      const r = await evalFormula(comp.formula, { ...scope });
      results[comp.key] = r;
      if (r.value !== null) {
        scope[comp.key] = r.value;
        if (comp.type === 'earning') earningsTotal += r.value;
        if (comp.type === 'deduction') deductionsTotal += r.value;
      }
    }
    scope.earnings_total = earningsTotal;
    scope.deductions_total = deductionsTotal;
    for (const comp of sorted.filter(c => c.type === 'result')) {
      results[comp.key] = await evalFormula(comp.formula, { ...scope });
    }
    setTestResults(results);
    setTestRunning(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/payroll/config/${clientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ components: components.map((c, i) => ({ ...c, order: i + 1 })) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
            <h1 className="text-4xl font-black italic uppercase">Formula Configurator</h1>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Client-Specific Payroll Component Rules</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addComponent} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm hover:shadow-md transition-all">
            <Plus className="w-4 h-4" /> Add Component
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Config'}
          </button>
        </div>
      </header>

      <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-black text-sm text-indigo-800">Formula Scope Variables</p>
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {FORMULA_HINTS.map(h => (
              <code key={h} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[11px] font-mono font-bold">{h}</code>
            ))}
          </div>
          <div className="bg-indigo-100/50 p-3 rounded-xl border border-indigo-200 mt-2">
            <p className="text-sm font-bold text-indigo-900">Important Note:</p>
            <p className="text-xs text-indigo-800 font-medium mt-1">
              <code className="font-mono font-bold text-indigo-900">gross</code> = <span className="font-bold underline">actual salary uncalculated</span>. The engine automatically prorates the CTC based on attendance, and this attendance-adjusted value is injected directly into your formulas wherever you type "gross".
            </p>
          </div>
          <p className="text-xs text-indigo-600 mt-3 font-medium">Components are evaluated in order — each one's result is available to subsequent formulas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Component List */}
        <div className="lg:col-span-2 space-y-3">
          {components.map((comp, idx) => (
            <div key={comp.key} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                  <span className="w-6 h-6 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 flex items-center justify-center">{idx + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={comp.type}
                    onChange={e => update(idx, 'type', e.target.value)}
                    className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border outline-none ${TYPE_STYLE[comp.type]}`}
                  >
                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>
                    <option value="result">Result</option>
                  </select>
                  <button onClick={() => removeComponent(idx)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Display Label</label>
                  <input
                    value={comp.label}
                    onChange={e => update(idx, 'label', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Variable Key</label>
                  <input
                    value={comp.key}
                    onChange={e => update(idx, 'key', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Formula (mathjs expression)</label>
                <input
                  value={comp.formula}
                  onChange={e => update(idx, 'formula', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-sm rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none"
                  placeholder="e.g.  gross * 0.4"
                />
                {testResults[comp.key] && (
                  <div className={`mt-2 flex items-center gap-2 text-xs font-bold ${testResults[comp.key].error ? 'text-red-500' : 'text-emerald-600'}`}>
                    {testResults[comp.key].error ? (
                      <><AlertCircle className="w-3 h-3" />{testResults[comp.key].error}</>
                    ) : (
                      <><CheckCircle className="w-3 h-3" />= ₹{(testResults[comp.key].value || 0).toLocaleString('en-IN')}</>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Test Panel */}
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 sticky top-6">
            <h3 className="font-black uppercase italic text-sm flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-indigo-500" /> Formula Tester
            </h3>
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Test Gross Salary</label>
              <input
                type="number"
                value={testGross}
                onChange={e => setTestGross(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl font-black text-lg outline-none focus:ring-2 focus:ring-indigo-500 border-none"
              />
            </div>
            <button
              onClick={runTest}
              disabled={testRunning}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-xl uppercase italic tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {testRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
              {testRunning ? 'Running...' : 'Run Test'}
            </button>

            {Object.keys(testResults).length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                {components.map(comp => {
                  const r = testResults[comp.key];
                  if (!r) return null;
                  return (
                    <div key={comp.key} className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-600">{comp.label}</span>
                      {r.error ? (
                        <span className="text-red-500 text-xs font-bold">Error</span>
                      ) : (
                        <span className={`font-black ${comp.type === 'earning' ? 'text-emerald-600' : comp.type === 'deduction' ? 'text-red-600' : 'text-indigo-700'}`}>
                          ₹{(r.value || 0).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
