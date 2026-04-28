"use client";
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';

export default function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center text-sm font-medium transition-colors hover:text-red-600 dark:hover:text-red-400 ${mobile ? 'text-gray-600 hover:bg-red-50 px-3 py-1.5 rounded-lg' : 'w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg group'}`}
    >
      <LogOut className={`w-5 h-5 ${mobile ? 'mr-2' : 'mr-3 group-hover:text-red-600 dark:group-hover:text-red-400 text-gray-400'}`} />
      <span>Sign out</span>
    </button>
  );
}
