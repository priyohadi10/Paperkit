import React from 'react';
import { cn } from '@/lib/utils';

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  children,
  className,
  hover = false,
  active = false,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'paper-card p-4',
        hover && 'paper-card-hover cursor-pointer',
        active && 'paper-card-active',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
};
