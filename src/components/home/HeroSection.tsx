import React from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/contact');
    setTimeout(() => {
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLearnMore = () => {
    navigate('/about-us'); // Navigates to About Us page
  };

  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)', 
        }}
      >
        <div className="absolute inset-0 bg-primary-600 opacity-80"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white mb-6 leading-tight">
            Integrated High Tech Solutions for Modern Businesses
          </h1>
          <p className="text-xl md:text-2xl text-secondary-100 mb-8 leading-relaxed">
            We provide comprehensive HR, recruitment, Manpower and verification services to help your business succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleGetStarted}
              size="lg"
              variant="secondary"
              className="font-semibold"
            >
              Get Started
            </Button>
            <Button
              onClick={handleLearnMore}
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;