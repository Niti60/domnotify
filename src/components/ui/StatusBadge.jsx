'use client';

import { cn } from '@/lib/cn';

export function StatusBadge({ variant = 'neutral', children, className = '' }) {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-500/10 text-red-700 dark:text-red-400',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    neutral: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2.5 py-0.5 text-xs font-medium',
        variants[variant] ?? variants.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}
