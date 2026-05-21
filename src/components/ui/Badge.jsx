export function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-blue-100 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300',
    success: 'bg-emerald-100 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-100 dark:bg-amber-900/25 text-amber-700 dark:text-amber-300',
    danger: 'bg-rose-100 dark:bg-rose-900/25 text-rose-700 dark:text-rose-300',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    purple: 'bg-violet-100 dark:bg-violet-900/25 text-violet-700 dark:text-violet-300',
    gradient: 'bg-linear-to-r from-blue-500/15 to-cyan-500/15 text-blue-700 dark:text-blue-300',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
