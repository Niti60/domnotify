'use client';

import { cn } from '@/lib/cn';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
