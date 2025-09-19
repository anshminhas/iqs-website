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
    navigate('/about-us');
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* ✅ Fullscreen Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/hero-desktop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* ✅ Hero Content */}
      <div className="relative z-20 container mx-auto px-4 md:px-6 py-24 flex flex-col justify-center h-full">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white mb-6 leading-tight">
            Integrated High Tech Solutions for Modern Businesses
          </h1>
          <p className="text-xl md:text-2xl text-secondary-100 mb-8 leading-relaxed">
            We provide comprehensive HR, recruitment, manpower, and verification services to help your business succeed.
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
