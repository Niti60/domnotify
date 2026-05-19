'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) {
  const variants = {
    primary:
      'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30',
    secondary:
      'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800',
    ghost:
      'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
    outline:
      'border-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 dark:border-cyan-400 dark:text-cyan-400',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'font-semibold rounded-lg transition-all duration-200',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
