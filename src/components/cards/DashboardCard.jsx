'use client';

import { cn } from '@/lib/cn';

export function DashboardCard({ children, title, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
      {...props}
    >
      {title && <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>}
      {children}
    </div>
  );
}
