import { motion } from 'framer-motion';

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
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10',
    secondary: 'bg-white/5 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-200',
    outline: 'border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
