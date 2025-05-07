import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import PricingCard from '../ui/PricingCard';

const PricingSection: React.FC = () => {
  const plans = [
    {
      title: "Basic",
      price: "",
      period: "",
      description: "",
      features: [
        "Payroll Processing",
        "Employee Onboarding",
        "Emloyee Documentation",
        "Basic background checks",
        "Email support",
        "Monthly reporting"
      ],
      popular: false
    },
    {
      title: "STANDARD",
      price: "",
      period: "",
      description: "",
      features: [
        "Everything in Basic+",
        "Full Employee Lifecycle Management",
        "Detailed Background checks & Verification",
        "Recruitment(Shortlisting)",
        "Enhanced background verification",
        "Priority email & phone support",
        "Weekly reporting"
      ],
      popular: true
    },
    {
      title: "Premium",
      price: "",
      period: "",
      description: "For enterprises with Dedicated HR",
      features: [
        "Everything in Standard+",
        "Full-suite HR management",
        "Dedicated HR",
        "Comprehensive verification services",
        "24/7 dedicated support",
        "Custom reporting",
        
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          title="Simple, Transparent Pricing"
          subtitle="Choose a plan that works best for your business needs. All plans include core features with varying levels of service."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
              buttonText="Get QUOTE"
              buttonLink="/contact"
            />
          ))}
        </div>
        
        <p className="text-center mt-10 text-gray-600">
          Business Plan is Also Available and On-Request Custom Plans are available. Want one? <a href="/contact" className="text-primary-600 hover:underline">Contact us</a> for tailored solutions.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;