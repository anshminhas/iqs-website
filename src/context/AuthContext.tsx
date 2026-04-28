'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: any;
  isAuthInitialized: boolean;
  isAuthenticated: boolean;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthInitialized: false,
  isAuthenticated: false,
  fetchWithAuth: async () => new Response(),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const initFetched = useRef(false);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    router.push('/login');
    router.refresh();
  }, [router]);

  const fetchWithAuth = useCallback(async (url: string, options?: RequestInit) => {
    const fetchOptions = {
      ...options,
      credentials: 'include' as RequestCredentials,
    };
    const res = await fetch(url, fetchOptions);
    if (res.status === 401) {
      logout();
    }
    return res;
  }, [logout]);

  useEffect(() => {
    if (initFetched.current) return;
    initFetched.current = true;

    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else if (pathname?.startsWith('/dashboard')) {
          router.push('/login');
        }
      })
      .catch(err => {
        console.error('Auth initialization error', err);
        if (pathname?.startsWith('/dashboard')) router.push('/login');
      })
      .finally(() => {
        setIsAuthInitialized(true);
      });
  }, [pathname, router]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthInitialized, isAuthenticated, fetchWithAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
