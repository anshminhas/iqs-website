import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import Chatbot from '../ui/Chatbot';
import NoticeBanner from './NoticeBanner';

const Layout: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen font-poppins text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 transition-colors duration-300">
      <NoticeBanner />
      <div className="pt-8">
        <Navbar />
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <Chatbot />
    </div>
  );
};

export default Layout;