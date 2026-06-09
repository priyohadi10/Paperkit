import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PaperInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: 'text' | 'number' | 'password';
  min?: number;
  max?: number;
  maxLength?: number;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  ariaLabel?: string;
}

export const PaperInput = forwardRef<HTMLInputElement, PaperInputProps>(({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  type = 'text',
  min,
  max,
  maxLength,
  autoFocus,
  onKeyDown,
  ariaLabel,
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn('paper-input w-full', className)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      maxLength={maxLength}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      inputMode={type === 'number' ? 'numeric' : 'text'}
    />
  );
});

PaperInput.displayName = 'PaperInput';
