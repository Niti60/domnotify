'use client';

import { cn } from '@/lib/cn';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground p-6 transition-colors duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
