"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import AuthBoundary from '@/src/components/auth/AuthBoundary';
import { 
  Download, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  LayoutDashboard, 
  ShieldCheck, 
  Briefcase, 
  ClipboardList,
  Search,
  ChevronRight,
  Fingerprint,
  FileCheck
} from 'lucide-react';

type DashboardTab = 'REGISTRATIONS' | 'MONTHLY' | 'STATUTORY';

export default function ClientDashboard() {
  const { isAuthInitialized, fetchWithAuth } = useAuth();
  const dataFetched = useRef(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('MONTHLY');
  const [data, setData] = useState<{ monthly: any[], registrations: any[], statutory: any[] }>({
    monthly: [],
    registrations: [],
    statutory: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthInitialized || dataFetched.current) return;
    dataFetched.current = true;

    fetchWithAuth('/api/client/documents')
      .then(res => res.json())
      .then(resData => {
        setData({
          monthly: resData.monthly || [],
          registrations: resData.registrations || [],
          statutory: resData.statutory || []
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthInitialized, fetchWithAuth]);

  const DocCard = ({ docData, title, showMonth = false, subTitle = "" }: { docData: any, title: string, showMonth?: boolean, subTitle?: string }) => {
    if (!docData) {
      return (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 transition-all">
           <div className="flex items-center gap-3 opacity-40 overflow-hidden">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs truncate">{title}</div>
                {subTitle && <div className="text-[9px] text-gray-400 truncate uppercase mt-0.5">{subTitle}</div>}
              </div>
           </div>
           <span className="text-[9px] text-gray-400 font-bold px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full uppercase tracking-tighter shrink-0 ml-2">Pending</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-between p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all group relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex flex-shrink-0 items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="font-bold text-gray-900 dark:text-white leading-tight truncate text-sm" title={title}>{title}</div>
              <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap overflow-hidden">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium shrink-0">
                   {new Date(docData.createdAt).toLocaleDateString()}
                </span>
                {showMonth && (
                  <span className="text-[10px] text-indigo-500 font-bold uppercase truncate">MB: {docData.month}</span>
                )}
                {docData.subcategory && (
                  <span className="text-[10px] text-emerald-600 font-bold uppercase truncate bg-emerald-50 dark:bg-emerald-900/20 px-1 rounded">{docData.subcategory}</span>
                )}
              </div>
            </div>
         </div>
         <a 
           href={docData.file?.url}
           target="_blank" 
           rel="noreferrer"
           className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-xl transition-all active:scale-95 shrink-0 ml-2"
         >
            <Download className="w-5 h-5" />
         </a>
      </div>
    );
  };

  const NavItem = ({ id, label, icon: Icon }: { id: DashboardTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none translate-x-1' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'group-hover:text-indigo-600'}`} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
    </button>
  );

  return (
    <AuthBoundary requiredRole="client">
      <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)]">
      {/* Internal Management Sidebar */}
      <aside className="lg:w-72 flex-shrink-0 space-y-6">
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-3 border border-white dark:border-gray-700 shadow-sm">
          <div className="px-4 py-4 mb-2">
            <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Compliance Portal</h2>
          </div>
          <nav className="space-y-1.5 focus:outline-none">
            <NavItem id="MONTHLY" label="Monthly Vault" icon={Calendar} />
            <NavItem id="REGISTRATIONS" label="Licenses & Reg" icon={ShieldCheck} />
            <NavItem id="STATUTORY" label="Statutory Docs" icon={ClipboardList} />
          </nav>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
          <Fingerprint className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-125 transition-transform duration-500" />
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mb-1">Status</p>
          <p className="text-xl font-black mb-4">Regulatory Standard</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white w-[92%] h-full rounded-full" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black font-montserrat tracking-tight text-gray-900 dark:text-white">
              {activeTab === 'MONTHLY' && 'Monthly Audit Vault'}
              {activeTab === 'REGISTRATIONS' && 'License Registry'}
              {activeTab === 'STATUTORY' && 'Statutory Repository'}
            </h1>
            <p className="text-gray-500 mt-1 font-medium italic">
              Professional compliance management system.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Filter specific records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl border dark:border-gray-700" />
            ))}
          </div>
        ) : (
          <div className="space-y-10 focus:outline-none">
            {activeTab === 'REGISTRATIONS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.registrations.length > 0 ? (
                  data.registrations
                    .filter(d => (d.subcategory || d.categoryId?.name).toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(doc => (
                      <DocCard key={doc._id} docData={doc} title={doc.subcategory || 'Registration License'} />
                    ))
                ) : (
                  <EmptyState message="No registration files found in this vault." />
                )}
              </div>
            )}

            {activeTab === 'MONTHLY' && (
              <div className="space-y-12 relative before:content-[''] before:absolute before:inset-0 before:left-8 before:w-px before:bg-gradient-to-b before:from-indigo-200 before:via-gray-100 before:to-transparent dark:before:from-indigo-900/40 dark:before:via-gray-800">
                {data.monthly.length > 0 ? (
                  data.monthly.map((group, index) => (
                    <div key={group.month} className="relative pl-16">
                      <div className="absolute left-0 top-1 w-16 h-16 bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col items-center justify-center -translate-x-1/2 z-10 transition-transform hover:scale-105">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                          {new Date(group.month).toLocaleDateString('en-US', { year: 'numeric' })}
                        </span>
                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">
                          {new Date(group.month).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-[2.5rem] border border-white dark:border-gray-800 shadow-inner">
                        <DocCard docData={group.documents.payroll} title="Payroll Sheet" />
                        <DocCard docData={group.documents.esi} title="ESIC Return" />
                        <DocCard docData={group.documents.pf} title="PF Return" />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="Monthly audit history is clear." />
                )}
              </div>
            )}

            {activeTab === 'STATUTORY' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.statutory.length > 0 ? (
                    data.statutory
                      .filter(d => (d.categoryId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(doc => (
                        <DocCard 
                          key={doc._id} 
                          docData={doc} 
                          title={doc.categoryId?.name} 
                          showMonth 
                          subTitle={doc.subcategory}
                        />
                      ))
                  ) : (
                    <EmptyState message="No auxiliary statutory documents recorded." />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        </main>
      </div>
    </AuthBoundary>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-20 text-center bg-white/30 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-gray-300 dark:border-gray-700">
      <FileCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-widest">{message}</p>
    </div>
  );
}
