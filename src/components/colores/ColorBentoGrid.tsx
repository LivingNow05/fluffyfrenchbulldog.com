import React from 'react';
import { cn } from '@/lib/utils';

interface SpecItem {
  key: string;
  label: string;
  icon: string;
  value: string;
}

interface ColorBentoGridProps {
  caracteristicas?: Record<string, string>;
  specLabels?: Record<string, string>;
  specIcons?: Record<string, string>;
  className?: string;
}

export const ColorBentoGrid: React.FC<ColorBentoGridProps> = ({
  caracteristicas = {},
  specLabels = {},
  specIcons = {},
  className,
}) => {
  const items: SpecItem[] = Object.entries(caracteristicas || {}).map(([key, value]) => ({
    key,
    label: specLabels[key] || key,
    icon: specIcons[key] || '🐾',
    value,
  }));

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8', className)}>
      {items.map((item) => {
        const isFeatured = item.key === 'pelaje' || item.key === 'temperamento';

        return (
          <div
            key={item.key}
            className={cn(
              'rounded-2xl p-6 transition-colors duration-200 bg-[#121215] border border-[#27272a] hover:border-purple-500 hover:bg-[#18181b]',
              isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1f1032] border border-[#3b1964] flex items-center justify-center text-2xl shrink-0 text-purple-400">
                {item.icon}
              </div>
              <div className="flex-grow">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 block mb-1">
                  {item.label}
                </span>
                <span
                  className={cn(
                    'font-bold text-white leading-relaxed block',
                    isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base'
                  )}
                >
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
