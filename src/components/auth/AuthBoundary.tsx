'use client';

import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function AuthBoundary({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string | string[] }) {
  const { isAuthInitialized, isAuthenticated, user } = useAuth();

  if (!isAuthInitialized) {
    return (
      <div className="fixed inset-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-600 dark:text-gray-300 font-bold tracking-[0.2em] uppercase text-sm animate-pulse">Authenticating Session...</p>
      </div>
    );
  }

  // Still show spinner during redirect — prevents blank flash
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center">
        <div className="h-16 w-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-600 dark:text-gray-300 font-bold tracking-[0.2em] uppercase text-sm animate-pulse">Redirecting...</p>
      </div>
    );
  }

  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return (
        <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-[9999] flex flex-col items-center justify-center">
          <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">You do not have permission to view this dashboard.</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
