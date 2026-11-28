'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import AuthBoundary from '@/src/components/auth/AuthBoundary';
import {
  Building2,
  Users,
  UserPlus,
  Plus,
  Search,
  ArrowRight,
  Briefcase,
  MapPin,
  Globe,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  X,
  Trash2,
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface Company {
  _id: string;
  name: string;
  industry?: string;
  location?: string;
  website?: string;
  description?: string;
  candidateCount?: number;
  activeCount?: number;
  selectedCount?: number;
  createdAt: string;
  createdBy?: any;
}

export default function RecruiterDashboard() {
  const { isAuthInitialized, fetchWithAuth, user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const lastLoadedUser = useRef<string | null>(null);

  // New Company Modal state
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    description: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Delete Company Modal state
  const [deleteModalCompany, setDeleteModalCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteCompany = async () => {
    if (!deleteModalCompany) return;
    setDeletingCompany(true);
    setDeleteError('');
    try {
      const res = await fetchWithAuth(`/api/recruiter/companies/${deleteModalCompany._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete company');
      }
      setCompanies((prev) => prev.filter((c) => c._id !== deleteModalCompany._id));
      setDeleteModalCompany(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting company');
    } finally {
      setDeletingCompany(false);
    }
  };

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth('/api/recruiter/companies', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setCompanies(data.companies || []);
      }
    } catch (err) {
      console.error('Failed to load companies', err);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (!isAuthInitialized) return;
    const currentUserId = user?.id || user?._id || user?.email || 'anon';
    if (lastLoadedUser.current !== currentUserId) {
      lastLoadedUser.current = currentUserId;
      loadCompanies();
    }
  }, [isAuthInitialized, user, loadCompanies]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newCompany.name.trim()) {
      setErrorMsg('Company name is required');
      return;
    }

    setCreating(true);
    try {
      const res = await fetchWithAuth('/api/recruiter/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create company');
      }

      setCompanies((prev) => [data.company, ...prev]);
      setShowModal(false);
      setNewCompany({ name: '', industry: '', location: '', website: '', description: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  const totalCandidates = companies.reduce((sum, c) => sum + (c.candidateCount || 0), 0);
  const totalActive = companies.reduce((sum, c) => sum + (c.activeCount || 0), 0);
  const totalSelected = companies.reduce((sum, c) => sum + (c.selectedCount || 0), 0);

  return (
    <AuthBoundary requiredRole={['recruiter', 'super_admin']}>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Recruitment Portal
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white font-montserrat tracking-tight uppercase italic">
              Recruitment Operations Hub
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
              Create and manage companies you are recruiting for, add candidates, and track their application pipeline.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-200 dark:shadow-purple-900/20 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> Add Partner Company
          </button>
        </div>

        {/* Workspace Scope Banner */}
        {user?.role === 'recruiter' && (
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/80 dark:border-blue-800/60 rounded-2xl text-xs text-blue-900 dark:text-blue-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">
                Private Recruiter Workspace: <span className="text-purple-600 dark:text-purple-400">{user?.name || user?.email}</span>
              </p>
              <p className="text-blue-700 dark:text-blue-300 mt-0.5">
                Strict workspace isolation active. You only see companies and candidate pipelines created under your recruiter account.
              </p>
            </div>
          </div>
        )}

        {user?.role === 'super_admin' && (
          <div className="flex items-center gap-3 px-4 py-3 bg-purple-50/80 dark:bg-purple-900/20 border border-purple-200/80 dark:border-purple-800/60 rounded-2xl text-xs text-purple-900 dark:text-purple-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">
                Super Admin Global View: <span className="text-purple-600 dark:text-purple-400">All Recruiter Companies</span>
              </p>
              <p className="text-purple-700 dark:text-purple-300 mt-0.5">
                Viewing all companies across all recruiters. Log in with individual recruiter accounts to verify private recruiter isolation.
              </p>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Companies</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{companies.length}</div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Active client accounts</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Candidates</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{totalCandidates}</div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Profiles registered</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">In Pipeline</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{totalActive}</div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Under active review</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Hired / Selected</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalSelected}</div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Selected or Onboarded</p>
          </div>
        </div>

        {/* Search & Companies Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies by name, industry, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
            <div className="text-xs font-bold text-gray-400">
              Showing {filteredCompanies.length} of {companies.length} companies
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Companies Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery
                  ? `No companies matched "${searchQuery}". Try a different keyword.`
                  : 'Start recruiting by adding the first company you are hiring for.'}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Partner Company
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((comp) => (
                <Link
                  key={comp._id}
                  href={`/dashboard/recruiter/company/${comp._id}`}
                  className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center uppercase shadow-md shadow-purple-500/20">
                        {comp.name.substring(0, 2)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
                          <Users className="w-3.5 h-3.5" />
                          <span>{comp.candidateCount || 0} Candidates</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteModalCompany(comp);
                          }}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all opacity-70 group-hover:opacity-100"
                          title={`Delete ${comp.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {comp.name}
                      </h3>
                      {comp.createdBy && typeof comp.createdBy === 'object' && (comp.createdBy.name || comp.createdBy.email) && (
                        <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                          <span>Created by: {comp.createdBy.name || comp.createdBy.email}</span>
                        </div>
                      )}
                      {comp.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {comp.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {comp.industry && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 rounded-lg">
                          {comp.industry}
                        </span>
                      )}
                      {comp.location && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 rounded-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {comp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    <span>Manage Candidates & Pipeline</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Create Company */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic">
                  Add Recruiting Company
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  Enter the details of the company or client for which you are actively recruiting.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-800">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateCompany} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Infosys, Wipro, Google, StartupX"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                      Industry / Sector
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IT, FinTech, Healthcare"
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                      Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore, Remote, Mumbai"
                      value={newCompany.location}
                      onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                    Description / Job Requirements Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief notes about the recruitment drive or roles required..."
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    {creating ? 'Creating...' : 'Save & Start Recruiting'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal: Delete Confirmation */}
        {deleteModalCompany && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                Delete &ldquo;{deleteModalCompany.name}&rdquo;?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to delete this company? All candidate records ({deleteModalCompany.candidateCount || 0} candidates) associated with this company will also be permanently deleted. This action cannot be undone.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-800">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deletingCompany}
                  onClick={() => {
                    setDeleteModalCompany(null);
                    setDeleteError('');
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deletingCompany}
                  onClick={handleDeleteCompany}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  {deletingCompany ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete Company'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthBoundary>
  );
}
