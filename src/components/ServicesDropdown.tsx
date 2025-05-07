import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MobileServicesDropdownProps {
  onLinkClick?: () => void;
}

const MobileServicesDropdown: React.FC<MobileServicesDropdownProps> = ({ onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        onTouchEnd={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-primary-600 transition-all duration-300"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Services</span>
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
      </button>
      
      {/* Mobile dropdown menu */}
      <div 
        className={`
          w-full bg-gray-50 rounded-lg overflow-hidden
          transition-all duration-300
          ${isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="py-1 space-y-1 px-2">
          <Link
            to="/hr-services"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
            onClick={handleLinkClick}
            onTouchEnd={handleLinkClick}
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
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
            onClick={handleLinkClick}
            onTouchEnd={handleLinkClick}
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
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
            onClick={handleLinkClick}
            onTouchEnd={handleLinkClick}
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

export default MobileServicesDropdown;