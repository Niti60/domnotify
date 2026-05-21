'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-12" />;
  }

  const activeTheme = theme === 'system' ? resolvedTheme : theme;
  const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      className="inline-flex h-12 items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-white/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:bg-white/5"
    >
      <span className="flex items-center gap-2">
        {activeTheme === 'dark' ? (
          <Sun className="h-5 w-5 text-amber-300" />
        ) : (
          <Moon className="h-5 w-5 text-slate-600" />
        )}
        <span></span>
      </span>
    </motion.button>
  );
}
