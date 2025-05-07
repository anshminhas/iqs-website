import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Card from './Card';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  className = '',
}) => {
  return (
    <Card hoverable className={`h-full ${className}`}>
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-5">
          <Icon className="h-7 w-7 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold font-montserrat text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Card>
  );
};

export default ServiceCard;