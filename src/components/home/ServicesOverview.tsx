import React from 'react';
import { FileText, Users, Search, LineChart, Award, Shield } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ServiceCard from '../ui/ServiceCard';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const ServicesOverview: React.FC = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      icon: FileText,
      title: "HR Services",
      description: "Comprehensive HR support including payroll, attendance, and compliance management.",
      link: "/hr-services"
    },
    {
      icon: Users,
      title: "Recruitment & Manpower",
      description: "End-to-end recruitment solutions and manpower outsourcing for your business needs.",
      link: "/recruitment-manpower"
    },
    {
      icon: Search,
      title: "RCU & Verification",
      description: "Thorough background checks and verification services for risk mitigation.",
      link: "/rcu-verification"
    },
    {
      icon: LineChart,
      title: "Performance Management",
      description: "Set goals, track progress, and evaluate performance for organizational growth.",
      link: "/performance-management"
    },
    {
      icon: Award,
      title: "Training & Development",
      description: "Customized training programs to enhance skills and productivity of your workforce.",
      link: "/training-development"
    },
    {
      icon: Shield,
      title: "Legal Compliance",
      description: "Stay updated with changing employment laws and maintain legal compliance.",
      link: "/legal-compliance"
    }
    // ... other services remain the same
  ];

  const handleContactClick = () => {
    navigate('/contact');
    // Scroll to form after navigation (with slight delay)
    setTimeout(() => {
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title="Our Services"
          subtitle="We provide a comprehensive range of HR, recruitment, and verification services tailored to meet your business needs."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={handleContactClick}
            variant="primary" 
            size="lg"
          >
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;