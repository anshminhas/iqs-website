'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import AuthBoundary from '@/src/components/auth/AuthBoundary';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Users,
  Search,
  Calendar,
  Phone,
  Mail,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { CANDIDATE_STATUSES, CandidateStatus, CandidateItem } from '@/src/types/candidate';

interface CompanyItem {
  _id: string;
  name: string;
  industry?: string;
  location?: string;
  candidateCount?: number;
  selectedCount?: number;
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

export default function SuperAdminRecruiterDetailPage({
  params,
}: {
  params: Promise<{ recruiterId: string }>;
}) {
  const { recruiterId } = use(params);
  const { isAuthInitialized, fetchWithAuth } = useAuth();

  const [recruiter, setRecruiter] = useState<any>(null);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isAuthInitialized) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAuth(`/api/superadmin/recruiter/${recruiterId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load recruiter');

        setRecruiter(data.recruiter);
        setCompanies(data.companies || []);
        setCandidates(data.candidates || []);
        setStats(data.stats || {});
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [recruiterId, isAuthInitialized, fetchWithAuth]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">
          Loading Recruiter Portfolio...
        </p>
      </div>
    );
  }

  if (error || !recruiter) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl text-center">
        <ShieldCheck className="mx-auto w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black mb-2 italic uppercase">Recruiter Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{error || 'Record does not exist'}</p>
        <Link
          href="/dashboard/superadmin"
          className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all text-sm inline-block"
        >
          Return to Super Admin Hub
        </Link>
      </div>
    );
  }

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchCompany = selectedCompanyId === 'ALL' || String(c.companyId) === selectedCompanyId;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phno.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q);

    return matchCompany && matchStatus && matchSearch;
  });

  return (
    <AuthBoundary requiredRole={['super_admin']}>
      <div className="space-y-8 animate-in fade-in duration-500 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/superadmin"
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all text-gray-700 dark:text-gray-200 mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-100 dark:bg-purple-900/30 px-2.5 py-0.5 rounded-full">
                  Recruiter Profile
                </span>
                <span className="text-xs text-gray-400 font-bold">• {recruiter.email}</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white font-montserrat tracking-tight uppercase italic mt-1">
                {recruiter.name}
              </h1>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                Registered on{' '}
                {new Date(recruiter.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <Link
            href={`/dashboard/recruiter`}
            className="px-5 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-purple-100 transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Switch to Recruiter View
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Companies</span>
              <Building2 className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.totalCompanies || 0}</div>
            <p className="text-[11px] text-gray-400 mt-1">Managed by recruiter</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Candidates</span>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.totalCandidates || 0}</div>
            <p className="text-[11px] text-gray-400 mt-1">Under this recruiter</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">In Pipeline</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats?.pipelineCount || 0}</div>
            <p className="text-[11px] text-gray-400 mt-1">Active evaluations</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Selected / Hired</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats?.selectedCount || 0}</div>
            <p className="text-[11px] text-gray-400 mt-1">Selected or Onboarded</p>
          </div>
        </div>

        {/* Companies Handled */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" /> Companies Recruiting For ({companies.length})
            </h3>
          </div>

          {companies.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 text-center">
              This recruiter has not created any partner companies yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {companies.map((c) => (
                <div
                  key={c._id}
                  className="p-4 rounded-2xl bg-gray-50/70 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{c.name}</h4>
                    <p className="text-[11px] text-gray-400">
                      {c.industry || 'General Industry'} {c.location ? `• ${c.location}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                      {c.candidateCount || 0} Candidates
                    </span>
                    <p className="text-[10px] text-emerald-600 font-bold">{c.selectedCount || 0} Hired</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidates Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-base uppercase italic tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" /> Candidates Under This Recruiter ({filteredCandidates.length})
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Review candidate records, job roles, interview statuses, and confirmed joining dates.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, phone, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none text-gray-700 dark:text-gray-200"
            >
              <option value="ALL">All Companies</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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
          {filteredCandidates.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs italic">
              No candidate records match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-700/20 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Role Applied</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Application Status</th>
                    <th className="py-3 px-4">Joining Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-xs">
                  {filteredCandidates.map((c) => {
                    const color = STATUS_COLORS[c.status] || STATUS_COLORS.Applied;
                    return (
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
                          <span
                            className={`inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${color.bg} ${color.text} ${color.border}`}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {c.joiningDate ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg">
                              <Calendar className="w-3 h-3" />
                              {c.joiningDate}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px] font-normal italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthBoundary>
  );
}
