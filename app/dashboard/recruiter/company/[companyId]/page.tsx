'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import AuthBoundary from '@/src/components/auth/AuthBoundary';
import {
  ArrowLeft,
  Building2,
  Users,
  UserPlus,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Trash2,
  X,
  FileText,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { CANDIDATE_STATUSES, CandidateStatus, CandidateItem } from '@/src/types/candidate';

interface Company {
  _id: string;
  name: string;
  industry?: string;
  location?: string;
  website?: string;
  description?: string;
}

const STATUS_COLORS: Record<CandidateStatus, { bg: string; text: string; border: string }> = {
  Applied: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  Screening: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  'Interview Scheduled': {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  Shortlisted: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  Selected: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  Rejected: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
  },
  Onboarded: {
    bg: 'bg-teal-50 dark:bg-teal-900/30',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800',
  },
};

export default function CompanyCandidateTrackerPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const { isAuthInitialized, fetchWithAuth } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Candidate Modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    phno: '',
    email: '',
    role: '',
    status: 'Applied' as CandidateStatus,
    joiningDate: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');

  // Join Date Prompt Modal for Selected / Onboarded status
  const [joinDatePrompt, setJoinDatePrompt] = useState<{
    candidateId: string;
    candidateName: string;
    targetStatus: CandidateStatus;
    joiningDate: string;
  } | null>(null);
  const [savingJoinDate, setSavingJoinDate] = useState(false);

  // Status updating feedback
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch Company
  const loadCompany = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`/api/recruiter/companies/${companyId}`);
      const data = await res.json();
      if (res.ok && data.company) {
        setCompany(data.company);
        setAccessDenied(false);
      } else {
        setAccessDenied(true);
      }
    } catch (err) {
      console.error('Failed to load company', err);
      setAccessDenied(true);
    }
  }, [companyId, fetchWithAuth]);

  // Fetch Candidates
  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const url = new URL('/api/recruiter/candidates', window.location.origin);
      url.searchParams.set('companyId', companyId);
      if (statusFilter !== 'ALL') url.searchParams.set('status', statusFilter);
      if (sortBy) url.searchParams.set('sort', sortBy);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());

      const res = await fetchWithAuth(url.pathname + url.search);
      const data = await res.json();
      if (res.ok) {
        setCandidates(data.candidates || []);
      }
    } catch (err) {
      console.error('Failed to load candidates', err);
    } finally {
      setLoading(false);
    }
  }, [companyId, statusFilter, sortBy, searchQuery, fetchWithAuth]);

  useEffect(() => {
    if (!isAuthInitialized) return;
    loadCompany();
    loadCandidates();
  }, [isAuthInitialized, loadCompany, loadCandidates]);

  // Handle Add Candidate
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !candidateForm.name.trim() ||
      !candidateForm.phno.trim() ||
      !candidateForm.email.trim() ||
      !candidateForm.role.trim()
    ) {
      setFormError('Candidate name, phone number, email, and job role are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchWithAuth('/api/recruiter/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...candidateForm,
          companyId,
          companyName: company?.name || 'Recruiting Company',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add candidate');
      }

      setCandidates((prev) => [data.candidate, ...prev]);
      setShowModal(false);
      setCandidateForm({
        name: '',
        phno: '',
        email: '',
        role: '',
        status: 'Applied',
        joiningDate: '',
        notes: '',
      });
    } catch (err: any) {
      setFormError(err.message || 'Error adding candidate');
    } finally {
      setSubmitting(false);
    }
  };

  // Status Change Request: Intercepts Selected / Onboarded to request a Joining Date
  const handleStatusChangeRequest = (candidate: CandidateItem, newStatus: CandidateStatus) => {
    if (newStatus === 'Selected' || newStatus === 'Onboarded') {
      setJoinDatePrompt({
        candidateId: candidate._id,
        candidateName: candidate.name,
        targetStatus: newStatus,
        joiningDate: candidate.joiningDate || '',
      });
    } else {
      handleUpdateStatus(candidate._id, newStatus);
    }
  };

  // Confirm Join Date from the prompt modal
  const handleConfirmJoinDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinDatePrompt) return;
    if (!joinDatePrompt.joiningDate) {
      alert('Please specify a joining date.');
      return;
    }

    setSavingJoinDate(true);
    await handleUpdateStatus(
      joinDatePrompt.candidateId,
      joinDatePrompt.targetStatus,
      joinDatePrompt.joiningDate
    );
    setSavingJoinDate(false);
    setJoinDatePrompt(null);
  };

  // Handle Quick Status & Optional Join Date Update
  const handleUpdateStatus = async (
    candidateId: string,
    newStatus: CandidateStatus,
    joiningDate?: string
  ) => {
    setUpdatingId(candidateId);
    // Optimistic UI update
    setCandidates((prev) =>
      prev.map((c) =>
        c._id === candidateId
          ? {
              ...c,
              status: newStatus,
              joiningDate: joiningDate !== undefined ? joiningDate : c.joiningDate,
            }
          : c
      )
    );

    try {
      const payload: Record<string, any> = { status: newStatus };
      if (joiningDate !== undefined) {
        payload.joiningDate = joiningDate;
      }

      const res = await fetchWithAuth(`/api/recruiter/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      // Reload on error
      loadCandidates();
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete Candidate
  const handleDeleteCandidate = async (candidateId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove candidate "${name}"?`)) return;

    try {
      const res = await fetchWithAuth(`/api/recruiter/candidates/${candidateId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCandidates((prev) => prev.filter((c) => c._id !== candidateId));
      }
    } catch (err) {
      console.error('Failed to delete candidate', err);
    }
  };

  // Calculate status counts
  const statusCounts = CANDIDATE_STATUSES.reduce(
    (acc, st) => {
      acc[st] = candidates.filter((c) => c.status === st).length;
      return acc;
    },
    {} as Record<string, number>
  );

  if (accessDenied) {
    return (
      <AuthBoundary requiredRole={['recruiter', 'super_admin']}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase italic">
            Company Access Restricted
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
            This company either does not exist or was created by another recruiter. You can only view and manage companies created under your recruiter account.
          </p>
          <Link
            href="/dashboard/recruiter"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Return to My Dashboard
          </Link>
        </div>
      </AuthBoundary>
    );
  }

  return (
    <AuthBoundary requiredRole={['recruiter', 'super_admin']}>
      <div className="space-y-8 animate-in fade-in duration-500 pb-16">
        {/* Back and Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/recruiter"
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all text-gray-700 dark:text-gray-200 mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  Recruiting For
                </span>
                {company?.industry && (
                  <span className="text-xs text-gray-400 font-bold">• {company.industry}</span>
                )}
                {company?.location && (
                  <span className="text-xs text-gray-400 font-bold">• {company.location}</span>
                )}
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white font-montserrat tracking-tight uppercase italic">
                {company ? company.name : 'Loading Company...'}
              </h1>
              {company?.description && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-medium max-w-2xl">
                  {company.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-200 dark:shadow-purple-900/20 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Candidate
            </button>
          </div>
        </div>

        {/* Filter & Sorting Controls */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
          {/* Status Filter Badges */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter by Application Status
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/20'
                    : 'bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                }`}
              >
                All Applications ({candidates.length})
              </button>
              {CANDIDATE_STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/20'
                      : 'bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span>{st}</span>
                  {statusCounts[st] > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        statusFilter === st
                          ? 'bg-purple-800 text-purple-200'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {statusCounts[st]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Sort Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-700/60">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search candidates by name, phone, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-400">Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:text-gray-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status-asc">Status (A → Z)</option>
                <option value="status-desc">Status (Z → A)</option>
                <option value="name-asc">Candidate Name (A → Z)</option>
                <option value="name-desc">Candidate Name (Z → A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : candidates.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No Candidates Found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No candidate profiles matched your filter criteria.'
                  : `There are currently no candidates added for ${company?.name || 'this company'}. Click "+ Add Candidate" to register one.`}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Add Candidate
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-700/20 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Role Applied</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6">Company</th>
                    <th className="py-4 px-6">Application Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
                  {candidates.map((c) => {
                    const color = STATUS_COLORS[c.status] || STATUS_COLORS.Applied;
                    return (
                      <tr
                        key={c._id}
                        className="hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors"
                      >
                        {/* Candidate Name & Initials */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-black text-xs uppercase flex items-center justify-center flex-shrink-0">
                              {c.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                {c.name}
                              </div>
                              <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Job Role */}
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {c.role}
                          </span>
                        </td>

                        {/* Contact Info */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <a
                              href={`tel:${c.phno}`}
                              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {c.phno}
                            </a>
                            <a
                              href={`mailto:${c.email}`}
                              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              {c.email}
                            </a>
                          </div>
                        </td>

                        {/* Company Name */}
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {c.companyName}
                          </span>
                        </td>

                        {/* Application Status (Dropdown to update on the fly) */}
                        <td className="py-4 px-6">
                          <div className="space-y-1.5">
                            <div className="relative inline-block">
                              <select
                                value={c.status}
                                disabled={updatingId === c._id}
                                onChange={(e) =>
                                  handleStatusChangeRequest(c, e.target.value as CandidateStatus)
                                }
                                className={`appearance-none text-xs font-black uppercase px-3.5 py-1.5 rounded-xl border outline-none cursor-pointer pr-7 transition-all ${color.bg} ${color.text} ${color.border}`}
                              >
                                {CANDIDATE_STATUSES.map((st) => (
                                  <option key={st} value={st} className="bg-white text-gray-900">
                                    {st}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                            </div>

                            {(c.status === 'Selected' || c.status === 'Onboarded') && (
                              <div>
                                {c.joiningDate ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setJoinDatePrompt({
                                        candidateId: c._id,
                                        candidateName: c.name,
                                        targetStatus: c.status,
                                        joiningDate: c.joiningDate || '',
                                      })
                                    }
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all"
                                    title="Click to edit joining date"
                                  >
                                    <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>Join: {c.joiningDate}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setJoinDatePrompt({
                                        candidateId: c._id,
                                        candidateName: c.name,
                                        targetStatus: c.status,
                                        joiningDate: '',
                                      })
                                    }
                                    className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-all animate-pulse"
                                    title="Set joining date"
                                  >
                                    <Clock className="w-3 h-3" />
                                    + Set Join Date
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteCandidate(c._id, c.name)}
                            title="Remove candidate"
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add Candidate */}
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
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic">
                  Add Candidate Profile
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  Register candidate details for recruitment at{' '}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {company?.name}
                  </span>
                  .
                </p>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-800">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                      Phone Number (phno) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={candidateForm.phno}
                      onChange={(e) => setCandidateForm({ ...candidateForm, phno: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john.doe@example.com"
                      value={candidateForm.email}
                      onChange={(e) =>
                        setCandidateForm({ ...candidateForm, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                      Job Role Applied *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend Engineer"
                      value={candidateForm.role}
                      onChange={(e) => setCandidateForm({ ...candidateForm, role: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                      Initial Status
                    </label>
                    <select
                      value={candidateForm.status}
                      onChange={(e) =>
                        setCandidateForm({
                          ...candidateForm,
                          status: e.target.value as CandidateStatus,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {CANDIDATE_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(candidateForm.status === 'Selected' || candidateForm.status === 'Onboarded') && (
                  <div>
                    <label className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Joining Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={candidateForm.joiningDate}
                      onChange={(e) =>
                        setCandidateForm({ ...candidateForm, joiningDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                    Recruiting Company
                  </label>
                  <input
                    type="text"
                    disabled
                    value={company?.name || ''}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                    Notes / Interview Feedback (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Candidate strengths, interview date, or recruiter comments..."
                    value={candidateForm.notes}
                    onChange={(e) => setCandidateForm({ ...candidateForm, notes: e.target.value })}
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
                    disabled={submitting}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    {submitting ? 'Registering...' : 'Add Candidate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal: Set Joining Date for Selected / Onboarded */}
        {joinDatePrompt && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setJoinDatePrompt(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic">
                  Set Joining Date
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  Candidate <span className="font-bold text-gray-900 dark:text-white">&ldquo;{joinDatePrompt.candidateName}&rdquo;</span> is marked as{' '}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{joinDatePrompt.targetStatus}</span>. Please specify their joining date.
                </p>
              </div>

              <form onSubmit={handleConfirmJoinDate} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">
                    Confirmed / Expected Joining Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={joinDatePrompt.joiningDate}
                    onChange={(e) =>
                      setJoinDatePrompt({ ...joinDatePrompt, joiningDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setJoinDatePrompt(null)}
                    className="px-5 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingJoinDate}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    {savingJoinDate ? 'Saving...' : 'Confirm Status & Date'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthBoundary>
  );
}
