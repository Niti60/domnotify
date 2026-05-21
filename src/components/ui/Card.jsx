'use client';

import { cn } from '@/lib/cn';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border bg-(--surface) p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-slate-950/90',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
