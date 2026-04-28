"use client";

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Activity, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Mail, 
  Briefcase,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDetailPage({ params }: { params: Promise<{ adminId: string }> }) {
  const resolvedParams = use(params);
  const adminId = resolvedParams.adminId;

  const [data, setData] = useState<{ admin: any; logs: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await fetch(`/api/superadmin/admin/${adminId}`);
        if (!res.ok) throw new Error('Failed to synchronize admin profile data.');
        const resData = await res.json();
        setData(resData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDetails();
  }, [adminId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Admin Crypt...</p>
    </div>
  );

  if (error || !data) return (
    <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-[2.5rem] border shadow-2xl text-center">
      <ShieldCheck className="mx-auto w-20 h-20 text-red-500 mb-6" />
      <h2 className="text-2xl font-black mb-2 italic">Access Denied</h2>
      <p className="text-gray-500 mb-8">{error || 'Admin record not found in registry.'}</p>
      <Link href="/dashboard/superadmin" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
        Return to Dashboard
      </Link>
    </div>
  );

  const { admin, logs } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/superadmin" className="p-3 bg-white border rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">{admin.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Administrator Account</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-100">
                <UserCircle className="w-12 h-12" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-bold">{admin.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-tight">Access Level: Admin</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium italic">Registered: {new Date(admin.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
             <Activity className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-125 transition-transform duration-500" />
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Success Metrics</p>
             <h3 className="text-3xl font-black mb-6 italic">Performance Hub</h3>
             
             <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-xs font-bold text-indigo-100">Assigned Portfolio</span>
                  <span className="text-2xl font-black">{admin.assignedClients?.length || 0} Clients</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-indigo-100">Audit Logs (Recents)</span>
                  <span className="text-2xl font-black">{logs.length} Actions</span>
                </div>
             </div>
          </div>
        </div>

        {/* Portfolio & Audit Log */}
        <div className="lg:col-span-2 space-y-8">
           {/* Business Portfolio */}
           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black italic uppercase flex items-center gap-3">
                  <Users className="w-6 h-6 text-indigo-500" /> Managed Portfolio
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {admin.assignedClients?.length > 0 ? admin.assignedClients.map((client: any) => (
                  <Link 
                    key={client._id}
                    href={`/dashboard/admin/client/${client._id}`}
                    className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-indigo-200 hover:bg-white transition-all group flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{client.companyName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Full Production Access</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                  </Link>
                )) : (
                  <div className="col-span-full py-10 text-center bg-gray-50/50 rounded-3xl border border-dashed">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No clients assigned yet</p>
                  </div>
                )}
              </div>
           </div>

           {/* Activity Log */}
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-xl font-black italic uppercase flex items-center gap-3">
                  <Activity className="w-6 h-6 text-indigo-500" /> Audit Trail
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Activity Analytics</span>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                <ul className="divide-y divide-gray-50">
                  {logs.length > 0 ? logs.map((log: any) => (
                    <li key={log._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-black uppercase">{log.action}</span>
                             <span className="text-xs font-bold text-gray-900 leading-none">{log.description}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-indigo-500 translate-x-2 opacity-0 group-hover:opacity-100 transition-all" />
                    </li>
                  )) : (
                    <li className="p-20 text-center">
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-widest italic">No activity recorded for this session</p>
                    </li>
                  )}
                </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
