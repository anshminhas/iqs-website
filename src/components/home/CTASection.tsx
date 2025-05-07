import React from 'react';
import Button from '../ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine the service based on the current path
  const getServiceName = () => {
    if (location.pathname.includes('hr-services')) return 'HR Operations';
    if (location.pathname.includes('recruitment-manpower')) return 'Recruitment & Manpower';
    if (location.pathname.includes('rcu-verification')) return 'RCU & Verification';
    return 'HR Operations'; // Default fallback
  };

  const serviceName = getServiceName();

  // Handle contact button click
  const handleContactClick = () => {
    // If already on contact page, scroll to form
    if (location.pathname === '/contact') {
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to contact page and then scroll to form
      navigate('/contact');
      setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to allow page transition
    }
  };

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">
          Ready to Transform Your {serviceName}?
        </h2>
        <p className="text-lg md:text-xl text-secondary-100 max-w-3xl mx-auto mb-8">
          Take the first step towards streamlined {serviceName.toLowerCase()}.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={handleContactClick}
            variant="secondary"
            size="lg"
            className="font-semibold"
          >
            Get Started Today
          </Button>
          <Button
            href="/demo"
            variant="outline"
            size="lg"
            className="bg-transparent border-white text-white hover:bg-white/10 font-semibold"
          >
            Request a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;