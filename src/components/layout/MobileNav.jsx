'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navItems, isActive } from '@/lib/navItems';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function MobileNav({ open, onClose }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/50"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed left-0 top-0 z-50 flex h-full w-80 flex-col overflow-y-auto border-r border-white/10 bg-(--surface) p-5 shadow-2xl dark:bg-slate-950"
          >
            <div className="flex items-center justify-between gap-4 pb-4">
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">DomNotify</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Domain operations on mobile</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-slate-700 transition hover:bg-white/5 dark:text-slate-200 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3 rounded-3xl px-3 py-3 text-sm font-medium transition ${
                        active
                          ? 'bg-white/10 text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
                          : 'text-slate-700 hover:bg-white/5 dark:text-slate-300 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-slate-700 dark:bg-white/10 dark:text-slate-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-white/10 pt-4">
              <ThemeToggle />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
