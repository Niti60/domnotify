'use client';

import { Menu } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header({ onOpenMobile }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-(--surface)/95 backdrop-blur-xl shadow-sm dark:bg-slate-950/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-700 transition hover:border-white/20 hover:bg-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-white/5 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 text-white font-semibold">
              D
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">DomNotify</p>
            </div>
          </div>
        </div>

        <div className="flex-1 hidden lg:block">
          <SearchBar placeholder="Search domains, SSL, WHOIS..." />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
