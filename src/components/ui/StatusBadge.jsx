'use client';

export function StatusBadge({ variant = 'neutral', children, className = '' }) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/25 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/25 dark:text-rose-300',
    info: 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300',
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
