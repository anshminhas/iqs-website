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
        bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-elevation-1 dark:shadow-none dark:border dark:border-gray-700
        ${hoverable ? 'hover:shadow-elevation-3 dark:hover:border-gray-600 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;