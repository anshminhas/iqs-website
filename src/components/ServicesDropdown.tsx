import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ServicesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
      >
        Services
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <Link
              to="/hr-services"
              className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              HR Services
            </Link>
            <Link
              to="/recruitment-manpower"
              className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Recruitment & Manpower
            </Link>
            <Link
              to="/rcu-verification"
              className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              RCU & Verification
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesDropdown;