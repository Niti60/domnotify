'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems, isActive } from '@/lib/navItems';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-(--surface)/95 px-2 py-4 shadow-sm backdrop-blur-xl transition-all duration-300 dark:bg-slate-950/95 md:flex ${collapsed ? 'w-20' : 'w-72'}`}
    >
      <div className="mb-6 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 text-white font-semibold">
            D
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">DomNotify</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Domain ops dashboard</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-700 transition hover:border-white/20 hover:bg-white/10 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/5"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);

          return (
            <Link key={item.href} href={item.href} className="group">
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 rounded-3xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-white/10 text-slate-900 shadow-sm dark:bg-white/10 dark:border dark:border-white/10 dark:text-white'
                    : 'text-slate-700 hover:bg-white/5 dark:text-slate-400 dark:hover:bg-white/5'
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-200 ${
                    active
                      ? 'bg-linear-to-br from-blue-600 to-cyan-600 text-white'
                      : 'bg-white/10 text-slate-700 dark:bg-white/10 dark:text-white/70'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {!collapsed && <span>{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
