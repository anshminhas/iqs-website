import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isReversed?: boolean;
  imageSrc?: string;
}

const ServiceFeature: React.FC<ServiceFeatureProps> = ({
  icon: Icon,
  title,
  description,
  isReversed = false,
  imageSrc,
}) => {
  return (
    <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
      {/* Image or illustration */}
      {imageSrc ? (
        <div className="w-full md:w-1/2">
          <img
            src={imageSrc}
            alt={title}
            className="rounded-lg shadow-elevation-1 w-full h-auto object-cover"
          />
        </div>
      ) : (
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-32 h-32 bg-primary-50 rounded-full flex items-center justify-center">
            <Icon className="h-16 w-16 text-primary-600" />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-semibold font-montserrat text-gray-800">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceFeature;