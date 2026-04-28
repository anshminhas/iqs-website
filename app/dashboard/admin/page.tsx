'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Search, ArrowRight, FileText, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import AuthBoundary from '@/src/components/auth/AuthBoundary';
import { useRef } from 'react';

export default function AdminDashboard() {
  const { isAuthInitialized, fetchWithAuth } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const dataFetched = useRef(false);

  useEffect(() => {
    if (!isAuthInitialized || dataFetched.current) return;
    dataFetched.current = true;

    fetchWithAuth('/api/admin/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load clients', err);
        setLoading(false);
      });
  }, [isAuthInitialized, fetchWithAuth]);

  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthBoundary requiredRole={['admin', 'super_admin']}>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-montserrat tracking-tight">Admin Operations Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Select a client to manage their compliance documents and uploads.</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by company name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Assigned Clients</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">You don't have any clients assigned to your account yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Link 
              key={client._id} 
              href={`/dashboard/admin/client/${client._id}`}
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {client.logoUrl ? (
                      <img src={client.logoUrl} alt={client.companyName} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <Building2 className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      {client.assignedCategoryIds?.length || 0} Categories
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {client.companyName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-4">
                  {client.contactEmail}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center">
                  Open Workspace <ArrowRight className="w-3 h-3 ml-1 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </span>
                <LayoutDashboard className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </AuthBoundary>
  );
}
