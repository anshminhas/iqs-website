'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  List, 
  Activity, 
  Settings, 
  UserPlus, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import Link from 'next/link';
import { createAdmin, createClient, assignClientToAdmin, updateClientCategories } from '@/app/actions/superadmin.actions';

export default function SuperAdminClientView({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState<'users' | 'assignments' | 'categories' | 'logs' | 'security'>('users');
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Password change state
  const [pwdForm, setPwdForm] = useState({ email: '', password: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.password !== pwdForm.confirm) {
      setPwdMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (pwdForm.password.length < 6) {
      setPwdMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPwdLoading(true);
    setPwdMsg(null);
    try {
      const res = await fetch('/api/superadmin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetEmail: pwdForm.email, newPassword: pwdForm.password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setPwdMsg({ type: 'success', text: json.message });
      setPwdForm({ email: '', password: '', confirm: '' });
    } catch (err: any) {
      setPwdMsg({ type: 'error', text: err.message });
    } finally {
      setPwdLoading(false);
    }
  };

  // User form states
  const [showForm, setShowForm] = useState<'admin' | 'client' | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    companyName: string;
    email: string;
    password: string;
    assignedCategoryIds: string[];
    logoUrl: string;
    address: string;
  }>({ name: '', companyName: '', email: '', password: '', assignedCategoryIds: [], logoUrl: '', address: '' });

  // Assignment states
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (showForm === 'admin') {
        const res = await fetch('/api/superadmin/create-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Error creating admin' }));
          throw new Error(errorData.error || 'Server error');
        }
        alert('Admin created successfully');
      } else if (showForm === 'client') {
        const res = await fetch('/api/superadmin/create-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: formData.companyName,
            email: formData.email,
            password: formData.password,
            assignedCategoryIds: formData.assignedCategoryIds,
            logoUrl: formData.logoUrl,
            address: formData.address,
          })
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Error creating client' }));
          throw new Error(errorData.error || 'Server error');
        }
        alert('Client created successfully');
      }
      setShowForm(null);
      setLogoPreview('');
      window.location.reload();
    } catch (error: any) {
      alert(`Error creating user: ${error.message || 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleAssign = async () => {
    if (!selectedAdmin || !selectedClient) return alert('Select both admin and client');
    setLoading(true);
    try {
      await assignClientToAdmin(selectedAdmin, selectedClient);
      alert('Assigned successfully');
      window.location.reload();
    } catch (error) {
      alert('Error assigning client');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">Super Admin Hub</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Manage administrators, compliance portfolios, and corporate registry.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-100 gap-8 mb-8">
        {[
          { id: 'users', label: 'Users & Clients', icon: Users },
          { id: 'assignments', label: 'Assignments', icon: List },
          { id: 'categories', label: 'Categories', icon: Settings },
          { id: 'logs', label: 'Activity Logs', icon: Activity },
          { id: 'security', label: 'Security', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 px-2 flex items-center gap-2 transition-all border-b-2 font-black text-xs uppercase tracking-widest ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'security' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-lg">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><KeyRound className="w-5 h-5 text-indigo-500" /> Change User Password</h2>
            <p className="text-sm text-gray-500 mt-1">Reset the password for any admin, client, or your own account.</p>
          </div>
          <form onSubmit={handleChangePassword} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">User Email</label>
              <input
                type="email"
                required
                placeholder="Enter user's email address"
                value={pwdForm.email}
                onChange={e => setPwdForm(p => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">New Password</label>
              <input
                type="password"
                required
                placeholder="Min. 6 characters"
                value={pwdForm.password}
                onChange={e => setPwdForm(p => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={pwdForm.confirm}
                onChange={e => setPwdForm(p => ({ ...p, confirm: e.target.value }))}
                className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
            {pwdMsg && (
              <div className={`rounded-2xl px-5 py-3 text-sm font-bold ${
                pwdMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {pwdMsg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {pwdLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> Update Password</>
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex gap-4">
            <button onClick={() => setShowForm('admin')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center shadow-lg shadow-indigo-100 transition-all active:scale-95">
              <UserPlus className="w-4 h-4 mr-2" /> Create Administrative Account
            </button>
            <button onClick={() => setShowForm('client')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center shadow-lg shadow-emerald-100 transition-all active:scale-95">
              <Building2 className="w-4 h-4 mr-2" /> Register Corporate Client
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-black italic uppercase mb-6">Create New {showForm === 'admin' ? 'Administrator' : 'Client Profile'}</h3>
              <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-6">
                {showForm === 'admin' ? (
                  <input type="text" placeholder="Full Employee Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-none bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                ) : (
                  <input type="text" placeholder="Registered Company Name" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="border-none bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                )}
                <input type="email" placeholder="Official Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border-none bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                <input type="password" placeholder="System Generated Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="border-none bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                {showForm === 'client' && (
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Company Logo</label>
                    <div
                      onClick={() => document.getElementById('logo-upload-input')?.click()}
                      className={`relative border-2 border-dashed rounded-3xl p-6 cursor-pointer transition-all flex items-center gap-6 ${
                        logoPreview
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        id="logo-upload-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setLogoUploading(true);
                          try {
                            const fd = new FormData();
                            fd.append('logo', file);
                            const res = await fetch('/api/superadmin/upload-logo', { method: 'POST', body: fd, credentials: 'include' });
                            const json = await res.json();
                            if (!res.ok) throw new Error(json.error || 'Upload failed');
                            setLogoPreview(json.url);
                            setFormData(prev => ({ ...prev, logoUrl: json.url }));
                          } catch (err: any) {
                            alert(`Logo upload failed: ${err.message}`);
                          } finally {
                            setLogoUploading(false);
                          }
                        }}
                      />
                      {logoUploading ? (
                        <div className="flex items-center gap-3 w-full justify-center py-2">
                          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-bold text-indigo-500">Uploading...</span>
                        </div>
                      ) : logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded-2xl border border-gray-100 bg-white shadow-sm flex-shrink-0" />
                          <div>
                            <p className="font-black text-sm text-emerald-700">Logo uploaded ✓</p>
                            <p className="text-[10px] text-gray-400 mt-1">Click to replace</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-7 h-7 text-gray-300" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-500">Click to upload logo</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">PNG, JPG, WEBP, SVG · Max 2MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {showForm === 'client' && (
                  <input type="text" placeholder="Company Address (for payslips)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="col-span-2 border-none bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                )}
                
                {showForm === 'client' && (
                  <div className="col-span-2 mt-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Assign Compliance Categories</p>
                    <div className="grid grid-cols-3 gap-3">
                      {data.categories.map((cat: any) => (
                        <label key={cat._id} className={`flex items-center p-3 rounded-2xl border transition-all cursor-pointer ${formData.assignedCategoryIds.includes(cat._id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-transparent text-gray-500'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={formData.assignedCategoryIds.includes(cat._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, assignedCategoryIds: [...formData.assignedCategoryIds, cat._id]});
                              } else {
                                setFormData({...formData, assignedCategoryIds: formData.assignedCategoryIds.filter(id => id !== cat._id)});
                              }
                            }}
                          />
                          <span className="text-xs font-bold uppercase truncate">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="col-span-2 flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(null)} className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600 transition-all">Cancel</button>
                  <button type="submit" disabled={loading} className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-black italic uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-black">Initialize</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center text-gray-400 relative z-10">
                <Users className="w-4 h-4 mr-2 text-indigo-500" /> Administrative Core
              </h3>
              <ul className="space-y-3 relative z-20">
                {data.admins.map((a: any) => (
                  <li key={a._id || a.id}>
                    <Link 
                      href={`/dashboard/superadmin/admin/${a._id || a.id}`}
                      className="flex items-center justify-between p-5 rounded-[2rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all group border border-transparent hover:border-indigo-100 cursor-pointer"
                    >
                      <div className="min-w-0 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">
                          {a.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-black text-sm truncate uppercase tracking-tight">{a.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-tight">{a.email}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center text-gray-400 relative z-10">
                <Building2 className="w-4 h-4 mr-2 text-emerald-500" /> Compliance Portfolio
              </h3>
              <ul className="space-y-3 relative z-20">
                {data.clients.map((c: any) => (
                  <li key={c._id || c.id}>
                    <Link 
                      href={`/dashboard/superadmin/client/${c._id || c.id}`}
                      className="flex items-center justify-between p-5 rounded-[2rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all group border border-transparent hover:border-emerald-100 cursor-pointer"
                    >
                      <div className="min-w-0 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs uppercase">
                          {c.companyName.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-black text-sm truncate uppercase tracking-tight">{c.companyName}</p>
                          <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-tight">{c.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-emerald-500 transition-colors">Audit</span>
                        <ExternalLink className="w-4 h-4 text-gray-200 group-hover:text-emerald-500 transition-all" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in duration-700">
          <h3 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3">
             <List className="w-6 h-6 text-indigo-600" /> Workflow Assignments
          </h3>
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <select value={selectedAdmin} onChange={e => setSelectedAdmin(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex-1">
              <option value="">Select Primary Admin...</option>
              {data.admins.map((a: any) => <option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
            </select>
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex-1">
              <option value="">Select Target Client...</option>
              {data.clients.map((c: any) => <option key={c._id} value={c._id}>{c.companyName}</option>)}
            </select>
            <button onClick={handleAssign} disabled={loading} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50">Sync Assignment</button>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Compliance Chains</h4>
            <div className="grid grid-cols-1 gap-3">
              {data.admins.map((a: any) => (
                <div key={a._id} className="p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="font-black text-sm uppercase italic">{a.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {a.assignedClients && a.assignedClients.length > 0 ? (
                      a.assignedClients.map((c: any) => <span key={c._id} className="px-3 py-1.5 bg-white border border-gray-100 text-[10px] font-black uppercase text-gray-600 rounded-xl shadow-sm">{c.companyName}</span>)
                    ) : <span className="text-[10px] font-bold text-gray-300 uppercase italic">Unassigned Resources</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-8 animate-in fade-in duration-700">
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
             <h3 className="text-2xl font-black italic uppercase mb-2 flex items-center gap-3">
                <Settings className="w-6 h-6 text-indigo-600" /> Compliance Protocols
             </h3>
             <p className="text-gray-400 font-medium italic text-sm mb-10">Global categorization system for all regulatory document streams.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.categories.map((cat: any) => (
                  <div key={cat._id} className="p-8 rounded-[2.5rem] bg-gray-50/50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                    <h4 className="font-black text-lg uppercase italic mb-3">{cat.name}</h4>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cat.subcategories.map((sub: string) => (
                          <span key={sub} className="px-2 py-1 bg-white border text-[9px] font-black uppercase text-gray-400 rounded-lg">{sub}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-xl font-black italic uppercase flex items-center gap-3">
              <Activity className="w-6 h-6 text-indigo-600" /> Master Audit Log
            </h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total System Activity</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {data.logs && data.logs.length > 0 ? data.logs.map((log: any) => (
              <div key={log._id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 font-black text-xs">
                    {log.adminId?.name ? log.adminId.name.substring(0, 1) : '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-sm uppercase tracking-tight">{log.adminId?.name || 'System Auto'}</span> 
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase">{log.action}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 italic">{log.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</p>
                  <p className="text-[10px] font-medium text-gray-300">{new Date(log.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : <div className="p-20 text-center text-gray-300 font-black uppercase italic tracking-widest">Registry Synchronization Clear</div>}
          </div>
        </div>
      )}
    </div>
  );
}
