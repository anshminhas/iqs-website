import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  position: string;
  companyName: string;
  rating?: number;
  imageSrc?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  position,
  companyName,
  rating = 5,
  imageSrc,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-elevation-1 p-6 md:p-8">
      {/* Rating Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`mr-1 ${
              i < rating ? 'fill-warning text-warning' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="mb-6">
        <p className="text-gray-700 italic leading-relaxed">"{quote}"</p>
      </blockquote>
      
      {/* Author Info */}
      <div className="flex items-center">
        {imageSrc && (
          <div className="mr-4">
            <img
              src={imageSrc}
              alt={author}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-600">
            {position}, {companyName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;