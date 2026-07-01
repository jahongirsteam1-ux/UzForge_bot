import type { FC, ReactNode } from 'react';

interface GlassCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: FC<GlassCardProps> = ({ title, children, className = '', delay = 0 }) => {
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
