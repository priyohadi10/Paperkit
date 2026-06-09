import React from 'react';
import { cn } from '@/lib/utils';

interface PaperTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const PaperTitle: React.FC<PaperTitleProps> = ({
  children,
  as: Tag = 'h1',
  className,
  align = 'left',
}) => {
  const sizeClasses = {
    h1: 'paper-title text-3xl md:text-4xl',
    h2: 'paper-subtitle text-2xl md:text-3xl',
    h3: 'text-xl md:text-2xl font-display font-bold',
  };

  return (
    <Tag
      className={cn(
        sizeClasses[Tag],
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        'text-[var(--paper-text)]',
        className
      )}
    >
      {children}
    </Tag>
  );
};
