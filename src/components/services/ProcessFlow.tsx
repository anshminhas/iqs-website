import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface ProcessFlowProps {
  steps: ProcessStep[];
  className?: string;
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({ steps, className = '' }) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {step.number}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold font-montserrat text-gray-800 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="hidden md:flex flex-col items-center justify-center mx-2 h-12">
              <ChevronRight className="text-primary-300" size={24} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProcessFlow;