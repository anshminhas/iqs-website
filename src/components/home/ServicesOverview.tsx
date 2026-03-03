import React from 'react';
import { FileText, Users, DollarSign, LineChart, Award, Shield } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ServiceCard from '../ui/ServiceCard';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const ServicesOverview: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: FileText,
      title: 'HR Services',
      description: 'Comprehensive HR support including attendance, compliance management, and employee relations.',
      link: '/services/hr-services',
    },
    {
      icon: Users,
      title: 'Recruitment & Manpower',
      description: 'End-to-end recruitment solutions and manpower outsourcing for your business needs.',
      link: '/services/recruitment-manpower',
    },
    {
      icon: DollarSign,
      title: 'Payroll Services',
      description: 'Accurate, compliant payroll processing with PF, ESI, TDS management and MIS reporting.',
      link: '/services/payroll',
    },
    {
      icon: LineChart,
      title: 'Performance Management',
      description: 'Set goals, track progress, and evaluate performance for organisational growth.',
      link: '/performance-management',
    },
    {
      icon: Award,
      title: 'Training & Development',
      description: 'Customised training programs to enhance skills and productivity of your workforce.',
      link: '/training-development',
    },
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'Stay updated with changing employment laws and maintain full legal compliance.',
      link: '/legal-compliance',
    },
  ];

  const handleContactClick = () => {
    navigate('/contact');
    setTimeout(() => {
      const el = document.getElementById('contact-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title="Our Services"
          subtitle="A comprehensive range of HR, recruitment, and payroll services tailored to meet your business needs."
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
          <Button onClick={handleContactClick} variant="primary" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;