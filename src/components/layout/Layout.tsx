// @ts-nocheck
"use client";
import React from 'react';
import { usePathname } from 'next/navigation';

import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import Chatbot from '../ui/Chatbot';
import NoticeBanner from './NoticeBanner';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isDashboardOrAuth = pathname?.startsWith('/dashboard') || pathname?.startsWith('/login') || pathname?.startsWith('/register');

  return (
    <>
      {isDashboardOrAuth ? (
        <div className="font-poppins text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 transition-colors duration-300">
          {children}
        </div>
      ) : (
        <div className="flex flex-col min-h-screen font-poppins text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 transition-colors duration-300">
          <NoticeBanner />
          <div className="pt-8">
            <Navbar />
          </div>
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
          <Chatbot />
        </div>
      )}
    </>
  );
};

export default Layout;