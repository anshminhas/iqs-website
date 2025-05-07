import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ServicesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-primary-600 transition-all duration-300 relative group"
      >
        <span className="relative z-10">Services</span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Animated underline */}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transition-all duration-300 ${isOpen ? 'scale-x-100' : 'scale-x-0'}`} />
      </button>
      
      {/* Dropdown menu */}
      <div className={`absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-20 overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'}`}
           style={{
             boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
           }}>
        <div className="py-2 space-y-1">
          <Link
            to="/hr-services"
            className="block px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group relative"
            onClick={() => setIsOpen(false)}
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-primary-600 transition-all duration-200 scale-y-0 group-hover:scale-y-100" />
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              HR Services
            </span>
          </Link>
          
          <Link
            to="/recruitment-manpower"
            className="block px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group relative"
            onClick={() => setIsOpen(false)}
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-primary-600 transition-all duration-200 scale-y-0 group-hover:scale-y-100" />
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Recruitment & Manpower
            </span>
          </Link>
          
          <Link
            to="/rcu-verification"
            className="block px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group relative"
            onClick={() => setIsOpen(false)}
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-primary-600 transition-all duration-200 scale-y-0 group-hover:scale-y-100" />
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              RCU & Verification
            </span>
          </Link>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
      </div>
    </div>
  );
};

export default ServicesDropdown;