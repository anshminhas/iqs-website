'use client';

import React, { useState, useEffect } from 'react';
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
  KeyRound,
  Briefcase,
  Search,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { createAdmin, createClient, assignClientToAdmin, updateClientCategories } from '@/app/actions/superadmin.actions';
import { CANDIDATE_STATUSES } from '@/src/types/candidate';

export default function SuperAdminClientView({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState<'users' | 'recruitment' | 'assignments' | 'categories' | 'logs' | 'security'>('users');
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Recruitment overview state
  const [recOverview, setRecOverview] = useState<{
    recruiters: any[];
    companies: any[];
    candidates: any[];
    stats: any;
  } | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recSearch, setRecSearch] = useState('');
  const [recFilterStatus, setRecFilterStatus] = useState('ALL');
  const [recFilterRecruiter, setRecFilterRecruiter] = useState('ALL');

  useEffect(() => {
    if (activeTab === 'recruitment' && !recOverview) {
      setRecLoading(true);
      fetch('/api/superadmin/recruitment-overview', { credentials: 'include' })
        .then((r) => r.json())
        .then((d) => setRecOverview(d))
        .catch(console.error)
        .finally(() => setRecLoading(false));
    }
  }, [activeTab, recOverview]);

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

  // User deletion state
  const [deleteUserTarget, setDeleteUserTarget] = useState<{
    id: string;
    name: string;
    email?: string;
    type: 'admin' | 'recruiter' | 'client';
  } | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState('');

  const handleDeleteUser = async () => {
    if (!deleteUserTarget) return;
    setDeletingUser(true);
    setDeleteUserError('');
    try {
      const res = await fetch(`/api/superadmin/users/${deleteUserTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to delete user');
      }

      // Update local state
      if (deleteUserTarget.type === 'admin') {
        setData((prev: any) => ({
          ...prev,
          admins: prev.admins.filter((a: any) => String(a._id || a.id) !== String(deleteUserTarget.id)),
        }));
      } else if (deleteUserTarget.type === 'recruiter') {
        setData((prev: any) => ({
          ...prev,
          recruiters: (prev.recruiters || []).filter((r: any) => String(r._id || r.id) !== String(deleteUserTarget.id)),
        }));
        setRecOverview((prev: any) =>
          prev
            ? {
                ...prev,
                recruiters: (prev.recruiters || []).filter(
                  (r: any) => String(r._id || r.id) !== String(deleteUserTarget.id)
                ),
              }
            : prev
        );
      } else if (deleteUserTarget.type === 'client') {
        setData((prev: any) => ({
          ...prev,
          clients: prev.clients.filter((c: any) => String(c._id || c.id) !== String(deleteUserTarget.id)),
        }));
      }

      setDeleteUserTarget(null);
    } catch (err: any) {
      setDeleteUserError(err.message || 'Error deleting user');
    } finally {
      setDeletingUser(false);
    }
  };

  // User form states
  const [showForm, setShowForm] = useState<'admin' | 'client' | 'recruiter' | null>(null);
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
      } else if (showForm === 'recruiter') {
        const res = await fetch('/api/superadmin/create-recruiter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Error creating recruiter' }));
          throw new Error(errorData.error || 'Server error');
        }
        alert('Recruiter created successfully');
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

      <div className="flex border-b border-gray-100 gap-8 mb-8 overflow-x-auto">
        {[
          { id: 'users', label: 'Users & Clients', icon: Users },
          { id: 'recruitment', label: 'Recruitment Hub', icon: Briefcase },
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
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setShowForm('admin')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center shadow-lg shadow-indigo-100 transition-all active:scale-95">
              <UserPlus className="w-4 h-4 mr-2" /> Create Administrative Account
            </button>
            <button onClick={() => setShowForm('recruiter')} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center shadow-lg shadow-purple-100 transition-all active:scale-95">
              <Briefcase className="w-4 h-4 mr-2" /> Create Recruiter Account
            </button>
            <button onClick={() => setShowForm('client')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center shadow-lg shadow-emerald-100 transition-all active:scale-95">
              <Building2 className="w-4 h-4 mr-2" /> Register Corporate Client
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-black italic uppercase mb-6">
                Create New {showForm === 'admin' ? 'Administrator' : showForm === 'recruiter' ? 'Recruiter Account' : 'Client Profile'}
              </h3>
              <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-6">
                {showForm === 'client' ? (
                  <input type="text" placeholder="Registered Company Name" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="border-none bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                ) : (
                  <input type="text" placeholder={showForm === 'recruiter' ? "Recruiter Full Name" : "Full Employee Name"} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-none bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center text-gray-400 relative z-10">
                <Users className="w-4 h-4 mr-2 text-indigo-500" /> Administrative Core
              </h3>
              <ul className="space-y-3 relative z-20">
                {data.admins.map((a: any) => (
                  <li key={a._id || a.id} className="flex items-center gap-2">
                    <Link 
                      href={`/dashboard/superadmin/admin/${a._id || a.id}`}
                      className="flex-1 min-w-0 flex items-center justify-between p-4 rounded-[1.75rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all group border border-transparent hover:border-indigo-100 cursor-pointer"
                    >
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase flex-shrink-0">
                          {a.name.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm truncate uppercase tracking-tight">{a.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-tight">{a.email}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-500 transition-all group-hover:translate-x-1 flex-shrink-0" />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteUserTarget({
                          id: a._id || a.id,
                          name: a.name,
                          email: a.email,
                          type: 'admin',
                        })
                      }
                      className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all flex-shrink-0"
                      title={`Delete Administrator ${a.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center text-gray-400 relative z-10">
                <Briefcase className="w-4 h-4 mr-2 text-purple-500" /> Recruitment Team
              </h3>
              <ul className="space-y-3 relative z-20">
                {(!data.recruiters || data.recruiters.length === 0) ? (
                  <li className="text-xs text-gray-400 italic p-6 text-center bg-gray-50/50 rounded-[2rem]">
                    No recruiters created yet. Use &ldquo;Create Recruiter Account&rdquo; above.
                  </li>
                ) : (
                  data.recruiters.map((r: any) => (
                    <li key={r._id || r.id} className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/superadmin/recruiter/${r._id || r.id}`}
                        className="flex-1 min-w-0 flex items-center justify-between p-4 rounded-[1.75rem] bg-gray-50/50 border border-transparent hover:border-purple-100 hover:bg-white hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-0.5 transition-all group cursor-pointer"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs uppercase flex-shrink-0">
                            {r.name.substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-sm truncate uppercase tracking-tight">{r.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-tight">{r.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">
                            Recruiter
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteUserTarget({
                            id: r._id || r.id,
                            name: r.name,
                            email: r.email,
                            type: 'recruiter',
                          })
                        }
                        className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all flex-shrink-0"
                        title={`Delete Recruiter ${r.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center text-gray-400 relative z-10">
                <Building2 className="w-4 h-4 mr-2 text-emerald-500" /> Compliance Portfolio
              </h3>
              <ul className="space-y-3 relative z-20">
                {data.clients.map((c: any) => (
                  <li key={c._id || c.id} className="flex items-center gap-2">
                    <Link 
                      href={`/dashboard/superadmin/client/${c._id || c.id}`}
                      className="flex-1 min-w-0 flex items-center justify-between p-4 rounded-[1.75rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all group border border-transparent hover:border-emerald-100 cursor-pointer"
                    >
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs uppercase flex-shrink-0">
                          {c.companyName.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm truncate uppercase tracking-tight">{c.companyName}</p>
                          <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-tight">{c.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-emerald-500 transition-colors">Audit</span>
                        <ExternalLink className="w-4 h-4 text-gray-200 group-hover:text-emerald-500 transition-all" />
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteUserTarget({
                          id: c._id || c.id,
                          name: c.companyName,
                          email: c.contactEmail,
                          type: 'client',
                        })
                      }
                      className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all flex-shrink-0"
                      title={`Delete Client ${c.companyName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Centralized Recruitment Command
                </span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">
                Recruitment Portfolio Overview
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-0.5">
                Monitor all recruiters, their partner companies, and all candidate pipelines across the organization.
              </p>
            </div>

            <Link
              href="/dashboard/recruiter"
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-200 dark:shadow-purple-900/20 active:scale-95 transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Open Recruiter Portal
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Recruiters</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {recOverview?.stats?.totalRecruiters ?? data.recruiters?.length ?? 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Active recruiter staff</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Partner Companies</span>
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {recOverview?.stats?.totalCompanies ?? 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Clients being recruited for</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Candidates</span>
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {recOverview?.stats?.totalCandidates ?? 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Registered applications</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Selected / Hired</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {recOverview?.stats?.selectedCount ?? 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Confirmed offers & joining</p>
            </div>
          </div>

          {/* Recruiters Breakdown Cards */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 flex items-center">
              <Users className="w-4 h-4 mr-2 text-purple-600" /> Active Recruiters & Assigned Volumes
            </h3>

            {recLoading && !recOverview ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (!recOverview?.recruiters || recOverview.recruiters.length === 0) ? (
              <div className="p-8 text-center text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                No recruiter accounts created yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recOverview.recruiters.map((r: any) => (
                  <div
                    key={r._id}
                    className="p-6 rounded-[2rem] bg-gray-50/70 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 flex flex-col justify-between space-y-4 hover:border-purple-200 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-black text-sm flex items-center justify-center uppercase flex-shrink-0">
                          {r.name.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-sm text-gray-900 dark:text-white truncate uppercase">
                            {r.name}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-bold truncate">{r.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        Recruiter
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
                      <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Companies</span>
                        <span className="text-base font-black text-gray-900 dark:text-white">{r.companiesCount || 0}</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Candidates</span>
                        <span className="text-base font-black text-gray-900 dark:text-white">{r.candidatesCount || 0}</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] text-emerald-600 font-bold block uppercase">Hired</span>
                        <span className="text-base font-black text-emerald-600">{r.selectedCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/superadmin/recruiter/${r._id}`}
                        className="flex-1 py-2.5 bg-white dark:bg-gray-800 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm group"
                      >
                        <span>View All Companies & Candidates</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteUserTarget({
                            id: r._id,
                            name: r.name,
                            email: r.email,
                            type: 'recruiter',
                          })
                        }
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl border border-gray-200 dark:border-gray-700 transition-all"
                        title={`Delete Recruiter ${r.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Master Candidate Registry */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-base uppercase italic tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" /> Master Candidate Registry ({recOverview?.candidates?.length || 0})
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Complete candidate database across all recruiters with status and joining dates.
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name, phone, email, role, company, or recruiter..."
                  value={recSearch}
                  onChange={(e) => setRecSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={recFilterRecruiter}
                onChange={(e) => setRecFilterRecruiter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none text-gray-700 dark:text-gray-200"
              >
                <option value="ALL">All Recruiters</option>
                {recOverview?.recruiters?.map((r: any) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                value={recFilterStatus}
                onChange={(e) => setRecFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none text-gray-700 dark:text-gray-200"
              >
                <option value="ALL">All Statuses</option>
                {CANDIDATE_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            {recLoading && !recOverview ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (!recOverview?.candidates || recOverview.candidates.length === 0) ? (
              <div className="py-12 text-center text-gray-400 text-xs italic">
                No candidates registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-700/20 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Recruiter</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Role Applied</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Application Status</th>
                      <th className="py-3 px-4">Joining Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-xs">
                    {recOverview.candidates
                      .filter((c: any) => {
                        const matchRecruiter =
                          recFilterRecruiter === 'ALL' ||
                          String(c.createdBy?._id || c.createdBy) === recFilterRecruiter;
                        const matchStatus = recFilterStatus === 'ALL' || c.status === recFilterStatus;
                        const q = recSearch.toLowerCase().trim();
                        const matchSearch =
                          !q ||
                          c.name?.toLowerCase().includes(q) ||
                          c.phno?.toLowerCase().includes(q) ||
                          c.email?.toLowerCase().includes(q) ||
                          c.role?.toLowerCase().includes(q) ||
                          c.companyName?.toLowerCase().includes(q) ||
                          c.createdBy?.name?.toLowerCase().includes(q);

                        return matchRecruiter && matchStatus && matchSearch;
                      })
                      .map((c: any) => (
                        <tr key={c._id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center">
                                {c.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div>{c.name}</div>
                                <span className="text-[10px] text-gray-400 font-normal">
                                  {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-gray-600 dark:text-gray-300">
                            {c.createdBy?.name ? (
                              <Link
                                href={`/dashboard/superadmin/recruiter/${c.createdBy._id || c.createdBy}`}
                                className="hover:text-purple-600 font-bold flex items-center gap-1"
                              >
                                <span>{c.createdBy.name}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                              </Link>
                            ) : (
                              '-'
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-gray-700 dark:text-gray-300">
                            {c.companyName}
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-gray-200">
                            {c.role}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                <Phone className="w-3 h-3 text-gray-400" /> {c.phno}
                              </div>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Mail className="w-3 h-3 text-gray-400" /> {c.email}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                              {c.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {c.joiningDate ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                                <Calendar className="w-3 h-3" />
                                {c.joiningDate}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[11px] italic">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
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

      {/* Modal: Delete User Confirmation */}
      {deleteUserTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Delete {deleteUserTarget.type === 'recruiter' ? 'Recruiter' : deleteUserTarget.type === 'admin' ? 'Administrator' : 'Client Profile'}?
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-gray-900">&ldquo;{deleteUserTarget.name}&rdquo;</span>
              {deleteUserTarget.email ? ` (${deleteUserTarget.email})` : ''}?
              {deleteUserTarget.type === 'recruiter' && ' This will permanently remove this recruiter and all partner companies and candidates created under their account.'}
              {deleteUserTarget.type === 'client' && ' This will remove the client profile and disable client portal access.'}
              {deleteUserTarget.type === 'admin' && ' This administrator will no longer have access to the administrative system.'}
            </p>

            {deleteUserError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                {deleteUserError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deletingUser}
                onClick={() => {
                  setDeleteUserTarget(null);
                  setDeleteUserError('');
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingUser}
                onClick={handleDeleteUser}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {deletingUser ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
