import React from 'react';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, FileText, Settings, Users, LogOut, Upload, Home } from 'lucide-react';
import LogoutButton from './LogoutButton';
import { ThemeToggle } from '../../src/components/ThemeToggle';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('dms_auth')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const payload: any = await verifyToken(token);
  
  if (!payload) {
    redirect('/login');
  }

  const role = payload.role as 'super_admin' | 'admin' | 'client';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between hidden md:flex h-full shadow-sm">
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center w-[75%]">
              <ShieldCheck className="w-6 h-6 text-primary-600 dark:text-blue-400 mr-2 flex-shrink-0" />
              <span className="font-bold text-gray-800 dark:text-white truncate" title={payload.email}>
                IQS Portal
              </span>
            </div>
            <ThemeToggle />
          </div>

          <nav className="p-4 space-y-1">
            {role === 'super_admin' && (
              <>
                <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-4">Management</div>
                <Link href="/dashboard/superadmin" className="flex items-center px-3 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg font-medium">
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Overview
                </Link>
                <Link href="/dashboard/admin/payroll" className="flex items-center px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg font-medium transition-colors">
                  <FileText className="w-5 h-5 mr-3" />
                  Payroll Engine
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-4">Document Ops</div>
                <Link href="/dashboard/admin" className="flex items-center px-3 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg font-medium">
                  <Upload className="w-5 h-5 mr-3" />
                  Upload Center
                </Link>
                <Link href="/dashboard/admin/payroll" className="flex items-center px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg font-medium transition-colors">
                  <FileText className="w-5 h-5 mr-3" />
                  Payroll Engine
                </Link>
              </>
            )}

            {role === 'client' && (
              <>
                <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-4">My Documents</div>
                <Link href="/dashboard/client" className="flex items-center px-3 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg font-medium transition-colors hover:bg-primary-100 dark:hover:bg-primary-900/40">
                  <FileText className="w-5 h-5 mr-3" />
                  Monthly Vault
                </Link>
                <Link href="/dashboard/client/payroll" className="flex items-center px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg font-medium transition-colors">
                  <Settings className="w-5 h-5 mr-3" />
                  Payroll Vault
                </Link>
              </>
            )}

            <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-8">External</div>
            <Link href="/" className="flex items-center px-3 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg font-medium transition-colors">
              <Home className="w-5 h-5 mr-3" />
              Back to Home
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
           <div className="mb-4 px-3 text-xs text-gray-500 dark:text-gray-400 truncate flex flex-col">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{payload.name || payload.email}</span>
              <span className="uppercase text-[10px] mt-0.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full w-max">{role}</span>
           </div>
           <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-gray-50/50 dark:bg-gray-900/50 relative pt-16 md:pt-0">
         {/* Mobile Header (placeholder for mobile nav) */}
         <div className="md:hidden fixed top-[82px] left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center px-4 shadow-sm justify-between">
            <span className="font-bold text-gray-800 dark:text-white">Portal</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LogoutButton mobile />
            </div>
         </div>
         <div className="p-6 md:p-10 flex-1 max-w-7xl mx-auto w-full">
            {children}
         </div>
      </main>
    </div>
  );
}
