import React from 'react';
import { Search, Users, Award, Clock, Briefcase, TrendingUp } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import ServiceCard from '../components/ui/ServiceCard';
import ProcessFlow from '../components/services/ProcessFlow';
import CTASection from '../components/home/CTASection';

const RecruitmentManpower: React.FC = () => {
  // Update document title
  React.useEffect(() => {
    document.title = "Recruitment & Manpower | IQS - Integrated Quality Solutions";
  }, []);

  const services = [
    {
      icon: Search,
      title: "Talent Acquisition",
      description: "Strategic recruitment for permanent, contract, and executive positions."
    },
    {
      icon: Users,
      title: "Manpower Outsourcing",
      description: "Flexible staffing solutions for temporary, project-based, or seasonal needs."
    },
    {
      icon: Award,
      title: "Executive Search",
      description: "Targeted recruitment of high-level executives and specialized professionals."
    },
    {
      icon: Clock,
      title: "RPO Services",
      description: "Recruitment Process Outsourcing for end-to-end hiring management."
    },
    {
      icon: Briefcase,
      title: "Replacement Guarantee",
      description: "Comprehensive replacement assurance for all our placed candidates."
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Industry-specific hiring trends, salary benchmarks, and talent analytics."
    }
  ];

  const recruitmentSteps = [
    {
      number: 1,
      title: "Requirements Analysis",
      description: "We thoroughly analyze your job requirements, company culture, and specific needs to ensure perfect matches."
    },
    {
      number: 2,
      title: "Sourcing & Screening",
      description: "Our team sources candidates through multiple channels and conducts preliminary screening to identify qualified professionals."
    },
    {
      number: 3,
      title: "In-depth Assessment",
      description: "Candidates undergo technical assessments, behavioral interviews, and skill evaluations tailored to your requirements."
    },
    {
      number: 4,
      title: "Shortlisting",
      description: "We present a curated shortlist of top candidates with detailed profiles and assessment results."
    },
    {
      number: 5,
      title: "Interview Facilitation",
      description: "Our team coordinates and facilitates interviews between your company and the shortlisted candidates."
    },
    {
      number: 6,
      title: "Offer & Onboarding",
      description: "We assist with negotiations, offer management, and provide support during the onboarding process."
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
            backgroundImage: 'url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)', 
          }}
        >
          <div className="absolute inset-0 bg-primary-600 opacity-80"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-white mb-6 leading-tight">
              Recruitment & Manpower
            </h1>
            <p className="text-xl text-secondary-100 mb-8 leading-relaxed">
              Strategic talent acquisition and flexible workforce solutions to meet your business staffing needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Our Recruitment & Manpower Services"
            subtitle="We provide comprehensive talent acquisition and workforce management solutions to help you build high-performing teams."
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

      {/* Recruitment Process Flow */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Our Recruitment Process"
            subtitle="Our systematic approach ensures we identify, evaluate, and deliver the right talent for your organization."
            centered
          />
          
          <div className="mt-12 max-w-4xl mx-auto">
            <ProcessFlow steps={recruitmentSteps} />
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Industries We Serve"
            subtitle="We have experience recruiting across diverse industries, delivering specialized talent that understands your sector's unique challenges."
            centered
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
            {[
              "Information Technology", 
              "Healthcare & Pharmaceuticals", 
              "Banking & Finance", 
              "Manufacturing",
              "Retail & E-commerce", 
              "Telecommunications", 
              "Construction & Engineering", 
              "Energy & Utilities",
              "Hospitality & Tourism",
              "Education",
              "Logistics & Supply Chain",
              "Media & Entertainment"
            ].map((industry, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center shadow-sm hover:shadow-elevation-1 transition-shadow">
                <p className="font-medium text-gray-800">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Testimonials specific to recruitment */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Recruitment Success Stories"
            subtitle="See how our recruitment solutions have helped organizations find exceptional talent."
            centered
          />
          
          <div className="bg-white p-8 rounded-lg shadow-elevation-1 mt-12">
            <blockquote className="text-lg italic text-gray-700 mb-6">
              "IQS helped us scale our engineering team during a critical growth phase. Their thorough understanding of our technical requirements and company culture resulted in high-quality candidates who integrated seamlessly. The entire process was handled professionally, and we continue to rely on their expertise for our hiring needs."
            </blockquote>
            <div className="flex items-center">
              <div>
                <p className="font-semibold text-gray-900">Robert Torres</p>
                <p className="text-sm text-gray-600">CTO, Innovate Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Replacement Guarantee */}
      <section className="py-16 md:py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">
            Our Replacement Guarantee
          </h2>
          <p className="text-lg text-secondary-100 max-w-3xl mx-auto mb-8">
            We stand behind our recruitment services with a comprehensive replacement guarantee. If a placed candidate leaves or doesn't meet expectations within the guarantee period, we'll find a suitable replacement at no additional cost.
          </p>
          <a 
            href="/contact" 
            className="inline-block px-6 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-secondary-100 transition-colors"
          >
            Learn More About Our Guarantee
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  );
};

export default RecruitmentManpower;