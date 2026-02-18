import React from 'react';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const ClayButton: React.FC<ClayButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = "transition-all duration-300 active:scale-95 flex items-center justify-center font-bold";
  
  const variants = {
    primary: "bg-primary text-white shadow-clay-btn active:shadow-inset-primary rounded-2xl",
    secondary: "bg-white text-slate-700 shadow-clay-btn active:shadow-inset-light rounded-2xl",
    ghost: "text-slate-600 hover:text-primary bg-transparent shadow-none"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};