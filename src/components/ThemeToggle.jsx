'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle({ compact = true, className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-slate-500 transition ${className}`}
      >
        <Moon className="h-5 w-5" />
      </button>
    );
  }

  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-700 shadow-sm transition hover:bg-white/10 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-white/5 ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-blue-600 dark:text-blue-300">
        <Icon className="h-5 w-5" />
      </span>
    </button>
  );
}
