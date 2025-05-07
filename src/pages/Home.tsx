import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesOverview from '../components/home/ServicesOverview';
import PricingSection from '../components/home/PricingSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import ContactSection from '../components/home/ContactSection';

const Home: React.FC = () => {
  // Update document title
  React.useEffect(() => {
    document.title = "IQS - Integrated Quality Solutions | HR & Recruitment";
  }, []);

  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
    </>
  );
};

export default Home;