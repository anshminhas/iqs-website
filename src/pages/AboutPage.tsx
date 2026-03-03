import React from 'react';
import { Users, ShieldCheck, BarChart2, Target, Clock, Heart, HandHeart, HeartHandshake, PencilRulerIcon, KeyRound, CircleDollarSign, Ruler, Clock1 } from 'lucide-react';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
          }}
        >
          <div className="absolute inset-0 bg-primary-600 opacity-80"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white mb-6 leading-tight">
              About IQS
            </h1>
            <p className="text-xl md:text-2xl text-secondary-100 mb-8 leading-relaxed">
              Welcome to INTEGRATED QUALITY SOLUTIONS - Your trusted partner in workforce solutions
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 mb-8">
              IQS – INTIGRATED QUALITY SOLUTIONS
            </h2>
            <p className="text-lg text-gray-600 mb-6">
            IQS – Integrated Quality Solutions is a professionally managed HR and workforce solutions firm delivering structured, compliant, and scalable business support services across India. Built on the principles of integrity, precision, and operational excellence, IQS partners with organizations to streamline workforce management and enhance operational efficiency.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our core expertise spans HR services, end-to-end payroll management, manpower supply, recruitment solutions, and project outsourcing (IT and Non-IT). For payroll operations, we utilize premium, technology-driven payroll software integrated with expert oversight from experienced payroll professionals. This ensures accurate salary processing, statutory compliance (PF, ESI, TDS), attendance validation, reporting, and regulatory adherence with complete confidentiality and zero-error execution.</p>

            <p className="text-lg text-gray-600 mb-6">
            Beyond payroll and HR, IQS provides dependable project outsourcing solutions handled exclusively by qualified, industry-experienced teams. Whether managing specialized assignments or executing full-scale operational projects, our expert professionals ensure structured delivery, performance accountability, and measurable outcomes aligned with client objectives.
            </p>

            <p className="text-lg text-gray-600 mb-6">
             At IQS, we believe workforce and operational management are strategic enablers of business growth—not merely administrative functions. Our services are supported by disciplined processes, strong compliance frameworks, and seamless system integration to deliver efficiency, transparency, and long-term value.</p>

<p className="text-lg text-gray-600 mb-6">
            We proudly support startups, SMEs, enterprises, and service-driven organizations seeking reliable outsourcing partnerships backed by expertise, technology, and professionalism.</p>

            <p className="text-lg text-gray-600 mb-6">
              Partner with IQS to transform your HR and payroll operations into a structured, compliant, and growth-driven advantage.</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Why to choose us?"
            subtitle="
            At IQS, we don't just provide services — we build partnerships that drive performance."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Users,
                title: "People First",
                description: "We prioritize human connections in all our solutions"
              },
              {
                icon: ShieldCheck,
                title: "Integrity",
                description: "Ethical practices and transparency guide every decision"
              },
              {
                icon: BarChart2,
                title: "Excellence",
                description: "Relentless pursuit of quality in every service"
              },
              {
                icon: Target,
                title: "Innovation",
                description: "Technology-driven solutions for modern challenges"
              },
              {
                icon: Clock,
                title: "Efficiency",
                description: "Fast turnaround without compromising quality"
              },
              {
                icon: Heart,
                title: "Commitment",
                description: "Dedicated to our clients' long-term success"
              },
              {
                icon: ShieldCheck,
                title: "Data Privacy & Security",
                description: "Strict adherence to labor laws, data protection, and ISO standards"
              },
              {
                icon: KeyRound,
                title: "One-Stop Solution",
                description: "HR outsourcing, manpower supply, recruitment, and RCU – all under one roof."
              },
              {
                icon: PencilRulerIcon,
                title: "High-Tech Softwares",
                description: "Transparent, trackable service with digital reports and insights."
              },
              {
                icon: CircleDollarSign,
                title: "Cost-Efficient Services",
                description: "Reduce internal overhead with expert support at a fraction of in-house costs."
              },
              {
                icon: Clock1,
                title: "Faster Turnaround Time",
                description: "Quick service delivery with real-time updates, photo proofs, and geotagging."
              },
              {
                icon: Ruler,
                title: "Tailor-Made HR Processes",
                description: "Custom SOPs and workflows aligned with your company culture and policies."
              }
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <value.icon className="w-8 h-8 text-primary-600 mr-4" />
                  <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">
            Ready to Transform Your Workforce Strategy?
          </h2>
          <p className="text-lg md:text-xl text-secondary-100 max-w-3xl mx-auto mb-8">
            Partner with IQS for comprehensive HR and verification solutions tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="font-semibold"
            >
              Get Started
            </Button>
            <Button
              href="/services/payroll"
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white/10 font-semibold"
            >
              Our Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;