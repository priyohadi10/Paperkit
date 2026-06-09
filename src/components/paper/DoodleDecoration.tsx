import React from 'react';

interface DoodleDecorationProps {
  variant?: 'zigzag' | 'wave' | 'dots' | 'star' | 'spiral';
  className?: string;
}

export const DoodleDecoration: React.FC<DoodleDecorationProps> = ({
  variant = 'zigzag',
  className = '',
}) => {
  const color = 'var(--paper-text)';

  if (variant === 'zigzag') {
    return (
      <svg
        viewBox="0 0 120 20"
        className={`w-24 h-4 ${className}`}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M0 10 L10 2 L20 18 L30 2 L40 18 L50 2 L60 18 L70 2 L80 18 L90 2 L100 18 L110 2 L120 10" />
      </svg>
    );
  }

  if (variant === 'wave') {
    return (
      <svg
        viewBox="0 0 120 20"
        className={`w-24 h-4 ${className}`}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M0 10 Q15 0, 30 10 T60 10 T90 10 T120 10" />
      </svg>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--paper-text)]"
            style={{ opacity: 0.6 + i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'star') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`w-6 h-6 ${className}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }

  if (variant === 'spiral') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`w-6 h-6 ${className}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12s-2.5 5.5-5.5 5.5S12 15 12 12c0-4.5-3.5-8-8-8S-4 7.5-4 12s3.5 8 8 8" />
      </svg>
    );
  }

  return null;
};
