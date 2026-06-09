import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string | number;
  label: string;
  className?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, className, icon }) => {
  return (
    <div className={cn('stat-card', className)}>
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};
