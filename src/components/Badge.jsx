'use client';

import { cn } from '@/lib/cn';

export default function Badge({ children, variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
    success: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
    danger: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
    purple: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
    gradient: 'bg-slate-900 text-white',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
