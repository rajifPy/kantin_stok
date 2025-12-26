import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  className,
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-600',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-600',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600',
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      icon: 'bg-orange-100 text-orange-600',
      text: 'text-orange-600',
    },
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600',
    },
    pink: {
      bg: 'from-pink-500 to-pink-600',
      icon: 'bg-pink-100 text-pink-600',
      text: 'text-pink-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 p-6',
        'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-xl', colors.icon)}>
          <Icon size={24} />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
              trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            <svg
              className={cn('w-4 h-4', trend.isPositive ? 'rotate-0' : 'rotate-180')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={cn('text-3xl font-bold', colors.text)}>{value}</p>
      </div>

      <div className={cn('mt-4 h-1 rounded-full bg-gradient-to-r', colors.bg, 'opacity-20')} />
    </div>
  );
};