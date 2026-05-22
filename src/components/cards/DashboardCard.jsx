'use client';

import { cn } from '@/lib/cn';

export function DashboardCard({ children, title, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 text-card-foreground transition-colors duration-200',
        className,
      )}
      {...props}
    >
      {title && <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>}
      {children}
    </div>
  );
}
