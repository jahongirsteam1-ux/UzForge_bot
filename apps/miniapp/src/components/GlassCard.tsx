import React from 'react';

interface GlassCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ title, children, className = '', delay = 0 }) => {
  return (
    <div 
      className={`glass-panel animate-slide-up ${className}`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      {title && <h3 className="font-semibold text-xl mb-4 text-gradient">{title}</h3>}
      {children}
    </div>
  );
};
