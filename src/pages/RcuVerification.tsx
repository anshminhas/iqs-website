import React from 'react';
import { Search, ShieldCheck, AlertTriangle, FileCheck, Fingerprint, Globe } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import ServiceCard from '../components/ui/ServiceCard';
import ServiceFeature from '../components/services/ServiceFeature';
import CTASection from '../components/home/CTASection';

const RcuVerification: React.FC = () => {
  // Update document title
  React.useEffect(() => {
    document.title = "RCU & Verification | IQS - Integrated Quality Solutions";
  }, []);

  const services = [
    {
      icon: Search,
      title: "Background Verification",
      description: "Comprehensive checks on employment, education, and personal history."
    },
    {
      icon: ShieldCheck,
      title: "Criminal Record Checks",
      description: "Thorough criminal history verification at local, national, and international levels."
    },
    {
      icon: AlertTriangle,
      title: "Fraud Detection",
      description: "Advanced techniques to identify document forgery and misrepresentation."
    },
    {
      icon: FileCheck,
      title: "Document Verification",
      description: "Authentication of educational certificates, employment records, and personal documents."
    },
    {
      icon: Fingerprint,
      title: "Identity Verification",
      description: "Multi-factor verification to confirm candidate identity and prevent impersonation."
    },
    {
      icon: Globe,
      title: "Global Verification",
      description: "International background checks and verification services across multiple countries."
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
            backgroundImage: 'url(https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)', 
          }}
        >
          <div className="absolute inset-0 bg-primary-600 opacity-80"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-white mb-6 leading-tight">
              RCU & Verification Services
            </h1>
            <p className="text-xl text-secondary-100 mb-8 leading-relaxed">
              Comprehensive verification solutions to mitigate hiring risks and ensure your organization's security.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Our Verification Services"
            subtitle="We provide thorough background verification and fraud detection services to protect your organization from potential risks."
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

      {/* Verification Process */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Our Verification Process"
            subtitle="Our systematic approach ensures thorough verification with quick turnaround times."
          />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <img 
                src="https://images.pexels.com/photos/7876708/pexels-photo-7876708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Verification Process" 
                className="rounded-lg shadow-elevation-1"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat text-gray-800 mb-2">
                    Initial Screening
                  </h3>
                  <p className="text-gray-600">
                    Document collection and preliminary verification to identify any immediate red flags.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat text-gray-800 mb-2">
                    Comprehensive Verification
                  </h3>
                  <p className="text-gray-600">
                    Thorough examination of education, employment, criminal records, and personal history.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat text-gray-800 mb-2">
                    Field Verification
                  </h3>
                  <p className="text-gray-600">
                    On-ground investigations to verify addresses, conduct reference checks, and validate claims.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat text-gray-800 mb-2">
                    Advanced Screening
                  </h3>
                  <p className="text-gray-600">
                    Digital footprint analysis, social media screening, and specialized checks based on role requirements.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat text-gray-800 mb-2">
                    Detailed Reporting
                  </h3>
                  <p className="text-gray-600">
                    Comprehensive report with findings, risk assessment, and verification status for each parameter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verification Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Featured Verification Services"
            subtitle="Our specialized verification services designed to protect your organization from potential risks."
          />
          
          <div className="space-y-20 mt-12">
            <ServiceFeature
              icon={ShieldCheck}
              title="Advanced Background Screening"
              description="Our comprehensive background screening goes beyond basic checks to provide a detailed profile of candidates. We verify education credentials, employment history, criminal records, credit history, and professional licenses. Our multi-layered approach ensures that every aspect of a candidate's background is thoroughly investigated to prevent fraud and mitigate hiring risks."
              imageSrc="https://images.pexels.com/photos/4353618/pexels-photo-4353618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            
            <ServiceFeature
              icon={AlertTriangle}
              title="Fraud Detection & Prevention"
              description="Our fraud detection services utilize advanced technologies and expert analysis to identify potential misrepresentations and document forgery. We examine documents for authenticity, cross-reference information across multiple sources, and employ digital verification tools to ensure the integrity of candidate-provided information. This proactive approach helps organizations avoid costly hiring mistakes and potential legal issues."
              isReversed
              imageSrc="https://images.pexels.com/photos/5669603/pexels-photo-5669603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            
            <ServiceFeature
              icon={Globe}
              title="Global Verification Network"
              description="Our international verification network spans over 190 countries, allowing us to conduct thorough background checks across borders. We navigate local regulations, access regional databases, and work with trusted partners worldwide to verify information regardless of geographic location. This global reach is essential for multinational organizations and companies hiring employees with international backgrounds."
              imageSrc="https://images.pexels.com/photos/7233354/pexels-photo-7233354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <SectionHeader
            title="Trusted Verification Pros"
            subtitle="Our verification services adhere to the highest industry standards and compliance requirements."
            centered
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { title: "", description: "Information Security" },
              { title: "", description: "Data Protection" },
              { title: "", description: "Fair Credit Reporting" },
              { title: "", description: "Background Screening" }
            ].map((badge, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-elevation-1 flex flex-col items-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold font-montserrat text-gray-800 mb-1">
                  {badge.title}
                </h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  );
};

export default RcuVerification;