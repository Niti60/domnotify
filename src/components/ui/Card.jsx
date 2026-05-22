'use client';

import { cn } from '@/lib/cn';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
