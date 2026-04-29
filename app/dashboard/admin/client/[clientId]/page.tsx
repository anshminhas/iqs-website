'use client';

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

export default function AdminClientWorkspace({ params }: { params: Promise<{ clientId: string }> }) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.clientId;

  const [client, setClient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload Form State
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
      
      // Fetch client details
      const clientRes = await fetch('/api/admin/clients');
      if (!clientRes.ok) {
        const errData = await clientRes.json().catch(() => ({}));
        throw new Error(errData.error || `Client fetch failed with status ${clientRes.status}`);
      }
      
      const clientData = await clientRes.json();
      const foundClient = clientData.clients?.find((c: any) => String(c._id || c.id) === String(clientId));
      
      if (!foundClient) {
        throw new Error('Access Denied: This client is not in your authorized management scope.');
      }
      setClient(foundClient);

      // Fetch all documents for this client
      const docsRes = await fetch(`/api/admin/clients/${clientId}/documents`);
      if (!docsRes.ok) {
        const errData = await docsRes.json().catch(() => ({}));
        throw new Error(errData.error || `Registry fetch failed with status ${docsRes.status}`);
      }
      
      const docsData = await docsRes.json();
      setDocuments(docsData.documents || []);

    } catch (err: any) {
      console.error('Critical Workspace Error:', err);
      setError(err.message || 'Critical System Fault: Document synchronization interrupted.');
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
      
      // Strict PDF enforcement on frontend
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        alert("Security Error: Only PDF documents are permitted for this system.");
        e.target.value = '';
        setFile(null);
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("Performance Error: File exceeds 50MB management limit.");
        e.target.value = '';
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !month || !categoryId) {
      setUploadStatus({ success: false, message: 'Process Error: Missing required compliance parameters.' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    // Normalize to YYYY-MM
    formData.append('month', month.substring(0, 7));
    formData.append('categoryId', categoryId);
    if (subcategory) formData.append('subcategory', subcategory);
    if (remarks) formData.append('remarks', remarks);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'System Upload Failure');
      }

      setUploadStatus({ success: true, message: 'Document Vault Updated Synchronously.' });
      
      // Reset form
      setFile(null);
      setMonth('');
      setCategoryId('');
      setSubcategory('');
      setRemarks('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh document list
      await fetchData();

    } catch (err: any) {
      setUploadStatus({ success: false, message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleReupload = (doc: any) => {
    setCategoryId(doc.categoryId?._id || doc.categoryId);
    setMonth(doc.month);
    setSubcategory(doc.subcategory || '');
    setRemarks(`Audit Update: Regenerating version for ${doc.categoryId?.name}...`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-bold animate-pulse">Establishing Secure Workspace Connection...</p>
    </div>
  );

  if (error || !client) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] border shadow-2xl text-center">
        <ShieldAlert className="mx-auto w-20 h-20 text-red-500 mb-6" />
        <h2 className="text-2xl font-black mb-2 italic">Access Revoked or Denied</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <Link href="/dashboard/admin" className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
          Return to Hub
        </Link>
      </div>
    );
  }

  const selectedCatObj = client.assignedCategoryIds?.find((c: any) => c._id === categoryId);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/admin" className="p-3 bg-white dark:bg-gray-800 border rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all">
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase">{client.companyName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Management Session</p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">Current Registry</p>
            <p className="text-lg font-black">{documents.length} Records</p>
          </div>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <FileSearch className="text-white w-6 h-6" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Upload Terminal */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                <Upload className="w-6 h-6" />
              </div>
              Production Terminal
            </h2>
            <div className="p-1 bg-gray-100 dark:bg-gray-900 rounded-lg flex gap-1">
              <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded font-bold text-[10px] shadow-sm">PDF STRICT</div>
              <div className="px-3 py-1 font-bold text-[10px] text-gray-400">VERSIONED</div>
            </div>
          </div>

          {uploadStatus && (
            <div className={`p-5 mb-8 rounded-[2rem] flex items-center justify-between transition-all ${uploadStatus.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              <div className="flex items-center">
                {uploadStatus.success ? <CheckCircle className="w-6 h-6 mr-3" /> : <AlertCircle className="w-6 h-6 mr-3" />}
                <span className="font-bold">{uploadStatus.message}</span>
              </div>
              <button onClick={() => setUploadStatus(null)} className="text-[10px] font-black uppercase opacity-50 hover:opacity-100 italic">Clear</button>
            </div>
          )}

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Compliance Month/Date (YYYY-MM)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                  <input type="date" required value={month} onChange={(e) => setMonth(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Regulatory Category</label>
                <select required value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategory(''); }} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold appearance-none transition-all">
                  <option value="">-- Select Stream --</option>
                  {client.assignedCategoryIds?.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {selectedCatObj?.subcategories?.length > 0 && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Specific Subcategory</label>
                  <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all">
                    <option value="">-- Generic/Other --</option>
                    {selectedCatObj.subcategories.map((sub: string) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payload (PDF Only)</label>
                <div className="relative group">
                  <input id="file-upload" type="file" accept=".pdf" required onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  <div className="w-full p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center text-center group-hover:border-indigo-400 transition-colors">
                    <FileText className={`w-10 h-10 mb-2 ${file ? 'text-indigo-600' : 'text-gray-300 group-hover:text-indigo-400'}`} />
                    <p className="font-bold text-sm truncate max-w-full px-4">{file ? file.name : 'Drop file or click to select'}</p>
                    <p className="text-[10px] text-gray-400 uppercase mt-1">Maximum Load 50MB</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Internal Remarks</label>
                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Attach operational context..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-none rounded-2xl min-h-[120px] focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm" />
              </div>
            </div>

            <button type="submit" disabled={uploading} className="md:col-span-2 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:translate-y-[-2px] active:translate-y-0">
              {uploading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>SYNCHRONIZING REPOSITORY...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  <span>COMMIT DOCUMENT TO VAULT</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Ops */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border shadow-sm">
             <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-gray-400">Environment Specs</h3>
             <div className="space-y-5">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/40 flex items-center justify-center text-violet-600">
                    <Settings className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase">Contact Node</p>
                   <p className="text-sm font-bold truncate">{client.contactEmail}</p>
                 </div>
               </div>
               <div className="pt-4 border-t dark:border-gray-700">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Privileged Streams</p>
                 <div className="flex flex-wrap gap-2">
                   {client.assignedCategoryIds?.map((cat: any) => (
                     <span key={cat._id} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tighter transition-all hover:bg-indigo-500 hover:text-white cursor-default">
                       {cat.name}
                     </span>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="px-10 py-8 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white">
              <History className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black italic uppercase">Regulatory Registry</h2>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Audit Log</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Compliance Bound</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category stream</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sequence</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp / Operator</th>
                <th className="px-10 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {documents.length === 0 ? (
                <tr><td colSpan={5} className="px-10 py-24 text-center">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold italic uppercase tracking-widest">Registry entry null</p>
                </td></tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-all group">
                    <td className="px-10 py-6">
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl inline-block group-hover:bg-white transition-colors duration-500">
                        <span className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                          {new Date(doc.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div>
                        <p className="font-black text-sm uppercase text-indigo-600 dark:text-indigo-400 tracking-tight">{doc.categoryId?.name}</p>
                        {doc.subcategory && (
                          <div className="flex items-center gap-1 mt-1">
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{doc.subcategory}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="font-black text-xs uppercase italic">Version {doc.version}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-xs font-bold text-gray-900 dark:text-white uppercase">{new Date(doc.updatedAt).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5 tracking-widest">OP: {doc.uploadedBy?.name || 'ROOT'}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a 
                          href={doc.file?.url}
                          target="_blank" rel="noreferrer"
                          className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400 transition-all hover:scale-110 active:scale-95" title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                        <button onClick={() => handleReupload(doc)} className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-2xl text-emerald-600 dark:text-emerald-400 transition-all hover:scale-110 active:scale-95" title="Re-upload">
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
