import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden shadow-elevation-1
        ${hoverable ? 'hover:shadow-elevation-3 transition-shadow duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;