'use client';

import { cn } from '@/lib/cn';

export function DashboardCard({ children, title, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-(--surface) p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-slate-950/90',
        className
      )}
      {...props}
    >
      {title && <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>}
      {children}
    </div>
  );
}
