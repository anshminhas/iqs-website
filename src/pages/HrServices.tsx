import React from 'react';
import { FileText, FileCheck, Shield, Clock, Calendar, Briefcase } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import ServiceCard from '../components/ui/ServiceCard';
import ServiceFeature from '../components/services/ServiceFeature';
import CTASection from '../components/home/CTASection';

const HrServices: React.FC = () => {
  // Update document title
  React.useEffect(() => {
    document.title = "HR Services | IQS - Integrated Quality Solutions";
  }, []);

  const services = [
    {
      icon: FileText,
      title: "Payroll Management",
      description: "Comprehensive payroll processing, tax compliance, and reporting services."
    },
    {
      icon: FileCheck,
      title: "Offer Letter Management",
      description: "Creation, processing, and management of compliant employment offer letters."
    },
    {
      icon: Shield,
      title: "Compliance Management",
      description: "Ensuring adherence to labor laws, regulations, and industry standards."
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      description: "Automated time tracking, leave management, and attendance reporting."
    },
    {
      icon: Calendar,
      title: "Policy Development",
      description: "Creating tailored HR policies and procedures for your organization."
    },
    {
      icon: Briefcase,
      title: "Employee Relations",
      description: "Conflict resolution, employee engagement, and workplace culture development."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        {/* Background with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)', 
          }}
        >
          <div className="absolute inset-0 bg-primary-600 opacity-80"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-white mb-6 leading-tight">
              HR Services
            </h1>
            <p className="text-xl text-secondary-100 mb-8 leading-relaxed">
              Comprehensive human resources solutions tailored to optimize your workforce management and compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Our HR Service Offerings"
            subtitle="We provide comprehensive HR solutions tailored to your business needs, regardless of your company size or industry."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Featured HR Services"
            subtitle="Explore our premium HR offerings designed to streamline your operations and enhance employee satisfaction."
          />
          
          <div className="space-y-20 mt-12">
            <ServiceFeature
              icon={FileText}
              title="Comprehensive Payroll Management"
              description="Our payroll services handle everything from basic processing to complex tax compliance. We ensure accurate and timely payments, tax calculations, and reporting, freeing your team to focus on strategic initiatives. Our system adapts to your specific needs, whether you're a small business or a large enterprise with international operations."
              imageSrc="https://eminencetechnosystem.com/images/payroll.jpg"
            />
            
            <ServiceFeature
              icon={Shield}
              title="HR Compliance & Risk Management"
              description="Navigate the complex landscape of labor laws and regulations with our compliance expertise. We help you develop and implement compliant policies, conduct regular audits, and provide guidance on best practices. Our team stays updated on changing regulations to ensure your business remains compliant and protected from potential legal issues."
              isReversed
              imageSrc="https://images.pexels.com/photos/6615076/pexels-photo-6615076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            
            <ServiceFeature
              icon={Clock}
              title="Advanced Attendance Management"
              description="Our attendance tracking solutions combine user-friendly interfaces with powerful backend analytics. Employees can easily log time while managers gain insights through customizable reports. The system handles leave management, overtime tracking, and integration with payroll for streamlined operations and improved workforce management."
              imageSrc="https://wpschoolpress.com/wp-content/uploads/2023/05/Attendance-Management-System.png"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Why Choose Our HR Services"
            subtitle="Our approach to HR services ensures you receive tailored, effective solutions that address your specific business challenges."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary-600">
              <h3 className="text-xl font-semibold font-montserrat text-gray-800 mb-3">
                Expertise & Experience
              </h3>
              <p className="text-gray-600">
                Our team of HR professionals brings decades of combined experience across various industries, ensuring you receive knowledgeable guidance and support.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary-600">
              <h3 className="text-xl font-semibold font-montserrat text-gray-800 mb-3">
                Customized Solutions
              </h3>
              <p className="text-gray-600">
                We understand that every business is unique. Our services are tailored to meet your specific needs, whether you're a startup or an established enterprise.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary-600">
              <h3 className="text-xl font-semibold font-montserrat text-gray-800 mb-3">
                Technology-Driven Approach
              </h3>
              <p className="text-gray-600">
                We leverage cutting-edge HR technologies to streamline processes, improve accuracy, and provide valuable insights for better decision-making.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary-600">
              <h3 className="text-xl font-semibold font-montserrat text-gray-800 mb-3">
                Compliance Focus
              </h3>
              <p className="text-gray-600">
                Our team stays updated on changing regulations to ensure your HR practices remain compliant with all relevant laws and standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  );
};

export default HrServices;