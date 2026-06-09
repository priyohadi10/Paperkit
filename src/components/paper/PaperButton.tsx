import React from 'react';
import { cn } from '@/lib/utils';

interface PaperButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  ariaLabel?: string;
}

export const PaperButton: React.FC<PaperButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
  onClick,
  ariaLabel,
}) => {
  return (
    <button
      type={type}
      className={cn(
        'paper-btn',
        variant === 'primary' && 'paper-btn-primary',
        variant === 'danger' && 'bg-red-500 text-white border-red-700 shadow-paper hover:shadow-paper-hover active:shadow-paper-active',
        variant === 'ghost' && 'border-transparent shadow-none hover:shadow-none hover:bg-black/5 dark:hover:bg-white/5',
        size === 'sm' && 'text-sm px-3 py-1.5 min-h-[36px]',
        size === 'lg' && 'text-lg px-6 py-3 min-h-[52px]',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
