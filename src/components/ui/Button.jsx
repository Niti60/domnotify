import { cn } from '@/lib/cn';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500',
    secondary:
      'border border-border bg-muted text-foreground hover:bg-black/5 dark:hover:bg-white/5',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5',
    outline:
      'border border-border text-foreground hover:bg-black/5 dark:hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(baseClasses, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  );
}
