import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png'; // Adjust path as needed

interface ServicesDropdownProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const ServicesDropdown: React.FC<ServicesDropdownProps> = ({ isMobile = false, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close dropdown when route changes or on mobile menu close
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    if (closeMobileMenu) closeMobileMenu();
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : ''}`}>
      {/* Logo for mobile */}
      {isMobile && (
        <div className="flex items-center justify-center mb-4">
          <img 
            src={logo} 
            alt="Integrated Quality Solutions Logo" 
            className="h-12 w-auto"
          />
        </div>
      )}

      <button
        onClick={toggleDropdown}
        className={`flex items-center justify-between w-full px-4 py-3 transition-colors ${
          isOpen ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
        } ${isMobile ? 'bg-gray-50 rounded-lg' : ''}`}
        aria-expanded={isOpen}
      >
        <span className="font-medium">Services</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={`${
          isMobile ? 
            'w-full mt-1 bg-white rounded-lg shadow-md' : 
            'absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20'
        } transition-all duration-200 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="py-1">
          <Link
            to="/hr-services"
            className={`block px-4 py-3 ${
              isMobile ? 'hover:bg-gray-100' : 'hover:bg-primary-50'
            } transition-colors`}
            onClick={handleLinkClick}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              HR Services
            </div>
          </Link>

          <Link
            to="/recruitment-manpower"
            className={`block px-4 py-3 ${
              isMobile ? 'hover:bg-gray-100' : 'hover:bg-primary-50'
            } transition-colors`}
            onClick={handleLinkClick}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Recruitment & Manpower
            </div>
          </Link>

          <Link
            to="/rcu-verification"
            className={`block px-4 py-3 ${
              isMobile ? 'hover:bg-gray-100' : 'hover:bg-primary-50'
            } transition-colors`}
            onClick={handleLinkClick}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              RCU & Verification
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesDropdown;