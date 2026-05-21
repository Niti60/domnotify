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
      'bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30',
    secondary:
      'bg-white/5 dark:bg-white/10 text-slate-900 dark:text-white border border-white/10 hover:bg-white/10 dark:hover:bg-white/10',
    ghost:
      'text-slate-900 dark:text-white hover:bg-white/5 dark:hover:bg-white/10',
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
