import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period = '/month',
  description,
  features,
  popular = false,
  buttonText = 'Get Started',
  buttonLink = '#',
}) => {
  return (
    <div className={`
      flex flex-col rounded-lg overflow-hidden
      ${popular ? 'border-2 border-primary-600 shadow-elevation-3 transform scale-105 md:scale-100 md:transform-none relative z-10' : 'border border-gray-200 shadow-elevation-1'}
    `}>
      {popular && (
        <div className="bg-primary-600 py-1 text-center text-white text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="p-6 md:p-8 bg-white flex-grow">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold font-montserrat text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex items-end justify-center">
            <span className="text-3xl md:text-4xl font-bold text-gray-900">{price}</span>
            {period && <span className="text-gray-500 ml-1">{period}</span>}
          </div>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <Button
            href={buttonLink}
            variant={popular ? 'primary' : 'outline'}
            size="lg"
            className="w-full"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;