import React from 'react';

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ClayCard: React.FC<ClayCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-background-light shadow-clay rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
};