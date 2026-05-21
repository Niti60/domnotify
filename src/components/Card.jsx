'use client';

import { cn } from '@/lib/cn';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-(--surface) border border-white/10 p-6 transition-all hover:shadow-lg dark:bg-slate-950',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
