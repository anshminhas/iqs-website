import React from 'react';
import Button from '../ui/Button';
import { useLocation } from 'react-router-dom';

const CTASection: React.FC = () => {
  const location = useLocation();
  
  // Determine the service based on the current path
  const getServiceName = () => {
    if (location.pathname.includes('hr-services')) return 'HR Operations';
    if (location.pathname.includes('recruitment-manpower')) return 'Recruitment & Manpower';
    if (location.pathname.includes('rcu-verification')) return 'RCU & Verification';
    return 'HR Operations'; // Default fallback
  };

  const serviceName = getServiceName();

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        
        
      </div>
    </section>
  );
};

export default CTASection;