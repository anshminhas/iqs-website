"use client";

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { 
  Upload, 
  Calendar, 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  History, 
  Download, 
  RefreshCw,
  Eye,
  ShieldCheck,
  FileSearch,
  Settings,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminClientWorkspace({ params }: { params: Promise<{ clientId: string }> }) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.clientId;

  const [client, setClient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload Form State (Super Admin can also upload if needed)
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [remarks, setRemarks] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{success: boolean, message: string} | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch client details (Super Admin can see all)
      const clientRes = await fetch('/api/admin/clients');
      if (!clientRes.ok) {
        const errData = await clientRes.json().catch(() => ({}));
        throw new Error(errData.error || `Registry fetch failed with status ${clientRes.status}`);
      }
      
      const clientData = await clientRes.json();
      const foundClient = clientData.clients?.find((c: any) => String(c._id || c.id) === String(clientId));
      
      if (!foundClient) {
        throw new Error('Access Denied: This client record was not found in the global registry.');
      }
      setClient(foundClient);

      // Fetch all documents for this client
      const docsRes = await fetch(`/api/admin/clients/${clientId}/documents`);
      if (!docsRes.ok) {
        const errData = await docsRes.json().catch(() => ({}));
        throw new Error(errData.error || `Document sync failed with status ${docsRes.status}`);
      }
      
      const docsData = await docsRes.json();
      setDocuments(docsData.documents || []);

    } catch (err: any) {
      console.error('Super Admin Detail Error:', err);
      setError(err.message || 'Critical Synchronization Failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        alert("Security Lock: Only PDF documents are valid.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !month || !categoryId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('month', month.substring(0, 7));
    formData.append('categoryId', categoryId);
    if (subcategory) formData.append('subcategory', subcategory);
    if (remarks) formData.append('remarks', `SUPER ADMIN UPLOAD: ${remarks}`);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Master Upload Failed');

      setUploadStatus({ success: true, message: 'Corporate Registry Updated.' });
      setFile(null);
      await fetchData();
    } catch (err: any) {
      setUploadStatus({ success: false, message: err.message });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-vh-50 space-y-4 py-20">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse font-montserrat">Accessing Corporate Vault...</p>
    </div>
  );

  if (error || !client) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 bg-white rounded-[3rem] border shadow-2xl text-center">
        <ShieldAlert className="mx-auto w-24 h-24 text-red-500 mb-6" />
        <h2 className="text-3xl font-black mb-2 italic">Registry Access Denied</h2>
        <p className="text-gray-500 mb-8 font-medium italic">{error}</p>
        <Link href="/dashboard/superadmin" className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-black transition-all">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const selectedCatObj = client.assignedCategoryIds?.find((c: any) => c._id === categoryId);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard/superadmin" className="p-4 bg-white border-2 rounded-3xl hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <div>
             <div className="flex items-center gap-3 mb-1">
               <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Super Admin Level</span>
               <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">{client.companyName}</h1>
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Observational Registry & Production Terminal</p>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
          {/* Upload Section (Privileged) */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full translate-x-32 -translate-y-32 group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black italic uppercase flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                    <Upload className="w-6 h-6" />
                  </div>
                  System Override Terminal
                </h2>
                <span className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Authorized</span>
              </div>

              {uploadStatus && (
                <div className={`p-6 mb-8 rounded-3xl flex items-center justify-between ${uploadStatus.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  <span className="font-black text-sm italic uppercase">{uploadStatus.message}</span>
                  <button onClick={() => setUploadStatus(null)} className="text-[10px] font-black uppercase opacity-50">Dismiss</button>
                </div>
              )}

              <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Reporting Period</label>
                    <input type="date" required value={month} onChange={e => setMonth(e.target.value)} className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Regulatory Category</label>
                    <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                       <option value="">-- Master Stream --</option>
                       {client.assignedCategoryIds?.map((cat: any) => (
                         <option key={cat._id} value={cat._id}>{cat.name}</option>
                       ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Payload Injection (PDF)</label>
                    <div className="relative group/input">
                      <input type="file" accept=".pdf" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="border-3 border-dashed border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group-hover/input:border-indigo-200 transition-all bg-gray-50/50">
                        <FileText className={`w-10 h-10 mb-2 ${file ? 'text-indigo-600' : 'text-gray-300'}`} />
                        <p className="font-black text-xs uppercase truncate max-w-full">{file ? file.name : 'Click to bind PDF source'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={uploading} className="md:col-span-2 py-6 bg-indigo-600 hover:bg-black text-white font-black rounded-3xl transition-all shadow-2xl shadow-indigo-100 uppercase italic tracking-widest flex items-center justify-center gap-3">
                  {uploading ? <RefreshCw className="animate-spin w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  {uploading ? 'SYNCHRONIZING REPOSITORY...' : 'COMMIT TO CORPORATE REGISTRY'}
                </button>
              </form>
            </div>
          </div>

          {/* Document Registry */}
          <div className="bg-white rounded-[3.5rem] border border-gray-50 shadow-sm overflow-hidden">
             <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <h3 className="text-2xl font-black italic uppercase flex items-center gap-4">
                   <div className="p-3 bg-gray-900 rounded-2xl text-white">
                      <History className="w-6 h-6" />
                   </div>
                   Audit Registry
                </h3>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-gray-50/50">
                         <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Period</th>
                         <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category stream</th>
                         <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Version</th>
                         <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Auth / View</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {documents.map((doc) => (
                        <tr key={doc._id} className="hover:bg-gray-50/30 transition-all group">
                           <td className="px-10 py-8">
                             <span className="text-lg font-black italic uppercase text-gray-900 leading-none">
                               {new Date(doc.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                             </span>
                           </td>
                           <td className="px-10 py-8">
                              <p className="font-black text-xs uppercase text-indigo-600 mb-1">{doc.categoryId?.name}</p>
                              {doc.subcategory && (
                                <div className="flex items-center gap-1 opacity-50">
                                   <ChevronRight className="w-3 h-3" />
                                   <span className="text-[10px] font-bold uppercase">{doc.subcategory}</span>
                                </div>
                              )}
                           </td>
                           <td className="px-10 py-8">
                              <div className="w-max px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">v{doc.version}.0</div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                 <a href={doc.file?.url} target="_blank" rel="noreferrer" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1">
                                    <Eye className="w-5 h-5" />
                                 </a>
                                 <div className="text-right">
                                    <p className="text-[9px] font-black text-gray-900 uppercase">{new Date(doc.updatedAt).toLocaleDateString()}</p>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase">Authorized View</p>
                                 </div>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
           <div className="bg-gray-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden group">
              <ShieldCheck className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 group-hover:scale-125 transition-transform duration-1000" />
              <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-2">Corporate Intelligence</p>
              <h3 className="text-3xl font-black italic uppercase leading-none mb-8">Registry Profile</h3>
              
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Official Entry Email</p>
                    <p className="font-black text-sm break-all">{client.contactEmail}</p>
                 </div>
                 <div className="pt-6 border-t border-white/10">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-3">Assigned Streams</p>
                    <div className="flex flex-wrap gap-2">
                       {client.assignedCategoryIds?.map((cat: any) => (
                         <span key={cat._id} className="px-3 py-1.5 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-tight text-indigo-300">{cat.name}</span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] border border-gray-50 shadow-sm text-center">
              <FileSearch className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Global ID</p>
              <p className="text-[10px] font-black uppercase tracking-widest break-all">{client._id}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
