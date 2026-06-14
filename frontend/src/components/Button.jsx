import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  // Generous padding, bold text, and smooth transitions
  const baseStyles = "px-6 py-3 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    // Primary energetic call-to-action
    primary: "bg-primary text-white hover:bg-[#d94f15] focus:ring-primary shadow-soft hover:shadow-md",
    // Surface-based secondary button
    secondary: "bg-surface text-text-main hover:bg-gray-200 border border-border-light focus:ring-gray-300 shadow-soft",
    // Outline button using the accent color only on hover
    outline: "bg-transparent text-text-main border-2 border-border-light hover:border-primary hover:text-primary focus:ring-primary"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}